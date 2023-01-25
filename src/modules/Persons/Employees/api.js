import { distinctArr } from 'utils/functions/array';
import { showWarn } from 'utils/functions/common';

export const getEmployeesColumns = (data) => [
  {
    title: '#',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: 'รหัสพนักงาน',
    dataIndex: 'employeeNo',
    align: 'center',
    width: 60,
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

export const _search = async (txt, allData, setData, setSearching) => {
  try {
    if (!txt) {
      return setData([]);
    }
    setSearching(true);
    const arr1 = allData.filter((item) =>
      ['email'].some((key) => {
        let sTxt = !!item[key]
          ? item[key].toString().replace(/(\r\n|\n|\r|,| |-)/g, '')
          : '';
        return sTxt.toLowerCase().includes(txt.toLowerCase());
      })
    );
    const arr2 = allData.filter((item) =>
      ['firstName'].some((key) => {
        let sTxt = !!item[key]
          ? item[key].toString().replace(/(\r\n|\n|\r|,|-)/g, '')
          : '';
        // showLog({ sTxt });
        return sTxt.toLowerCase().includes(txt.toLowerCase());
      })
    );
    const arr3 = allData.filter((item) =>
      ['phoneNumber'].some((key) => {
        let sTxt = !!item[key]
          ? item[key].toString().replace(/(\r\n|\n|\r|,| |-)/g, '')
          : '';
        // showLog({ sTxt });
        return sTxt.toLowerCase().includes(txt.toLowerCase());
      })
    );
    const arr = distinctArr(
      [...arr1, ...arr2, ...arr3],
      ['email', 'phoneNumber']
    );
    setData(arr);
    setSearching(false);
  } catch (e) {
    showWarn(e);
    setSearching(false);
  }
};
