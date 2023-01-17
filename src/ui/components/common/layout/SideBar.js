const MainSideBar = ({ collapsed, menu }) => {
  return (
    <div
      className="hidden shadow-md lg:block bg-background2 dark:bg-background1 overflow-y-auto overflow-x-hidden"
      style={{
        width: collapsed ? 80 : 256,
      }}
    >
      {menu}
    </div>
  );
};
export default MainSideBar;
