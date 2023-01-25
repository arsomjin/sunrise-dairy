import {
  EditOutlined,
  SafetyCertificateOutlined,
  VerifiedOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFirestoreDoc } from 'services/firebase';
import BarTitle from 'ui/components/common/BarTitle';
import Button from 'ui/elements/Button';
import { getAddressText } from 'utils/functions/common';
import { getFullName } from 'utils/functions/common';
import { showLog } from 'utils/functions/common';
import { formatValuesBeforeLoad } from 'utils/functions/common';

const ProfileView = ({ setEdit }) => {
  const { USER } = useSelector((state) => state.user);
  const [data, setData] = useState({});
  useEffect(() => {
    const getProfile = async () => {
      let doc = await getFirestoreDoc(`users/${USER?.uid}/info`, 'profile');
      if (doc) {
        let val = formatValuesBeforeLoad(doc);
        setData(val);
      }
    };
    getProfile();
  }, [USER?.uid]);

  showLog({ data });

  const name = getFullName(data);
  const address =
    data?.address && data?.residence ? getAddressText(data) : null;

  return (
    <>
      <BarTitle>ข้อมูลส่วนตัว</BarTitle>
      <div className="bg-background1 font-sans h-screen w-full flex flex-row justify-center items-center">
        <div className="card w-96 mx-auto bg-white  shadow-xl hover:shadow">
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: 6,
            }}
          >
            <Button
              type="ghost"
              icon={<EditOutlined className="text-secondary" />}
              onClick={() => setEdit((pe) => !pe)}
            />
          </div>
          <img
            className="w-32 mx-auto rounded-full -mt-28 border-8 border-white"
            src={USER?.photoURL || undefined}
            //   src="https://avatars.githubusercontent.com/u/67946056?v=4"
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="text-center text-black mt-2 text-3xl font-medium">
            {name}
          </div>
          <div className="text-center text-black mt-2 font-light text-sm">
            {data.email}
          </div>
          <div className="text-center text-black font-normal text-lg">
            {data.phoneNumber}
          </div>
          <div className="text-center text-sm font-normal text-success m-4 flex justify-center">
            <SafetyCertificateOutlined
              className="text-success"
              style={{ fontSize: 20 }}
            />
            <span className="ml-2">ยืนยันตัวตนแล้ว</span>
          </div>
          <div className="px-6 text-center text-black mt-2 font-light text-sm">
            <p>{address}</p>
          </div>
          <hr className="mt-8" />
          {/* <div className="flex p-4">
            <div className="w-1/2 text-center text-tw-black">
              <span className="font-bold">1.8 k</span> Followers
            </div>
            <div className="w-0 border border-gray-300"></div>
            <div className="w-1/2 text-center text-tw-black">
              <span className="font-bold">2.0 k</span> Following
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ProfileView;
