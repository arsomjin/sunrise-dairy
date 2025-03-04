import { hasKey } from 'utils/functions/common';
import { distinctArr } from 'utils/functions/array';
import { arrayForEach } from 'utils/functions/array';
import { addFirestore } from 'services/firebase';
import {
  cleanValuesBeforeSave,
  showWarn,
  showWarning,
  showLog,
} from 'utils/functions/common';
import dayjs from 'dayjs';
import { getFirestoreCollection } from 'services/firebase';
import { createArrOfLength } from 'utils/functions/array';
import { showAlert } from 'utils/functions/common';
import { Numb } from 'utils/functions/common';
import { setFirestore } from 'services/firebase';
import { deleteFirestore } from 'services/firebase';
import { Dates } from 'constants/Dates';
import { numer } from 'utils/functions/number';
var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const IMPORT_MILK_WEIGHT_FIELD_NAME = [
  'เลขที่เอกสาร',
  'วันที่บันทึก',
  'รหัสสมาชิก',
  'ชื่อ-สกุล',
  'ช่วงเวลา',
  'น้ำหนัก',
  'ผู้บันทึก',
  'วันที่ในระบบ',
];

export const isDataValid = (arr, title) => {
  // showLog({ arr, title });
  switch (title) {
    case 'น้ำหนักนม':
      return hasFields(arr, IMPORT_MILK_WEIGHT_FIELD_NAME);
    default:
      return false;
  }
};

export const hasFields = (arr, fields, hasException) => {
  let fieldsException = ['จำนวนช่องตามจำนวนครั้งที่สแกน', 'A'];
  let nameException = hasException
    ? createArrOfLength(32).map((l) => l.toString())
    : [];
  let checkFields = fields.filter((l) => !fieldsException.includes(l));
  showLog({ checkFields });
  const fArr = arr.filter((elem) => {
    let included = true;
    if (
      ['รหัส', 'รหัสพนักงาน'].includes(elem.name) &&
      checkFields.includes('ชื่อ-นามสกุล')
    ) {
      included = [...checkFields, 'รหัส'].includes(elem.name.toString().trim());
    } else {
      included = checkFields.includes(elem.name.toString().trim());
    }
    // showLog({ included, nameException, name: elem.name });
    return included && !nameException.includes(elem.name);
  });
  // showLog({ arr, checkFields, fArr, nameException });
  if (fArr.length < checkFields.length) {
    arr.map((f) => {
      if (
        !checkFields.includes(f.name.toString().trim()) &&
        ![
          'A',
          'จำนวนช่องตามจำนวนครั้งที่สแกน',
          ...(hasException ? nameException : []),
        ].includes(f.name.toString().trim())
      ) {
        //  showLog('ERROR_FIELD_NAME', f.name.toString());
        showWarning({
          title: `ชื่อคอลัมน์ ​"${f.name.toString()}" ไม่ตรงตามที่กำหนด!`,
        });
      }
      return f;
    });
  }
  return fArr.length >= checkFields.length;
};

export const formatExcelToJson = async (dat, user) => {
  try {
    const result = [];
    const anomalies = [];
    for (var i = 0; i < dat.rows.length; i++) {
      if (dat.rows[i].length === 0) {
        return dat;
      }
      let it = {};
      for (var n = 0; n < dat.rows[i].length; n++) {
        let val = dat.rows[i][n] || '';
        if (!!dat.cols[n + 1]) {
          let excelFieldName = dat.cols[n + 1].name.toString().trim();
          // Map excel header to field name.
          let fieldName = FieldMapping[excelFieldName];
          if (fieldName) {
            // showLog('last4', fieldName.substr(-4));
            let isDate = Dates.isDateTypeField(fieldName);
            // let isDate = fieldName.substr(-4) === 'Date';
            if (isDate && val.length > 9) {
              switch (fieldName) {
                case 'effectiveDate':
                  it[fieldName] = dayjs(val, 'DD.MM.YYYY').format('YYYY-MM-DD');
                  break;
                case 'systemDate':
                  it[fieldName] = dayjs(val, 'DD/MM/YYYY HH:mm:ss').format(
                    'YYYY-MM-DD HH:mm:ss'
                  );
                  break;

                default:
                  it[fieldName] = dayjs(val, 'DD/MM/YYYY').format('YYYY-MM-DD');
                  break;
              }
            } else {
              it[fieldName] = val;
            }
          } else {
            it[excelFieldName] = val;
            // Add anomaly
            anomalies.push({
              excelFieldName,
              value: val,
            });
          }
        } else {
          showLog({ error: { n, col: dat.cols[n + 1], row: dat.rows[i] } });
        }
      }
      if (
        hasKey('productCode', it) &&
        hasKey('fullName', it) &&
        hasKey('department', it)
      ) {
        // Field name mapping correction.
        it.employeeCode = it.productCode;
        delete it.productCode;
      }
      if (
        hasKey('employeeCode', it) &&
        hasKey('fullName', it) &&
        hasKey('department', it)
      ) {
        // Field name mapping correction.
        it.branch = it.department;
        delete it.department;
      }
      result.push(it);
    }
    if (anomalies.length > 0) {
      const dAnomalies = distinctArr(anomalies, ['excelFieldName']);
      await arrayForEach(dAnomalies, async (item) => {
        await addFirestore(
          'anomaly/imports/fieldName',
          cleanValuesBeforeSave({
            item,
            anomaly: {
              type: 'FIELDNAME_MAPPING',
              by: user.uid,
              time: Date.now(),
            },
          })
        );
      });
    }
    return result;
  } catch (e) {
    throw e;
  }
};

