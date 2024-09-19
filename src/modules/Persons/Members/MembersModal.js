import React, { useEffect, useState } from 'react';
import { Form, Row, Select } from 'antd';
import { notificationController } from 'controllers/notificationController';
import { useResponsive } from 'hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import { updateFirestore } from 'services/firebase';
import { showWarn } from 'utils/functions/common';
import { errorHandler } from 'utils/functions/common';
import { cleanValuesBeforeSave } from 'utils/functions/common';
import { capitalize } from 'utils/functions/common';
import { showConfirm } from 'utils/functions/common';
import { showLog } from 'utils/functions/common';
import { renderMembersBody } from './components';
import { useSelector } from 'react-redux';
import { addLogs } from 'services/firebase';
import { getResidences } from 'constants/thaiTambol';
import { showWarning } from 'utils/functions/common';
import { checkDuplicatedDoc } from 'services/firebase';
import { setFirestore } from 'services/firebase';

const MembersModal = ({ doc, setLoading, onFinish, parent, notRequired }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { mobileOnly } = useResponsive();
  const { USER } = useSelector((state) => state.user);

  const [residences2, setRes] = useState(null);

  useEffect(() => {
    const getAddresses = async () => {
      let res = await getResidences();
      setRes(res);
    };
    getAddresses();
  }, []);

  const preFinish = async (val) => {
    try {
      showLog({ val });
      if (!doc?.firstName) {
        setLoading(true);
        const hasDup = await checkDuplicatedDoc('sections/personal/members', {
          firstName: val.firstName,
          lastName: val.lastName,
          deleted: false,
        });
        showLog({ hasDup });
        if (hasDup) {
          return showWarning({
            title: 'มีรายการซ้ำ',
            content: `คุณ ${val.firstName} ${val.lastName} บันทึกข้อมูลเรียบร้อยแล้ว`,
          });
        }
        setLoading(false);
      }
      showConfirm({
        title: t('ยืนยัน').toUpperCase(),
        content: 'บันทึกข้อมูล ?',
        onOk: () => onConfirm({ ...doc, ...val }),
      });
    } catch (e) {
      setLoading(false);
      showWarn(e);
    }
  };

  const onConfirm = async (val) => {
    try {
      showLog({ val });
      setLoading(true);
      let saveItem = cleanValuesBeforeSave({
        ...val,
        deleted: false,
        editBy: USER.uid,
      });
      if (!!doc?.firstName) {
        await updateFirestore(
          'sections/personal/members',
          doc.memberId,
          saveItem
        );
      } else {
        await setFirestore('sections/personal/members', doc.memberId, saveItem);
      }
      // Add log.
      const log = {
        action: doc?.firstName ? 'EDIT' : 'ADD',
        module: 'MEMBER',
        command: doc?.firstName ? 'MEMBER_EDIT' : 'MEMBER_ADD',
        docId: doc.memberId,
        snap: saveItem,
      };
      await addLogs(log);
      setLoading(false);
      notificationController.success({
        message: `${capitalize(t('บันทึกข้อมูล'))} ${t(
          'สำเร็จ'
        ).toLowerCase()}.`,
      });
      onFinish();
      // Add Log.
    } catch (e) {
      setLoading(false);
      showWarn(e);
      errorHandler({
        code: e?.code || '',
        message: e?.message || '',
        module: 'MembersModal',
        snap: val,
      });
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await updateFirestore('sections/personal/members', doc.memberId, {
        deleted: true,
        deleteBy: USER.uid,
      });
      // Add log.
      const log = {
        action: 'DELETE',
        module: 'MEMBER',
        command: 'MEMBER_DELETE',
        docId: doc.memberId,
      };
      await addLogs(log);
      setLoading(false);
      notificationController.success({
        message: `${capitalize(t('ลบข้อมูล'))} ${t('สำเร็จ').toLowerCase()}.`,
      });
      onFinish();
    } catch (e) {
      setLoading(false);
      showWarn(e);
      errorHandler({
        code: e?.code || '',
        message: e?.message || '',
        module: 'MembersModal',
      });
    }
  };

  const onDelete = () =>
    showConfirm({
      title: t('ยืนยัน').toUpperCase(),
      content: `${t('ลบข้อมูล').toUpperCase()} ?`,
      onOk: () => confirmDelete(),
      okButtonProps: { danger: true },
    });

  const onClear = () =>
    showConfirm({
      title: t('ยืนยัน').toUpperCase(),
      content: 'ล้างหน้าจอ ?',
      onOk: () => form.resetFields(),
    });

  const [emailAutoCompleteResult, setEmailAutoCompleteResult] = useState([]);

  const onEmailChange = (value) => {
    if (!value) {
      setEmailAutoCompleteResult([]);
    } else {
      setEmailAutoCompleteResult(
        ['@gmail.com', '@hotmail.com', '.co.th'].map(
          (domain) => `${value}${domain}`
        )
      );
    }
  };

  const emailOptions = emailAutoCompleteResult.map((email) => ({
    label: email,
    value: email,
  }));

  const getParent = (field) =>
    parent ? [...parent, field] : ['address', field];

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{ width: 80 }}
        options={[
          {
            value: 'นาย',
            label: t('นาย'),
          },
          {
            value: 'นาง',
            label: t('นาง'),
          },
          {
            value: 'นางสาว',
            label: t('นางสาว'),
          },
        ]}
      />
    </Form.Item>
  );

  return (
    <Form
      form={form}
      initialValues={{
        ...doc,
        residence: doc.residence || [
          'นครราชสีมา',
          'สูงเนิน',
          'สูงเนิน',
          '30170',
        ],
        prefix: doc.prefix || 'นาย',
        phonePrefix: doc.phonePrefix || '66',
      }}
      onFinish={preFinish}
      scrollToFirstError
    >
      {(values) => {
        //   showLog({ values });
        return renderMembersBody({
          mobileOnly,
          prefixSelector,
          t,
          onDelete,
          isModal: true,
          memberId: doc.memberId,
          disabled: false,
          readOnly: false,
          emailOptions,
          getParent,
          onEmailChange,
          notRequired,
          residences2,
          onClear,
        });
      }}
    </Form>
  );
};

export default MembersModal;
