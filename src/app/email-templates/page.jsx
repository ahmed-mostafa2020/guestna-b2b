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

const TEMPLATES = [
  {
    id: "booking",
    label: "تأكيد الحجز",
    labelEn: "Booking Confirmation",
    icon: "✅",
    subject: "تأكيد حجز رحلة المزرعة التعليمية — مدرسة النور الدولية",
    to: "منسق الأنشطة — مدرسة النور الدولية",
    from: "noreply@guestna-edu.com",
    html: bookingConfirmationHTML,
  },
  {
    id: "invoice",
    label: "فاتورة الدفع",
    labelEn: "Payment Invoice",
    icon: "🧾",
    subject: "فاتورة #INV-2025-0742 — رحلة المزرعة التعليمية",
    to: "billing@alnour-school.edu.sa",
    from: "finance@guestna-edu.com",
    html: invoiceHTML,
  },
  {
    id: "trip-reminder",
    label: "تذكير الرحلة",
    labelEn: "Trip Reminder",
    icon: "⏰",
    subject: "تذكير: رحلتكم غداً الساعة 8:00 ص — جستنا",
    to: "منسق الأنشطة + أولياء الأمور",
    from: "reminders@guestna-edu.com",
    html: tripReminderHTML,
  },
  {
    id: "quote",
    label: "عرض السعر",
    labelEn: "Quote Proposal",
    icon: "📑",
    subject: "عرض برنامج رحلة علمية مخصص — مختبر الفضاء #QT-2025-0156",
    to: "م. خالد العتيبي — مدرسة الأفق العلمي",
    from: "proposals@guestna-edu.com",
    html: quoteProposalHTML,
  },
  {
    id: "trip-request",
    label: "طلب رحلة",
    labelEn: "Trip Request",
    icon: "📋",
    subject: "طلب رحلة مدرسية مخصصة — مختبر الفضاء والتكنولوجيا",
    to: "فريق عمليات جستنا",
    from: "system@guestna-edu.com",
    html: tripRequestHTML,
  },
  {
    id: "withdrawal",
    label: "سحب المحفظة",
    labelEn: "Wallet Withdrawal",
    icon: "💰",
    subject: "طلب سحب رصيد #WD-2025-0893 — مدرسة النور الدولية",
    to: "فريق العمليات المالية — جستنا",
    from: "finance@guestna-edu.com",
    html: walletWithdrawalHTML,
  },
  {
    id: "trip-limit",
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
    label: "رفض الطلب",
    labelEn: "Trip Reject",
    icon: "❌",
    subject: "تحديث طلب الرحلة: تم رفض الطلب #REQ-2025-0211",
    to: "م. خالد العتيبي",
    from: "support@guestna.app",
    html: tripRejectHTML,
  },
  {
    id: "withdrawal-edit",
    label: "تعديل سحب",
    labelEn: "Withdrawal Edited",
    icon: "✏️",
    subject: "تم وتحديث مبلغ السحب لطلبك",
    to: "المحاسب المالي المدرسة",
    from: "finance@guestna.app",
    html: withdrawalAmountEditedHTML,
  },
  {
    id: "withdrawal-confirm",
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
    label: "فاتورة السحب",
    labelEn: "Withdrawal Invoice",
    icon: "💸",
    subject: "فاتورة سحب للمستفيد: مدرسة النور الدولية",
    to: "billing@alnour.edu.sa",
    from: "finance@guestna.app",
    html: withdrawalInvoiceHTML,
  },
  {
    id: "client-action",
    label: "موافقة العميل",
    labelEn: "Client Approved",
    icon: "💚",
    subject: "رد العميل: تمت الموافقة على الرحلة #ORD-5541",
    to: "عمليات جستنا",
    from: "system@guestna.app",
    html: clientTripActionHTML,
  },
  {
    id: "trip-processing",
    label: "قيد المراجعة",
    labelEn: "Processing",
    icon: "⏳",
    subject: "طلب الرحلة قيد المراجعة والمعالجة",
    to: "مدرسة الأفق العلمي",
    from: "system@guestna.app",
    html: tripProcessingHTML,
  },
  {
    id: "quote-request",
    label: "طلب تسعيرة",
    labelEn: "Quote Request",
    icon: "📨",
    subject: "طلب تسعيرة لرحلة: مختبر الفضاء",
    to: "فريق الإدارة",
    from: "system@guestna.app",
    html: quoteRequestHTML,
  },
  {
    id: "add-user",
    label: "حساب العميل",
    labelEn: "Add Account",
    icon: "🎉",
    subject: "مرحباً! تم إنشاء حسابك في جستنا",
    to: "أ. أحمد مصطفى",
    from: "noreply@guestna.app",
    html: addB2bUserHTML,
  }
];

