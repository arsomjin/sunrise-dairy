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
