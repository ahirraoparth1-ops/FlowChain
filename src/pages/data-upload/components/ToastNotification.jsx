import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ToastNotification = ({ message, type, isVisible, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: 'CheckCircle',
          iconColor: 'var(--color-success)'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: 'XCircle',
          iconColor: 'var(--color-error)'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: 'AlertTriangle',
          iconColor: 'var(--color-warning)'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'Info',
          iconColor: 'var(--color-primary)'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center space-x-3 p-4 rounded-lg border shadow-lg max-w-md ${styles?.bg}`}>
        <Icon name={styles?.icon} size={20} color={styles?.iconColor} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${styles?.text}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${styles?.text} hover:opacity-70 transition-opacity`}
        >
          <Icon name="X" size={16} />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;