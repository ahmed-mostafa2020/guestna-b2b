"use client";

import { useState } from "react";
import { bookingConfirmationHTML } from "./templates/booking-confirmation";
import { walletWithdrawalHTML } from "./templates/wallet-withdrawal";
import { tripRequestHTML } from "./templates/trip-request";
import { invoiceHTML } from "./templates/invoice";
import { tripReminderHTML } from "./templates/trip-reminder";
import { quoteProposalHTML } from "./templates/quote-proposal";
import { tripLimitHTML } from "./templates/trip-limit";
import { tripRejectHTML } from "./templates/trip-reject";
import { withdrawalAmountEditedHTML } from "./templates/withdrawal-amount-edited";
import { withdrawalConfirmingHTML } from "./templates/withdrawal-confirming";
import { withdrawalInvoiceHTML } from "./templates/withdrawal-invoice";
import { clientTripActionHTML } from "./templates/client-trip-action";
import { tripProcessingHTML } from "./templates/trip-processing";
import { quoteRequestHTML } from "./templates/quote-request";
import { addB2bUserHTML } from "./templates/add-b2b-user";
import { newAccountHTML } from "./templates/new-account";
import { emailConfirmHTML } from "./templates/email-confirm";
import { resetPasswordHTML } from "./templates/reset-password";
import { maintenanceHTML } from "./templates/maintenance";
import { adminNewUserHTML } from "./templates/admin-new-user";

// ── Categories (mirrors current_emails_templates folder structure) ──
const CATEGORIES = [
  { id: "accounts", label: "الحسابات والمستخدمين", icon: "👤" },
  { id: "trips", label: "الرحلات", icon: "🗺️" },
  { id: "bookings", label: "الحجوزات والعروض", icon: "📅" },
  { id: "withdrawals", label: "المالية والسحوبات", icon: "💰" },
];

