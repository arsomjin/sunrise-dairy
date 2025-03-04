import classNames from 'classnames';
import { showLog } from 'utils/functions/common';
import { Numb } from 'utils/functions/common';
import { numer } from 'utils/functions/number';
import { isVerySmallNumber } from 'utils/functions/number';

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
    width: 100,
    // className: 'text-primary',
    align: 'right',
    render: (text) => <div> {numer(text).format('0,0.00')}</div>,
  },
  {
    title: 'เย็น (kg)',
    dataIndex: 'eveningW',
    width: 100,
    // className: 'text-primary',
    align: 'right',
    render: (text) => <div> {numer(text).format('0,0.00')}</div>,
  },
  {
    title: 'รวม (kg)',
    dataIndex: 'totalW',
    width: 100,
    className: 'text-warning',
    align: 'right',
    render: (text, record) => {
      return (
        <div className={classNames('text-blue-400')}>
          {numer(text).format('0,0.00')}
        </div>
      );
    },
  },
  {
    title: 'ราคา',
    dataIndex: 'unitPrice',
    width: 80,
    render: (text, _) => {
      showLog({ _ });
      return (
        <div
          className={classNames(
            'text-right',
            _.belowStandard ? 'text-warning' : ''
          )}
        >
          {numer(text).format('0,0.00')}
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
          {numer(text).format('0,0.00')}
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
          {numer(text).format('0,0.00')}
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
          {numer(text).format('0,0.00')}
        </div>
      );
    },
  },
];
