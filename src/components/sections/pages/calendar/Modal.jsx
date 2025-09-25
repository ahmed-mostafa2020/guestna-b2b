"use client";

const Modal = ({ isOpen, onClose, children, maxWidth = "max-w-2xl" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`p-6  bg-white rounded-xl shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
