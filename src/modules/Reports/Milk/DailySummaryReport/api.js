import classNames from 'classnames';
import numeral from 'numeral';
import { distinctArr } from 'utils/functions/array';
import { Numb } from 'utils/functions/common';

export const getDailySummaryReportColumns = (data) => [
  {
    title: '#',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: 'ชื่อ - สกุล',
    dataIndex: 'nameSurname',
    width: 160,
    filters: distinctArr(data, ['nameSurname']).map((it) => ({
      value: it.nameSurname,
      text: it.nameSurname,
    })),
    onFilter: (value, record) => record.nameSurname === value,
  },
  {
    title: 'เบอร์',
    dataIndex: 'memberId',
    width: 80,
    align: 'center',
    // className: 'text-warning',
    filters: distinctArr(data, ['memberId']).map((it) => ({
      value: it.memberId,
      text: it.memberId,
    })),
    onFilter: (value, record) => record.memberId === value,
  },
  // {
  //   title: 'วันที่',
  //   dataIndex: 'recordDate',
  //   width: 130,
  //   align: 'right',
  // },
  // {
  //   title: 'ช่วงเวลา',
  //   dataIndex: 'period',
  //   width: 130,
  //   align: 'right',
  // },
  // {
  //   title: 'น้ำหนัก',
  //   dataIndex: 'weight',
  //   width: 130,
  //   align: 'right',
  // },
  {
    title: 'เช้า (kg)',
    dataIndex: 'morningW',
    width: 80,
    // className: 'text-primary',
    align: 'right',
    render: (text) => <div> {numeral(text).format('0,0.00')}</div>,
  },
  {
    title: 'เย็น (kg)',
    dataIndex: 'eveningW',
    width: 80,
    // className: 'text-primary',
    align: 'right',
    render: (text) => <div> {numeral(text).format('0,0.00')}</div>,
  },
  {
    title: 'รวม (kg)',
    dataIndex: 'totalW',
    width: 80,
    className: 'text-warning',
    align: 'right',
    render: (text, record) => {
      let total = Numb(record.morningW) + Numb(record.eveningW);
      return (
        <div className={classNames('text-blue-400')}>
          {numeral(total).format('0,0.00')}
        </div>
      );
    },
  },
  {
    title: 'ราคา',
    dataIndex: 'unitPrice',
    width: 80,
    render: (text) => {
      return (
        <div
          className={classNames(
            'text-right',
            Numb(text) < 0 ? 'text-warning' : ''
          )}
        >
          {numeral(text).format('0,0.00')}
        </div>
      );
    },
    align: 'right',
  },
  {
    title: 'คุณภาพ',
    dataIndex: 'qUnitPrice',
    width: 80,
    render: (text) => {
      return (
        <div
          className={classNames(
            'text-right',
            Numb(text) < 0
              ? 'text-warning'
              : Numb(text) > 0
              ? 'text-success'
              : ''
          )}
        >
          {numeral(text).format('0,0.00')}
        </div>
      );
    },
    align: 'right',
  },
  {
    title: 'ราคาต่อ kg',
    dataIndex: 'accUnitPrice',
    width: 80,
    render: (text) => {
      return (
        <div
          className={classNames(
            'text-right',
            Numb(text) < 1 ? 'text-warning' : 'text-blue-400'
          )}
        >
          {numeral(text).format('0,0.00')}
        </div>
      );
    },
    align: 'right',
  },
  {
    title: 'รวมเงิน',
    width: 100,
    render: (text, record) => {
      let total = Numb(record.morningW) + Numb(record.eveningW);
      let amount = total * record.accUnitPrice;
      return (
        <div
          className={classNames(
            'text-right',
            Numb(amount) < 1 ? 'text-warning' : 'text-success'
          )}
        >
          {numeral(amount).format('0,0.00')}
        </div>
      );
    },
  },
];
