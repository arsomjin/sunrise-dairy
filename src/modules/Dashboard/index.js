import { Col, Row } from 'antd';
import React from 'react';
import SmallStats from 'ui/components/common/Charts/SmallStats';
import colors from 'utils/colors';
import { ROW_GUTTER } from 'constants/Styles';
import PageTitle from 'ui/components/common/Pages/PageTitle';
import Sessions from 'ui/components/common/Charts/Sessions';
import { APP_NAME } from 'constants';
import BarTitle from 'ui/components/common/BarTitle';
const Dashboard = ({ smallStats }) => {
  return (
    <>
      <BarTitle>หน้าแรก</BarTitle>
      <div className="h-full p-4 flex flex-col">
        <PageTitle title="ภาพรวม" subtitle={APP_NAME} />
        <Row gutter={ROW_GUTTER}>
          {smallStats.map((stats, idx) => (
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
            <Sessions title={'ปริมาณน้ำนม (ตัน)'} />
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
          label: 'Today',
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
      label: 'วันนี้',
      value: '5,919',
      percentage: '7.21%',
      chartLabels: [null, null, null, null, null],
      increase: false,
      decrease: true,
      datasets: [
        {
          label: 'Today',
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
      label: 'จำนวนสมาชิก',
      value: '981',
      percentage: '3.71%',
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
    },
    {
      label: 'สมาชิกใหม่',
      value: '29',
      percentage: '2.71%',
      chartLabels: [null, null, null, null, null],
      increase: false,
      decrease: true,
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: colors.salmon.toRGBA(0.1),
          borderColor: colors.salmon.toRGBA(),
          data: [3, 3, 4, 9, 4],
        },
      ],
    },
  ],
};

export default Dashboard;
