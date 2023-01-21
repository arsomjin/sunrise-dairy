import React, { useEffect } from 'react';
import { useMergeState } from 'hooks';
import Progress from 'ui/elements/Progress';
import { Popconfirm, Button } from 'antd';

const ProgressLoader = (props) => {
  const [cState, setCState] = useMergeState({
    show: typeof props.show !== 'undefined' ? props.show : false,
    percent: typeof props.percent !== 'undefined' ? props.percent : 0,
    text: props.text || null,
    subtext: props.subtext || null,
    onCancel: props.onCancel || null,
  });

  useEffect(() => {
    setCState({
      show: typeof props.show !== 'undefined' ? props.show : false,
      percent: typeof props.percent !== 'undefined' ? props.percent : 0,
      text: props.text || null,
      subtext: props.subtext || null,
      onCancel: props.onCancel || null,
    });
  }, [
    props.onCancel,
    props.percent,
    props.show,
    props.subtext,
    props.text,
    setCState,
  ]);

  if (!cState.show) {
    return null;
  }

  return (
    <div className="absolute flex flex-col bg-slate-50 dark:bg-slate-400 opacity-90 inset-0 z-20  items-center justify-center">
      <div className="flex justify-center">
        <Progress {...{ percent: parseInt(cState.percent) }} />
      </div>
      {cState.text && (
        <div className="flex justify-center">
          <label className="text-primary my-3 text-center">{cState.text}</label>
        </div>
      )}
      {cState.subtext && (
        <div className="flex justify-center">
          <label className="text-warning mb-3 text-center">
            {cState.subtext}
          </label>
        </div>
      )}
      {cState.onCancel && (
        <div className="flex justify-center border-top mt-3 pt-3">
          <Popconfirm
            title="ยืนยัน?"
            okText="ยืนยัน ยกเลิกการดำเนินการ"
            cancelText="ยกเลิก"
            onConfirm={() => {
              cState.onCancel();
              setCState({ show: false });
            }}
          >
            <Button type="primary" danger size="middle">
              ยกเลิก
            </Button>
          </Popconfirm>
        </div>
      )}
    </div>
  );
};

export default ProgressLoader;
