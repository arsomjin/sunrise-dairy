import numeral from 'numeral';
import { distinctArr } from 'utils/functions/array';

export const getMilkColumns = (data) => [
  {
    title: '#',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: 'เลขที่เอกสาร',
    dataIndex: 'docNo',
    width: 130,
    align: 'center',
    filters: distinctArr(data, ['docNo']).map((it) => ({
      value: it.docNo,
      text: it.docNo,
    })),
    onFilter: (value, record) => record.docNo === value,
  },
  {
    title: 'วันที่บันทึก',
    dataIndex: 'recordDate',
    width: 100,
    filters: distinctArr(data, ['recordDate']).map((it) => ({
      value: it.recordDate,
      text: it.recordDate,
    })),
    onFilter: (value, record) => record.recordDate === value,
  },
  {
    title: 'รหัสสมาชิก',
    dataIndex: 'memberId',
    align: 'center',
    width: 90,
    filters: distinctArr(data, ['memberId']).map((it) => ({
      value: it.memberId,
      text: it.memberId,
    })),
    onFilter: (value, record) => record.memberId === value,
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
    title: 'ช่วงเวลา',
    dataIndex: 'period',
    align: 'center',
    width: 70,
    filters: distinctArr(data, ['period']).map((it) => ({
      value: it.period,
      text: it.period,
    })),
    onFilter: (value, record) => record.period === value,
  },
  {
    title: 'น้ำหนัก',
    dataIndex: 'weight',
    align: 'center',
    width: 80,
    className: 'text-primary',
    render: (text) => (
      <div className="text-right">
        {text ? numeral(text).format('0,0.00') : '-'}
      </div>
    ),
    sorter: (a, b) => a.weight - b.weight,
  },
  {
    title: 'ผู้บันทึก',
    dataIndex: 'recorder',
    width: 160,
    filters: distinctArr(data, ['recorder']).map((it) => ({
      value: it.recorder,
      text: it.recorder,
    })),
    onFilter: (value, record) => record.recorder === value,
  },
  {
    title: 'วันที่ในระบบ',
    dataIndex: 'systemDate',
    width: 180,
  },
];
