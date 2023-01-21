import React from 'react';
import { Socials } from 'utils/footers';

const About = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center px-4 pb-4">
      <img
        id="main-logo"
        className="d-inline-block align-top mr-1"
        style={{
          maxWidth: '128px',
          size: '122px',
          marginBottom: '30px',
        }}
        src={require('assets/logo/logo192.png')}
        alt="Rungaroon Dairy"
      />
      <h3 className="text-3xl font-extrabold text-black">
        บริษัท รุ่งอรุณ แดรี่ จำกัด
      </h3>
      <p className="text-tw-black">
        ซื้อขายน้ำนมดิบ​ ผลิตภัณฑ์​อาหารสัตว์​ ผลิตภัณฑ์​นม
      </p>
      <p className="text-tw-black">
        888 หมู่ 15 ต.มะเกลือเก่า อ.สูงเนิน จ.นครราชสีมา 30170
      </p>
      <h2 className="text-2xl font-extrabold text-black mt-4">
        RUNGAROON DAIRY COMPANY LIMITED
      </h2>
      <Socials medium />
    </div>
  );
};

export default About;
