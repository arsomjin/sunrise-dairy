import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import SmallStats from 'ui/components/common/Charts/SmallStats';
import colors from 'utils/colors';
import { ROW_GUTTER } from 'constants/Styles';
import PageTitle from 'ui/components/common/Pages/PageTitle';
import Sessions from 'ui/components/common/Charts/Sessions';
import { APP_NAME } from 'constants';
import BarTitle from 'ui/components/common/BarTitle';
import { showWarn } from 'utils/functions/common';
import { useLoading } from 'hooks/useLoading';
import { getFirestoreCollection } from 'services/firebase';
import dayjs from 'dayjs';
import { sortArr } from 'utils/functions/array';
import { showLog } from 'utils/functions/common';
import { Numb } from 'utils/functions/common';
import { distinctArr } from 'utils/functions/array';
import numeral from 'numeral';
const Dashboard = ({ smallStats, chartData }) => {
  const { loading, setLoading } = useLoading();
  const [data, setData] = useState([]);
  const [members, setMember] = useState([]);
  const [smStats, setSmStats] = useState(smallStats);
  const [chData, setChData] = useState(chartData);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getFirestoreCollection('sections/milk/weight', [
        [
          'recordDate',
          '>=',
          dayjs().startOf('month').subtract(1, 'month').format('YYYY-MM-DD'),
        ],
      ]);
      let arr = res
        ? Object.keys(res).map((k) => ({
            ...res[k],
            _id: k,
          }))
        : [];
      arr = sortArr(arr, ['recordDate']).map((it, id) => ({
        ...it,
        id,
        key: id,
      }));

      const res2 = await getFirestoreCollection('sections/personal/members');
      let mArr = res2
        ? Object.keys(res2).map((k) => ({
            ...res2[k],
            _id: k,
          }))
        : [];
      mArr = sortArr(
        mArr.filter((l) => !l.deleted),
        ['bucketNo']
      ).map((it, id) => ({
        ...it,
        id,
        key: id,
      }));

      // showLog({ arr, res });

      const thisMonth = arr
        .filter(
          (l) => l.recordDate >= dayjs().startOf('month').format('YYYY-MM-DD')
        )
        .reduce((sum, elem) => sum + Numb(elem.weight), 0);
      const lastMonth = arr
        .filter(
          (l) =>
            l.recordDate >=
              dayjs()
                .subtract(1, 'month')
                .startOf('month')
                .format('YYYY-MM-DD') &&
            l.recordDate <= dayjs().subtract(1, 'month').format('YYYY-MM-DD')
        )
        .reduce((sum, elem) => sum + Numb(elem.weight), 0);
      const thisWeek = arr
        .filter(
          (l) => l.recordDate >= dayjs().startOf('week').format('YYYY-MM-DD')
        )
        .reduce((sum, elem) => sum + Numb(elem.weight), 0);
      const lastWeek = arr
        .filter(
          (l) =>
            l.recordDate >=
              dayjs()
                .subtract(1, 'week')
                .startOf('week')
                .format('YYYY-MM-DD') &&
            l.recordDate <= dayjs().subtract(1, 'week').format('YYYY-MM-DD')
        )
        .reduce((sum, elem) => sum + Numb(elem.weight), 0);
      const tDay = arr
        .filter((l) => l.recordDate === dayjs().format('YYYY-MM-DD'))
        .reduce((sum, elem) => sum + Numb(elem.weight), 0);
      const yDay = arr
        .filter(
          (l) =>
            l.recordDate === dayjs().subtract(1, 'day').format('YYYY-MM-DD')
        )
        .reduce((sum, elem) => sum + Numb(elem.weight), 0);
      let dailySum = distinctArr(arr, ['recordDate'], ['weight']).map(
        (l, id) => ({ recordDate: l.recordDate, weight: l.weight, id, key: id })
      );
      let smst = [...smStats];
      let chrData = { ...chartData };
      let chData1 = dailySum
        .filter(
          (l) =>
            l.recordDate <=
            dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
        )
        .map((it) => it.weight);
      let chData2 = dailySum
        .filter(
          (l) => l.recordDate >= dayjs().startOf('month').format('YYYY-MM-DD')
        )
        .map((it) => it.weight);

      chrData.datasets[0].data = chData1;
      chrData.datasets[1].data = chData2;

      let chg1 = ((thisMonth - lastMonth) / lastMonth) * 100;
      let chg2 = ((thisWeek - lastWeek) / lastWeek) * 100;
      let chg3 = ((tDay - yDay) / yDay) * 100;

      smst[0].value = numeral(thisMonth / 1000).format('0,0.00');
      smst[0].datasets[0].data = dailySum
        .slice(dailySum.length - 10, dailySum.length)
        .map((l) => l.weight);
      smst[0].percentage = `${numeral(chg1).format('0.00')}%`;
      smst[0].increase = chg1 > 0;
      smst[0].decrease = chg1 < 0;
      smst[1].value = numeral(thisWeek / 1000).format('0,0.00');
      smst[1].datasets[0].data = dailySum
        .slice(dailySum.length - 5, dailySum.length)
        .map((l) => l.weight);
      smst[1].percentage = `${numeral(chg2).format('0.00')}%`;
      smst[1].increase = chg2 > 0;
      smst[1].decrease = chg2 < 0;
      smst[2].value = numeral(tDay).format('0,0.00');
      smst[2].datasets[0].data = dailySum
        .slice(dailySum.length - 5, dailySum.length)
        .map((l) => l.weight);
      smst[2].percentage = `${numeral(chg3).format('0.00')}%`;
      smst[2].increase = chg3 > 0;
      smst[2].decrease = chg3 < 0;
      smst[3].value = mArr.length;
      smst[3].increase = true;
      smst[3].decrease = false;

      // showLog({
      //   smst,
      //   arr,
      //   dailySum,
      //   thisMonth,
      //   lastMonth,
      //   thisWeek,
      //   lastWeek,
      //   chData1,
      //   chData2,
      // });

      setData(arr);
      setSmStats(smst);
      setChData(chrData);

      setLoading(false);
    } catch (e) {
      showWarn(e);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BarTitle>หน้าแรก</BarTitle>
      <div className="h-full p-4 flex flex-col">
        <PageTitle title="ภาพรวม" subtitle={APP_NAME} />
        <Row gutter={ROW_GUTTER}>
          {smStats.map((stats, idx) => (
            <Col key={`small-stats-${idx}`} span={24} sm={12} md={6}>
              <SmallStats
                id={`small-stats-${idx}`}
                chartData={stats.datasets}
                chartLabels={stats.chartLabels}
                label={stats.label}
                value={stats.value}
                percentage={stats.percentage}
                increase={stats.increase}
                decrease={stats.decrease}
                unit={stats.unit}
              />
            </Col>
          ))}
        </Row>
        <Row gutter={ROW_GUTTER}>
          <Col span={24}>
            <Sessions title={'ปริมาณน้ำนม (ตัน)'} chartData={chData} />
          </Col>
        </Row>
      </div>
    </>
  );
};

