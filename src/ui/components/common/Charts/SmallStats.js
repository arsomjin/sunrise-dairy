import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shortid from 'shortid';

import Chart from 'utils/chart';
import { useSelector } from 'react-redux';
import { getChart } from 'utils/chart';

const SmallStats = ({
  variation,
  label,
  value,
  percentage,
  increase,
  chartData,
  chartOptions,
  chartLabels,
  chartConfig,
  unit,
}) => {
  const { theme } = useSelector((state) => state.global);
  const Chart = getChart(theme);

  const canvasRef = useRef();

  useEffect(() => {
    const cOptions = {
      ...{
        maintainAspectRatio: true,
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
          custom: false,
        },
        elements: {
          point: {
            radius: 0,
          },
          line: {
            tension: 0.33,
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: false,
              ticks: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: false,
              scaleLabel: false,
              ticks: {
                display: false,
                isplay: false,
                // Avoid getting the graph line cut of at the top of the canvas.
                // Chart.js bug link: https://github.com/chartjs/Chart.js/issues/4790
                suggestedMax: Math.max(...chartData[0].data) + 1,
              },
            },
          ],
        },
      },
      ...chartOptions,
    };

    const cConfig = {
      ...{
        type: 'line',
        data: {
          ...{
            labels: chartLabels,
          },
          ...{
            datasets: chartData,
          },
        },
        options: cOptions,
      },
      ...chartConfig,
    };

    new Chart(canvasRef.current, cConfig);
  }, []);

  const cardClasses = classNames(
    'stats-small',
    variation && `stats-small--${variation}`
  );

  const cardBodyClasses = classNames(
    variation === '1' ? 'p-0 flex' : 'px-0 pb-0'
  );

  const innerWrapperClasses = classNames(
    'flex',
    variation === '1' ? 'flex-column m-auto' : 'px-2',
    'justify-between items-center'
  );

  const dataFieldClasses = classNames(
    'stats-small__data',
    variation === '1' && 'text-center',
    'p-3'
  );

  const labelClasses = classNames(
    'stats-small__label',
    'uppercase',
    variation !== '1' && 'mb-1',
    'text-muted'
  );

  const valueClasses = classNames(
    'stats-small__value',
    'count',
    variation === '1' ? 'my-3' : 'm-0',
    'text-black text-2xl'
  );

  const innerDataFieldClasses = classNames(
    'stats-small__data',
    variation !== '1' && 'text-right align-items-center',
    'text-black p-1'
  );

  const percentageClasses = classNames(
    'stats-small__percentage',
    `stats-small__percentage--${increase ? 'increase' : 'decrease'}`,
    increase ? 'text-success' : 'text-danger'
  );

  const canvasHeight = variation === '1' ? 120 : 60;

  return (
    <div className="rounded-xl bg-background2 shadow-lg mb-4">
      <div className={cardBodyClasses}>
        <div className={innerWrapperClasses}>
          <div className={dataFieldClasses}>
            <span className={labelClasses} style={{ fontSize: '14px' }}>
              {label}
            </span>
            <h6 className={valueClasses}>
              {value}
              {unit && (
                <span className="text-muted" style={{ fontSize: 14 }}>
                  {' '}
                  {unit}
                </span>
              )}
            </h6>
          </div>
          <div className={innerDataFieldClasses}>
            <span className={percentageClasses}>{percentage}</span>
          </div>
        </div>
        <canvas
          height={canvasHeight}
          ref={canvasRef}
          className={`stats-small-${shortid()}`}
        />
      </div>
    </div>
  );
};

SmallStats.propTypes = {
  /**
   * The Small Stats variation.
   */
  variation: PropTypes.string,
  /**
   * The label.
   */
  label: PropTypes.string,
  /**
   * The value.
   */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The percentage number or string.
   */
  percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Whether is a value increase, or not.
   */
  increase: PropTypes.bool,
  /**
   * The Chart.js configuration object.
   */
  chartConfig: PropTypes.object,
  /**
   * The Chart.js options object.
   */
  chartOptions: PropTypes.object,
  /**
   * The chart data.
   */
  chartData: PropTypes.array.isRequired,
  /**
   * The chart labels.
   */
  chartLabels: PropTypes.array,
};

SmallStats.defaultProps = {
  increase: true,
  percentage: 0,
  value: 0,
  label: 'Label',
  chartOptions: Object.create(null),
  chartConfig: Object.create(null),
  chartData: [],
  chartLabels: [],
};

export default SmallStats;
