export const getLabel = (chartData) => (
  <div>
    <ul className="flex items-center text-muted">
      <span
        style={{
          background: 'rgba(0,123,255,1)',
          width: 20,
          borderRadius: 10,
          height: 2,
          left: 0,
          marginLeft: 5,
          marginRight: 5,
        }}
      ></span>
      {chartData.datasets[0].label}
      <span
        className="sc-legend__label"
        style={{
          background: 'rgba(255,65,105,1)',
          width: 20,
          borderRadius: 10,
          height: 2,
          left: 0,
          marginLeft: 10,
          marginRight: 5,
        }}
      ></span>
      {chartData.datasets[1].label}
    </ul>
  </div>
);
