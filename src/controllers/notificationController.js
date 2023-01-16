import React from 'react';
import { notification } from 'antd';

const EmptyDescription = () => <div style={{ marginTop: '-12px' }} />;

const openSuccessNotification = (config) => {
  notification.success({
    ...config,
    // icon: <CheckCircleFilled className="success-icon" />,

    message: (
      <div className={`title ${!config.description && `title-only`}`}>
        {config.message}
      </div>
    ),
    description: config.description ? (
      <div className="description">{config.description}</div>
    ) : (
      <EmptyDescription />
    ),
    className: config.description ? '' : 'notification-without-description',
  });
};

const openInfoNotification = (config) => {
  notification.info({
    ...config,
    // icon: <InfoCircleFilled className="info-icon" />,
    message: (
      <div className={`title ${!config.description && `title-only`}`}>
        {config.message}
      </div>
    ),
    description: config.description ? (
      <div className="description">{config.description}</div>
    ) : (
      <EmptyDescription />
    ),
    className: config.description ? '' : 'notification-without-description',
  });
};

const openWarningNotification = (config) => {
  notification.warning({
    ...config,
    // icon: <ExclamationCircleFilled className="warning-icon" />,
    message: (
      <div className={`title ${!config.description && `title-only`}`}>
        {config.message}
      </div>
    ),
    description: config.description ? (
      <div className="description">{config.description}</div>
    ) : (
      <EmptyDescription />
    ),
    className: config.description ? '' : 'notification-without-description',
  });
};

const openErrorNotification = (config) => {
  notification.error({
    ...config,
    // icon: <StopFilled className="error-icon" />,
    message: (
      <div className={`title ${!config.description && `title-only`}`}>
        {config.message}
      </div>
    ),
    description: config.description ? (
      <div className="description">{config.description}</div>
    ) : (
      <EmptyDescription />
    ),
    className: config.description ? '' : 'notification-without-description',
  });
};

export const notificationController = {
  success: openSuccessNotification,
  info: openInfoNotification,
  warning: openWarningNotification,
  error: openErrorNotification,
};
