import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import { notificationController } from 'controllers/notificationController';
import dayjs from 'dayjs';
import { useMergeState } from 'hooks';
import { useLoading } from 'hooks/useLoading';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { addLogs } from 'services/firebase';
import { getFirestoreCollection } from 'services/firebase';
import { setFirestore } from 'services/firebase';
import Page from 'ui/components/common/Pages/Page';
import EditableCellTable from 'ui/components/common/Table/EditableCellTable';
import { capitalize } from 'utils/functions/common';
import { errorHandler } from 'utils/functions/common';
import { Numb } from 'utils/functions/common';
import { showConfirm } from 'utils/functions/common';
import { showLog } from 'utils/functions/common';
import { showWarn } from 'utils/functions/common';
import { getPricingColumns } from './api';

const initEditable = {
  cleanliness: false,
  fat: false,
  lateDelivery: false,
  content: false,
  somaticCell: false,
  fp: false,
};

const Pricing = () => {
  const { profile, USER } = useSelector((state) => state.user);
  const [editable, setEditable] = useMergeState(initEditable);
  const [data, setData] = useMergeState({});
  const [loaded, setLoaded] = useState(false);
  const { setLoading } = useLoading();

  const { t } = useTranslation();
  const columns = getPricingColumns(editable);

  useEffect(() => {
    // Get latest pricing.
    getFirestoreCollection(
      'sections/milk/pricing',
      null,
      'created',
      1,
      true
    ).then((snap) => {
      showLog({ snap });
      Object.keys(snap).map((k) => {
        setData(snap[k]);
        return k;
      });
      setLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUpdateItem = async (row, type) => {
    try {
      const newData = [...data[type]];
      const index = newData.findIndex((item) => row.key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
      } else {
        newData.push(row);
      }
      showLog({ newData, index, data, row });
      setData({ [type]: newData });
    } catch (errInfo) {
      showWarn('Update Failed:', errInfo);
    }
  };

  const confirm = async () => {
    try {
      setLoading(true);
      let res = await setFirestore(
        'sections/milk/pricing',
        dayjs().format('YYYY-MM-DD'),
        { ...data, created: dayjs().tz('Asia/Bangkok').valueOf(), by: USER.uid }
      );
      const log = {
        action: 'ADD',
        module: 'PRICING',
        command: 'PRICING_ADD',
        docId: dayjs().format('YYYY-MM-DD'),
        snap: data,
      };
      await addLogs(log);
      setLoading(false);
      notificationController.success({
        message: `${capitalize(t('บันทึกข้อมูล'))} ${t(
          'สำเร็จ'
        ).toLowerCase()}.`,
      });
    } catch (e) {
      showWarn(e);
      setLoading(false);
      errorHandler({
        code: e?.code || '',
        message: e?.message || '',
        module: 'Pricing',
        snap: data,
      });
    }
  };

  const handleSave = async () => {
    try {
      showConfirm({
        title: t('ยืนยัน').toUpperCase(),
        content: `${t('บันทึกข้อมูล').toUpperCase()} ?`,
        onOk: () => confirm(),
      });
    } catch (e) {
      showWarn(e);
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <Page title="รายละเอียดราคาน้ำนมดิบ" subtitle="รุ่งอรุณ แดรี่">
      <div className="bg-background2 rounded-lg m-3 p-2">
        <div
          className="flex justify-end"
          style={{ display: profile.permissions.milk.price.edit ? '' : 'none' }}
        >
          <Button
            type="link"
            icon={editable.lateDelivery ? <CheckOutlined /> : <EditOutlined />}
            onClick={() =>
              setEditable({ lateDelivery: !editable.lateDelivery })
            }
          />
        </div>
        <h4 className="text-lg text-primary text-center">ส่งช้ากว่ากำหนด</h4>
        <h2 className="text-sm text-muted text-center">
          เวลาเช้า ตั้งแต่เวลา 07.00 น. ถึงเวลา 09.00 น.
        </h2>
        <h2 className="text-sm text-muted text-center">
          เวลาเย็น ตั้งแต่เวลา 16.00 น. ถึงเวลา 18.00 น.
        </h2>
        <EditableCellTable
          dataSource={data.lateDelivery}
          columns={columns.lateDelivery}
          onUpdate={(row) => onUpdateItem(row, 'lateDelivery')}
          //   loading={loading}
          // reset={reset}
          //   handleEdit={handleSelect}
          // onRow={(record, rowIndex) => {
          //   return {
          //     onClick: () => handleSelect(record),
          //   };
          // }}
          // hasEdit
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
          noScroll
        />
      </div>
      <div className="bg-background2 rounded-lg m-3 p-2">
        <div
          className="flex justify-end"
          style={{ display: profile.permissions.milk.price.edit ? '' : 'none' }}
        >
          <Button
            type="link"
            icon={editable.cleanliness ? <CheckOutlined /> : <EditOutlined />}
            onClick={() => setEditable({ cleanliness: !editable.cleanliness })}
          />
        </div>
        <h4 className="text-lg text-primary text-center">ความสะอาด</h4>
        <EditableCellTable
          dataSource={data.cleanliness}
          columns={columns.cleanliness}
          onUpdate={(row) => onUpdateItem(row, 'cleanliness')}
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
          noScroll
        />
      </div>
      <div className="bg-background2 rounded-lg m-3 p-2">
        <div
          className="flex justify-end"
          style={{ display: profile.permissions.milk.price.edit ? '' : 'none' }}
        >
          <Button
            type="link"
            icon={editable.fat ? <CheckOutlined /> : <EditOutlined />}
            onClick={() => setEditable({ fat: !editable.fat })}
          />
        </div>
        <h4 className="text-lg text-primary text-center">
          ราคาตามปริมาณไขมัน (Fat)
        </h4>
        <EditableCellTable
          dataSource={data.fat}
          columns={columns.fat}
          onUpdate={(row) => onUpdateItem(row, 'fat')}
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
          noScroll
        />
      </div>
      <div className="bg-background2 rounded-lg m-3 p-2">
        <div
          className="flex justify-end"
          style={{ display: profile.permissions.milk.price.edit ? '' : 'none' }}
        >
          <Button
            type="link"
            icon={editable.content ? <CheckOutlined /> : <EditOutlined />}
            onClick={() => setEditable({ content: !editable.content })}
          />
        </div>
        <h4 className="text-lg text-primary text-center">
          ราคาตามปริมาณเนื้อนมไม่รวมมันเนย
        </h4>
        <EditableCellTable
          dataSource={data.content}
          columns={columns.content}
          onUpdate={(row) => onUpdateItem(row, 'content')}
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
          noScroll
        />
      </div>
      <div className="bg-background2 rounded-lg m-3 p-2">
        <div
          className="flex justify-end"
          style={{ display: profile.permissions.milk.price.edit ? '' : 'none' }}
        >
          <Button
            type="link"
            icon={editable.somaticCell ? <CheckOutlined /> : <EditOutlined />}
            onClick={() => setEditable({ somaticCell: !editable.somaticCell })}
          />
        </div>
        <h4 className="text-lg text-primary text-center">
          ราคาตามจำนวนเม็ดเลือดขาว
        </h4>
        <EditableCellTable
          dataSource={data.somaticCell}
          columns={columns.somaticCell}
          onUpdate={(row) => onUpdateItem(row, 'somaticCell')}
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
          noScroll
        />
      </div>
      <div className="bg-background2 rounded-lg m-3 p-2">
        <div
          className="flex justify-end"
          style={{ display: profile.permissions.milk.price.edit ? '' : 'none' }}
        >
          <Button
            type="link"
            icon={editable.fp ? <CheckOutlined /> : <EditOutlined />}
            onClick={() => setEditable({ fp: !editable.fp })}
          />
        </div>
        <h4 className="text-lg text-primary text-center">
          จุดเยือกแข็ง (องศาเซลเซียส)
        </h4>
        <EditableCellTable
          dataSource={data.fp}
          columns={columns.fp}
          onUpdate={(row) => onUpdateItem(row, 'fp')}
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
          noScroll
        />
      </div>
      <div
        className="flex justify-center items-center mt-8 "
        style={{ display: profile.permissions.milk.price.edit ? '' : 'none' }}
      >
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={handleSave}
          size="large"
        >
          บันทึกข้อมูลทั้งหมด
        </Button>
      </div>
      <div style={{ height: 200 }} />
    </Page>
  );
};

export default Pricing;
