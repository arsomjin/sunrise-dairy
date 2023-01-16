import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLan } from 'store/slices/appSlice';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

const ToggleLan = ({ size, noColor, ...props }) => {
  const { lan } = useSelector((state) => state.global);
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const lanPress = async () => {
    let nLan = lan === 'th' ? 'en' : 'th';
    i18n.changeLanguage(nLan);
    dispatch(updateLan({ lan: nLan }));
  };

  return (
    <Button
      type="ghost"
      size={size}
      shape="circle"
      onClick={() => lanPress()}
      className={
        noColor
          ? 'text-base text-tw-black underline'
          : 'text-base text-primary underline'
      }
      style={{ marginTop: 2 }}
      {...props}
    >
      {lan === 'th' ? 'ไทย' : 'EN'}
    </Button>
  );
};

export default ToggleLan;