export const formatExcelImportArr = (excelData) => {
  showLog({ excelData });
  let result = [];
  for (var i = 0; i < excelData.rows.length; i++) {
    let it = [];
    for (var n = 0; n < excelData.rows[i].length; n++) {
      let val = excelData.rows[i][n] || '';
      if (val && !!excelData.cols[n + 1]?.name) {
        let cName = excelData.cols[n + 1].name.toString();
        if (cName.startsWith('วันที่') || cName.startsWith('เวลา')) {
          // val = toDate(val, cName.startsWith('เวลา'));
          // val = getJsDateFromExcel(val);
          val = parseDateExcel(val);
          val = dayjs(val).subtract(1076, 's'); // Correction!
          if (cName.startsWith('เวลา')) {
            val = dayjs(val).format('HH:mm:ss');
          } else {
            val = cName.startsWith('วันที่ในระบบ')
              ? dayjs(val).format('DD/MM/YYYY HH:mm:ss')
              : dayjs(val).format('DD/MM/YYYY');
          }
        }
      }
      it[n] = val;
    }
    if (it.length > 0) {
      result.push(it);
    }
  }
  // showLog('offset', new Date(0).getTimezoneOffset());

  return result;
};

export const parseDateExcel = (excelTimestamp) => {
  const secondsInDay = 24 * 60 * 60;
  const excelEpoch = new Date(1899, 11, 31);
  const excelEpochAsUnixTimestamp = excelEpoch.getTime();
  const missingLeapYearDay = secondsInDay * 1000;
  const delta = excelEpochAsUnixTimestamp - missingLeapYearDay;
  const excelTimestampAsUnixTimestamp = excelTimestamp * secondsInDay * 1000;
  const parsed = excelTimestampAsUnixTimestamp + delta;
  return isNaN(parsed) ? null : parsed;
};

export const getTitle = (dataType) => {
  switch (dataType) {
    case 'weight':
      return 'น้ำหนักนม';

    default:
      return 'น้ำหนักนม';
  }
};

export const getDataType = (title) => {
  switch (title) {
    case 'น้ำหนักนม':
      return 'weight';

    default:
      return 'weight';
  }
};

export const getColNameFromTitle = (title) => {
  switch (title) {
    case 'น้ำหนักนม':
      return IMPORT_MILK_WEIGHT_FIELD_NAME;

    default:
      return IMPORT_MILK_WEIGHT_FIELD_NAME;
  }
};

export const _checkIsNotDuplicated = async (data, dataType) => {
  try {
    let col;
    let wheres = [];
    switch (dataType) {
      case 'weight':
        col = 'sections/milk/weight';
        wheres = [
          ['docNo', '==', data.docNo],
          ['recordDate', '==', data.recordDate],
          ['systemDate', '==', data.systemDate],
          ['memberId', '==', data.memberId],
        ];
        break;

      default:
        break;
    }

    const existing = await getFirestoreCollection(col, wheres);
    if (existing) {
      return { result: false, duplicateData: existing };
    } else {
      return { result: true };
    }
  } catch (e) {
    showWarn(e);
    return { result: true };
  }
};

