import { isRejectedWithValue } from '@reduxjs/toolkit';
import { notificationController } from 'controllers/notificationController';

/**
 * Log a warning and show a toast!
 */
export const errorLoggingMiddleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    notificationController.error({ message: action.payload });
  }

  return next(action);
};
