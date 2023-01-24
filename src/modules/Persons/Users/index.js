import React, { useCallback, useEffect, useState } from 'react';
import { Form, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import Page from 'ui/components/common/Pages/Page';
import { useResponsive } from 'hooks/useResponsive';
import dayjs from 'dayjs';
import EditableCellTable from 'ui/components/common/Table/EditableCellTable';
import { getUsersColumns } from './api';
import DatePicker from 'ui/elements/DatePicker';
import { getRules } from 'utils/functions/validator';
import {
  showLog,
  cleanValuesBeforeSave,
  showConfirm,
  showWarn,
  errorHandler,
  capitalize,
  showWarning,
} from 'utils/functions/common';
import { useLoading } from 'hooks/useLoading';
import { notificationController } from 'controllers/notificationController';
import { getFirestoreCollection } from 'services/firebase';
import { addFirestore } from 'services/firebase';
import { renderUsersBody } from './components';
import UsersModal from './UsersModal';
import { useSelector } from 'react-redux';
import { checkDuplicatedDoc } from 'services/firebase';
import { getThaiDate } from 'utils/functions/times';
import { addLogs } from 'services/firebase';
import { query } from 'firebase/database';
import { firestore } from 'services/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Users = () => {
  const { profile, USER } = useSelector((state) => state.user);
  const editable =
    profile?.permissions &&
    profile.permissions?.milk &&
    profile.permissions.milk.QC.edit;
  const addable =
    profile?.permissions &&
    profile.permissions?.milk &&
    profile.permissions.milk.QC.add;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { mobileOnly } = useResponsive();
  const { loading, setLoading, setModal } = useLoading();
  const [data, setData] = useState([]);

  const getUsers = useCallback(
    async (sDate) => {
      try {
        setLoading(true);
        const res = await getFirestoreCollection('errors/no_auth/handler');
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
    getUsers();
  }, [getUsers]);

  const handleSelect = (rec) => {
    showLog({ rec });
    setModal({
      content: (
        <UsersModal
          {...{
            doc: rec,
            setLoading,
            onFinish: () => {
              getUsers();
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
          <span className="text-warning ml-2">{rec.bucketNo}</span>
        </span>
      ),
      footer: false,
    });
    // setModal({ doc: rec, open: true });
  };

  const mData = data.map((it, id) => ({
    ...it,
    id,
    nameSurname: `${it.prefix}${it.firstName} ${it.lastName || ''}`,
  }));
  return (
    <Page title="รายชื่อผู้ใช้งาน" subtitle="รุ่งอรุณ แดรี่">
      <div className="mt-3">
        <EditableCellTable
          dataSource={mData}
          columns={getUsersColumns(mData)}
          loading={loading}
          handleEdit={handleSelect}
          // onRow={(record, rowIndex) => {
          //   return {
          //     onClick: () => handleSelect(record),
          //   };
          // }}
          hasEdit={editable}
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
        />
      </div>
    </Page>
  );
};

export default Users;