export const _checkImportData = async (
  excelArr,
  jsonArr,
  dataType,
  // users,
  byPassDuplicateCheck
) => {
  try {
    // Check data type and length.
    let isCorrected = !!excelArr && excelArr?.rows && excelArr.cols;
    if (!isCorrected) {
      return { result: false, info: 'ไม่มีข้อมูล หรือ ข้อมูลไม่ถูกต้อง' };
    }
    isCorrected =
      !!jsonArr &&
      Array.isArray(jsonArr) &&
      Array.isArray(excelArr.rows) &&
      Array.isArray(excelArr.cols);
    if (!isCorrected) {
      return { result: false, info: 'ไม่มีข้อมูล หรือ ข้อมูลไม่ถูกต้อง' };
    }
    isCorrected =
      jsonArr.length > 0 &&
      excelArr.rows.length > 0 &&
      excelArr.cols.length > 0;
    if (!isCorrected) {
      return { result: false, info: 'ไม่มีข้อมูล หรือ ข้อมูลไม่ถูกต้อง' };
    }
    // Check duplication
    //  - Random check fields [docNo, docDate, billNoSKC, branchCode, userName] in json file.
    let rd1 = Math.floor(Math.random() * jsonArr.length);
    if (!byPassDuplicateCheck) {
      const isNotDuplicated = await _checkIsNotDuplicated(
        jsonArr[rd1],
        dataType
      );
      if (!isNotDuplicated.result) {
        return {
          result: false,
          info: `ไฟล์นี้ได้อัปโหลดแล้ว เมื่อวันที่ ${dayjs(
            isNotDuplicated.duplicateData.importTime
          ).format('DD/MM/YY')} เวลา ${dayjs(
            isNotDuplicated.duplicateData.importTime
          ).format('HH:mm')}`,
        };
        // r({
        //   result: false,
        //   info: `ไฟล์นี้ได้อัปโหลดแล้ว เมื่อวันที่ ${dayjs(
        //     isNotDuplicated.duplicateData.importTime
        //   ).format('DD/MM/YY')} เวลา ${dayjs(
        //     isNotDuplicated.duplicateData.importTime
        //   ).format('HH:mm')} โดย ${
        //     users[isNotDuplicated.duplicateData.importBy]?.displayName
        //   }`,
        // });
        return;
      }
    }
    return { result: true };
  } catch (e) {
    showWarn(e);
    return { result: false, info: 'ไม่มีข้อมูล หรือ ข้อมูลไม่ถูกต้อง' };
  }
};

export const onCancelImportData = async (
  collectionArr,
  batchNo,
  handleCancel,
  setUpdate
) => {
  // showLog({ batchNo });
  try {
    setUpdate({
      show: true,
      text: 'กำลังยกเลิก... \nห้ามออกจากหน้านี้ การยกเลิกจะถูกขัดจังหวะ และข้อมูลจะเกิดการผิดพลาด',
    });
    const dSnap = await getFirestoreCollection(collectionArr[0], [
      ['batchNo', '==', batchNo],
    ]);
    if (dSnap) {
      let dArr = [];
      Object.keys(dSnap).map((k) => {
        dArr.push({ ...dSnap[k], _id: k });
        return k;
      });
      // showLog({ dArr });
      await arrayForEach(dArr, async (it) => {
        await deleteFirestore(collectionArr[0], it._id);
      });
    }
    if (collectionArr.length > 1) {
      const dSnap2 = await getFirestoreCollection(collectionArr[1], [
        ['batchNo', '==', batchNo],
      ]);

      if (dSnap2) {
        let dArr2 = [];
        Object.keys(dSnap2).map((k) => {
          dArr2.push({ ...dSnap2[k], _id: k });
          return k;
        });
        await arrayForEach(dArr2, async (it) => {
          await deleteFirestore(collectionArr[1], it._id);
        });
      }
    }
    setUpdate({ show: false });
    showWarning({
      title: 'สำเร็จ',
      content: 'ยกเลิกการนำเข้าข้อมูลเรียบร้อยแล้ว',
      onOk: handleCancel,
    });
  } catch (e) {
    showWarn(e);
    setUpdate({ show: false });
  }
};

