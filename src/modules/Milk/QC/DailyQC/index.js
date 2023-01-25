import React, { useCallback, useEffect, useState } from 'react';
import { Form, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import Page from 'ui/components/common/Pages/Page';
import { useResponsive } from 'hooks/useResponsive';
import dayjs from 'dayjs';
import EditableCellTable from 'ui/components/common/Table/EditableCellTable';
import { getDailyQCColumns } from './api';
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
import { renderDailyQCBody } from './components';
import DailyQCModal from './DailyQCModal';
import { useSelector } from 'react-redux';
import { checkDuplicatedDoc, addLogs } from 'services/firebase';
import { Dates } from 'constants/Dates';

const DailyQC = () => {
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
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

  const getDailyQC = useCallback(
    async (sDate) => {
      try {
        setLoading(true);
        const res = await getFirestoreCollection('sections/milk/dailyQC', [
          ['recordDate', '==', sDate],
        ]);
        const arr = res
          ? Object.keys(res).map((k, id) => ({
              ...res[k],
              id,
              key: id,
              _id: k,
              nameSurname: `${res[k].prefix}${res[k].firstName} ${
                res[k].lastName || ''
              }`,
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
    getDailyQC(date);
  }, [date, getDailyQC]);

  const onDateChange = (val) => setDate(val);

  const preFinish = async (val) => {
    try {
      showLog({ val });
      // Check duplicate (except deleted).
      const hasDup = await checkDuplicatedDoc('sections/milk/dailyQC', {
        firstName: val.firstName,
        bucketNo: val.bucketNo,
        recordDate: val.recordDate,
        deleted: false,
      });
      showLog({ hasDup });
      if (hasDup) {
        return showWarning({
          title: 'มีรายการซ้ำ',
          content: `เบอร์ ${val.bucketNo} ${
            val.firstName
          } วันที่ ${Dates.getThaiDate(
            val.recordDate
          )} บันทึกข้อมูลเรียบร้อยแล้ว`,
        });
      }
      showConfirm({
        title: t('ยืนยัน').toUpperCase(),
        content: 'บันทึกข้อมูล ?',
        onOk: () => onConfirm(val),
      });
    } catch (e) {
      showWarn(e);
    }
  };

  const onConfirm = async (val) => {
    try {
      setLoading(true);
      let saveItem = cleanValuesBeforeSave({
        ...val,
        deleted: false,
        by: USER.uid,
      });
      const res = await addFirestore('sections/milk/dailyQC', saveItem);
      // Add log.
      const log = {
        action: 'ADD',
        module: 'DAILY_QC',
        command: 'DAILY_QC_ADD',
        docId: res.id,
        snap: saveItem,
      };
      await addLogs(log);
      // Add search fields at cloud.
      setLoading(false);
      notificationController.success({
        message: `${capitalize(t('บันทึกข้อมูล'))} ${t(
          'สำเร็จ'
        ).toLowerCase()}.`,
      });
      getDailyQC(date);
      form.resetFields();
    } catch (e) {
      setLoading(false);
      showWarn(e);
      errorHandler({
        code: e?.code || '',
        message: e?.message || '',
        module: 'DailyQC',
        snap: val,
      });
    }
  };

  const onClear = () =>
    showConfirm({
      title: t('ยืนยัน').toUpperCase(),
      content: 'ล้างข้อมูล ?',
      onOk: () => form.resetFields(),
    });

  const handleSelect = (rec) => {
    showLog({ rec });
    setModal({
      content: (
        <DailyQCModal
          {...{
            doc: rec,
            setLoading,
            onFinish: () => {
              getDailyQC(date);
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

  const prefixSelector = (
    <Form.Item name="prefix" rules={getRules(['required'])} noStyle>
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

  const mData = data.map((it, id) => ({
    ...it,
    id,
    nameSurname: `${it.prefix}${it.firstName} ${it.lastName || ''}`,
  }));
  return (
    <Page title="การตรวจน้ำนมดิบประจำวัน" subtitle="รุ่งอรุณ แดรี่">
      <span className="mx-2 text-muted">วันที่</span>
      <DatePicker value={date} onChange={onDateChange} />
      <div className="mt-3">
        <EditableCellTable
          dataSource={mData}
          columns={getDailyQCColumns(mData)}
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
      {addable && (
        <Form
          form={form}
          initialValues={{ recordDate: date }}
          onFinish={preFinish}
          scrollToFirstError
        >
          {(values) => {
            //   showLog({ values });
            return renderDailyQCBody({
              mobileOnly,
              prefixSelector,
              t,
              onClear,
            });
          }}
        </Form>
      )}
    </Page>
  );
};

export default DailyQC;
