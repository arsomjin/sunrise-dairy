import { useDispatch, useSelector } from 'react-redux';
import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Drawer, Dropdown, Input, Popover } from 'antd';
import ToggleTheme from '../ToggleTheme';
import ToggleLan from '../ToggleLan';
import { useEffect, useState } from 'react';
import './layout.css';
import CompanyLogo from '../CompanyLogo';
import { routes } from 'navigation/routes';
import { useTranslation } from 'react-i18next';
import { useLoading } from 'hooks/useLoading';
import FirebaseAuth from 'services/firebase/authFirebase';
import { getNotificationContent, notif_data } from './items';
import { showWarn } from 'utils/functions/common';
import { useNavigate } from 'react-router-dom';
import { showConfirm } from 'utils/functions/common';
import { waitFor } from 'utils/functions/common';
import { updateCurrentRoute } from 'store/slices/tempSlice';
import { useResponsive } from 'hooks/useResponsive';

// const avatar_placeholder = 'https://i.pravatar.cc/300'

const Topbar = ({
  open,
  toggleHided,
  toggleShow,
  collapsed,
  toggleCollapsed,
  menu,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useLoading();
  const { loading: loader, signOutUser } = FirebaseAuth();
  const { nightMode } = useSelector((state) => state.global);
  const { profile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { mobileOnly } = useResponsive();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [imgUrl, setImg] = useState(
    profile?.photoURL ||
      profile?.url ||
      require('assets/images/blank-profile.png')
  );

  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  useEffect(() => {
    setImg(
      profile?.photoURL ||
        profile?.url ||
        require('assets/images/blank-profile.png')
    );
  }, [profile?.photoURL, profile?.url]);

  const onAvatarClick = (e) => {
    switch (e.key) {
      case 'profile':
        dispatch(updateCurrentRoute({ currentRoute: 'PROFILE' }));
        navigate(routes.PROFILE);
        break;
      case 'signout':
        showConfirm({
          title: t('ยืนยัน').toUpperCase(),
          content: `${t('ออกจากระบบ')} ?`,
          onOk: () => signOut(),
        });
        break;

      default:
        break;
    }
  };

  const onSearch = () => {};

  const signOut = async () => {
    try {
      setLoading(true);
      await signOutUser();
      await waitFor(200);
      setLoading(false);
    } catch (e) {
      showWarn(e);
      setLoading(false);
    }
  };

  const [openNotif, setOpenNotif] = useState(false);
  const hide = () => {
    setOpenNotif(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpenNotif(newOpen);
  };

  // Translation issue, if move outside component.
  const avatar_items = [
    {
      key: 'profile',
      label: t('ข้อมูลส่วนตัว'),
      icon: <UserOutlined className="text-primary" />,
      style: { width: 200 },
    },
    {
      key: 'signout',
      label: t('ออกจากระบบ'),
      icon: <LogoutOutlined className="text-danger" />,
      style: { width: 200 },
    },
  ];

  return (
    <div
      className="sticky top-0 w-full flex shadow-sm bg-background2 dark:bg-background1 justify-between p-3 px-4 items-center"
      style={{
        borderBottom: nightMode ? '2px solid  #1b2538' : '2px solid #f2f2f2',
      }}
    >
      <div className="flex items-center">
        <div
          className="flex items-center justify-between"
          style={{ width: mobileOnly ? 90 : 220 }}
        >
          <div className="flex items-center">
            <div className="burger mr-2">
              <Button
                icon={<MenuOutlined />}
                onClick={toggleShow}
                type="ghost"
                shape="circle"
                className="mb-2"
              />
              <Drawer
                title={<CompanyLogo />}
                placement="left"
                onClick={toggleHided}
                onClose={toggleHided}
                open={open}
              >
                {menu}
              </Drawer>
            </div>
            <CompanyLogo logoOnly={mobileOnly} />
          </div>
          <div className="hidden lg:block">
            <Button
              icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              type="ghost"
              shape="circle"
              className="mb-2"
            />
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className={mobileOnly ? '' : 'hidden lg:block'}>
          {/* <div  className="hidden lg:block"  > */}
          <Input
            prefix={<SearchOutlined />}
            placeholder="ค้นหา..."
            onChange={onSearch}
            style={{
              display: mobileOnly ? 'none' : '',
              width: 220,
              marginLeft: 20,
            }}
          />
        </div>
      </div>

      {/* ICONS */}
      <div className="flex">
        <ToggleTheme className="mr-2" style={{ marginTop: '6px' }} noColor />
        <ToggleLan className="mr-2 ml-2" noColor />
        <Popover
          content={getNotificationContent(
            notif_data.concat(notif_data).concat(notif_data)
          )}
          trigger="click"
          open={openNotif}
          onOpenChange={handleOpenChange}
          placement="bottomRight"
        >
          <div className="mr-2">
            <Badge
              style={{ marginTop: 4, marginRight: 15 }}
              count={9}
              overflowCount={10}
            >
              <Button
                className="mr-3"
                icon={<BellOutlined />}
                type="ghost"
                shape="circle"
              />
            </Badge>
          </div>
        </Popover>
        {/* <Button className="mr-2" icon={<SettingOutlined />} type='ghost' shape="circle" /> */}
        <Dropdown
          placement="bottomRight"
          menu={{ items: avatar_items, onClick: onAvatarClick }}
        >
          <Avatar size="large" src={imgUrl} />
        </Dropdown>
        {/* <Button className="mr-2" icon={
            <UserOutlined /> } type='ghost' shape="circle" /> */}
      </div>
    </div>
  );
};

export default Topbar;
