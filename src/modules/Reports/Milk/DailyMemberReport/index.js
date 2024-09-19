import dayjs from 'dayjs';
import { useLoading } from 'hooks/useLoading';
import React, { useCallback, useEffect, useState } from 'react';
import { getFirestoreCollection } from 'services/firebase';
import Page from 'ui/components/common/Pages/Page';
import EditableCellTable from 'ui/components/common/Table/EditableCellTable';
import DatePicker from 'ui/elements/DatePicker';
import { sortArr } from 'utils/functions/array';
import { showLog } from 'utils/functions/common';
import { showWarn } from 'utils/functions/common';
import { getDailyMemberReportColumns } from './api';
import { distinctArr } from 'utils/functions/array';
import { arrayForEach } from 'utils/functions/array';
import { Numb } from 'utils/functions/common';
import MemberSelector from 'ui/components/MemberSelector';
import { Col, Form, Row } from 'antd';
import { useResponsive } from 'hooks/useResponsive';
import { ROW_GUTTER } from 'constants/Styles';
import { getRules } from 'utils/functions/validator';
import { useTranslation } from 'react-i18next';
import Button from 'ui/elements/Button';
import { CheckOutlined } from '@ant-design/icons';
import { getFirestoreDoc } from 'services/firebase';
import { formatValuesBeforeLoad } from 'utils/functions/common';
import { TableSummary } from 'ui/components/common/Table';
import { useSelector } from 'react-redux';

