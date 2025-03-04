import classNames from 'classnames';
import { distinctArr } from 'utils/functions/array';
import { Numb } from 'utils/functions/common';
import { numer } from 'utils/functions/number';

export const getDailyQCReportColumns = (data) => [
  {
    title: '#',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: 'ชื่อ - สกุล',
    dataIndex: 'nameSurname',
    width: 180,
    filters: distinctArr(data, ['nameSurname']).map((it) => ({
      value: it.nameSurname,
      text: it.nameSurname,
    })),
    onFilter: (value, record) => record.nameSurname === value,
  },
  {
    title: 'เบอร์',
    dataIndex: 'bucketNo',
    width: 130,
    align: 'center',
    filters: distinctArr(data, ['bucketNo']).map((it) => ({
      value: it.bucketNo,
      text: it.bucketNo,
    })),
    onFilter: (value, record) => record.bucketNo === value,
  },
  {
    title: 'เริ่มเวลา',
    dataIndex: 'startTime',
    width: 100,
    className: 'text-primary',
    align: 'center',
  },
  {
    title: 'ชั่วโมงที่',
    dataIndex: 'theHour',
    width: 100,
    className: 'text-primary',
    align: 'center',
  },
  {
    title: 'เกรด',
    dataIndex: 'cleanliness',
    width: 100,
    className: 'text-primary',
    render: (text, record) => {
      return (
        <div
          className={classNames(
            'text-center',
            Numb(text) > 1 ? 'text-warning' : 'text-success'
          )}
        >
          {numer(text).format('0,0.00')}
        </div>
      );
    },
  },
  {
    title: 'ราคา',
    dataIndex: 'price_per_kg',
    width: 100,
    render: (text, record) => {
      const grade = record?.cleanliness;
      return (
        <div
          className={classNames(
            'text-center',
            Numb(grade) > 1 ? 'text-warning' : 'text-success'
          )}
        >
          {numer(text).format('0,0.00')}
        </div>
      );
    },
  },
];
