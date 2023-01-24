import React, { useEffect, useState } from 'react';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { Spin, Typography, Button, Upload, Modal } from 'antd';
import { formatExcelImportArr, getColNameFromTitle, isDataValid } from './api';
import { notificationController } from 'controllers/notificationController';
import { showLog } from 'utils/functions/common';
import { UploadOutlined } from '@ant-design/icons';
import CustomFileUpload from '../CustomFileUpload';
const { Text } = Typography;

const Excels = ({ firstRowIsHeader, onDataLoaded, style, title }) => {
  const [rows, setRows] = useState(null);
  const [cols, setCols] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [uploadedFileName, setUploadFileName] = useState('');
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [colName, setColName] = useState([]);
  const [imgSrc, setImg] = useState(require('assets/images/excel-format.png'));

  useEffect(() => {
    switch (title) {
      case 'น้ำหนักนม':
        setImg(require('assets/images/excel-format.png'));
        break;

      default:
        break;
    }
  }, [title]);

  const setInitial = () => {
    setDataLoaded(false);
    setIsFormInvalid(false);
    setLoading(false);
    setRows(null);
    setCols(null);
  };

  const renderFile = (fileObj) => {
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
        setLoading(false);
      } else {
        //  showLog('resp', resp);
        let columnArr = [{ name: 'A', key: 0 }];
        let rowArr = JSON.parse(JSON.stringify(resp.rows));
        if (firstRowIsHeader) {
          let firstRow = rowArr[0];
          for (var i = 0; i < firstRow.length; i++) {
            columnArr.push({
              name: firstRow[i],
              key: i + 1,
            });
          }
          rowArr = rowArr.slice(1);
          rowArr = formatExcelImportArr({ rows: rowArr, cols: columnArr });
          // Check isDataVaid
          const isValid = isDataValid(columnArr, title);
          if (!isValid) {
            setLoading(false);
            setIsFormInvalid(true);
            return;
          }
        } else {
          columnArr = resp.cols;
        }
        setCols(columnArr);
        setRows(rowArr);
        setDataLoaded(true);
        onDataLoaded({ rows: rowArr, cols: columnArr });
        setLoading(false);
      }
    });
  };

  const fileHandler = (event) => {
    setInitial();
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;
      showLog({ fileObj, fileName });
      //check for file extension and pass only if it is .xlsx and display error message otherwise
      let fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1);
      if (['xlsx', 'xls'].includes(fileExtension)) {
        setUploadFileName(fileName);
        setIsFormInvalid(false);
        setLoading(true);
        renderFile(fileObj);
      } else {
        setIsFormInvalid(true);
        setUploadFileName('');
      }
    }
  };

  const toggle = () => {
    if (title === 'ข้อมูลอื่นๆ') {
      return notificationController.warning({
        message: 'การอัพโหลดนี้ ไม่มีการตรวจสอบชื่อคอลัมน์ก่อนนำเข้า',
      });
    }
    let names = getColNameFromTitle(title);
    setColName(names);
    setIsOpen(true);
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        notificationController.success({
          message: `${info.file.name} file uploaded successfully.`,
        });
      } else if (status === 'error') {
        notificationController.error({
          message: `${info.file.name} file upload failed.`,
        });
      }
    },
  };

  // showLog({ rows, cols });
  const isLoaded = dataLoaded && rows && cols;
  return (
    <div style={style} className="bg-background1">
      <div className="border-bottom bg-background2 p-3">
        <h6 className="text-primary">
          {isLoaded
            ? 'กรุณาตรวจสอบข้อมูล ก่อนอัปโหลด'
            : `อัปโหลดข้อมูล ${title}`}
        </h6>
        {!isLoaded && (
          <div>
            <div>
              <Text className="text-light">
                กรุณาจัดรูปแบบไฟล์ Excel ที่ต้องการนำเข้า ดังตัวอย่างในรูป
              </Text>
            </div>
            <div>
              <Text className="text-light">
                1. ให้แถวแรกเป็นชื่อข้อมูล (แถวเดียวเท่านั้น)
              </Text>
            </div>
            <div>
              <Text className="text-light">
                2. ชื่อข้อมูลในแต่ละช่อง ต้องตรงตามที่กำหนดไว้เท่านั้น{' '}
                <span
                  onClick={toggle}
                  className="text-primary cursor-pointer underline"
                >
                  ตรวจสอบรายชื่อข้อมูลได้ที่นี่
                </span>
              </Text>
            </div>
            <div>
              <Text className="text-light">
                (หมายเหตุ: ระบบจะนำเข้าเฉพาะ Sheet แรก ของไฟล์เท่านั้น)
              </Text>
            </div>
          </div>
        )}
      </div>
      {!isLoaded && (
        <div className="flex flex-col items-center justify-center bg-background2">
          <div className="bordered">
            <img
              src={imgSrc}
              alt="excel-format"
              className="restrict-excel-img w-fit sm:min-w-full"
              // style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            <div style={{ height: 20 }} />
            <CustomFileUpload
              fileHandler={fileHandler}
              fileName={uploadedFileName}
              loading={loading}
            />
            {isFormInvalid && (
              <div style={{ textAlign: 'center' }}>
                <p className="text-danger">รูปแบบไฟล์ไม่ถูกต้อง</p>
              </div>
            )}
            <div style={{ height: 20 }} />
          </div>
        </div>
      )}
      <Modal
        title={`รายชื่อคอลัมน์ในไฟล์ Excel - ${title}`}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={[
          <Button type="primary" key="ok" onClick={() => setIsOpen(false)}>
            ตกลง
          </Button>,
        ]}
      >
        <div>
          <Text>
            {colName.map(
              (l, i) => `${l}${i < colName.length - 1 ? ' | ' : ''}`
            )}
          </Text>
        </div>
        {!['การสแกนลายนิ้วมือ'].includes(title) && (
          <div className="mt-3">
            <Text className="text-muted">(รวม {colName.length} ช่อง)</Text>
          </div>
        )}
      </Modal>
      {isLoaded && (
        <div
          className="restrict-card"
          style={{ height: '60vh', overflowY: 'auto' }}
        >
          <OutTable
            data={rows}
            columns={cols}
            tableClassName="ExcelTable2007"
            tableHeaderRowClass="heading"
          />
        </div>
      )}
    </div>
  );
};

export default Excels;
