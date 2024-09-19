import { List } from 'antd';
import { useLoading } from 'hooks/useLoading';
import React from 'react';
import { getFirestoreCollection } from 'services/firebase';
import Page from 'ui/components/common/Pages/Page';
import Button from 'ui/elements/Button';
import { arrayForEach } from 'utils/functions/array';
import { distinctArr } from 'utils/functions/array';
import { showLog } from 'utils/functions/common';
import { showWarn } from 'utils/functions/common';
import { setFirestore } from 'services/firebase';
import { deleteToken } from 'firebase/messaging';
import { updateFirestore } from 'services/firebase';
import dayjs from 'dayjs';

const lists = [
  {
    title: 'Check data',
    description: '',
  },
  {
    title: 'Update data',
    description: '',
  },
  {
    title: 'Delete import data by batchNo',
    description: '',
  },
];

const CheckData = () => {
  const { setLoading } = useLoading();

  const _checkData = async () => {
    try {
      setLoading(true);
      const res = await getFirestoreCollection('sections/milk/milkQC', [
        // ['deleted', '==', false],
        // ['recordDate', '>=', '2024-06-01'],
        // ['recordDate', '<=', '2024-06-30'],
        // ['bucketNo', '==', '889'],
      ]);
      let dataArr = [];
      if (res) {
        dataArr = Object.keys(res).map((k, id) => ({
          ...res[k],
          id,
          key: k,
          _id: k,
        }));
      }

      const avaiDates = distinctArr(dataArr, ['recordDate']).map(
        (it) => it.recordDate
      );

      await arrayForEach(dataArr, async (dt) => {
        let mt = { ...dt };
        let key = mt.key;
        delete mt.id;
        delete mt.key;
        delete mt._id;
        let recordMonth = dayjs(mt.recordDate, 'YYYY-MM-DD').format('YYYY-MM');
        // showLog({ recordMonth, recordDate: mt.recordDate });
        await updateFirestore('sections/milk/milkQC', key, {
          recordMonth,
          // affectingPeriod:
          //   mt.recordDate === avaiDates[0] ? 'firstHalf' : 'secondHalf',
        });
        // await setFirestore('sections/milk/milkQC_bak', key, mt);
      });
      setLoading(false);
      showLog({
        dataArr,
        avaiDates,
        // noKeywords,
      });
    } catch (e) {
      showWarn(e);
      setLoading(false);
    }
  };

  const _onSelect = (item) => {
    switch (item.id) {
      case 0:
        _checkData();
        break;
      case 1:
        // let path = 'sections/stocks/importVehicleItems';
        // let batchNo = 1631781609200;
        // editImportDataByBatchNo(path, batchNo);
        break;
      case 2:
        // let collection = `sections/stocks/importParts`;
        // let itemCollection = `sections/stocks/importPartItems`;
        // let batchNo = 1648435289090;
        // deleteImportDataByBatchNo({ collection, itemCollection, batchNo, api });
        break;
      default:
        break;
    }
  };

  return (
    <Page title="Developer" subtitle="พัฒนาระบบ">
      <div className="ml-4 bg-light bordered pb-1">
        <List
          itemLayout="horizontal"
          dataSource={lists}
          renderItem={(item, id) => (
            <List.Item
              className="px-2"
              actions={[
                <Button
                  htmlType="button"
                  type="primary"
                  onClick={() => _onSelect({ ...item, id })}
                >
                  OK
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </div>
    </Page>
  );
};

export default CheckData;
