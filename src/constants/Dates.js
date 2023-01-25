import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import localeData from 'dayjs/plugin/localeData';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/th';

dayjs.extend(localizedFormat);
dayjs.extend(localeData);
dayjs.extend(isBetween);

export class Dates {
  static setLocale(locale) {
    dayjs.locale(locale);
  }

  static getToday() {
    return dayjs();
  }

  static getClearDate() {
    return this.getToday().hour(0).minute(0).second(0).millisecond(0);
  }

  static getMonths() {
    return dayjs.months();
  }

  static getDays() {
    return dayjs.weekdaysShort();
  }

  static getDate(date) {
    return dayjs(date);
  }

  static format(date, query) {
    if (typeof date === 'string' || typeof date === 'number') {
      return dayjs(date).format(query);
    } else {
      return date.format(query);
    }
  }
  static convertSeconds = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    const hTxt = hours < 10 ? `0${hours}` : hours;
    const mTxt = minutes < 10 ? `0${minutes}` : minutes;
    const sTxt = seconds < 10 ? `0${seconds}` : seconds;
    return `${hTxt}:${mTxt}:${sTxt}`;
  };

  static getStartDateFromDuration = (val) => {
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

  static isDateTypeField = (val) => {
    return (
      val.substr(-4) === 'Date' ||
      val.search('วันที่') > -1 ||
      val.substr(0, 4).toLowerCase() === 'date'
    );
  };

  static isTimeTypeField = (val) => {
    return (
      val.search('Time') > -1 || val.search('เวลา') > -1 || val === 'created'
    );
  };

  static getThaiDate = (val, full) => {
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
}

export const DateRange = {
  today: 'วันนี้',
  thisWeek: 'สัปดาห์นี้',
  thisMonth: 'เดือนนี้',
  sevenDays: '7 วันที่ผ่านมา',
  thirtyDays: '30 วันที่ผ่านมา',
  threeMonth: '3 เดือนที่ผ่านมา',
  custom: 'กำหนดเอง',
};

export const DateRangeWithAll = {
  today: 'วันนี้',
  thisWeek: 'สัปดาห์นี้',
  thisMonth: 'เดือนนี้',
  sevenDays: '7 วันที่ผ่านมา',
  thirtyDays: '30 วันที่ผ่านมา',
  threeMonth: '3 เดือนที่ผ่านมา',
  all: 'ทั้งหมด',
  custom: 'กำหนดเอง',
};
