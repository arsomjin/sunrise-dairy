import React from 'react';
import {
  Form,
  Popconfirm,
  Tooltip,
  Select,
  Badge,
  Table,
  Typography,
  Button,
} from 'antd';
import numeral from 'numeral';
import {
  ArrowRightOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import Input from 'ui/elements/Input';
import { showWarning } from 'utils/functions/common';
import { Numb } from 'utils/functions/common';
import { isMobileNumber } from 'utils/functions/validator';
import { Dates } from 'constants/Dates';
import { showLog } from 'utils/functions/common';

const { Option } = Select;
const { Text } = Typography;

export const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false} scrollToFirstError>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const ColumnProps = {
  id: {
    width: 50,
  },
};

export const getInputNode = ({
  dataIndex,
  number,
  ref,
  save,
  size,
  record,
  onBlur,
  path,
}) => {
  const mProps = {
    ref,
    ...(typeof save !== 'undefined' && { onPressEnter: save }),
    ...(typeof onBlur !== 'undefined' && { onBlur: save }),
    ...(typeof number !== 'undefined' && { number: true }),
  };

  let inputNode = <Input {...mProps} size={size || 'small'} />;

  return inputNode;
};

export const getRenderColumns = (
  columns,
  handleSave,
  isEditing,
  // validating
  onKeyDown,
  onBlur,
  size
) => {
  return columns.map((col, n) => {
    if (col.children || col.render) {
      return { ...col, title: <div className="text-center">{col.title}</div> };
    }
    let mCol = {
      ...col,
      title: <div className="text-center">{col.title}</div>,
    };
    if (col?.titleAlign) {
      switch (col.titleAlign) {
        case 'left':
          mCol = {
            ...mCol,
            title: col.title,
          };
          break;
        case 'right':
          mCol = {
            ...mCol,
            title: <div className="text-right">{col.title}</div>,
          };
          break;

        default:
          break;
      }
    }
    const isDate =
      Dates.isDateTypeField(col.dataIndex) || col.dataIndex === 'date';

    if (isDate) {
      mCol = {
        ...mCol,
        align: 'center',
        render: (text) => (
          <div className={!text ? 'transparent' : ''}>
            {text === 'N/A'
              ? text
              : !!text
              ? col.dataIndex === 'systemDate'
                ? Dates.getThaiDate(text, true)
                : Dates.getThaiDate(text)
              : ''}
          </div>
        ),
      };
    } else {
      switch (col.dataIndex) {
        case 'id':
          mCol = {
            ...mCol,
            render: (text) => <div>{(text || n) + 1}</div>,
          };
          break;

        default:
          mCol = {
            ...mCol,
            render: (text) => (
              <div className={!text ? 'transparent' : ''}>{text || '-'}</div>
            ),
          };
      }
    }

    if (col.editable) {
      let cellObj = {
        number: col.number,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: <div className="text-center">{col.title}</div>,
        required: col.required,
        ...(typeof handleSave !== 'undefined' && { handleSave }),
        ...(typeof onKeyDown !== 'undefined' && { onKeyDown }),
        ...(typeof onBlur !== 'undefined' && { onBlur }),
        ...(typeof size !== 'undefined' && { size }),
      };
      let resultForRowType = {
        ...mCol,
        ...ColumnProps[col.dataIndex],
        ...(col.width && { width: col.width }),
        key: n.toString(),
        onCell: (record) => ({
          record,
          ...cellObj,
          editing: isEditing(record),
          // validating,
        }),
      };
      let resultForCellType = {
        ...mCol,
        ...ColumnProps[col.dataIndex],
        ...(col.width && { width: col.width }),
        key: n.toString(),
        onCell: (record) => ({
          record,
          ...cellObj,
        }),
      };

      return typeof isEditing === 'undefined'
        ? resultForCellType
        : resultForRowType;
    }
    return {
      ...mCol,
      key: n.toString(),
      ...ColumnProps[col.dataIndex],
      ...(col.width && { width: col.width }),
      ...(col.align && { align: col.align }),
    };
  });
};

