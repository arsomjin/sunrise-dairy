import classNames from 'classnames';
import { getFirestoreCollection } from 'services/firebase';
import dayjs from 'dayjs';
import { numer } from 'utils/functions/number';
import { Numb, showLog, showWarn } from 'utils/functions/common';
import { distinctArr, arrayForEach, sortArr } from 'utils/functions/array';
import { findMaxValueByKey } from 'utils/functions/number';

export const getRangeSummaryReportColumns = (data) => [
  {
    title: '#',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: 'ชื่อ - สกุล',
    dataIndex: 'nameSurname',
    width: 160,
    filters: distinctArr(data, ['nameSurname']).map((it) => ({
      value: it.nameSurname,
      text: it.nameSurname,
    })),
    onFilter: (value, record) => record.nameSurname === value,
  },
  {
    title: 'เบอร์',
    dataIndex: 'memberId',
    width: 80,
    align: 'center',
    // className: 'text-warning',
    filters: distinctArr(data, ['memberId']).map((it) => ({
      value: it.memberId,
      text: it.memberId,
    })),
    onFilter: (value, record) => record.memberId === value,
  },
  {
    title: 'เช้า (kg)',
    dataIndex: 'morningW',
    width: 80,
    // className: 'text-primary',
    align: 'right',
    render: (text) => <div> {numer(text).format('0,0.00')}</div>,
  },
  {
    title: 'เย็น (kg)',
    dataIndex: 'eveningW',
    width: 80,
    // className: 'text-primary',
    align: 'right',
    render: (text) => <div> {numer(text).format('0,0.00')}</div>,
  },
  {
    title: 'รวม (kg)',
    dataIndex: 'totalW',
    width: 80,
    className: 'text-warning',
    align: 'right',
    render: (text, record) => {
      return (
        <div className={classNames('text-blue-400')}>
          {numer(text).format('0,0.00')}
        </div>
      );
    },
  },
  {
    title: 'รวมเงิน',
    dataIndex: 'amount',
    width: 100,
    render: (text, record) => {
      return (
        <div
          className={classNames(
            'text-right',
            Numb(text) < 0 ? 'text-warning' : 'text-success'
          )}
        >
          {numer(text).format('0,0.00')}
        </div>
      );
    },
  },
];

// Helper to fetch daily QC prices (batch fetching could be improved further by pre-fetching all relevant records)
export const fetchDailyQCPrices = async (recordDate, memberId) => {
  const res = await getFirestoreCollection('sections/milk/dailyQC', [
    ['recordDate', '==', recordDate],
    ['bucketNo', '==', memberId],
  ]);
  return res ? Object.values(res) : [];
};

// Helper to fetch monthly QC prices (batch fetching could also be done here if needed)
export const fetchMilkQCPrices = async (recordDate, memberId) => {
  const recordMonth = dayjs(recordDate).format('YYYY-MM');
  const res = await getFirestoreCollection('sections/milk/milkQC', [
    ['recordMonth', '==', recordMonth],
    ['bucketNo', '==', memberId],
  ]);
  return res ? Object.values(res) : [];
};

// Helper to calculate QC price
export const calculateQCPrice = (qcPrices, recordDate) => {
  const isFirstHalf = dayjs(recordDate).date() < 16;
  const relevantQC = qcPrices.find(
    (qc) => qc.affectingPeriod === (isFirstHalf ? 'firstHalf' : 'secondHalf')
  );
  if (relevantQC) {
    const { fat_price, snf_price, scc_price, fp_price } = relevantQC;
    return Numb(fat_price) + Numb(snf_price) + Numb(scc_price) + Numb(fp_price);
  }
  return null;
};

// Main data fetch and process function
export const fetchAndProcessData = async (dateRange, setLoading) => {
  try {
    setLoading(true);

    // Fetch all records for the date range
    const res = await getFirestoreCollection('sections/milk/weight', [
      ['recordDate', '>=', dateRange[0]],
      ['recordDate', '<=', dateRange[1]],
    ]);

    let arr = res ? Object.keys(res).map((k) => ({ ...res[k], _id: k })) : [];
    arr = arr
      .map((it, id) => ({ ...it, id, key: id }))
      .sort((a, b) => dayjs(a.recordDate).unix() - dayjs(b.recordDate).unix());

    // Aggregate by memberId, recordDate, period
    const distinctData = distinctArr(
      arr,
      ['memberId', 'recordDate', 'period'],
      ['weight']
    );

    const processedData = {};
    await arrayForEach(distinctData, async (record) => {
      const { memberId, nameSurname, period, recordDate, weight } = record;

      const key = `${recordDate}${memberId}`;

      if (!processedData[key]) {
        // Fetch daily and monthly QC prices (individual fetch - can be optimized further if needed)
        const dailyQCPrices = await fetchDailyQCPrices(recordDate, memberId);
        const milkQCPrices = await fetchMilkQCPrices(recordDate, memberId);

        const unitPrice =
          dailyQCPrices.length > 0 ? dailyQCPrices[0].price_per_kg : null;
        const qUnitPrice = calculateQCPrice(milkQCPrices, recordDate);

        processedData[key] = {
          memberId,
          nameSurname,
          recordDate,
          morningW: period === 'เช้า' ? weight : null,
          eveningW: period === 'เย็น' ? weight : null,
          unitPrice,
          qUnitPrice,
          accUnitPrice: Numb(unitPrice) + Numb(qUnitPrice),
        };
      } else {
        if (period === 'เช้า') {
          processedData[key].morningW = weight;
        } else {
          processedData[key].eveningW = weight;
        }
      }
    });

    // Convert processed object into array
    const finalArray = Object.keys(processedData).map((key, id) => {
      const entry = processedData[key];
      const totalW = Numb(entry.morningW) + Numb(entry.eveningW);
      const amount = totalW * Numb(entry.accUnitPrice);
      return { ...entry, totalW, amount, id, key };
    });

    // Aggregate for member-level summary (optional: you can keep it or remove if you want only daily data)
    const memberSummary = distinctArr(
      finalArray,
      ['memberId'],
      ['morningW', 'eveningW', 'totalW', 'weight', 'amount']
    );

    const maxUnitPrice = findMaxValueByKey(memberSummary, 'unitPrice');

    const sortSummary = sortArr(memberSummary, ['-amount']);

    const result = sortSummary.map((item) => ({
      ...item,
      belowStandard: Numb(item.unitPrice) < maxUnitPrice,
    }));

    showLog({ arr, distinctData, finalArray, memberSummary, result });
    return result;
  } catch (error) {
    showWarn(error);
    return [];
  } finally {
    setLoading(false);
  }
};
