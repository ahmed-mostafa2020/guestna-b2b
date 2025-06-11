"use client";

import { memo } from "react";

const Dialog = ({
  header,
  title,
  content,
  children,
  cancelButton,
  confirmButton,
  handleClose,
  handleConfirm,
}) => {
  return (
    <section className="h-[94%] mx-auto centered max-w-[570px]">
      <div className="w-full bg-white rounded-2xl ">
        <h2 className="px-4 py-6 text-xl font-semibold text-center text-black border-b border-black">
          {header}
        </h2>

        <div className="px-4 py-8">
          {title && (
            <h3 className="text-xl font-semibold text-black">{title}</h3>
          )}

          {content && <h4 className="text-lg text-textLight ">{content}</h4>}

          {children && children}

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
        </div>
      </div>
    </section>
  );
};

export default memo(Dialog);
