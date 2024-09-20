import classNames from 'classnames';
import numeral from 'numeral';
import { distinctArr } from 'utils/functions/array';
import { Numb } from 'utils/functions/common';

export const getDailyMemberReportColumns = (data) => [
  {
    title: '#',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: 'วันที่',
    dataIndex: 'recordDate',
    width: 110,
    align: 'center',
  },
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
      return (
        <div className={classNames('text-blue-400')}>
          {numeral(text).format('0,0.00')}
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
    dataIndex: 'amount',
    width: 100,
    render: (text, record) => {
      return (
        <div
          className={classNames(
            'text-right',
            Numb(text) < 0 ? 'text-warning' : 'text-success'
          )}
        >
          {numeral(text).format('0,0.00')}
        </div>
      );
    },
  },
];
