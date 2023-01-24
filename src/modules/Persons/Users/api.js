import { distinctArr } from 'utils/functions/array';

export const getUsersColumns = (data) => [
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
    title: 'เบอร์โทร',
    dataIndex: 'phoneNumber',
    width: 100,
    align: 'center',
    onFilter: (value, record) => record.phoneNumber === value,
  },
  {
    title: 'อีเมล',
    dataIndex: 'phoneNumber',
    width: 100,
    align: 'center',
    onFilter: (value, record) => record.email === value,
  },
];
