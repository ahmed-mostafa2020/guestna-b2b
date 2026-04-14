import Link from "next/link";

const NotFound = () => {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "160px",
              fontWeight: "bold",
              color: "#384250",
              margin: 0,
              lineHeight: 1,
            }}
          >
            404
          </h1>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#161616",
              margin: 0,
            }}
          >
            حدث خطأ ما
          </p>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#161616",
              margin: 0,
            }}
          >
            عذراً، الصفحة التي تبحث عنها غير موجودة
          </p>
          <Link
            href="/ar"
            replace={true}
            style={{
              padding: "12px 32px",
              backgroundColor: "#1a56db",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            العودة للرئيسية
          </Link>
        </div>
      </body>
    </html>
  );
};

export default NotFound;
