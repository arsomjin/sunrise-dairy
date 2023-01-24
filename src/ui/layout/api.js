import {
  BookOutlined,
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

export const menuItems = [
  getItem('หน้าแรก', 'DASHBOARD', <PieChartOutlined />),
  getItem('ข้อมูลน้ำหนักน้ำนมดิบ', 'WEIGHT', <DesktopOutlined />),
  // getItem('Option 3', '3', <ContainerOutlined />),
  getItem('คุณภาพน้ำนมดิบ', 'mikl-quality', <SafetyCertificateOutlined />, [
    getItem('ตรวจคุณภาพน้ำนมดิบ', 'MILK_QC'),
    getItem('ตรวจน้ำนมดิบประจำวัน', 'MILK_DAILY_TEST'),
    getItem('รายงานผลการตรวจ', 'QC_RESULT', <SnippetsOutlined />, [
      getItem('รายงานประจำวัน', 'MILK_DAILY_REPORT'),
      getItem('รายงานคุณภาพน้ำนมดิบ', 'MILK_QC_REPORT'),
    ]),
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
