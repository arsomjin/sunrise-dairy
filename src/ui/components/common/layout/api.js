import {
  AppstoreOutlined,
  BookOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
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
  getItem('คุณภาพน้ำนมดิบ', 'sub1', <ContainerOutlined />, [
    getItem('ตรวจคุณภาพน้ำนมดิบ', '5'),
    getItem('ตรวจน้ำนมดิบประจำวัน', 'SCREEN1'),
    getItem('รายงานผลการตรวจ', 'SCREEN2', null, [
      getItem('รายงานประจำวัน', '11'),
      getItem('รายงานคุณภาพน้ำนมดิบ', '12'),
    ]),
    getItem('ราคาน้ำนมดิบ', '8'),
  ]),
  getItem('บุคคล', 'sub2', <UserOutlined />, [
    getItem('รายชื่อพนักงาน', '9'),
    getItem('รายชื่อสมาชิก', '10'),
    getItem('รายชื่อผู้ใช้งานระบบ', 'sub3', null, [
      getItem('ทั้งหมด', '11'),
      getItem('รอการอนุมัติ', '12'),
    ]),
  ]),
  getItem('เกี่ยวกับเรา', 'ABOUT', <BookOutlined />),
];
