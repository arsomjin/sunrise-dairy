import React, { useCallback, useEffect, useState } from 'react';
import { Input } from 'antd';
import Page from 'ui/components/common/Pages/Page';
import EditableCellTable from 'ui/components/common/Table/EditableCellTable';
import { getEmployeesColumns, _search } from './api';
import { showLog, showWarn } from 'utils/functions/common';
import { useLoading } from 'hooks/useLoading';
import { getFirestoreCollection } from 'services/firebase';
import EmployeesModal from './EmployeesModal';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import Button from 'ui/elements/Button';
import { PlusOutlined } from '@ant-design/icons';
import shortid from 'shortid';

const Employees = () => {
  const { profile } = useSelector((state) => state.user);
  const editable =
    profile?.permissions &&
    profile.permissions?.personal &&
    profile.permissions.personal.employee.edit;
  const addable =
    profile?.permissions &&
    profile.permissions?.personal &&
    profile.permissions.personal.employee.add;
  const { loading, setLoading, setModal } = useLoading();
  const [searching, setSearching] = useState(false);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  const getEmployees = useCallback(
    async (sDate) => {
      try {
        setLoading(true);
        const res = await getFirestoreCollection('sections/personal/employees');
        const arr = res
          ? Object.keys(res).map((k, id) => ({
              ...res[k],
              id,
              key: id,
              _id: k,
              nameSurname: `${res[k].prefix || ''}${res[k].firstName || ''} ${
                res[k].lastName || ''
              }`.trim(),
            }))
          : [];
        showLog({ arr, res });
        setLoading(false);
        setData(arr);
      } catch (e) {
        showWarn(e);
        setLoading(false);
      }
    },
    [setLoading]
  );

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const handleSelect = (rec) => {
    showLog({ rec });
    setModal({
      content: (
        <EmployeesModal
          {...{
            doc: rec,
            setLoading,
            onFinish: () => {
              getEmployees();
              setModal({
                open: false,
                content: null,
                title: null,
                footer: undefined,
              });
            },
          }}
        />
      ),
      open: true,
      title: (
        <span className="text-muted ml-2">
          แก้ไขข้อมูล
          <span className="text-warning ml-2">{` ${rec.prefix || ''}${
            rec.firstName
          } ${rec?.lastName || ''}`}</span>
        </span>
      ),
      footer: false,
    });
  };

  const handleAdd = () => {
    setModal({
      content: (
        <EmployeesModal
          {...{
            doc: { employeeId: shortid() },
            setLoading,
            onFinish: () => {
              getEmployees();
              setModal({
                open: false,
                content: null,
                title: null,
                footer: undefined,
              });
            },
          }}
        />
      ),
      open: true,
      title: <span className="text-muted ml-2">เพิ่มรายชื่อพนักงาน</span>,
      footer: false,
    });
  };

  const onSearch = debounce((txt) => {
    _search(txt, allData, setData, setSearching);
  }, 200);

  return (
    <Page title="รายชื่อพนักงาน" subtitle="รุ่งอรุณ แดรี่">
      <div className="w-96 my-3 flex items-center">
        <Button
          icon={<PlusOutlined />}
          type="link"
          onClick={handleAdd}
          disabled={!addable}
        />
        <Input.Search
          placeholder="ค้นหาจาก ชื่อ, อีเมล, เบอร์โทร, ฯลฯ"
          onSearch={onSearch}
          enterButton
          loading={searching}
          className="ml-2"
        />
      </div>
      <div className="mt-3">
        <EditableCellTable
          dataSource={data}
          columns={getEmployeesColumns(data)}
          loading={loading}
          handleEdit={handleSelect}
          hasEdit={editable}
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
        />
      </div>
    </Page>
  );
};

export default Employees;
