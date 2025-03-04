import classNames from 'classnames';
import { getFirestoreCollection } from 'services/firebase';
import dayjs from 'dayjs';
import { numer } from 'utils/functions/number';
import { Numb, showLog, showWarn } from 'utils/functions/common';
import { distinctArr, sortArr } from 'utils/functions/array';
import { findMaxValueByKey } from 'utils/functions/number';

// Column definitions for the report table.
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
  },
  {
    title: 'เบอร์',
    dataIndex: 'memberId',
    width: 80,
    align: 'center',
    sorter: {
      compare: (a, b) => a.memberId - b.memberId,
      multiple: 2,
    },
  },
  {
    title: 'เช้า (kg)',
    dataIndex: 'morningW',
    width: 80,
    align: 'right',
    render: (text) => <div>{numer(text).format('0,0.00')}</div>,
  },
  {
    title: 'เย็น (kg)',
    dataIndex: 'eveningW',
    width: 80,
    align: 'right',
    render: (text) => <div>{numer(text).format('0,0.00')}</div>,
  },
  {
    title: 'รวม (kg)',
    dataIndex: 'totalW',
    width: 80,
    className: 'text-warning',
    align: 'right',
    render: (text) => (
      <div className={classNames('text-blue-400')}>
        {numer(text).format('0,0.00')}
      </div>
    ),
  },
  {
    title: 'รวมเงิน',
    dataIndex: 'amount',
    width: 100,
    render: (text) => (
      <div
        className={classNames(
          'text-right',
          Numb(text) < 0 ? 'text-warning' : 'text-success'
        )}
      >
        {numer(text).format('0,0.00')}
      </div>
    ),
    sorter: {
      compare: (a, b) => b.amount - a.amount,
      multiple: 1,
    },
  },
];

// Fetch daily QC prices for a specific record date and member.
export const fetchDailyQCPrices = async (recordDate, memberId) => {
  const res = await getFirestoreCollection('sections/milk/dailyQC', [
    ['recordDate', '==', recordDate],
    ['bucketNo', '==', memberId],
  ]);
  return res ? Object.values(res) : [];
};

// Fetch monthly QC prices for a given record date and member.
export const fetchMilkQCPrices = async (recordDate, memberId) => {
  const recordMonth = dayjs(recordDate).format('YYYY-MM');
  const res = await getFirestoreCollection('sections/milk/milkQC', [
    ['recordMonth', '==', recordMonth],
    ['bucketNo', '==', memberId],
  ]);
  return res ? Object.values(res) : [];
};

// Calculate the QC price based on the relevant period.
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

// Main function to fetch and process data within a date range.
export const fetchAndProcessData = async (dateRange, setLoading) => {
  try {
    setLoading(true);

    // Fetch records within the date range.
    const res = await getFirestoreCollection('sections/milk/weight', [
      ['recordDate', '>=', dateRange[0]],
      ['recordDate', '<=', dateRange[1]],
    ]);

    // Convert Firestore collection to an array.
    const records = res
      ? Object.entries(res).map(([key, value], index) => ({
          ...value,
          _id: key,
          id: index,
          key: index,
        }))
      : [];

    // Sort records by date.
    const sortedRecords = records.sort(
      (a, b) => dayjs(a.recordDate).unix() - dayjs(b.recordDate).unix()
    );

    // Remove duplicate entries based on memberId, recordDate, and period.
    const distinctData = distinctArr(
      sortedRecords,
      ['memberId', 'recordDate', 'period'],
      ['weight']
    );

    // Process each distinct record concurrently.
    const processedRecords = await Promise.all(
      distinctData.map(async (record) => {
        const { memberId, nameSurname, period, recordDate, weight } = record;
        // Fetch daily and monthly QC prices in parallel.
        const [dailyQCPrices, milkQCPrices] = await Promise.all([
          fetchDailyQCPrices(recordDate, memberId),
          fetchMilkQCPrices(recordDate, memberId),
        ]);
        const unitPrice =
          dailyQCPrices.length > 0 ? dailyQCPrices[0].price_per_kg : null;
        const qUnitPrice = calculateQCPrice(milkQCPrices, recordDate);

        return {
          key: `${recordDate}${memberId}`,
          memberId,
          nameSurname,
          recordDate,
          morningW: period === 'เช้า' ? weight : null,
          eveningW: period === 'เย็น' ? weight : null,
          unitPrice,
          qUnitPrice,
          accUnitPrice: Numb(unitPrice) + Numb(qUnitPrice),
        };
      })
    );

    // Merge records with the same key (if any) and calculate totals.
    const processedData = processedRecords.reduce((acc, record) => {
      if (!acc[record.key]) {
        acc[record.key] = record;
      } else {
        // Update morning or evening weight if the record already exists.
        if (record.morningW) acc[record.key].morningW = record.morningW;
        if (record.eveningW) acc[record.key].eveningW = record.eveningW;
      }
      return acc;
    }, {});

    // Convert the processed data object into an array and compute summary fields.
    const finalArray = Object.values(processedData).map((entry, index) => {
      const totalW = Numb(entry.morningW) + Numb(entry.eveningW);
      const amount = totalW * Numb(entry.accUnitPrice);
      return { ...entry, totalW, amount, id: index, key: index };
    });

    // Optional: Aggregate data at the member level.
    const memberSummary = distinctArr(
      finalArray,
      ['memberId'],
      ['morningW', 'eveningW', 'totalW', 'weight', 'amount']
    );
    const maxUnitPrice = findMaxValueByKey(memberSummary, 'unitPrice');
    // Sort records by date.
    const sortedSummary = memberSummary.sort((a, b) => b.amount - a.amount);

    const result = sortedSummary.map((item, id) => ({
      ...item,
      id,
      key: id,
      belowStandard: Numb(item.unitPrice) < maxUnitPrice,
    }));

    showLog({ records, distinctData, finalArray, memberSummary, result });
    return result;
  } catch (error) {
    showWarn(error);
    return [];
  } finally {
    setLoading(false);
  }
};
