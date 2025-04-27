import React from 'react';
import BarTitle from 'ui/components/common/BarTitle';
import { Socials } from 'utils/footers';
import logo from 'assets/logo-new/roongaroon-dairy.jpg';

const About = () => {
  return (
    <>
      <BarTitle>เกี่ยวกับเรา</BarTitle>
      <div className="h-full flex flex-col justify-center items-center px-4 pb-4">
        <div
          style={{
            width: '128px',
            height: '128px',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px'
          }}
        >
          <img
            id="main-logo"
            src={logo}
            alt="Rungaroon Dairy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        <h3 className="text-3xl font-extrabold text-black text-center">
          บริษัท รุ่งอรุณ แดรี่ จำกัด
        </h3>
        <p className="text-tw-black text-center">
          ซื้อขายน้ำนมดิบ​ ผลิตภัณฑ์​อาหารสัตว์​ ผลิตภัณฑ์​นม
        </p>
        <p className="text-tw-black text-center">
          888 หมู่ 15 ต.มะเกลือเก่า อ.สูงเนิน จ.นครราชสีมา 30170
        </p>
        <h2 className="text-2xl font-extrabold text-black mt-4 text-center">
          RUNGAROON DAIRY COMPANY LIMITED
        </h2>
        <Socials medium />
      </div>
    </>
  );
};

export default About;
