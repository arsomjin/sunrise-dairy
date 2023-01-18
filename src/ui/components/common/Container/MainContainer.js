import { Menu } from 'antd';
import { initTheme } from 'navigation/api';
import { routes } from 'navigation/routes';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { updateCurrentRoute } from 'store/slices/tempSlice';
import { showLog } from 'utils/functions/common';
import { menuItems } from '../layout/api';
import MainSideBar from '../layout/SideBar';
import Topbar from '../layout/Topbar';

const MainContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRoute, keyPath } = useSelector((state) => state.unPersisted);
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    initTheme(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleHided = () => {
    setOpen(false);
  };

  const toggleShow = () => {
    setOpen(true);
  };

  const onMenuClick = (e) => {
    const { key, keyPath } = e;
    // showLog({ key, keyPath, item });
    // showLog({ e, item: e.item, path: e.keyPath });
    navigate(routes[e.key]);
    dispatch(updateCurrentRoute({ currentRoute: key, keyPath }));
  };

  const menu = (
    <Menu
      defaultSelectedKeys={[currentRoute]}
      defaultOpenKeys={keyPath.slice(1)}
      mode="inline"
      inlineCollapsed={collapsed}
      items={menuItems}
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
