import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Form } from 'antd';
import { ROW_GUTTER } from 'constants/Styles';
import DatePicker from 'ui/elements/DatePicker';

const PageTitle = ({
  title,
  subtitle,
  editing,
  hasDuration,
  hasAllDate,
  defaultDuration,
  ...attrs
}) => {
  return (
    <Row gutter={ROW_GUTTER}>
      <Col sm={12} span={24} className="text-center sm:text-left" {...attrs}>
        <span className="text-slate-500 ">{subtitle}</span>
        <h3 className="text-tw-black text-2xl">{title}</h3>
      </Col>
      <Col sm={12} span={24} className="text-center sm:text-left" {...attrs}>
        <Form.Item name="date">
          <DatePicker />
        </Form.Item>
      </Col>
    </Row>
  );
};

PageTitle.propTypes = {
  /**
   * The page title.
   */
  title: PropTypes.string,
  /**
   * The page subtitle.
   */
  subtitle: PropTypes.string,
};

export default PageTitle;
