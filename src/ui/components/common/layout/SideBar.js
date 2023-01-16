const MainSideBar = ({ collapsed, menu }) => {
  return (
    <div
      className="hidden lg:block overflow-y-auto overflow-x-hidden"
      style={{
        width: collapsed ? 80 : 256,
      }}
    >
      {menu}
    </div>
  );
};
export default MainSideBar;
