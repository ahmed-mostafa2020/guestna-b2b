"use client";

const LoadingState = ({ message = "جاري تحميل الأحداث..." }) => {
  return (
    <div className="text-center py-16">
      <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingState;
