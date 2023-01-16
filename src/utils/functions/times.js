export const convertSeconds = seconds => {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  const hTxt = hours < 10 ? `0${hours}` : hours;
  const mTxt = minutes < 10 ? `0${minutes}` : minutes;
  const sTxt = seconds < 10 ? `0${seconds}` : seconds;
  return `${hTxt}:${mTxt}:${sTxt}`;
};
