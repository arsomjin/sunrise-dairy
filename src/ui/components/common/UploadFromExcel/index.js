import React, { useRef, useCallback } from 'react';
import { useMergeState } from 'hooks';
import { Button, Popconfirm } from 'antd';
import Excels from './Excels';
import {
  showLog,
  showWarn,
  showAlert,
  errorHandler,
  cleanValuesBeforeSave,
  showSuccess,
} from 'utils/functions/common';
import { useSelector } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';
import {
  formatExcelToJson,
  getTitle,
  onConfirm,
  _checkImportData,
} from './api';
import { setFirestore } from 'services/firebase';
import { showWarning } from 'utils/functions/common';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoading } from 'hooks/useLoading';

const UploadFromExcel = () => {
  const { USER } = useSelector((state) => state.user);
  // const { users } = useSelector((state) => state.data);
  const [cState, setCState] = useMergeState({
    loading: false,
    loaded: false,
  });

  const { progressing, setProgress, setUpdate } = useLoading();

  const navigate = useNavigate();
  const location = useLocation();
  const params = location.state;
  // showLog({ params });
  const dataType = params?.dataType;

  const loadedData = useRef(null);
  const loadedJson = useRef(null);

  const _onDataLoaded = async (dataLoaded, byPassDuplicateCheck) => {
    try {
      // showLog('dataLoaded', dataLoaded);
      let nData = JSON.parse(JSON.stringify(dataLoaded));
      let nRows = [];
      for (var i = 0; i < dataLoaded.rows.length; i++) {
        if (dataLoaded.rows[i].length > 0) {
          nRows.push(dataLoaded.rows[i]);
        }
      }
      nData.rows = nRows;
      let jsonData = await formatExcelToJson(nData, USER);
      //  showLog({ nData, jsonData });
      // Check correctness, duplication, etc.
      const isDataCorrected = await _checkImportData(
        nData,
        jsonData,
        dataType,
        // users,
        byPassDuplicateCheck
      );
      //  showLog({ isDataCorrected });
      if (!isDataCorrected.result) {
        //
        showWarning({
          title: `ไม่สำเร็จ`,
          content: isDataCorrected.info,
          onOk: handleCancel,
        });
        return;
      }
      loadedData.current = nData;
      loadedJson.current = jsonData;
      setCState({ loaded: true });
    } catch (e) {
      showWarn(e);
    }
  };

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const _onConfirm = async () => {
    try {
      const batchNo = await onConfirm({
        currentData: loadedJson.current,
        dataType,
        USER,
        handleCancel,
        setProgress,
        setUpdate,
      });
      if (batchNo) {
        showSuccess({
          title: `นำเข้าข้อมูล ${getTitle(dataType)} เรียบร้อยแล้ว`,
          onOk: () => handleCancel(),
        });
      }
    } catch (e) {
      showWarn(e);
      errorHandler({
        code: e?.code || '',
        message: e?.message || '',
        snap: {
          dataType,
          currentData: loadedJson.current,
          module: 'UploadFromExcel',
        },
      });
    }
  };

  return (
    <div className="h-full p-2">
      <Excels
        // style={{ flex: 1, padding: 20 }}
        firstRowIsHeader
        onDataLoaded={_onDataLoaded}
        title={getTitle(dataType)}
      />
      <div className="border-bottom bg-background2 p-3 text-center mt-2">
        <Button className="mr-2 my-2" onClick={handleCancel}>
          &larr; กลับ
        </Button>
        <Popconfirm
          title="อัปโหลดข้อมูลเข้าสู่ระบบ ?"
          onConfirm={_onConfirm}
          onCancel={() => showLog('cancel')}
          okText={progressing.show ? 'กำลังอัปโหลด' : 'ยืนยัน'}
          cancelText="ยกเลิก"
          okButtonProps={{ disabled: progressing.show }}
          cancelButtonProps={{ disabled: progressing.show }}
        >
          <Button
            type="primary"
            disabled={!cState.loaded}
            icon={<UploadOutlined />}
            className="mx-2 my-2"
          >
            อัปโหลดข้อมูล
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default UploadFromExcel;
