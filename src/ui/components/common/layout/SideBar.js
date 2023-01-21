import { useSelector } from 'react-redux';

const MainSideBar = ({ menu }) => {
  const { sideBarWidth } = useSelector((state) => state.unPersisted);
  return (
    <div
      className="hidden shadow-md lg:block bg-background2 dark:bg-background1 overflow-y-auto overflow-x-hidden"
      style={{
        width: sideBarWidth,
      }}
    >
      {menu}
    </div>
  );
};
export default MainSideBar;
