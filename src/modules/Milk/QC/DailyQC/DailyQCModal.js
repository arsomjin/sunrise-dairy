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
import { renderDailyQCBody } from './components';
import { useSelector } from 'react-redux';
import { addLogs } from 'services/firebase';

const DailyQCModal = ({ doc, setLoading, onFinish }) => {
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
      let saveItem = cleanValuesBeforeSave({
        ...val,
        deleted: false,
        editBy: USER.uid,
      });
      await updateFirestore('sections/milk/dailyQC', doc._id, saveItem);
      // Add log.
      const log = {
        action: 'EDIT',
        module: 'DAILY_QC',
        command: 'DAILY_QC_EDIT',
        docId: doc._id,
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
    } catch (e) {
      setLoading(false);
      showWarn(e);
      errorHandler({
        code: e?.code || '',
        message: e?.message || '',
        module: 'DailyQCModal',
        snap: val,
      });
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await updateFirestore('sections/milk/dailyQC', doc._id, {
        deleted: true,
        deleteBy: USER.uid,
      });
      // Add log.
      const log = {
        action: 'DELETE',
        module: 'DAILY_QC',
        command: 'DAILY_QC_DELETE',
        docId: doc._id,
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
        module: 'DailyQCModal',
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
      initialValues={doc}
      onFinish={preFinish}
      scrollToFirstError
    >
      {(values) => {
        //   showLog({ values });
        return renderDailyQCBody({
          mobileOnly,
          prefixSelector,
          t,
          onDelete,
          isModal: true,
        });
      }}
    </Form>
  );
};

export default DailyQCModal;
