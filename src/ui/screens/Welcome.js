import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import CompanyLogo from 'ui/components/common/CompanyLogo';
import { notificationController } from 'controllers/notificationController';

const Welcome = () => {
  const welcome = useRef(null);
  const shark = useRef(null);
  const paragraph = useRef(null);

  useEffect(() => {
    gsap.to(welcome.current, {
      x: 0,
      color: 'white',
      opacity: 1,
      duration: 1,
    });

    gsap.to(shark.current, {
      x: 0,
      opacity: 1,
      delay: 0.2,
      duration: 1,
    });

    gsap.to(paragraph.current, {
      x: 0,
      opacity: 1,
      delay: 0.5,
      duration: 1,
    });
  }, []);

  const image = require('assets/images/welcome.png');
  return (
    <main className="w-full flex items-center justify-center min-h-screen text-tw-white relative overflow-hidden">
      <div
        className="wave-effect absolute w-full h-full bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${image})`,
        }}
      ></div>
      <div
        className="absolute bg-gradient-to-b from-sky-800 to-gray-900 opacity-80 inset-0 z-0"
        // className={`absolute bg-gradient-to-b from-${themeColor}-500 to-${themeColor}-400 opacity-75 inset-0 z-0`}
      ></div>
      <section className="w-[80vw] h-full md:w-[90vw]">
        <div className="flex flex-col items-center justify-between">
          {/* <CompanyLogo logoOnly size={60} style={{ marginBottom: 40 }} /> */}
          <div className="text-center drop-shadow-lg">
            <h3
              className="text-4xl font-semibold opacity-0 -translate-x-20 lg:text-5xl sm:text-2xl"
              ref={welcome}
            >
              ยินดีต้อนรับสู่
            </h3>
            <h1
              className="pb-4 pt-2 bg-gradient-to-b from-[#8DFBFF] to-[#308EC7] bg-clip-text text-5xl font-bold text-transparent -translate-x-20 opacity-0 sm:text-6xl md:8xl md:bg-red-400"
              ref={shark}
            >
              รุ่งอรุณ แดรี่
            </h1>
          </div>
          <p
            className="text-md text-slate-300 font-light text-center w-3/4 opacity-0 -translate-x-20 sm:w-3/4 md:w-3/4 lg:w-3/4 "
            ref={paragraph}
          >
            ยินดีต้อนรับคุณเข้ามาเป็นสมาชิกใหม่ของเรา
            เพื่อร่วมกันพัฒนาคุณภาพชีวิต คุณภาพน้ำนม ให้ดียิ่งขึ้น
            และเราจะก้าวไปด้วยกันอย่างมั่งคั่ง มั่นคง
          </p>
          <button
            onClick={() =>
              notificationController.info({
                message:
                  'กรุณารอเราตรวจสอบและยืนยันตัวตนของท่าน ก่อนเข้าใช้งาน',
              })
            }
            // href="/#/sharksinfo"
            className="z-10 bg-[#1F78A1]/20 text-tw-white font-normal tracking-wide px-24 py-2 rounded-md border-[1px] border-[#165370] mt-8 hover:bg-[#165370] duration-300 shake-on-hover"
          >
            สำรวจ
          </button>
        </div>
      </section>
    </main>
  );
};

export default Welcome;
