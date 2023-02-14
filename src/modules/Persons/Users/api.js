import { AuditOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { distinctArr } from 'utils/functions/array';
import Button from 'ui/elements/Button';
import { showWarn } from 'utils/functions/common';

export const getUsersColumns = (editable, handleSelect) => [
  {
    title: '#',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: 'สิทธิ์',
    width: 50,
    align: 'center',
    render: (text, record) => {
      return (
        <div className="flex justify-center">
          <Button
            type="link"
            disabled={!editable}
            onClick={() => handleSelect(record)}
            icon={<AuditOutlined />}
          />
        </div>
      );
    },
  },
  {
    title: 'ชื่อ',
    dataIndex: 'displayName',
    width: 100,
    ellipsis: true,
  },
  {
    title: 'เบอร์โทร',
    dataIndex: 'phoneNumber',
    width: 80,
    align: 'center',
  },
  {
    title: 'อีเมล',
    dataIndex: 'email',
    width: 120,
    align: 'center',
  },
  {
    title: 'UID',
    dataIndex: 'uid',
    width: 100,
    align: 'center',
    render: (text, record) => {
      return <div>{`${text.slice(0, 6)}...${text.slice(-6)}`}</div>;
    },
  },
  {
    title: 'อนุมัติเข้าใช้งาน',
    dataIndex: 'granted',
    width: 80,
    render: (text, record) => {
      return (
        <div
          className={classNames(
            'text-center',
            text ? 'text-success' : 'text-warning'
          )}
        >
          {text ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
        </div>
      );
    },
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
      ['displayName'].some((key) => {
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
