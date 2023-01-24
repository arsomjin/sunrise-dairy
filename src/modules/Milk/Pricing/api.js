import classNames from 'classnames';
import numeral from 'numeral';
import { Numb } from 'utils/functions/common';

export const getPricingColumns = (editable) => ({
  cleanliness: [
    {
      title: 'ความสะอาด',
      dataIndex: 'cleanliness',
      width: 50,
      align: 'center',
    },
    {
      title: 'จำนวนชั่วโมงก่อนเปลี่ยนสี',
      dataIndex: 'label',
      width: 150,
      align: 'center',
    },
    {
      title: 'เพิ่มราคา',
      dataIndex: 'priceAdded',
      width: 60,
      align: 'right',
      editable,
      ...(editable.cleanliness && {
        className: 'text-primary bg-amber-500/10',
      }),
      ...(!editable.cleanliness && {
        render: (text, record) => {
          const cName =
            Numb(text) > 0
              ? 'text-success'
              : Numb(text) < 0
              ? 'text-danger'
              : '';
          return (
            <div className={classNames('text-center', cName)}>
              {text ? numeral(text).format('0,0.00') : '0.00'}
            </div>
          );
        },
      }),
    },
    {
      title: 'ราคา',
      dataIndex: 'price_per_kg',
      width: 60,
      align: 'right',
      editable,
      ...(editable.cleanliness && {
        className: 'text-primary bg-amber-500/10',
      }),
      ...(!editable.cleanliness && {
        render: (text, record) => {
          const cName =
            Numb(text) > 0
              ? 'text-success'
              : Numb(text) < 0
              ? 'text-danger'
              : '';
          return (
            <div className={classNames('text-center', cName)}>
              {text ? numeral(text).format('0,0.00') : '0.00'}
            </div>
          );
        },
      }),
    },
  ],
  lateDelivery: [
    {
      title: 'ช้ากว่ากำหนด',
      dataIndex: 'label',
      width: 150,
      align: 'center',
    },
    {
      title: 'ตัดราคา (บาท/กก)',
      dataIndex: 'underCut',
      width: 80,
      align: 'center',
      editable,
      ...(editable.lateDelivery && {
        className: 'text-primary bg-amber-500/10',
      }),
      ...(!editable.lateDelivery && {
        render: (text, record) => {
          const cName =
            Numb(text) > 0
              ? 'text-success'
              : Numb(text) < 0
              ? 'text-danger'
              : '';
          return (
            <div className={classNames('text-center', cName)}>
              {text ? numeral(text).format('0,0.00') : '0.00'}
            </div>
          );
        },
      }),
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'remark',
      width: 80,
      align: 'center',
    },
  ],
  fat: [
    {
      title: 'ร้อยละของปริมาณไขมัน',
      dataIndex: 'label',
      width: 150,
      align: 'center',
    },
    {
      title: 'ราคา +/- (บาท/กก)',
      dataIndex: 'priceAdjusted',
      width: 80,
      align: 'center',
      editable,
      ...(editable.fat && { className: 'text-primary bg-amber-500/10' }),
      ...(!editable.fat && {
        render: (text, record) => {
          const cName =
            Numb(text) > 0
              ? 'text-success'
              : Numb(text) < 0
              ? 'text-danger'
              : '';
          return (
            <div className={classNames('text-center', cName)}>
              {text ? numeral(text).format('0,0.00') : '0.00'}
            </div>
          );
        },
      }),
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'remark',
      width: 80,
      align: 'center',
    },
  ],
  content: [
    {
      title: 'ร้อยละของปริมาณเนื้อนมไม่รวมมันเนย',
      dataIndex: 'label',
      width: 150,
      align: 'center',
    },
    {
      title: 'ราคา +/- (บาท/กก)',
      dataIndex: 'priceAdjusted',
      width: 80,
      align: 'center',
      editable,
      ...(editable.content && { className: 'text-primary bg-amber-500/10' }),
      ...(!editable.content && {
        render: (text, record) => {
          const cName =
            Numb(text) > 0
              ? 'text-success'
              : Numb(text) < 0
              ? 'text-danger'
              : '';
          return (
            <div className={classNames('text-center', cName)}>
              {text ? numeral(text).format('0,0.00') : '0.00'}
            </div>
          );
        },
      }),
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'remark',
      width: 80,
      align: 'center',
    },
  ],
  somaticCell: [
    {
      title: 'จำนวนเม็ดเลือดขาว (เซลล์ / มิลลิลิตร)',
      dataIndex: 'label',
      width: 150,
      align: 'center',
    },
    {
      title: 'ราคา +/- (บาท/กก)',
      dataIndex: 'priceAdjusted',
      width: 80,
      align: 'center',
      editable,
      ...(editable.somaticCell && {
        className: 'text-primary bg-amber-500/10',
      }),
      ...(!editable.somaticCell && {
        render: (text, record) => {
          const cName =
            Numb(text) > 0
              ? 'text-success'
              : Numb(text) < 0
              ? 'text-danger'
              : '';
          return (
            <div className={classNames('text-center', cName)}>
              {text ? numeral(text).format('0,0.00') : '0.00'}
            </div>
          );
        },
      }),
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'remark',
      width: 80,
      align: 'center',
    },
  ],
  fp: [
    {
      title: 'จุดเยือกแข็ง',
      dataIndex: 'label',
      width: 150,
      align: 'center',
    },
    {
      title: 'ราคา +/- (บาท/กก)',
      dataIndex: 'priceAdjusted',
      width: 80,
      align: 'center',
      editable,
      ...(editable.fp && {
        className: 'text-primary bg-amber-500/10',
      }),
      ...(!editable.fp && {
        render: (text, record) => {
          const cName =
            Numb(text) > 0
              ? 'text-success'
              : Numb(text) < 0
              ? 'text-danger'
              : '';
          return (
            <div className={classNames('text-center', cName)}>
              {text ? numeral(text).format('0,0.00') : '0.00'}
            </div>
          );
        },
      }),
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'remark',
      width: 80,
      align: 'center',
    },
  ],
});

