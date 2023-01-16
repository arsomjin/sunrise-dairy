import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
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
  getItem('Dashboard', 'DASHBOARD', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('Option 3', '3', <ContainerOutlined />),
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Option 5', '5'),
    getItem('Screen 1', 'SCREEN1'),
    getItem('Screen 2', 'SCREEN2'),
    getItem('Option 8', '8'),
  ]),
  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Submenu', 'sub3', null, [
      getItem('Option 11', '11'),
      getItem('Option 12', '12'),
    ]),
  ]),
];

const items2 = [
  {
    label: 'Option 1',
    key: '1',
    icon: <PieChartOutlined />,
  },
  {
    label: 'Option 2',
    key: '2',
    icon: <DesktopOutlined />,
  },
  {
    label: 'Option 3',
    key: '3',
    icon: <ContainerOutlined />,
  },
  {
    label: 'Navigation One',
    key: 'sub1',
    icon: <MailOutlined />,
    children: [
      {
        label: 'Option 5',
        key: '5',
      },
      {
        label: 'Screen 1',
        key: 'screen1',
      },
      {
        label: 'Screen 2',
        key: 'screen2',
      },
      {
        label: 'Option 8',
        key: '8',
      },
    ],
  },
  {
    label: 'Navigation Two',
    key: 'sub2',
    icon: <AppstoreOutlined />,
    children: [
      {
        label: 'Option 9',
        key: '9',
      },
      {
        label: 'Option 10',
        key: '10',
      },
      {
        label: 'SubMenu',
        key: 'sub3',
        icon: null,
        children: [
          {
            label: 'Option 11',
            key: '11',
          },
          {
            label: 'Option 12',
            key: '12',
          },
        ],
      },
    ],
  },
];
