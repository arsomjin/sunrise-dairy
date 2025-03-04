import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { DatePicker } from 'antd';
import 'dayjs/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
import dayjs from 'dayjs';
import { isMobile } from 'react-device-detect';
import { showLog } from 'utils/functions/common';
const { RangePicker } = DatePicker;

export default forwardRef(
  (
    {
      value,
      onChange,
      format,
      placeholder,
      picker,
      isRange,
      sm,
      md,
      lg,
      xl,
      ...props
    },
    ref
  ) => {
    const dateRef = useRef();

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          dateRef.current.focus();
        },

        blur: () => {
          dateRef.current.blur();
        },

        clear: () => {
          dateRef.current.clear();
        },

        isFocused: () => {
          return dateRef.current.isFocused();
        },

        setNativeProps(nativeProps) {
          dateRef.current.setNativeProps(nativeProps);
        },
      }),
      []
    );

    const isMonth = picker === 'month';
    const isYear = picker === 'year';
    const isTime = picker === 'time';

    let size = sm ? 26 : md ? 32 : lg ? 36 : xl ? 42 : 32;

    const mFormat = isMonth
      ? 'YYYY-MM'
      : isYear
      ? 'YYYY'
      : isTime
      ? 'HH:mm'
      : 'YYYY-MM-DD';

    const MComponent = isRange ? RangePicker : DatePicker;

    const _onChange = (date, dateString) => {
      showLog({ date, dateString });
      if (isRange) {
        // onChange && onChange(dateString);
        onChange &&
          onChange([
            dayjs(dateString[0], 'DD/MM/YYYY').format('YYYY-MM-DD'),
            dayjs(dateString[1], 'DD/MM/YYYY').format('YYYY-MM-DD'),
          ]);
      } else {
        onChange && onChange(dayjs(date).format(mFormat), dateString);
      }
      // onChange && onChange(date, dateString);
    };
    return (
      <MComponent
        ref={dateRef}
        format={
          format ||
          (isMonth
            ? 'MM/YYYY'
            : isYear
            ? 'YYYY'
            : isTime
            ? 'HH:mm'
            : 'DD/MM/YYYY')
        }
        {...(!isRange && {
          placeholder:
            placeholder ||
            (isMonth ? 'เดือน' : isYear ? 'ปี' : isTime ? 'เวลา' : 'วันที่'),
        })}
        locale={locale}
        onChange={_onChange}
        value={
          typeof value === 'undefined'
            ? value
            : !!value
            ? isRange
              ? [dayjs(value[0], mFormat), dayjs(value[1], mFormat)]
              : dayjs(value, mFormat)
            : dayjs()
        }
        allowClear={false}
        picker={picker}
        onFocus={(e) => isMobile && (e.target.readOnly = true)} // Disable virtual keyboard on mobile devices.
        style={{ height: size, ...props.style }}
        {...props}
      />
    );
  }
);
