"use client";

import { useLocale } from "next-intl";

import { memo } from "react";

import { backIcon } from "@assets/svg";

const Dialog = ({
  header,
  title,
  content,
  children,
  cancelButton,
  confirmButton,
  handleClose,
  handleConfirm,

  closeDialogButton = false,
  width,
}) => {
  const locale = useLocale();

  return (
    <section
      className={`max-h-[80%] mx-auto centered ${
        width ? width : "max-w-[570px]"
      }`}
    >
      <div className="w-full m-auto bg-white rounded-2xl">
        <div className="relative">
          {header && (
            <h2 className="px-4 py-6 text-xl font-semibold text-center text-black border-b border-black">
              {header}
            </h2>
          )}
          {closeDialogButton && (
            <button
              onClick={handleClose}
              className="absolute -translate-y-1/2 top-1/2 start-5"
            >
              <span
                className={`${locale !== "ar" && "rotate-180 inline-block"}`}
              >
                {backIcon}
              </span>
            </button>
          )}
        </div>

        <div className="lg:p-8 p-4">
          {/* px-4 py-8 */}
          {title && (
            <h3 className="text-xl font-semibold text-black">{title}</h3>
          )}

          {content && <h4 className="text-lg text-textLight ">{content}</h4>}

          {children && children}

          {handleClose && handleConfirm && (
            <div className="w-full gap-4 mt-8 centered">
              <button
                onClick={handleClose}
                className="flex-1 px-8 py-3 font-semibold transition-all duration-200 ease-in-out bg-white border-2 rounded-lg border-mainColor hover:text-white hover:bg-linksHover hover:border-linksHover"
              >
                {cancelButton}
              </button>

              <button
                onClick={handleConfirm}
                className="flex-1 px-8 py-3 font-semibold text-white transition-all duration-200 ease-in-out border-2 rounded-lg bg-mainColor border-mainColor hover:bg-linksHover hover:border-linksHover"
              >
                {confirmButton}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(Dialog);
