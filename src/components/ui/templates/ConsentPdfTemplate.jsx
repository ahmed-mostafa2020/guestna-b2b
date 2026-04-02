const ConsentPdfTemplate = ({ consentRef, pdfStudent, booking, locale, t }) => {
  return (
    <div
      style={{
        position: "fixed",

        left: "-9999px",

        top: 0,

        zIndex: -1,
      }}
    >
      <div
        ref={consentRef}
        style={{
          width: "794px",

          padding: "40px",

          backgroundColor: "#ffffff",

          fontFamily: "Arial, sans-serif",

          direction: locale === "ar" ? "rtl" : "ltr",

          textAlign: locale === "ar" ? "right" : "left",
        }}
      >
        {/* Header */}

        <div
          style={{
            borderBottom: "3px solid #007473",

            paddingBottom: "16px",

            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "24px",

              fontWeight: "bold",

              color: "#007473",

              margin: 0,

              textAlign: locale === "ar" ? "right" : "left",
            }}
          >
            {t("profile.tables.orders.studentsTable.consentPdf.title")}
          </h1>
        </div>

        {/* Student & Parent Info */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns: "1fr 1fr",

            gap: "16px",

            marginBottom: "24px",

            border: "1px solid #e5e7eb",

            borderRadius: "8px",

            padding: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12px",

                color: "#6b7280",

                margin: "0 0 4px 0",
              }}
            >
              {t(
                "profile.tables.orders.studentsTable.consentPdf.studentName"
              )}
            </p>

            <p
              style={{
                fontSize: "16px",

                fontWeight: "600",

                margin: 0,
              }}
            >
              {pdfStudent.child?.name || "-"}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: "12px",

                color: "#6b7280",

                margin: "0 0 4px 0",
              }}
            >
              {t(
                "profile.tables.orders.studentsTable.consentPdf.nationalId"
              )}
            </p>

            <p
              style={{
                fontSize: "16px",

                fontWeight: "600",

                margin: 0,
              }}
            >
              {pdfStudent.child?.nationalId || "-"}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: "12px",

                color: "#6b7280",

                margin: "0 0 4px 0",
              }}
            >
              {t(
                "profile.tables.orders.studentsTable.consentPdf.parentName"
              )}
            </p>

            <p
              style={{
                fontSize: "16px",

                fontWeight: "600",

                margin: 0,
              }}
            >
              {pdfStudent.parent?.name || "-"}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: "12px",

                color: "#6b7280",

                margin: "0 0 4px 0",
              }}
            >
              {t("profile.tables.orders.studentsTable.consentPdf.tripName")}
            </p>

            <p
              style={{
                fontSize: "16px",

                fontWeight: "600",

                margin: 0,
              }}
            >
              {booking?.name || "-"}
            </p>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <p
              style={{
                fontSize: "12px",

                color: "#6b7280",

                margin: "0 0 4px 0",
              }}
            >
              {t(
                "profile.tables.orders.studentsTable.consentPdf.schoolName"
              )}
            </p>

            <p
              style={{
                fontSize: "16px",

                fontWeight: "600",

                margin: 0,
              }}
            >
              {booking?.organization?.name || "-"}
            </p>
          </div>
        </div>

        {/* Terms & Conditions */}

        {pdfStudent.parent?.termsAndCondition?.contents?.length > 0 && (
          <div
            style={{
              border: "1px solid #e5e7eb",

              borderRadius: "8px",

              padding: "16px",

              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",

                fontWeight: "bold",

                color: "#007473",

                marginBottom: "16px",

                marginTop: 0,
              }}
            >
              {t(
                "profile.tables.orders.studentsTable.consentPdf.termsTitle"
              )}
            </h3>

            {pdfStudent.parent.termsAndCondition.contents.map(
              (term, index) => (
                <div key={index} style={{ marginBottom: "12px" }}>
                  <h4
                    style={{
                      fontSize: "14px",

                      fontWeight: "600",

                      margin: "0 0 4px 0",

                      color: "#1f2937",
                    }}
                  >
                    {index + 1}. {term.title}
                  </h4>

                  <p
                    style={{
                      fontSize: "13px",

                      color: "#4b5563",

                      margin: 0,

                      lineHeight: "1.6",

                      textAlign: locale === "ar" ? "right" : "left",
                    }}
                  >
                    {term.content}
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* Confirmation */}

        {pdfStudent.parent?.termsAccepted && (
          <div
            style={{
              backgroundColor: "#f0fdf4",

              border: "1px solid #bbf7d0",

              borderRadius: "8px",

              padding: "16px",

              display: "flex",

              alignItems: "center",

              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "20px",
              }}
            >
              ✓
            </span>

            <div>
              <p
                style={{
                  fontSize: "14px",

                  fontWeight: "600",

                  color: "#166534",

                  margin: 0,

                  textAlign: locale === "ar" ? "right" : "left",
                }}
              >
                {t(
                  "profile.tables.orders.studentsTable.consentPdf.parentSignature"
                )}
              </p>

              <p
                style={{
                  fontSize: "13px",

                  color: "#15803d",

                  margin: "4px 0 0 0",

                  textAlign: locale === "ar" ? "right" : "left",
                }}
              >
                {pdfStudent.parent?.name} -{" "}
                {t(
                  "profile.tables.orders.studentsTable.consentPdf.confirmed"
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentPdfTemplate;