export const GetColumns = ({
  columns,
  handleDelete,
  handleSave,
  handleSelect,
  handleEdit,
  onDelete,
  isEditing,
  onKeyDown,
  onBlur,
  size,
  hasChevron,
  hasEdit,
  disabled,
  readOnly,
  deletedButtonAtEnd,
}) => {
  let mColumns = getRenderColumns(
    columns,
    handleSave,
    isEditing,
    onKeyDown,
    onBlur,
    size
  );

  if (typeof onDelete !== 'undefined' && !(disabled || readOnly)) {
    let insertCol = {
      title: 'ลบ',
      dataIndex: 'operation',
      align: 'center',
      width: 80,
      key: 'deleteBtn',
      render: (_, record) => {
        return !(record?.deleted || record?.rejected || record?.completed) ? (
          <Popconfirm
            title="แน่ใจหรือไม่ ?"
            onConfirm={() => handleDelete(record.key)}
            okText="ลบ"
            cancelText="ยกเลิก"
          >
            <DeleteOutlined className="text-danger mb-2" />
          </Popconfirm>
        ) : (
          <Button
            type="link"
            icon={<DeleteOutlined className="text-danger" />}
            onClick={() =>
              showWarning({ title: `แถวที่ ${record.key + 1} ไม่สามารถลบได้` })
            }
          />
        );
      },
    };
    let insertId = mColumns.findIndex(
      (l) => l.dataIndex === 'id' && !deletedButtonAtEnd
    );
    insertId > -1
      ? mColumns.splice(insertId + 1, 0, insertCol)
      : (mColumns = [...mColumns, insertCol]);
  }
  if (hasChevron && !(disabled || readOnly)) {
    mColumns = [
      ...mColumns,
      {
        title: '→',
        dataIndex: '',
        key: 'x',
        render: (_, record) => (
          <Button
            type="link"
            icon={<ArrowRightOutlined />}
            onClick={() =>
              !record.deleted && handleSelect && handleSelect(record)
            }
          />
        ),
        align: 'center',
        width: 50,
      },
    ];
  }

  if (hasEdit && !(disabled || readOnly)) {
    let insertCol = {
      title: '🖊',
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() =>
            !(record?.deleted || record?.rejected || record?.completed) &&
            handleEdit &&
            handleEdit(record)
          }
        />
      ),
      align: 'center',
      width: 50,
    };
    let insertId = mColumns.findIndex((l) => l.dataIndex === 'id');
    insertId > -1
      ? mColumns.splice(insertId + 1, 0, insertCol)
      : (mColumns = [...mColumns, insertCol]);
  }

  return mColumns;
};

export const createValidator = ({
  dataIndex,
  number,
  getFieldValue,
  ...vProps
}) => {
  switch (dataIndex) {
    case 'vehicleNo':
      return {
        validator(rule, value) {
          const peripheralNo = getFieldValue('peripheralNo');
          // //  showLog({ value, peripheralNo });
          if (peripheralNo) {
            return Promise.resolve();
          }
          if (!value) {
            return Promise.reject('กรุณาป้อนข้อมูล');
          }
          return Promise.resolve();
        },
      };
    case 'peripheralNo':
      return {
        validator(rule, value) {
          const vehicleNo = getFieldValue('vehicleNo');
          // //  showLog({ value, vehicleNo });
          if (vehicleNo) {
            return Promise.resolve();
          }
          if (!value) {
            return Promise.reject('กรุณาป้อนข้อมูล');
          }
          return Promise.resolve();
        },
      };
    default:
      return {
        validator(rule, value) {
          if (number) {
            if (!value || !isNaN(value)) {
              return Promise.resolve();
            }
            // subForm.setFieldsValue({ total: null });
            return Promise.reject('กรุณาป้อนเป็นตัวเลข');
          }
          return Promise.resolve();
        },
      };
  }
};

