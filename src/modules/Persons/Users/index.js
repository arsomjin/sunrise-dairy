import React, { useCallback, useEffect, useState } from 'react';
import { Input } from 'antd';
import Page from 'ui/components/common/Pages/Page';
import EditableCellTable from 'ui/components/common/Table/EditableCellTable';
import { getUsersColumns, _search } from './api';
import { showLog, showWarn } from 'utils/functions/common';
import { useLoading } from 'hooks/useLoading';
import { getFirestoreCollection } from 'services/firebase';
import UsersModal from './UsersModal';
import { useSelector } from 'react-redux';
import { arrayForEach } from 'utils/functions/array';
import { getFirestoreDoc } from 'services/firebase';
import { debounce } from 'lodash';

const Users = ({ isPending }) => {
  const { profile, USER } = useSelector((state) => state.user);
  const editable =
    profile?.permissions &&
    profile.permissions?.personal &&
    profile.permissions.personal.user.edit;
  const { loading, setLoading, setModal } = useLoading();
  const [searching, setSearching] = useState(false);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  const getUsers = useCallback(
    async (sDate) => {
      try {
        setLoading(true);
        const res = await getFirestoreCollection('users');
        const arr = res
          ? Object.keys(res).map((k, id) => ({
              ...res[k],
              id,
              key: id,
              _id: k,
            }))
          : [];
        let users = [];
        await arrayForEach(arr, async (usr) => {
          const pf = await getFirestoreDoc(`users/${usr.uid}/info`, 'profile');
          usr?.uid !== USER?.uid &&
            !usr?.isDev &&
            users.push({
              ...usr,
              granted: pf.permissions.granted,
              permissions: pf.permissions,
            });
        });
        showLog({ arr, res, users });
        const pendingUsers = users
          .filter((l) => !l.permissions.granted)
          .map((l, id) => ({ ...l, id, key: id }));
        const allUsers = users.map((l, id) => ({ ...l, id, key: id }));
        setLoading(false);
        setData(isPending ? pendingUsers : allUsers);
        setAllData(isPending ? pendingUsers : allUsers);
      } catch (e) {
        showWarn(e);
        setLoading(false);
      }
    },
    [USER?.uid, isPending, setLoading]
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
            onCancel: () => {
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
        <span className="text-primary ml-2">
          สิทธิ์การใช้งานของ{' '}
          {rec?.displayName || rec?.email || rec?.phoneNumber}
        </span>
      ),
      footer: false,
    });
    // setModal({ doc: rec, open: true });
  };

  const onSearch = debounce((txt) => {
    _search(txt, allData, setData, setSearching);
  }, 200);

  return (
    <Page
      title={isPending ? 'รายชื่อผู้ใช้งาน (รออนุมัติ)' : 'รายชื่อผู้ใช้งาน'}
      subtitle="รุ่งอรุณ แดรี่"
    >
      <div className="w-96 my-3">
        <Input.Search
          placeholder="ค้นหาจาก ชื่อ, อีเมล, เบอร์โทร, ฯลฯ"
          onSearch={onSearch}
          enterButton
          loading={searching}
        />
      </div>
      <div className="mt-3">
        <EditableCellTable
          dataSource={data}
          columns={getUsersColumns(editable, handleSelect)}
          loading={loading}
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
        />
      </div>
    </Page>
  );
};

export default Users;
