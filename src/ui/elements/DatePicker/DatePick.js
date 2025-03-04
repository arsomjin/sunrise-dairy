import React, { forwardRef } from 'react';
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/th_TH';
import dayjs from 'dayjs';
import { isMobile } from 'react-device-detect';

export default forwardRef(
  (
    {
      value,
      onChange,
      format,
      mFormat,
      dFormat,
      placeholder,
      picker,
      disabledDate,
      ...props
    },
    ref
  ) => {
    const isMonth = picker === 'month';
    const isYear = picker === 'year';
    const isTime = picker === 'time';

    const _onChange = (date, dateString) => {
      //   showLog({ date, dateString });
      onChange && onChange(dayjs(date).format(mFormat), dateString);
    };

    return (
      <DatePicker
        ref={ref}
        format={format || dFormat}
        placeholder={
          placeholder ||
          (isMonth ? 'เดือน' : isYear ? 'ปี' : isTime ? 'เวลา' : 'วันที่')
        }
        locale={locale}
        onChange={_onChange}
        value={
          typeof value === 'undefined'
            ? value
            : !!value
            ? dayjs(value, mFormat)
            : dayjs()
        }
        allowClear={false}
        picker={picker}
        disabledDate={disabledDate}
        onFocus={(e) => isMobile && (e.target.readOnly = true)} // Disable virtual keyboard on mobile devices.
        {...props}
      />
    );
  }
);