export const TableSummary = ({
  pageData,
  dataLength,
  startAt,
  sumKeys,
  align,
  labelAlign,
  sumClassName,
  noDecimal,
  columns,
}) => {
  if (dataLength === 0) {
    return null;
  }
  let total = 0;
  let sumObj = {};
  let dArr = pageData.filter((l) => !l.deleted);
  if (sumKeys) {
    sumKeys.map((k) => {
      sumObj[k] = dArr
        .filter((l) => !l?.isSection)
        .reduce((sum, elem) => sum + Numb(elem[k]), 0);
      return k;
    });
  } else {
    total = dArr
      .filter((l) => !l?.isSection)
      .reduce((sum, elem) => sum + Numb(elem.total), 0);
  }
  if (pageData.length === 0) {
    return null;
  }
  // showLog({ sumKeys, sumObj, dArr, columns, labels });
  return (
    <>
      <Table.Summary.Row className="bg-light">
        {Array.from(new Array(startAt), (_, i) => (
          <Table.Summary.Cell key={i} />
        ))}
        <Table.Summary.Cell>
          <div style={{ textAlign: labelAlign || 'right' }}>
            <Text>ยอดรวม</Text>
          </div>
        </Table.Summary.Cell>
        {!!sumKeys ? (
          !!columns ? (
            getIndexFromColumns(columns)
              .slice(startAt + 1)
              .map((k, li) => {
                showLog({ k, li });
                return sumKeys.includes(k) ? (
                  <Table.Summary.Cell key={`sk${li}`}>
                    <div style={{ textAlign: align || 'right' }}>
                      <Text
                        className={
                          sumClassName ? sumClassName[li] : 'text-primary'
                        }
                      >
                        {numeral(sumObj[k]).format(
                          noDecimal ? '0,0' : '0,0.00'
                        )}
                      </Text>
                    </div>
                  </Table.Summary.Cell>
                ) : (
                  <Table.Summary.Cell key={`sk${li}`} />
                );
              })
          ) : (
            Object.keys(sumObj).map((k, i) => {
              return (
                <Table.Summary.Cell key={k}>
                  <div style={{ textAlign: align || 'right' }}>
                    <Text
                      className={
                        sumClassName ? sumClassName[i] : 'text-primary'
                      }
                    >
                      {numeral(sumObj[k]).format(noDecimal ? '0,0' : '0,0.00')}
                    </Text>
                  </div>
                </Table.Summary.Cell>
              );
            })
          )
        ) : (
          <Table.Summary.Cell>
            <div style={{ textAlign: align || 'right' }}>
              <Text className="text-primary">
                {numeral(total).format(noDecimal ? '0,0' : '0,0.00')}
              </Text>
            </div>
          </Table.Summary.Cell>
        )}
        {!sumKeys && startAt + 3 < dataLength && (
          <Table.Summary.Cell>บาท</Table.Summary.Cell>
        )}
      </Table.Summary.Row>
    </>
  );
};

export const getRules = (rules) => {
  const requiredRule = [{ required: true, message: 'กรุณาป้อนข้อมูล' }];
  const numberRule = [
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || !isNaN(value)) {
          return Promise.resolve();
        }

        return Promise.reject('กรุณาป้อนตัวเลข');
      },
    }),
  ];
  const mobileNumberRule = [
    () => ({
      validator(rule, value) {
        if (!value) {
          return Promise.resolve();
        }
        if (isMobileNumber(value)) {
          return Promise.resolve();
        }

        return Promise.reject('กรุณาตรวจสอบ เบอร์โทรศัพท์');
      },
    }),
  ];

  let result = [];

  rules.forEach((rule) => {
    switch (rule) {
      case 'required':
        result = result.concat(requiredRule);
        break;
      case 'number':
        result = result.concat(numberRule);
        break;
      case 'mobileNumber':
        result = result.concat(mobileNumberRule);
        break;

      default:
        break;
    }
  });

  return result;
};

export const getRulesFromColumn = (col) => {
  const { required, number } = col;
  if (required && number) {
    return [
      { required: true, message: 'กรุณาป้อนข้อมูล' },
      ({ getFieldValue }) => ({
        validator(rule, value) {
          if (!value || !isNaN(value)) {
            return Promise.resolve();
          }

          return Promise.reject('กรุณาป้อนตัวเลข');
        },
      }),
    ];
  } else if (required) {
    return [{ required: true, message: 'กรุณาป้อนข้อมูล' }];
  } else if (number) {
    return [
      ({ getFieldValue }) => ({
        validator(rule, value) {
          if (!value || !isNaN(value)) {
            return Promise.resolve();
          }

          return Promise.reject('กรุณาป้อนตัวเลข');
        },
      }),
    ];
  } else return undefined;
};

export const getIndexFromColumns = (columns) => {
  // Get dataIndex (labels) from max 5 children layers.
  let result = [];
  columns.map((k, i) => {
    if (!!k.children) {
      k.children.map((kk, ii) => {
        if (!!kk.children) {
          kk.children.map((kkk, iii) => {
            if (!!kkk.children) {
              kkk.children.map((kkkk, iiii) => {
                if (!!kkkk.children) {
                  kkkk.children.map((kkkkk, iiiii) => {
                    result.push(kkkkk.dataIndex);
                    return kkkkk;
                  });
                } else {
                  result.push(kkkk.dataIndex);
                }
                return kkkk;
              });
            } else {
              result.push(kkk.dataIndex);
            }
            return kkk;
          });
        } else {
          result.push(kk.dataIndex);
        }
        return kk;
      });
    } else {
      result.push(k.dataIndex);
    }
    return k;
  });
  return result;
};
