import React from 'react';
import { FileExcelTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { routes } from 'navigation/routes';
import { useNavigate } from 'react-router-dom';

const ExcelUploadButton = ({ title, dataType, ...props }) => {
  const navigate = useNavigate();
  return (
    <Button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={() =>
        navigate(routes.EXCEL_UPLOAD, {
          state: { dataType },
        })
      }
      icon={<FileExcelTwoTone />}
      size="large"
      {...props}
    >
      {title}
    </Button>
  );
};

export default ExcelUploadButton;
