import { Menu } from 'antd';
import { useProfile } from 'hooks/useProfile';
import { initTheme } from 'navigation/api';
import { routes } from 'navigation/routes';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { updateCollapsed } from 'store/slices/tempSlice';
import { updateCurrentRoute } from 'store/slices/tempSlice';
import { updateProfile } from 'store/slices/userSlice';
import { menuItems } from '../../ui/layout/api';
import MainSideBar from '../../ui/layout/SideBar';
import Topbar from '../../ui/layout/Topbar';

const MainContainer = () => {
  const { USER, profile } = useSelector((state) => state.user);
  const { currentRoute, keyPath, collapsed } = useSelector(
    (state) => state.unPersisted
  );
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentProfile = useProfile(USER?.uid);

  const first1 = useRef(true);

  useEffect(() => {
    if (!first1.current) {
      // Avoid flickering to auth page.
      dispatch(updateProfile({ profile: currentProfile }));
    }
    first1.current = false;
  }, [currentProfile, dispatch]);

  useEffect(() => {
    initTheme(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCollapsed = () => {
    dispatch(updateCollapsed({ collapsed: !collapsed }));
  };

  const toggleHided = () => {
    setOpen(false);
  };

  const toggleShow = () => {
    setOpen(true);
    dispatch(updateCollapsed({ collapsed: false }));
  };

  const onMenuClick = (e) => {
    const { key, keyPath } = e;
    // showLog({ key, keyPath, item });
    // showLog({ e, item: e.item, path: e.keyPath });
    navigate(routes[e.key]);
    dispatch(updateCurrentRoute({ currentRoute: key, keyPath }));
    toggleHided();
  };

  const isPrivated =
    profile?.permissions &&
    !['member', 'undefined'].includes(profile.permissions?.role);
  const isMember =
    profile?.permissions &&
    ['member'].includes(profile.permissions?.role) &&
    !!profile.permissions?.memberId;

  const menu = (
    <Menu
      defaultSelectedKeys={[currentRoute]}
      defaultOpenKeys={keyPath.slice(1)}
      mode="inline"
      inlineCollapsed={collapsed}
      items={menuItems(
        isPrivated,
        ['arsomjin@gmail.com', 'arsom@happyinnovation.net'].includes(
          USER?.email
        ),
        isMember
      )}
      onClick={onMenuClick}
    />
  );

  return (
    <div className="flex flex-col h-screen">
      <Topbar
        open={open}
        collapsed={collapsed}
        toggleShow={toggleShow}
        toggleHided={toggleHided}
        toggleCollapsed={toggleCollapsed}
        defaultOpenKeys={keyPath.slice(1)}
        defaultSelectedKeys={[currentRoute]}
        menu={menu}
      />
      <div className="flex" style={{ height: `calc(100% - 65px)` }}>
        <MainSideBar collapsed={collapsed} menu={menu} />
        <div className="h-full flex-1 bg-background1 p-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