const FLOW_ORDER = [
  "trip-request",
  "quote",
  "booking",
  "invoice",
  "trip-reminder",
  "withdrawal",
];

export default function EmailTemplatesPage() {
  const [active, setActive] = useState("booking");
  const [copied, setCopied] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        /* ── Tabs ── */
        .et-tabs {
          background-color: #ffffff;
          border-bottom: 2px solid #e0e8e8;
          padding: 0 32px;
          display: flex;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
        }
        .et-tabs::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        .et-tab-btn {
          padding: 14px 22px;
          border: none;
          background: none;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: all 0.15s;
          flex-shrink: 0;
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
          width: 260px;
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

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .et-topbar {
            padding: 14px 16px;
            flex-wrap: wrap;
            gap: 8px;
          }
          .et-topbar-badge {
            display: none;
          }
          .et-tabs {
            padding: 0 16px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .et-tabs::-webkit-scrollbar {
            display: none;
          }
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
          .et-sidebar.open {
            display: flex;
          }
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
            font-size: 13px;
            font-weight: 600;
            color: #008F8F;
            order: 3;
          }
          .et-preview {
            order: 1;
          }
        }
      `}</style>

      <div className="et-page">

        {/* ── Top Bar ── */}
        <div className="et-topbar">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700 }}>
                Guestna B2B
              </span>
              <span style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#fff",
                padding: "2px 10px",
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: 600,
              }}>
                Email Templates
              </span>
            </div>
            <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.65)", fontSize: "12px" }}>
              معاينة قوالب البريد الإلكتروني — {TEMPLATES.length} قوالب جاهزة
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
            <div style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #e0e8e8",
              boxShadow: "0 2px 16px rgba(0,143,143,0.07)",
            }}>
              {/* macOS chrome */}
              <div style={{
                backgroundColor: "#f0f0f0",
                padding: "10px 16px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <div style={{ display: "flex", gap: "5px" }}>
                  <div style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
                  <div style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: "#febc2e" }} />
                  <div style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: "#28c840" }} />
                </div>
                <div style={{
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
                }}>
                  {current?.id}.html — Guestna B2B Email Template
                </div>
              </div>

              {/* Email client header */}
              <div style={{ backgroundColor: "#fafafa", padding: "12px 16px", borderBottom: "1px solid #eee" }}>
                {[
                  { k: "من", v: `Guestna <${current?.from}>` },
                  { k: "إلى", v: current?.to },
                  { k: "الموضوع", v: current?.subject },
                ].map((r) => (
                  <div key={r.k} style={{ display: "flex", gap: "10px", marginBottom: "4px", alignItems: "baseline" }}>
                    <span style={{ color: "#bbb", fontSize: "11px", fontWeight: 700, minWidth: "44px", flexShrink: 0 }}>
                      {r.k}:
                    </span>
                    <span style={{
                      color: r.k === "الموضوع" ? "#1a1a1a" : "#555",
                      fontSize: "12px",
                      fontWeight: r.k === "الموضوع" ? 600 : 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
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

          {/* ── Sidebar Toggle (mobile only) ── */}
          <button
            className="et-sidebar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <span>عرض القوالب</span>
            <span style={{ fontSize: "16px" }}>{sidebarOpen ? "▲" : "▼"}</span>
          </button>

          {/* ── Sidebar ── */}
          <div className={`et-sidebar${sidebarOpen ? " open" : ""}`}>

            {/* Template List */}
            <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e0e8e8", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "16px 18px", borderBottom: "1px solid #f0f0f0", backgroundColor: "#f8fdfd" }}>
                <p style={{ margin: 0, color: "#008F8F", fontSize: "15px", fontWeight: 700 }}>قوالب البريد الإلكتروني</p>
                <p style={{ margin: "4px 0 0", color: "#666", fontSize: "12px" }}>اختر القالب للمعاينة والتعديل</p>
              </div>
              <div style={{ padding: "8px 0", maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setActive(t.id); setSidebarOpen(false); }}
                    style={{
                      width: "100%",
                      padding: "12px 18px",
                      border: "none",
                      borderLeft: active === t.id ? "3px solid #008F8F" : "3px solid transparent",
                      background: active === t.id ? "#f4fafa" : "none",
                      cursor: "pointer",
                      textAlign: "right",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      fontFamily: "inherit",
                      transition: "all 0.2s"
                    }}
                  >
                    <span style={{ fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", width: "24px" }}>{t.icon}</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ color: active === t.id ? "#008F8F" : "#333", fontSize: "14px", fontWeight: active === t.id ? 700 : 500 }}>
                        {t.label}
                      </span>
                      <span style={{ color: "#999", fontSize: "11px", fontFamily: "sans-serif" }}>
                        {t.labelEn}
                      </span>
                    </div>
                  </button>
                ))}
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
