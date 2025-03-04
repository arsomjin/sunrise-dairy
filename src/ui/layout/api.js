import {
  BookOutlined,
  CodeOutlined,
  DesktopOutlined,
  PieChartOutlined,
  SafetyCertificateOutlined,
  SnippetsOutlined,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons';

export const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
};

export const menuItems = (isPrivated, isDev, isMember) => {
  let result = [];
  if (isPrivated) {
    result = [
      getItem('หน้าแรก', 'DASHBOARD', <PieChartOutlined />),
      getItem('ข้อมูลน้ำหนักน้ำนมดิบ', 'WEIGHT', <DesktopOutlined />),
      // getItem('Option 3', '3', <ContainerOutlined />),
      getItem('คุณภาพน้ำนมดิบ', 'mikl-quality', <SafetyCertificateOutlined />, [
        getItem('ตรวจคุณภาพน้ำนมดิบ', 'MILK_QC'),
        getItem('ตรวจน้ำนมดิบประจำวัน', 'MILK_DAILY_TEST'),
      ]),
      getItem('รายงาน', 'QC_RESULT', <SnippetsOutlined />, [
        getItem('ผลการตรวจน้ำนมดิบประจำวัน', 'MILK_DAILY_REPORT'),
        getItem('ผลการตรวจคุณภาพน้ำนมดิบ', 'MILK_QC_REPORT'),
        getItem('สรุปประจำวัน', 'DAILY_SUMMARY_REPORT'),
        getItem('สรุปตามช่วงเวลา', 'RANGE_SUMMARY_REPORT'),
        getItem('สรุปแยกรายสมาชิก', 'DAILY_MEMBER_REPORT'),
      ]),
      getItem('ราคาน้ำนมดิบ', 'PRICING', <TagOutlined />),
      getItem('บุคคล', 'PERSONAL', <UserOutlined />, [
        getItem('รายชื่อพนักงาน', 'EMPLOYEES'),
        getItem('รายชื่อสมาชิก', 'MEMBERS'),
        getItem('รายชื่อผู้ใช้งาน', 'USERS', null, [
          getItem('ทั้งหมด', 'ALL_USERS'),
          getItem('รออนุมัติ', 'PENDING_USERS'),
        ]),
      ]),
      getItem('เกี่ยวกับเรา', 'ABOUT', <BookOutlined />),
    ];
  } else if (isMember) {
    result = [
      getItem('หน้าแรก', 'DASHBOARD', <PieChartOutlined />),
      getItem('รายงาน', 'QC_RESULT', <SnippetsOutlined />, [
        getItem('ผลการตรวจน้ำนมดิบประจำวัน', 'MILK_DAILY_REPORT'),
        getItem('รายงานคุณภาพน้ำนมดิบ', 'MILK_QC_REPORT'),
        getItem('สรุปรายวัน', 'DAILY_MEMBER_REPORT'),
      ]),
      getItem('ราคาน้ำนมดิบ', 'PRICING', <TagOutlined />),
      getItem('เกี่ยวกับเรา', 'ABOUT', <BookOutlined />),
    ];
  } else {
    result = [
      getItem('หน้าแรก', 'DASHBOARD', <PieChartOutlined />),
      getItem('รายงาน', 'QC_RESULT', <SnippetsOutlined />, [
        getItem('ผลการตรวจน้ำนมดิบประจำวัน', 'MILK_DAILY_REPORT'),
        getItem('รายงานคุณภาพน้ำนมดิบ', 'MILK_QC_REPORT'),
      ]),
      getItem('ราคาน้ำนมดิบ', 'PRICING', <TagOutlined />),
      getItem('เกี่ยวกับเรา', 'ABOUT', <BookOutlined />),
    ];
  }
  if (isDev) {
    result = [
      ...result,
      getItem('พัฒนาระบบ', 'DEV_MENU', <CodeOutlined />, [
        getItem('CheckData', 'CHECK_DATA'),
      ]),
    ];
  }
  return result;
};