Dashboard.defaultProps = {
  smallStats: [
    {
      label: 'เดือนนี้',
      value: '29,219',
      percentage: '2.93%',
      chartLabels: [null, null, null, null, null],
      increase: true,
      datasets: [
        {
          label: 'This month',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: colors.primary.toRGBA(0.1),
          borderColor: colors.primary.toRGBA(),
          data: [4, 4, 4, 9, 20],
        },
      ],
      unit: 'ตัน',
    },
    {
      label: 'สัปดาห์นี้',
      value: '5,919',
      percentage: '7.21%',
      chartLabels: [null, null, null, null, null],
      increase: false,
      decrease: true,
      datasets: [
        {
          label: 'This week',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: colors.success.toRGBA(0.1),
          borderColor: colors.success.toRGBA(),
          data: [1, 9, 1, 9, 9],
        },
      ],
      unit: 'ตัน',
    },
    {
      label: 'วันนี้',
      value: '981',
      percentage: '0.00%',
      chartLabels: [null, null, null, null, null],
      increase: true,
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: colors.warning.toRGBA(0.1),
          borderColor: colors.warning.toRGBA(),
          data: [9, 9, 3, 9, 9],
        },
      ],
      unit: 'กก.',
    },
    {
      label: 'จำนวนสมาชิก',
      value: '29',
      percentage: '0.00%',
      chartLabels: [null, null, null, null, null],
      increase: false,
      decrease: true,
      datasets: [
        {
          label: 'Members',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: colors.salmon.toRGBA(0.1),
          borderColor: colors.salmon.toRGBA(),
          data: [3, 3, 4, 9, 4],
        },
      ],
    },
  ],
  chartData: {
    labels: Array.from(new Array(30), (_, i) => (i === 0 ? 1 : i)),
    datasets: [
      {
        label: 'เดือนนี้',
        fill: 'start',
        data: [
          5000, 8000, 3200, 1800, 2400, 3200, 2300, 6500, 5900, 12000, 7500,
          9400, 14200, 12000, 9600, 14500, 18200, 28000, 21020, 19200, 39200,
          32020, 31400, 28000, 32000, 32000, 34000, 29100, 31000, 42500,
        ],
        backgroundColor: colors.primary.toRGBA(0.1),
        borderColor: colors.primary.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.primary.toRGBA(1),
        borderWidth: 1.5,
        pointHoverRadius: 3,
      },
      {
        label: 'เดือนที่แล้ว',
        fill: 'start',
        data: [
          3800, 4300, 1200, 2300, 4100, 7400, 4720, 2190, 3910, 2290, 4000,
          2030, 3010, 3800, 2910, 6200, 7000, 3000, 6300, 4020, 3200, 3800,
          2890, 4100, 3000, 5300, 6300, 7200, 7800, 12000,
        ],
        backgroundColor: colors.salmon.toRGBA(0.1),
        borderColor: colors.salmon.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.salmon.toRGBA(1),
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 2,
        pointBorderColor: colors.salmon.toRGBA(1),
      },
    ],
  },
};

export default Dashboard;