const TEMPLATES = [
  // ── Accounts ──
  {
    id: "add-user",
    category: "accounts",
    label: "حساب B2B جديد",
    labelEn: "New B2B Account",
    icon: "🎉",
    subject: "مرحباً! تم إنشاء حسابك في جستنا",
    to: "أ. أحمد مصطفى",
    from: "noreply@guestna.app",
    html: addB2bUserHTML,
  },
  {
    id: "new-account",
    category: "accounts",
    label: "تفعيل الحساب",
    labelEn: "Account Activation",
    icon: "🔐",
    subject: "أكمل إنشاء حسابك — خطوة أخيرة",
    to: "أ. أحمد مصطفى",
    from: "noreply@guestna.app",
    html: newAccountHTML,
  },
  {
    id: "email-confirm",
    category: "accounts",
    label: "تأكيد البريد",
    labelEn: "Email Confirmation",
    icon: "✉️",
    subject: "تأكيد بريدك الإلكتروني — جستنا",
    to: "أ. أحمد مصطفى",
    from: "noreply@guestna.app",
    html: emailConfirmHTML,
  },
  {
    id: "reset-password",
    category: "accounts",
    label: "إعادة كلمة المرور",
    labelEn: "Password Reset",
    icon: "🔑",
    subject: "طلب إعادة تعيين كلمة المرور",
    to: "أ. أحمد مصطفى",
    from: "noreply@guestna.app",
    html: resetPasswordHTML,
  },
  {
    id: "maintenance",
    category: "accounts",
    label: "صيانة النظام",
    labelEn: "System Maintenance",
    icon: "🔧",
    subject: "تنبيه: صيانة مجدولة للنظام",
    to: "جميع المستخدمين",
    from: "system@guestna.app",
    html: maintenanceHTML,
  },
  {
    id: "admin-new-user",
    category: "accounts",
    label: "مؤسسة جديدة",
    labelEn: "New Institution Alert",
    icon: "🏫",
    subject: "تنبيه: انضمام مؤسسة تعليمية جديدة",
    to: "فريق إدارة جستنا",
    from: "system@guestna.app",
    html: adminNewUserHTML,
  },

  // ── Trips ──
  {
    id: "trip-request",
    category: "trips",
    label: "طلب رحلة",
    labelEn: "Trip Request",
    icon: "📋",
    subject: "طلب رحلة مدرسية مخصصة — مختبر الفضاء والتكنولوجيا",
    to: "فريق عمليات جستنا",
    from: "system@guestna-edu.com",
    html: tripRequestHTML,
  },
  {
    id: "trip-processing",
    category: "trips",
    label: "قيد المراجعة",
    labelEn: "Processing",
    icon: "⏳",
    subject: "طلب الرحلة قيد المراجعة والمعالجة",
    to: "مدرسة الأفق العلمي",
    from: "system@guestna.app",
    html: tripProcessingHTML,
  },
  {
    id: "trip-limit",
    category: "trips",
    label: "تجاوز الحد",
    labelEn: "Trip Limit",
    icon: "🚨",
    subject: "طلب زيادة حد الرحلات — م. خالد العتيبي",
    to: "تنبيه النظام",
    from: "system@guestna.app",
    html: tripLimitHTML,
  },
  {
    id: "trip-reject",
    category: "trips",
    label: "رفض الطلب",
    labelEn: "Trip Rejected",
    icon: "❌",
    subject: "تحديث طلب الرحلة: تم رفض الطلب #REQ-2025-0211",
    to: "م. خالد العتيبي",
    from: "support@guestna.app",
    html: tripRejectHTML,
  },
  {
    id: "trip-reminder",
    category: "trips",
    label: "تذكير الرحلة",
    labelEn: "Trip Reminder",
    icon: "⏰",
    subject: "تذكير: رحلتكم غداً الساعة 8:00 ص — جستنا",
    to: "منسق الأنشطة + أولياء الأمور",
    from: "reminders@guestna-edu.com",
    html: tripReminderHTML,
  },
  {
    id: "client-action",
    category: "trips",
    label: "موافقة العميل",
    labelEn: "Client Approved",
    icon: "💚",
    subject: "رد العميل: تمت الموافقة على الرحلة #ORD-5541",
    to: "عمليات جستنا",
    from: "system@guestna.app",
    html: clientTripActionHTML,
  },

  // ── Bookings ──
  {
    id: "booking",
    category: "bookings",
    label: "تأكيد الحجز",
    labelEn: "Booking Confirmation",
    icon: "✅",
    subject: "تأكيد حجز رحلة المزرعة التعليمية — مدرسة النور الدولية",
    to: "منسق الأنشطة — مدرسة النور الدولية",
    from: "noreply@guestna-edu.com",
    html: bookingConfirmationHTML,
  },
  {
    id: "quote-request",
    category: "bookings",
    label: "طلب تسعيرة",
    labelEn: "Quote Request",
    icon: "📨",
    subject: "طلب تسعيرة لرحلة: مختبر الفضاء",
    to: "فريق الإدارة",
    from: "system@guestna.app",
    html: quoteRequestHTML,
  },
  {
    id: "quote",
    category: "bookings",
    label: "عرض السعر",
    labelEn: "Quote Proposal",
    icon: "📑",
    subject: "عرض برنامج رحلة علمية مخصص — مختبر الفضاء #QT-2025-0156",
    to: "م. خالد العتيبي — مدرسة الأفق العلمي",
    from: "proposals@guestna-edu.com",
    html: quoteProposalHTML,
  },
  {
    id: "invoice",
    category: "bookings",
    label: "فاتورة الدفع",
    labelEn: "Payment Invoice",
    icon: "🧾",
    subject: "فاتورة #INV-2025-0742 — رحلة المزرعة التعليمية",
    to: "billing@alnour-school.edu.sa",
    from: "finance@guestna-edu.com",
    html: invoiceHTML,
  },

  // ── Withdrawals ──
  {
    id: "withdrawal",
    category: "withdrawals",
    label: "طلب سحب",
    labelEn: "Wallet Withdrawal",
    icon: "💰",
    subject: "طلب سحب رصيد #WD-2025-0893 — مدرسة النور الدولية",
    to: "فريق العمليات المالية — جستنا",
    from: "finance@guestna-edu.com",
    html: walletWithdrawalHTML,
  },
  {
    id: "withdrawal-edit",
    category: "withdrawals",
    label: "تعديل مبلغ",
    labelEn: "Amount Edited",
    icon: "✏️",
    subject: "تم تحديث مبلغ السحب لطلبك",
    to: "المحاسب المالي المدرسة",
    from: "finance@guestna.app",
    html: withdrawalAmountEditedHTML,
  },
  {
    id: "withdrawal-confirm",
    category: "withdrawals",
    label: "تأكيد التحويل",
    labelEn: "Transfer Confirmed",
    icon: "✅",
    subject: "تم تأكيد ومعالجة طلب السحب #WD-8842",
    to: "مدرسة النور الدولية",
    from: "finance@guestna.app",
    html: withdrawalConfirmingHTML,
  },
  {
    id: "withdrawal-invoice",
    category: "withdrawals",
    label: "إيصال السحب",
    labelEn: "Withdrawal Receipt",
    icon: "💸",
    subject: "إيصال سحب الأرباح — مدرسة النور الدولية",
    to: "billing@alnour.edu.sa",
    from: "finance@guestna.app",
    html: withdrawalInvoiceHTML,
  },
];