export const onConfirm = async ({
  currentData,
  dataType,
  USER,
  setProgress,
  setUpdate,
  handleCancel,
}) => {
  try {
    const batchNo = Date.now();
    switch (dataType) {
      case 'weight':
        const milkOrders = currentData;
        const records = milkOrders.length;
        let mBreak1 = false;
        await arrayForEach(milkOrders, async (item, i) => {
          if (mBreak1) {
            return;
          }
          const percent = Numb(((i + 1) * 100) / records);
          setProgress({
            show: true,
            percent,
            text: `กำลังอัปโหลด ${i + 1} จาก ${numer(records).format(
              '0,0'
            )} รายการ`,
            subtext:
              'ห้ามออกจากหน้านี้ การอัปโหลดจะถูกขัดจังหวะ และข้อมูลจะเกิดการผิดพลาด',
            onCancel: () => {
              mBreak1 = true;
              onCancelImportData(
                ['sections/milk/weight'],
                batchNo,
                handleCancel,
                setUpdate
              );
            },
          });
          const saveItem = cleanValuesBeforeSave(
            {
              ...item,
              importBy: USER.uid,
              importTime: Date.now(),
              batchNo,
            },
            true
          );
          await setFirestore('sections/milk/weight', item.docNo, saveItem);
        });
        if (mBreak1) {
          setProgress({ show: false, percent: 0, text: null, subtext: null });
          return;
        }
        break;
      default:
        break;
    }

    // Add import logs.
    await setFirestore(
      `sections/import/${dataType}`,
      batchNo.toString(),
      cleanValuesBeforeSave({
        batchNo,
        dataType,
        by: USER.uid,
        time: Date.now(),
      })
    );

    setProgress({ show: false, percent: 0, text: null, subtext: null });
    return batchNo;
  } catch (e) {
    showWarn(e);
    setProgress({ show: false, percent: 0, text: '' });
    throw e;
  }
};

export const FieldMapping = {
  เลขที่เอกสาร: 'docNo',
  วันที่บันทึก: 'recordDate',
  รหัสสมาชิก: 'memberId',
  'ชื่อ-สกุล': 'nameSurname',
  ช่วงเวลา: 'period',
  น้ำหนัก: 'weight',
  ผู้บันทึก: 'recorder',
  วันที่ในระบบ: 'systemDate',
};

