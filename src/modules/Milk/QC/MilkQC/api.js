import { distinctArr } from 'utils/functions/array';
import { numer } from 'utils/functions/number';

export const getMilkQCColumns = (data) => [
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
    title: 'ปริมาณไขมัน (3.40)',
    children: [
      {
        title: 'ค่า FAT',
        dataIndex: 'fat',
        width: 100,
        align: 'center',
      },
    ],
  },
  {
    title: 'ปริมาณเนื้อนมไม่รวมไขมันเนย',
    children: [
      {
        title: 'ค่า SNF',
        dataIndex: 'snf',
        width: 100,
        align: 'center',
      },
    ],
  },
  {
    title: 'เต้านมอักเสบ',
    children: [
      {
        title: 'ค่า SCC',
        dataIndex: 'scc',
        width: 100,
        render: (text, record) => {
          return (
            <div className="text-center">
              {text ? numer(text).format('0,0') : '0'}
            </div>
          );
        },
      },
    ],
  },
  {
    title: 'จุดเยือกแข็ง',
    children: [
      {
        title: 'ค่า FP',
        dataIndex: 'fp',
        width: 100,
        align: 'center',
      },
    ],
  },
];
