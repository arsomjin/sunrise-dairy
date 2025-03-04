import classNames from 'classnames';
import { distinctArr } from 'utils/functions/array';
import { showLog } from 'utils/functions/common';
import { Numb } from 'utils/functions/common';
import { numer } from 'utils/functions/number';

export const getQCResultColumns = (data) => [
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
      {
        title: 'ราคา+/- FAT',
        dataIndex: 'fat_price',
        width: 100,
        render: (text, record) => {
          return (
            <div
              className={classNames(
                'text-center',
                Numb(text) > 0
                  ? 'text-blue-500'
                  : Numb(text) < 0
                  ? 'text-danger'
                  : ''
              )}
            >
              {numer(text).format('0,0.00')}
            </div>
          );
        },
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
      {
        title: 'ราคา+/- SNF',
        dataIndex: 'snf_price',
        width: 100,
        render: (text, record) => {
          return (
            <div
              className={classNames(
                'text-center',
                Numb(text) > 0
                  ? 'text-blue-500'
                  : Numb(text) < 0
                  ? 'text-danger'
                  : ''
              )}
            >
              {numer(text).format('0,0.00')}
            </div>
          );
        },
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
          return <div className="text-center">{numer(text).format('0,0')}</div>;
        },
      },
      {
        title: 'ราคา+/- SCC',
        dataIndex: 'scc_price',
        width: 100,
        render: (text, record) => {
          return (
            <div
              className={classNames(
                'text-center',
                Numb(text) > 0
                  ? 'text-blue-500'
                  : Numb(text) < 0
                  ? 'text-danger'
                  : ''
              )}
            >
              {numer(text).format('0,0.00')}
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
      {
        title: 'ราคา+/- FP',
        dataIndex: 'fp_price',
        width: 100,
        render: (text, record) => {
          return (
            <div
              className={classNames(
                'text-center',
                Numb(text) > 0
                  ? 'text-blue-500'
                  : Numb(text) < 0
                  ? 'text-danger'
                  : ''
              )}
            >
              {numer(text).format('0,0.00')}
            </div>
          );
        },
      },
    ],
  },
  {
    title: 'ราคา+/- ทั้งหมด',
    dataIndex: 'all_price',
    width: 100,
    render: (text, record) => {
      const { fat_price, snf_price, scc_price, fp_price } = record;
      let total =
        Numb(fat_price) + Numb(snf_price) + Numb(scc_price) + Numb(fp_price);
      showLog({ fat_price, snf_price, scc_price, fp_price, total });
      return (
        <div
          className={classNames(
            'text-right',
            total > 0 ? 'text-blue-500' : total < 0 ? 'text-danger' : ''
          )}
        >
          {numer(total).format('0,0.00')}
        </div>
      );
    },
  },
];
