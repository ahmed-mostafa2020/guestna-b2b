import { useTranslations } from "next-intl";

const TransferMethodSelector = ({ transferMethod, setTransferMethod }) => {
  const t = useTranslations("profile.myWallet.withdrawPage.transferMethod");

  return (
    <div className="mb-8 pb-6 border-gray-200">
      <h3 className="text-xl font-medium mb-6 text-center sm:text-start">
        {t("title")}
      </h3>
      <div className="flex flex-col gap-4 mt-4">
        <label
          className={`flex items-center space-x-3 cursor-pointer p-4 border-2 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
            transferMethod === "stc"
              ? "border-green-500 bg-green-50 shadow-md"
              : "border-gray-200 hover:border-green-300"
          }`}
        >
          <input
            type="radio"
            name="transferMethod"
            value="stc"
            checked={transferMethod === "stc"}
            onChange={(e) => setTransferMethod(e.target.value)}
            className="w-5 h-5 me-2 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 checked:bg-green-600 checked:border-green-600"
            id="transfer-method-stc"
          />
          <div className="text-start flex-1">
            <span className="text-gray-900 font-medium text-base block mb-1">
              {t("stcPay.title")}
            </span>
            <span className="text-gray-600 text-xs">
              {t("stcPay.description")}
            </span>
          </div>
        </label>

        <label
          className={`flex items-center space-x-3 cursor-pointer p-4 border-2 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
            transferMethod === "bank"
              ? "border-green-500 bg-green-50 shadow-md"
              : "border-gray-200 hover:border-green-300"
          }`}
        >
          <input
            type="radio"
            name="transferMethod"
            value="bank"
            checked={transferMethod === "bank"}
            onChange={(e) => setTransferMethod(e.target.value)}
            className="w-5 h-5 me-2 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 checked:border-green-600"
            id="transfer-method-bank"
          />
          <div className="text-start flex-1">
            <span className="text-gray-900 font-medium text-base block mb-1">
              {t("bankTransfer.title")}
            </span>
            <span className="text-gray-600 text-xs">
              {t("bankTransfer.description")}
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default TransferMethodSelector;
