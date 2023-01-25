import React from 'react';
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
import { renderUsersBody } from './components';
import { useSelector } from 'react-redux';
import { addLogs } from 'services/firebase';
import dayjs from 'dayjs';

const UsersModal = ({ doc, setLoading, onFinish, onCancel }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { mobileOnly } = useResponsive();
  const { USER } = useSelector((state) => state.user);

  const preFinish = (val) => {
    showLog({ val });
    showConfirm({
      title: t('ยืนยัน').toUpperCase(),
      content: 'บันทึกข้อมูล ?',
      onOk: () => onConfirm(val),
    });
  };

  const onConfirm = async (val) => {
    try {
      showLog({ val });
      setLoading(true);
      let permissions = cleanValuesBeforeSave({
        ...val,
        editBy: { uid: USER.uid, ts: dayjs().tz('Asia/Bangkok').valueOf() },
      });
      await updateFirestore(`users/${doc._id}/info/`, 'profile', {
        permissions,
      });
      // Add log.
      const log = {
        action: 'EDIT',
        module: 'PERMISSIONS',
        command: 'PERMISSIONS_EDIT',
        docId: doc._id,
        snap: permissions,
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
        module: 'UsersModal',
        snap: val,
      });
    }
  };

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
        disabled
      />
    </Form.Item>
  );

  return (
    <Form
      form={form}
      initialValues={doc.permissions}
      onFinish={preFinish}
      scrollToFirstError
    >
      {(values) => {
        showLog({ modal_val: values });
        return renderUsersBody({
          mobileOnly,
          prefixSelector,
          t,
          onCancel,
          isModal: true,
          form,
          values,
        });
      }}
    </Form>
  );
};

export default UsersModal;
