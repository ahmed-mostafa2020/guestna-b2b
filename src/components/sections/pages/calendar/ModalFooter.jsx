"use client";

const ModalFooter = ({
  onCancel,
  onConfirm,
  cancelText = "إلغاء",
  confirmText = "تأكيد",
  isLoading = false,
  confirmDisabled = false,
  isForm = false,
}) => {
  return (
    <div className="p-6 border-t border-gray-200">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
        >
          {cancelText}
        </button>
        <button
          type={isForm ? "submit" : "button"}
          onClick={!isForm ? onConfirm : undefined}
          disabled={confirmDisabled || isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              جاري التحميل...
            </div>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </div>
  );
};

export default ModalFooter;
