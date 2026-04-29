export default function MaintenancePage({ locale = "ar" }) {
  const isAr = locale === "ar";

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-white to-[#e8f4f0] flex items-center justify-center px-4"
    >
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1a9e6e] to-[#0d7a54] flex items-center justify-center shadow-lg shadow-[#1a9e6e]/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                />
              </svg>
            </div>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#1a9e6e]/20 animate-ping" />
          </div>
        </div>

        {/* Guestna wordmark */}
        <p className="text-sm font-semibold tracking-widest uppercase text-[#1a9e6e] mb-3">
          Guestna
        </p>

        {/* Headline */}
        <h1 className="text-3xl font-bold text-gray-800 pb-4 leading-snug">
          {isAr ? "نعمل على تحديث المنصة" : "We're Updating the Platform"}
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 pb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#1a9e6e]/40" />
          <div className="w-2 h-2 rounded-full bg-[#1a9e6e]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#1a9e6e]/40" />
        </div>

        {/* Body */}
        <p className="text-gray-600 text-base leading-relaxed pb-8">
          {isAr
            ? "الرحلات التعليمية غير متاحة مؤقتاً بسبب عمليات الصيانة والتطوير المستمرة. نعمل بجد لنقدم لك تجربة أفضل."
            : "Educational trips are temporarily unavailable due to ongoing maintenance and improvements. We're working hard to deliver you a better experience."}
        </p>

        {/* Time card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-5 mb-8 flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p
            className={`text-gray-700 text-sm leading-relaxed ${isAr ? "text-right" : "text-left"}`}
          >
            {isAr
              ? "يُرجى العودة خلال نصف ساعة — سيكون كل شيء جاهزاً لاستقبالك بشكل أفضل."
              : "Please visit again in about 30 minutes — everything will be ready to serve you better."}
          </p>
        </div>

        {/* Friendly closing */}
        <p className="text-[#1a9e6e] font-semibold text-base">
          {isAr
            ? "نسعد دائماً بخدمتكم 🌿"
            : "We're always happy to serve you 🌿"}
        </p>
      </div>
    </div>
  );
}
