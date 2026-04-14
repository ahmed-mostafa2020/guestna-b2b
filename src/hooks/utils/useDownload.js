import { useState } from "react";

/**
 * @param {Blob} blob
 * @param {string} title
 */
export const download = async (blob, title) => {
  if (blob) {
    try {
      const fr = new FileReader();
      fr.onloadend = () => {
        const anchor = document.createElement("a");
        anchor.href = fr.result;
        anchor.download = (title ? title : Date.now()) + ".xlsx";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      };
      fr.readAsDataURL(blob);
    } catch (error) {
      throw new Error();
    }
  } else {
    throw new Error();
  }
};

export const isIOS = () => {
  const ua = navigator.userAgent;
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  if (isSafari) return true;
  return /iPad|iPhone|iPod/.test(ua);
};

/**
 * @param {Blob} blob
 * @param {string} url
 * @returns {{ status: string, download: () => Promise<void> }}
 */
const useDownload = (blob, url) => {
  const [status, setStatus] = useState("idle");

  const download = async () => {
    if (url) {
      const proxUrl = url;
      setStatus("downloading");

      try {
        const response = await fetch(proxUrl);
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const blob = await response.blob();

        if (isIOS()) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const newTab = window.open(proxUrl, "_blank");
            if (!newTab) {
              const iframe = document.createElement("iframe");
              iframe.style.display = "none";
              iframe.src = proxUrl;
              document.body.appendChild(iframe);
              setTimeout(() => {
                document.body.removeChild(iframe);
              }, 1000);
            }
            setStatus("downloaded");
          };
          reader.readAsDataURL(blob);
        } else {
          const fr = new FileReader();
          fr.onloadend = () => {
            const anchor = document.createElement("a");
            anchor.href = fr.result;
            anchor.download = Date.now() + ".pdf";
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            setStatus("downloaded");
          };
          fr.readAsDataURL(blob);
        }
      } catch (error) {
        setStatus("error");
      }
    } else {
      setStatus("error");
    }
  };

  return { status, download };
};

export default useDownload;
