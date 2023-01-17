import React from 'react';

const Dashboard = () => {
  return (
    <div className="h-full p-4 flex flex-col">
      <h5 className="text-tw-black">DASHBOARD</h5>
      <div className="min-h-screen">
        <p className="text-black">
          This is a very long section that consumes 100% viewport height!
        </p>
      </div>
      <div className="min-h-screen bg-slate-200">
        <p className="text-black">
          This is second long section that consumes 100% viewport height!
        </p>
      </div>
      <div className="min-h-screen">
        <p className="text-black">
          This is third long section that consumes 100% viewport height!
        </p>
      </div>
      <div className="min-h-screen bg-slate-200">
        <p className="text-black">
          This is fourth long section that consumes 100% viewport height!
        </p>
      </div>
      <div className="min-h-screen">
        <p className="text-black">
          This is fifth long section that consumes 100% viewport height!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
