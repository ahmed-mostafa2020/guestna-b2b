"use client";

import { useState } from "react";
import { bookingConfirmationHTML } from "./templates/booking-confirmation";
import { walletWithdrawalHTML } from "./templates/wallet-withdrawal";
import { tripRequestHTML } from "./templates/trip-request";
import { invoiceHTML } from "./templates/invoice";
import { tripReminderHTML } from "./templates/trip-reminder";
import { quoteProposalHTML } from "./templates/quote-proposal";

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

        {/* ── Tabs ── */}
        <div className="et-tabs">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className="et-tab-btn"
              style={{
                color: active === t.id ? "#008F8F" : "#666",
                borderBottom: active === t.id ? "3px solid #008F8F" : "3px solid transparent",
                marginBottom: "-2px",
              }}
            >
              <span style={{ display: "block", fontSize: "13px", fontWeight: active === t.id ? 700 : 400 }}>
                {t.icon} {t.label}
              </span>
              <span style={{ display: "block", fontSize: "10px", color: "#aaa", fontFamily: "sans-serif" }}>
                {t.labelEn}
              </span>
            </button>
          ))}
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
            <span>بيانات الإرسال والخيارات</span>
            <span style={{ fontSize: "16px" }}>{sidebarOpen ? "▲" : "▼"}</span>
          </button>

          {/* ── Sidebar ── */}
          <div className={`et-sidebar${sidebarOpen ? " open" : ""}`}>

            {/* Email Meta */}
            <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e0e8e8", overflow: "hidden" }}>
              <div style={{ backgroundColor: "#008F8F", padding: "10px 14px" }}>
                <p style={{ margin: 0, color: "#fff", fontSize: "12px", fontWeight: 700 }}>بيانات الإرسال</p>
              </div>
              <div style={{ padding: "14px" }}>
                {[
                  { label: "من", value: current?.from },
                  { label: "إلى", value: current?.to },
                  { label: "الموضوع", value: current?.subject },
                ].map((row) => (
                  <div key={row.label} style={{ marginBottom: "10px" }}>
                    <p style={{ margin: "0 0 2px", color: "#aaa", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {row.label}
                    </p>
                    <p style={{ margin: 0, color: "#1a1a1a", fontSize: "12px", lineHeight: 1.5, wordBreak: "break-word" }}>
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Colors */}
            <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e0e8e8", padding: "14px" }}>
              <p style={{ margin: "0 0 10px", color: "#333", fontSize: "12px", fontWeight: 700 }}>Brand Colors</p>
              {[
                { hex: "#008F8F", label: "Primary", sub: "Trust / Headers" },
                { hex: "#ED8A22", label: "Secondary", sub: "CTAs / Alerts" },
                { hex: "#006e6e", label: "Dark Teal", sub: "Footer" },
              ].map((c) => (
                <div key={c.hex} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ width: "28px", height: "28px", backgroundColor: c.hex, borderRadius: "6px", flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, color: "#1a1a1a", fontSize: "11px", fontWeight: 700, fontFamily: "monospace" }}>{c.hex}</p>
                    <p style={{ margin: 0, color: "#999", fontSize: "10px" }}>{c.label} — {c.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Template Flow */}
            <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e0e8e8", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>
                <p style={{ margin: 0, color: "#333", fontSize: "12px", fontWeight: 700 }}>مسار الرحلة</p>
              </div>
              <div style={{ padding: "10px 0" }}>
                {FLOW_ORDER.map((id, index) => {
                  const t = TEMPLATES.find((x) => x.id === id);
                  if (!t) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => { setActive(id); setSidebarOpen(false); }}
                      style={{
                        width: "100%",
                        padding: "8px 14px",
                        border: "none",
                        background: active === id ? "#e6f5f5" : "none",
                        cursor: "pointer",
                        textAlign: "right",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontFamily: "inherit",
                      }}
                    >
                      <span style={{ color: "#ccc", fontSize: "10px", minWidth: "14px", fontFamily: "monospace" }}>{index + 1}</span>
                      <span style={{ fontSize: "13px" }}>{t.icon}</span>
                      <span style={{ color: active === id ? "#008F8F" : "#444", fontSize: "12px", fontWeight: active === id ? 700 : 400 }}>
                        {t.label}
                      </span>
                    </button>
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