export default function EmailTemplatesPage() {
  const [active, setActive] = useState("booking");
  const [copied, setCopied] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(900);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(() => {
    const first = TEMPLATES.find((t) => t.id === "booking");
    return first?.category ?? "accounts";
  });
  const current = TEMPLATES.find((t) => t.id === active);

  function handleCopy() {
    navigator.clipboard.writeText(current.html).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <style>{`
        .et-page {
          min-height: 100vh;
          background-color: #f0f4f4;
          font-family: 'IBM Plex Sans Arabic', Arial, sans-serif;
        }

        /* ── Top Bar ── */
        .et-topbar {
          background-color: #008F8F;
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #007a7a;
        }
        .et-topbar-badge {
          background-color: rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 6px 14px;
        }

        /* ── Body ── */
        .et-body {
          display: flex;
          gap: 20px;
          padding: 24px 32px;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* ── Sidebar ── */
        .et-sidebar {
          width: 268px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .et-sidebar-toggle {
          display: none;
        }

        /* ── Preview ── */
        .et-preview {
          flex: 1;
          min-width: 0;
        }

        /* ── Category Section ── */
        .et-cat-header {
          display: flex;
          align-items: center;
          padding: 8px 14px 8px 18px;
          background: #f8fafb;
          border-bottom: 1px solid #e8ecec;
          gap: 8px;
        }
        .et-cat-header:first-child { border-top: none; }
        .et-cat-header.active-cat { background: #f0f7f7; border-right: 3px solid #008F8F; }
        .et-template-btn {
          border: none;
          background: none;
          cursor: pointer;
          transition: background 0.12s;
        }
        .et-template-btn:hover { background: #f8fbfc !important; }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .et-topbar {
            padding: 14px 16px;
            flex-wrap: wrap;
            gap: 8px;
          }
          .et-topbar-badge { display: none; }
          .et-body {
            flex-direction: column;
            padding: 16px;
            gap: 16px;
          }
          .et-sidebar {
            width: 100%;
            order: 2;
            display: none;
          }
          .et-sidebar.open { display: flex; }
          .et-sidebar-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 11px 16px;
            background-color: #ffffff;
            border: 1px solid #e0e8e8;
            border-radius: 8px;
            cursor: pointer;
            font-family: inherit;
            font-size: 15px;
            font-weight: 600;
            color: #008F8F;
            order: 3;
          }
          .et-preview { order: 1; }
        }
      `}</style>

      <div className="et-page">
        {/* ── Top Bar ── */}
        <div className="et-topbar">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700 }}
              >
                Guestna B2B
              </span>
              <span
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  padding: "2px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                Email Templates
              </span>
            </div>
            <p
              style={{
                margin: "3px 0 0",
                color: "rgba(255,255,255,0.65)",
                fontSize: "12px",
              }}
            >
              معاينة قوالب البريد الإلكتروني — {TEMPLATES.length} قالب جاهز
            </p>
          </div>
          <div className="et-topbar-badge">
            <span style={{ color: "#fff", fontSize: "11px" }}>
              lifecycle: طلب ← عرض ← حجز ← فاتورة ← تذكير
            </span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="et-body">
          {/* ── Preview Panel ── */}
          <div className="et-preview">
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #e0e8e8",
                boxShadow: "0 2px 16px rgba(0,143,143,0.07)",
              }}
            >
              {/* macOS chrome */}
              <div
                style={{
                  backgroundColor: "#f0f0f0",
                  padding: "10px 16px",
                  borderBottom: "1px solid #ddd",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", gap: "5px" }}>
                  <div
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      backgroundColor: "#ff5f57",
                    }}
                  />
                  <div
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      backgroundColor: "#febc2e",
                    }}
                  />
                  <div
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      backgroundColor: "#28c840",
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    borderRadius: "5px",
                    padding: "4px 12px",
                    fontSize: "11px",
                    color: "#888",
                    border: "1px solid #ddd",
                    fontFamily: "monospace",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {current?.id}.html — Guestna B2B Email Template
                </div>
              </div>

              {/* Email client header */}
              <div
                style={{
                  backgroundColor: "#fafafa",
                  padding: "12px 16px",
                  borderBottom: "1px solid #eee",
                }}
              >
                {[
                  { k: "من", v: `Guestna <${current?.from}>` },
                  { k: "إلى", v: current?.to },
                  { k: "الموضوع", v: current?.subject },
                ].map((r) => (
                  <div
                    key={r.k}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "4px",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        color: "#bbb",
                        fontSize: "11px",
                        fontWeight: 700,
                        minWidth: "52px",
                        flexShrink: 0,
                      }}
                    >
                      {r.k}:
                    </span>
                    <span
                      style={{
                        color: r.k === "الموضوع" ? "#1a1a1a" : "#555",
                        fontSize: "12px",
                        fontWeight: r.k === "الموضوع" ? 600 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.v}
                    </span>
                  </div>
                ))}
              </div>

              {/* Iframe */}
              <iframe
                key={active}
                srcDoc={current?.html}
                style={{
                  width: "100%",
                  height: `${iframeHeight}px`,
                  border: "none",
                  display: "block",
                  backgroundColor: "#f0f4f4",
                }}
                title={current?.label}
                onLoad={(e) => {
                  try {
                    const h = e.target.contentDocument?.body?.scrollHeight;
                    if (h && h > 200) setIframeHeight(h + 48);
                  } catch (_) {}
                }}
              />
            </div>
          </div>

          {/* ── Sidebar Toggle (mobile) ── */}
          <button
            className="et-sidebar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <span>عرض القوالب</span>
            <span style={{ fontSize: "16px" }}>{sidebarOpen ? "▲" : "▼"}</span>
          </button>

          {/* ── Sidebar ── */}
          <div className={`et-sidebar${sidebarOpen ? " open" : ""}`}>
            {/* Template List — grouped by category */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                border: "1px solid #e0e8e8",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "14px 18px",
                  borderBottom: "1px solid #f0f0f0",
                  backgroundColor: "#f8fdfd",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#008F8F",
                    fontSize: "15px",
                    fontWeight: 700,
                  }}
                >
                  قوالب البريد الإلكتروني
                </p>
                <p
                  style={{ margin: "3px 0 0", color: "#666", fontSize: "12px" }}
                >
                  {TEMPLATES.length} قالب — اختر للمعاينة
                </p>
              </div>

              <div
                style={{ overflowY: "auto", maxHeight: "calc(100vh - 220px)" }}
              >
                {CATEGORIES.map((cat, catIdx) => {
                  const catTemplates = TEMPLATES.filter(
                    (t) => t.category === cat.id
                  );
                  const catColors = [
                    "#008F8F",
                    "#ED8A22",
                    "#3B82F6",
                    "#8B5CF6",
                  ];
                  const bgColors = ["#E0F5F5", "#FFF7ED", "#EFF6FF", "#F5F3FF"];
                  const c = catColors[catIdx];
                  const isExpanded = expandedCat === cat.id;
                  const hasActive = catTemplates.some((t) => t.id === active);
                  return (
                    <div key={cat.id}>
                      {/* Category Header - Clickable */}
                      <button
                        className="et-cat-header"
                        onClick={() =>
                          setExpandedCat(isExpanded ? null : cat.id)
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "10px 14px 10px 18px",
                          background: hasActive ? `${c}10` : "#f8fafb",
                          borderBottom: "1px solid #e8ecec",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          textAlign: "right",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              flexShrink: 0,
                              backgroundColor: c,
                            }}
                          />
                          <span style={{ fontSize: "15px" }}>{cat.icon}</span>
                          <span
                            style={{
                              fontSize: "15px",
                              fontWeight: 700,
                              color: hasActive ? c : "#475569",
                              letterSpacing: "0.2px",
                            }}
                          >
                            {cat.label}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            color: c,
                            transform: isExpanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        >
                          ▼
                        </span>
                      </button>

                      {/* Templates - Only show when expanded */}
                      {isExpanded && (
                        <div style={{ borderRight: `2px solid ${c}18` }}>
                          {catTemplates.map((t, tIdx) => (
                            <button
                              key={t.id}
                              className="et-template-btn"
                              onClick={() => {
                                setActive(t.id);
                                setSidebarOpen(false);
                              }}
                              style={{
                                width: "100%",
                                padding: "10px 16px 10px 12px",
                                border: "none",
                                borderRight:
                                  active === t.id
                                    ? `3px solid ${c}`
                                    : "3px solid transparent",
                                background:
                                  active === t.id ? bgColors[catIdx] : "none",
                                cursor: "pointer",
                                textAlign: "right",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                fontFamily: "inherit",
                                transition: "all 0.12s",
                                borderBottom:
                                  tIdx < catTemplates.length - 1
                                    ? "1px solid #F8FAFC"
                                    : "none",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "15px",
                                  width: "20px",
                                  flexShrink: 0,
                                  textAlign: "center",
                                  opacity: active === t.id ? 1 : 0.65,
                                }}
                              >
                                {t.icon}
                              </span>
                              <span
                                style={{
                                  color: active === t.id ? c : "#334155",
                                  fontSize: "15px",
                                  fontWeight: active === t.id ? 700 : 500,
                                  flex: 1,
                                }}
                              >
                                {t.label}
                              </span>
                              {active === t.id && (
                                <div
                                  style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    flexShrink: 0,
                                    backgroundColor: c,
                                  }}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              style={{
                width: "100%",
                padding: "11px",
                backgroundColor: copied ? "#008F8F" : "#ffffff",
                color: copied ? "#ffffff" : "#008F8F",
                border: "1.5px solid #008F8F",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {copied ? "✓ تم نسخ الـ HTML" : "⎘ نسخ HTML"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