export const FieldMappingToThai = {
  docHeaderText: 'ข้อความส่วนหัวเอกสาร',
  export: 'จ่ายออก',
  userName: 'ชื่อผู้ใช้',
  storeLocation: 'ชื่อสถานที่จัดเก็บ',
  receiveBranch: 'ชื่อสาขาที่รับโอน',
  productName: 'ชื่อสินค้า',
  movementType: 'ประเภทรายการเคลื่อนไหว',
  balance: 'ยอดคงเหลือ',
  startBalance: 'ยอดตั้งต้น',
  typeCode: 'รหัสประเภท',
  storeLocationCode: 'รหัสสถานที่จัดเก็บ',
  transferLocationCode: 'รหัสสถานที่จัดเก็บที่รับโอน',
  branchCode: 'รหัสสาขา',
  transferBranchCode: 'รหัสสาขารับโอน',
  productCode: 'รหัสสินค้า',
  import: 'รับเข้า',
  item: 'รายการ',
  itemNo: 'รายการที่',
  inputDate: 'วันที่คีย์',
  transactionDate: 'วันที่ทำรายการ',
  docDate: 'วันที่เอกสาร',
  branch: 'สาขา',
  unit: 'หน่วย',
  vehicleId: 'หมายเลขรถ',
  vehicleNo: 'หมายเลขรถ',
  remark: 'หมายเหตุ',
  docNo: 'เลขที่เอกสาร',
  peripheralNo: 'เลขอุปกรณ์ต่อพ่วง',
  transferDocNo: 'เลขเอกสารที่รับโอน',
  billNoSKC: 'เลขใบจ่ายสินค้า SKC',
  inputTime: 'เวลาคีย์',
  purchaseNo: 'เอกสารซื้อ',
  order: 'ใบสั่ง',
  storePoint: 'จุดเก็บ',
  incomeNo: 'เลขที่บิล',
  isNewCustomer: 'ลูกค้าใหม่',
  customerId: 'รหัสลูกค้า',
  customerNo: 'เลขที่ลูกค้า',
  prefix: 'คำนำหน้า',
  firstName: 'ชื่อ',
  lastName: 'นามสกุล',
  phoneNumber: 'เบอร์โทรศัพท์',
  incomeType: 'ประเภทการรับเงิน',
  deliverDate: 'วันที่ส่งมอบรถ',
  amtReceived: 'ยอดรับ',
  amtFull: 'ยอดสุทธิ',
  advInstallment: 'เงินดาวน์',
  amtPlateAndInsurance: 'ค่าทะเบียน_พรบ',
  amtSKC: 'SKC',
  amtOldCustomer: 'ลูกค้าเก่า',
  amtMAX: 'MAX',
  amtPro: 'โปรโมชั่น',
  amtBaacFee: 'ค่าธรรมเนียม_สกต_ธกส',
  amtBaacDebtor: 'ลูกหนี้_สกต_ธกส',
  promotions: 'โปรโมชั่น',
  amtKBN: 'KBN',
  amtReservation: 'เงินจอง',
  amtTurnOver: 'ตีเทิร์น',
  amtKBNLeasing: 'โครงการร้าน',
  oweKBNLeasing: 'ค้างโครงการร้าน',
  amtOther: 'อื่นๆ',
  amtOthers: 'อื่นๆ',
  deductOther: 'หักเงินอื่นๆ',
  deductOthers: 'หักเงินอื่นๆ',
  giveaways: 'ของแถม',
  total: 'ยอดรวม',
  paymentType: 'วิธีการรับเงิน',
  bankAcc: 'เลขที่บัญชี',
  depositor: 'ผู้โอน_ฝากเงิน',
  baacNo: 'เลขที่ใบ_สกต_ธกส',
  baacDate: 'วันที่ใบ_สกต_ธกส',
  receiverEmployee: 'ผู้รับเงิน',
  amtRebate: 'เงินคืน',
  amtExcess: 'เงินเกิน',
  billCounted: 'จำนวนบิล',
  partsDeposit: 'มัดจำอะไหล่',
  amtIntake: 'ท่อไอเสีย',
  amtFieldMeter: 'เครื่องวัดแปลงนา',
  amtBattery: 'แบตเตอรี่',
  amtGPS: 'GPS',
  amtTyre: 'ยาง',
  paymentType1: 'วิธีการรับเงิน1',
  paymentType2: 'วิธีการรับเงิน2',
  paymentType3: 'วิธีการรับเงิน3',
  payAmount1: 'จำนวนเงิน1',
  payAmount2: 'จำนวนเงิน2',
  payAmount3: 'จำนวนเงิน3',
  bankAcc1: 'เลขที่บัญชี1',
  bankAcc2: 'เลขที่บัญชี2',
  bankAcc3: 'เลขที่บัญชี3',
  amtParts: 'ค่าอะไหล่',
  amtOil: 'ค่าน้ำมัน',
  amtWage: 'ค่าแรง',
  amtBlackGlue: 'ค่ากาวดำ',
  amtDistance: 'ค่าระยะทาง',
  amtPumpCheck: 'ค่าเช็คปั๊ม',
  amtDeposit: 'มัดจำ',
  deductDeposits: 'หักมัดจำ',
  deductDeposit: 'หักมัดจำ',
  depositUsed: 'ใช้เงินมัดจำ',
  employeeId: 'รหัสพนักงาน',
  technicianId: 'รหัสช่าง',
  technicianNo: 'เลขที่ช่าง',
  technicianFirstName: 'ชื่อช่างบริการ',
  technicianLastName: 'นามสกุลช่าง',
  technicianPhoneNumber: 'เบอร์โทรศัพท์ช่าง',
  vehicleRegNumber: 'ทะเบียนรถ',
  time: 'เวลา',
  changeDeposit: 'รับเงินทอน',
  billTotal: 'รวมสุทธิ',
  netTotal: 'รวมสุทธิ',
  wht: 'หัก_ณ_ที่จ่าย',
  inputBy: 'บันทึกโดย',
  saleNo: 'เลขที่บิล',
  taxInvoice: 'ใบกำกับภาษี',
  taxInvoiceDate: 'วันที่ใบกำกับภาษี',
  vat: 'ภาษีมูลค่าเพิ่ม',
  contractDeliverDate: 'วันส่งสัญญา_SKL',
  contractAmtReceivedDate: 'จำนวนเงินที่ได้รับจาก_SKL',
  saleCutoffDate: 'วันที่ตัดขาย',
  date: 'วันที่',
  downPayment: 'เงินดาวน์',
  totalDownDiscount: 'รวมส่วนลดโปรช่วยดาวน์',
  firstInstallment: 'เงินงวดแรก',
  amtInsurance: 'เบี้ยประกันภัย',
  amtActOfLegal: 'พรบ_',
  loanInfoIncome: 'รายได้จากข้อมูลสินเชื่อ',
  created: 'สร้าง',
  reason: 'เหตุผล',
  referringDetails: 'รายละเอียดค่าแนะนำ',
  whTax: 'ภาษีหัก ณ ที่จ่าย',
  forHQ: 'สำนักงานใหญ่',
  creditCheckDate: 'สินเชื่อตรวจสอบวันที่',
  hqAuditor: 'สำนักงานใหญ่ตรวจสอบโดย',
  hqAccountAuditor: 'บัญชีตรวจสอบโดย',
  creditClerk: 'สินเชื่อ',
  sendTransferDate: 'ส่งโอนรอบวันที่',
};