export const PRICE_DATA = {
  cleanliness: [
    {
      key: '1',
      cleanliness: '1',
      moreThan: 6,
      lessThan: 9999,
      label: 'มากกว่า 6 ชั่วโมง',
      priceAdded: '0.4',
      price_per_kg: '19.5',
    },
    {
      key: '2',
      cleanliness: '2',
      moreThan: 5,
      lessThan: 5.59,
      label: 'มากกว่า 5 - 5:59 ชั่วโมง',
      priceAdded: '0.3',
      price_per_kg: '19.3',
    },
    {
      key: '3',
      cleanliness: '3',
      moreThan: 4,
      lessThan: 4.59,
      label: 'มากกว่า 4 - 4:59 ชั่วโมง',
      priceAdded: '0',
      price_per_kg: '19.1',
    },
    {
      key: '4',
      cleanliness: '4',
      moreThan: 0,
      lessThan: 4,
      label: 'น้อยกว่า 4 ชั่วโมง',
      priceAdded: '0',
      price_per_kg: '18.2',
    },
  ],
  lateDelivery: [
    {
      key: '1',
      moreThan: 0,
      lessThan: 0.5,
      label: 'น้อยกว่า 0.5 ชั่วโมง',
      underCut: '-0.25',
      remark: null,
    },
    {
      key: '2',
      moreThan: 0.5,
      lessThan: 1.0,
      label: '0.5 ชั่วโมง - 1 ชั่วโมง',
      underCut: '-1.00',
      remark: null,
    },
    {
      key: '3',
      moreThan: 1.0,
      lessThan: 999,
      label: 'เกินกว่า 1 ชั่วโมง',
      underCut: '-1.50',
      remark: 'หรือไม่รับก็ได้',
    },
  ],
  fat: [
    {
      key: '1',
      moreThan: 0,
      lessThan: 3.2,
      label: 'ร้อยละของปริมาณไขมัน น้อยกว่า 3.20',
      priceAdjusted: '-0.4',
      remark: 'ลดลง',
    },
    {
      key: '2',
      moreThan: 3.2,
      lessThan: 3.39,
      label: 'ร้อยละของปริมาณไขมัน 3.20 ถึง 3.39',
      priceAdjusted: '-0.2',
      remark: 'ลดลง',
    },
    {
      key: '3',
      moreThan: 3.4,
      lessThan: 3.59,
      label: 'ร้อยละของปริมาณไขมัน 3.40 ถึง 3.59',
      priceAdjusted: '0.00',
      remark: 'ไม่ลด/ไม่เพิ่ม',
    },
    {
      key: '4',
      moreThan: 3.6,
      lessThan: 3.79,
      label: 'ร้อยละของปริมาณไขมัน 3.60 ถึง 3.79',
      priceAdjusted: '0.20',
      remark: 'เพิ่มขึ้น',
    },
    {
      key: '5',
      moreThan: 3.8,
      lessThan: 3.99,
      label: 'ร้อยละของปริมาณไขมัน 3.80 ถึง 3.99',
      priceAdjusted: '0.30',
      remark: 'เพิ่มขึ้น',
    },
    {
      key: '6',
      moreThan: 4.0,
      lessThan: 999,
      label: 'ร้อยละของปริมาณไขมัน มากกว่าหรือเท่ากับ 4.00',
      priceAdjusted: '0.40',
      remark: 'เพิ่มขึ้น',
    },
  ],
  content: [
    {
      key: '1',
      moreThan: 0,
      lessThan: 8.25,
      label: 'ร้อยละของปริมาณเนื้อนมไม่รวมมันเนย น้อยกว่า 8.25',
      priceAdjusted: '-0.4',
      remark: 'ลดลง',
    },
    {
      key: '2',
      moreThan: 8.25,
      lessThan: 8.34,
      label: 'ร้อยละของปริมาณเนื้อนมไม่รวมมันเนย 8.25 ถึง 8.34',
      priceAdjusted: '-0.2',
      remark: 'ลดลง',
    },
    {
      key: '3',
      moreThan: 8.35,
      lessThan: 8.49,
      label: 'ร้อยละของปริมาณเนื้อนมไม่รวมมันเนย 8.35 ถึง 8.49',
      priceAdjusted: '0.00',
      remark: 'ไม่ลด/ไม่เพิ่ม',
    },
    {
      key: '4',
      moreThan: 8.5,
      lessThan: 8.69,
      label: 'ร้อยละของปริมาณเนื้อนมไม่รวมมันเนย 8.50 ถึง 8.69',
      priceAdjusted: '0.30',
      remark: 'เพิ่มขึ้น',
    },
    {
      key: '5',
      moreThan: 8.7,
      lessThan: 9999,
      label: 'ร้อยละของปริมาณเนื้อนมไม่รวมมันเนย มากกว่าหรือเท่ากับ 8.70',
      priceAdjusted: '0.60',
      remark: 'เพิ่มขึ้น',
    },
  ],
  somaticCell: [
    {
      key: '1',
      moreThan: 1000001,
      lessThan: 9999999999,
      label: 'จำนวนเม็ดเลือดขาว มากกว่า 1,000,001',
      priceAdjusted: '-1.50',
      remark: 'ลดลง',
    },
    {
      key: '2',
      moreThan: 900001,
      lessThan: 1000000,
      label: 'จำนวนเม็ดเลือดขาว มากกว่า 900,001 ถึง 1,000,000',
      priceAdjusted: '-1.00',
      remark: 'ลดลง',
    },
    {
      key: '3',
      moreThan: 700001,
      lessThan: 900000,
      label: 'จำนวนเม็ดเลือดขาว มากกว่า 700,001 ถึง 900,000',
      priceAdjusted: '-0.30',
      remark: 'ลดลง',
    },
    {
      key: '4',
      moreThan: 500001,
      lessThan: 700000,
      label: 'จำนวนเม็ดเลือดขาว มากกว่า 500,001 ถึง 700,000',
      priceAdjusted: '-0.20',
      remark: 'ลดลง',
    },
    {
      key: '5',
      moreThan: 400001,
      lessThan: 500000,
      label: 'จำนวนเม็ดเลือดขาว มากกว่า 400,001 ถึง 500,000',
      priceAdjusted: '0.00',
      remark: 'ไม่ลด/ไม่เพิ่ม',
    },
    {
      key: '6',
      moreThan: 300001,
      lessThan: 400000,
      label: 'จำนวนเม็ดเลือดขาว มากกว่า 300,001 ถึง 400,000',
      priceAdjusted: '0.20',
      remark: 'เพิ่มขึ้น',
    },
    {
      key: '7',
      moreThan: 200001,
      lessThan: 300000,
      label: 'จำนวนเม็ดเลือดขาว มากกว่า 200,001 ถึง 300,000',
      priceAdjusted: '0.30',
      remark: 'เพิ่มขึ้น',
    },
    {
      key: '8',
      moreThan: 0,
      lessThan: 200000,
      label: 'จำนวนเม็ดเลือดขาว น้อยกว่าหรือเท่ากับ 200,000',
      priceAdjusted: '0.50',
      remark: 'เพิ่มขึ้น',
    },
  ],
  fp: [
    {
      key: '1',
      moreThan: -0.51,
      lessThan: -9999,
      label: 'จุดเยือกแข็ง สูงกว่า -0.51℃',
      priceAdjusted: '-1.00',
      remark: 'ลดลง หรือ ปฏิเสธการรับซื้อ',
    },
  ],
};
