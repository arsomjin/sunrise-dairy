import dayjs from 'dayjs';

export const convertSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  const hTxt = hours < 10 ? `0${hours}` : hours;
  const mTxt = minutes < 10 ? `0${minutes}` : minutes;
  const sTxt = seconds < 10 ? `0${seconds}` : seconds;
  return `${hTxt}:${mTxt}:${sTxt}`;
};

export const getStartDateFromDuration = (val) => {
  let result = dayjs().startOf('d').format('YYYY-MM-DD');
  switch (val) {
    case 'today':
      result = dayjs().startOf('d').format('YYYY-MM-DD');
      break;
    case 'sevenDays':
      result = dayjs().subtract(7, 'd').format('YYYY-MM-DD');
      break;
    case 'thisWeek':
      result = dayjs().startOf('week').format('YYYY-MM-DD');
      break;
    case 'thisMonth':
      result = dayjs().startOf('month').format('YYYY-MM-DD');
      break;
    case 'thirtyDays':
      result = dayjs().subtract(30, 'd').format('YYYY-MM-DD');
      break;
    case 'threeMonth':
      result = dayjs().subtract(3, 'month').format('YYYY-MM-DD');
      break;
    case 'all':
      result = dayjs().subtract(10, 'years').format('YYYY-MM-DD'); // 10 years.
      break;

    default:
      break;
  }
  return result;
};

export const isDateTypeField = (val) => {
  return (
    val.substr(-4) === 'Date' ||
    val.search('วันที่') > -1 ||
    val.substr(0, 4).toLowerCase() === 'date'
  );
};

export const isTimeTypeField = (val) => {
  return (
    val.search('Time') > -1 || val.search('เวลา') > -1 || val === 'created'
  );
};

export const getThaiDate = (val, full) => {
  return full
    ? dayjs(val, 'YYYY-MM-DD HH:mm:ss')
        .add(543, 'year')
        .locale('th')
        .format('D/MM/YYYY HH:mm:ss')
    : dayjs(val, 'YYYY-MM-DD')
        .add(543, 'year')
        .locale('th')
        .format('D/MM/YYYY');
};
