import React from 'react';
import { useUI } from '../../context/UIContext';
import Alert from './Alert';

const Notifications = () => {
  const { notifications, removeNotification } = useUI();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          title={notification.title}
          message={notification.message}
          variant={notification.variant || 'info'}
          dismissible={true}
          autoClose={!notification.persistent}
          autoCloseDelay={notification.timeout || 5000}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default Notifications;