const DailyMemberReport = ({ children, title, subtitle, ...props }) => {
  const { USER, profile } = useSelector((state) => state.user);
  const { loading, setLoading } = useLoading();
  const [data, setData] = useState([]);
  const [defaultMember, setDefaultMember] = useState({});

  const [form] = Form.useForm();
  const { mobileOnly } = useResponsive();
  const { t } = useTranslation();

  const isMember =
    profile?.permissions &&
    ['member'].includes(profile.permissions?.role) &&
    !!profile.permissions?.memberId;

  const getDefaultMember = useCallback(async (memberId) => {
    try {
      let doc = await getFirestoreDoc('sections/personal/members', memberId);
      let member = {};
      if (doc) {
        member = formatValuesBeforeLoad(doc);
        setDefaultMember(member);
      }
    } catch (e) {
      showWarn(e);
    }
  }, []);

  useEffect(() => {
    if (isMember) {
      getDefaultMember(profile.permissions?.memberId);
    }
  }, [getDefaultMember, isMember, profile.permissions?.memberId]);

  const getDailyMember = useCallback(
    async (val) => {
      try {
        setLoading(true);
        const { memberId, dateRange } = val;
        let doc = await getFirestoreDoc('sections/personal/members', memberId);
        let member = {};
        if (doc) {
          member = formatValuesBeforeLoad(doc);
        }
        const res = await getFirestoreCollection('sections/milk/weight', [
          ['recordDate', '>=', dateRange[0]],
          ['recordDate', '<=', dateRange[1]],
          ['memberId', '==', member.bucketNo],
        ]);
        let arr = res
          ? Object.keys(res).map((k) => ({
              ...res[k],
              _id: k,
              // nameSurname: `${res[k].prefix}${res[k].firstName} ${
              //   res[k].lastName || ''
              // }`,
            }))
          : [];
        showLog({ arr });
        arr = sortArr(arr, ['recordDate']).map((it, id) => ({
          ...it,
          id,
          key: id,
        }));

        let dArr = distinctArr(arr, ['recordDate', 'period'], ['weight']);

        let fObj = {};
        await arrayForEach(dArr, async (l, i) => {
          const {
            memberId,
            nameSurname,
            period,
            recordDate,
            systemDate,
            weight,
          } = l;
          if (!fObj[recordDate]) {
            // Get daily QC price.
            const res = await getFirestoreCollection('sections/milk/dailyQC', [
              ['recordDate', '==', recordDate],
              ['bucketNo', '==', memberId],
            ]);
            let unitPriceArr = [];
            if (res) {
              unitPriceArr = Object.keys(res).map((k, id) => ({
                ...res[k],
                id,
                key: k,
                _id: k,
              }));
            }
            let unitPrice =
              unitPriceArr.length > 0 ? unitPriceArr[0].price_per_kg : null;

            // Get milk QC price.
            const res2 = await getFirestoreCollection('sections/milk/milkQC', [
              [
                'recordMonth',
                '==',
                dayjs(recordDate, 'YYYY-MM-DD').format('YYYY-MM'),
              ],
              ['bucketNo', '==', memberId],
            ]);
            let qUnitPriceArr = [];
            if (res2) {
              qUnitPriceArr = Object.keys(res2).map((k, id) => ({
                ...res2[k],
                id,
                key: k,
                _id: k,
              }));
            }
            let qUnitPrice = null;
            let isFirstHalf =
              recordDate <
              dayjs().startOf('month').add(15, 'day').format('YYYY-MM-DD');
            let qArr = qUnitPriceArr.filter(
              (l) =>
                l.affectingPeriod === (isFirstHalf ? 'firstHalf' : 'secondHalf')
            );
            if (qArr.length > 0) {
              const { fat_price, snf_price, scc_price, fp_price } = qArr[0];
              qUnitPrice =
                Numb(fat_price) +
                Numb(snf_price) +
                Numb(scc_price) +
                Numb(fp_price);
            }

            fObj[recordDate] = {
              memberId,
              nameSurname,
              recordDate,
              morningW: period === 'เช้า' ? weight : null,
              eveningW: period === 'เย็น' ? weight : null,
              unitPrice:
                unitPriceArr.length > 0 ? unitPriceArr[0].price_per_kg : null,
              qUnitPrice,
              accUnitPrice: Numb(unitPrice) + Numb(qUnitPrice),
            };
          } else {
            if (period === 'เช้า') {
              fObj[recordDate].morningW = weight;
            } else {
              fObj[recordDate].eveningW = weight;
            }
          }
          return l;
        });

        let fArr = Object.keys(fObj).map((k, id) => {
          let totalW = Numb(fObj[k].morningW) + Numb(fObj[k].eveningW);
          const amount = totalW * Numb(fObj[k].accUnitPrice);
          return {
            ...fObj[k],
            totalW,
            amount,
            id,
            key: k,
          };
        });

        showLog({ arr, dArr, fArr, res });
        setLoading(false);
        setData(fArr);
      } catch (e) {
        showWarn(e);
        setLoading(false);
      }
    },
    [setLoading]
  );

  const onSubmit = (val) => {
    showLog('onSubmit', val);
    if (!val.memberId && !isMember) {
      return;
    }
    let values = { ...val };
    if (isMember) {
      values.memberId = defaultMember.memberId;
    }
    getDailyMember(values);
  };

  return (
    <Page
      title={isMember ? 'สรุปรายวัน' : 'สรุปแยกรายสมาชิก'}
      subtitle="รุ่งอรุณ แดรี่"
    >
      <Form
        form={form}
        initialValues={{
          dateRange: [
            dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
            dayjs().format('YYYY-MM-DD'),
          ],
          memberId: isMember ? defaultMember.memberId : null,
        }}
        // onValuesChange={onValuesChange}
        onFinish={onSubmit}
        layout="vertical"
        scrollToFirstError
      >
        {(values) => {
          showLog({ values });
          return (
            <div className="py-2">
              <div className="pt-6 rounded-lg bg-background2 px-2">
                <Row gutter={ROW_GUTTER}>
                  <Col span={mobileOnly ? 24 : 8}>
                    {isMember ? (
                      <div>
                        <div className="mb-4">สมาชิก</div>
                        <span>{`${defaultMember.bucketNo || ''} - ${
                          defaultMember.prefix || ''
                        }${defaultMember.firstName || ''} ${
                          defaultMember.lastName || ''
                        }`}</span>
                      </div>
                    ) : (
                      <Form.Item
                        name="memberId"
                        label={t('สมาชิก')}
                        rules={[
                          {
                            required: true,
                            message: t('กรุณาป้อนข้อมูล'),
                          },
                        ]}
                      >
                        <MemberSelector
                          style={{
                            width: 300,
                          }}
                          disabled={isMember}
                        />
                      </Form.Item>
                    )}
                  </Col>
                  <Col span={mobileOnly ? 24 : 6}>
                    <Form.Item
                      name="dateRange"
                      label="วันที่"
                      rules={getRules(['required'])}
                    >
                      <DatePicker isRange />
                    </Form.Item>
                  </Col>
                  <Col span={mobileOnly ? 24 : 6}>
                    <span className="mx-2"></span>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<CheckOutlined />}
                      className="mt-2"
                    >
                      {t('ตกลง').toUpperCase()}
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          );
        }}
      </Form>

      <div className="mt-3">
        <EditableCellTable
          dataSource={data}
          columns={getDailyMemberReportColumns(data)}
          summary={(pageData) => (
            <TableSummary
              pageData={pageData}
              startAt={3}
              columns={getDailyMemberReportColumns(data)}
              sumKeys={['totalW', 'amount']}
              sumClassName={['text-primary', 'text-success']}
            />
          )}
          loading={loading}
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
        />
      </div>
    </Page>
  );
};

export default DailyMemberReport;
