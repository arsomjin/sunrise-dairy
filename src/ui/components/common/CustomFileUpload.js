import { CloudUploadOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

const CustomFileUpload = ({ fileHandler, fileName, loading }) => (
  <div className="border h-24 border-dashed border-gray-500 relative hover:opacity-70 hover:shadow-sm">
    <input
      type="file"
      multiple
      className="cursor-pointer relative block opacity-0 w-full h-full p-10 z-50"
      onChange={fileHandler}
    />
    {!loading ? (
      <div
        className="text-center p-10 absolute inset-0"
        style={{ marginTop: -20 }}
      >
        <CloudUploadOutlined className="mb-3 text-2xl text-primary" />
        <h4 className="text-slate-500">
          {fileName || 'วางไฟล์ที่ใดก็ได้เพื่ออัปโหลด หรือ เลือกไฟล์'}
        </h4>
      </div>
    ) : (
      <div
        className="absolute inset-0  justify-center items-center flex"
        style={{ textAlign: 'center' }}
      >
        <Spin tip="กำลังอ่านข้อมูล..." />
      </div>
    )}
  </div>
);

export default CustomFileUpload;
