import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const takeMeHome = () => navigate('/');

  return (
    <div className="flex bg-slate-200 min-h-screen items-center justify-center">
      <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
        <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
          <div className="relative">
            <div className="absolute">
              <div className="">
                <h1 className="my-2 text-tw-black font-bold text-2xl">
                  {t('ดูเหมือนว่าคุณได้พบประตูสู่ความว่างเปล่าอันยิ่งใหญ่')}
                </h1>
                <p className="my-2 text-tw-black">
                  {t(
                    'หยอกๆๆ! โปรดไปที่หน้าแรกของเราเพื่อดูหน้าเว็บที่คุณต้องการไป'
                  )}
                </p>
                <button
                  onClick={takeMeHome}
                  className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-sky-500 text-gray-50 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
                >
                  {t('พาไปหน่อยสิ!')}
                </button>
              </div>
            </div>
            <div>
              <img src="https://i.ibb.co/G9DC8S0/404-2.png" />
            </div>
          </div>
        </div>
        <div>
          <img src="https://i.ibb.co/ck1SGFJ/Group.png" />
        </div>
      </div>
    </div>
  );
};
