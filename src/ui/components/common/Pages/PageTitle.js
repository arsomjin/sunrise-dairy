import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';

const PageTitle = ({ title, subtitle, editing, ...attrs }) => {
  return (
    <Row>
      <Col
        sm={12}
        span={24}
        className="text-center ml-2 sm:text-left"
        {...attrs}
      >
        <span className="text-muted uppercase" style={{ fontSize: 14 }}>
          {subtitle}
        </span>
        <h3 className="text-tw-black text-3xl mt-1">{title}</h3>
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
