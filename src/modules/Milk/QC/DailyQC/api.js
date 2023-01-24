import { distinctArr } from 'utils/functions/array';

export const getDailyQCColumns = (data) => [
  {
    title: '#',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: 'ชื่อ - สกุล',
    dataIndex: 'nameSurname',
    width: 140,
    filters: distinctArr(data, ['nameSurname']).map((it) => ({
      value: it.nameSurname,
      text: it.nameSurname,
    })),
    onFilter: (value, record) => record.nameSurname === value,
    ellipsis: true,
  },
  {
    title: 'เบอร์',
    dataIndex: 'bucketNo',
    width: 100,
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
];
