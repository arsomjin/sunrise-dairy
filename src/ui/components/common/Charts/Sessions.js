import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import colors from 'utils/colors';
import DatePicker from 'ui/elements/DatePicker';
import { Row, Col, Radio } from 'antd';
import { showLog } from 'utils/functions/common';
import { getLabel } from './api';
import { useSelector } from 'react-redux';
import { useResponsive } from 'hooks/useResponsive';
import { getChart } from 'utils/chart';

const Sessions = ({ chartData, chartOptions, title }) => {
  const { theme } = useSelector((state) => state.global);
  const [period, setPeriod] = useState('ชั่วโมง');
  const legendRef = useRef();
  const canvasRef = useRef();

  const Chart = getChart(theme);

  const { mobileOnly } = useResponsive();

  useEffect(() => {
    const cOptions = {
      ...{
        responsive: true,
        legend: {
          position: 'top',
        },
        elements: {
          line: {
            // A higher value makes the line look skewed at this ratio.
            tension: 0.3,
          },
          point: {
            radius: 0,
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: false,
              ticks: {
                callback(tick, index) {
                  // Jump every 7 values on the X axis labels to avoid clutter.
                  return index % 7 !== 0 ? '' : tick;
                },
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                suggestedMax: 45,
                callback(tick) {
                  if (tick === 0) {
                    return tick;
                  }
                  // Format the amounts using Ks for thousands.
                  return tick > 999 ? `${(tick / 1000).toFixed(1)}K` : tick;
                },
              },
              gridLines: {
                color: theme === 'dark' ? '#4d4d4d' : 'rgba(233, 236 ,239, 1)',
              },
            },
          ],
        },
        hover: {
          mode: 'nearest',
          intersect: false,
        },
        tooltips: {
          custom: false,
          mode: 'nearest',
          intersect: false,
        },
      },
      ...chartOptions,
    };

    // yAxes: [
    //   {
    //     ticks: {
    //       suggestedMax: 45,
    //     },
    //     gridLines: {
    //       color: theme === 'dark' ? '#4d4d4d' : 'rgba(233, 236 ,239, 1)',
    //     },
    //   },
    // ],
    const AnalyticsOverviewChart = new Chart(canvasRef.current, {
      type: 'line',
      data: chartData,
      options: cOptions,
    });

    // Generate the analytics overview chart labels.
    // legendRef.current.innerHTML = AnalyticsOverviewChart.generateLegend();
    // showLog({ legend: legendRef.current.innerHTML });

    // Hide initially the first and last analytics overview chart points.
    // They can still be triggered on hover.
    const meta = AnalyticsOverviewChart.getDatasetMeta(0);
    meta.data[0]._model.radius = 0;
    meta.data[chartData.datasets[0].data.length - 1]._model.radius = 0;

    // Render the chart.
    AnalyticsOverviewChart.render();
  }, [chartData, chartOptions, theme]);

  return (
    <div className="rounded-xl bg-background2 shadow-lg mb-4 p-4 min">
      {/* Card Header */}
      <div className="border-bottom">
        <h6 className="mb-2 text-black">{title}</h6>
        <div className="block-handle" />
      </div>

      <div className="pt-0">
        <Row className="border-bottom py-2 bg-light">
          {/* DatePicker */}
          <Col sm={12} style={{ display: 'flex' }} className="max-w-xs">
            <DatePicker isRange />
          </Col>
        </Row>

        <canvas
          height={mobileOnly ? '220' : '140'}
          ref={canvasRef}
          style={{ maxWidth: '100% !important' }}
        />
      </div>
    </div>
  );
};

Sessions.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The Chart.js data.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js config options.
   */
  chartOptions: PropTypes.object,
};

Sessions.defaultProps = {
  title: 'Sessions',
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

export default Sessions;
