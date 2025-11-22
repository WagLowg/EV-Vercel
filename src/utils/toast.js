// Toast utility for components that can't use hooks directly
// Import this in your component and use the functions

let toastInstance = null;

export const setToastInstance = (toast) => {
  toastInstance = toast;
};

export const showSuccess = (message, duration) => {
  if (toastInstance) {
    toastInstance.showSuccess(message, duration);
  } else {
    alert(message);
  }
};

export const showError = (message, duration) => {
  if (toastInstance) {
    toastInstance.showError(message, duration);
  } else {
    alert(message);
  }
};

export const showWarning = (message, duration) => {
  if (toastInstance) {
    toastInstance.showWarning(message, duration);
  } else {
    alert(message);
  }
};

export const showInfo = (message, duration) => {
  if (toastInstance) {
    toastInstance.showInfo(message, duration);
  } else {
    alert(message);
  }
};

// For backward compatibility
export const toast = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
};

