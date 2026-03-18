// Device detection utilities

export const isIOS = () => {
  const ua = navigator.userAgent;
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  if (isSafari) return isSafari;
  return /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
};

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

export const isSafari = () => {
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome/.test(ua);
};
