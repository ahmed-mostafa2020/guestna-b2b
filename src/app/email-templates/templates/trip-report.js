export const tripReportHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <base target="_blank" />
  <title>Daily Trip Report — تقرير الرحلة اليومي</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap");
    body { font-family: "Inter", "IBM Plex Sans Arabic", Arial, sans-serif !important; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 28px 20px 24px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .stat-card { width: 100% !important; display: block !important; padding: 0 0 10px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EEF2F7;color:#1E293B;font-family:'Inter','IBM Plex Sans Arabic',Arial,sans-serif;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EEF2F7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="main-table" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td class="header-pad" style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:36px 36px 32px;text-align:center;">
              <img
                src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                alt="GuestNa Logo"
                width="130"
                style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;"
              />
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:5px 18px;font-size:11px;color:#ffffff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">
                Daily Report — تقرير يومي
              </div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:6px;line-height:1.3;">
                📊 Daily Org Trip Report
              </div>
              <div style="font-size:16px;font-weight:600;color:rgba(255,255,255,0.8);margin-bottom:8px;" dir="rtl">
                تقرير الرحلة اليومي
              </div>
              <div style="font-size:13px;color:rgba(255,255,255,0.5);">
                Automated update — تحديث تلقائي
              </div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#ED8A22,#F59E0B,#ED8A22);"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-pad" style="padding:32px 36px;">

              <!-- Trip Info Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#F0FDFA;border:1.5px solid #D0EAEA;border-radius:14px;padding:20px 24px;">
                    <p style="margin:0 0 14px;color:#008F8F;font-size:13px;font-weight:700;">📋 Trip Details / تفاصيل الرحلة</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="width:38%;padding:7px 0;vertical-align:top;">
                          <span style="font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Trip Code / كود الرحلة</span>
                        </td>
                        <td style="padding:7px 0;vertical-align:top;">
                          <span style="font-size:14px;font-weight:700;color:#1E293B;font-family:monospace,sans-serif;background:#E0F5F5;padding:2px 10px;border-radius:6px;">ORD-2024-001</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="width:38%;padding:7px 0;vertical-align:top;">
                          <span style="font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Trip Name / اسم الرحلة</span>
                        </td>
                        <td style="padding:7px 0;vertical-align:top;">
                          <span style="font-size:14px;font-weight:600;color:#008F8F;">Cairo Science Museum Trip</span>
                          <br />
                          <span style="font-size:13px;font-weight:500;color:#64748B;" dir="rtl">رحلة متحف القاهرة للعلوم</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="width:38%;padding:7px 0;vertical-align:top;">
                          <span style="font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Date &amp; Time / التاريخ والوقت</span>
                        </td>
                        <td style="padding:7px 0;vertical-align:top;">
                          <span style="font-size:14px;font-weight:600;color:#1E293B;">Tuesday, June 2, 2026 at <strong style="color:#008F8F;">6:00 AM</strong></span>
                          <br />
                          <span style="font-size:13px;font-weight:500;color:#64748B;" dir="rtl">الثلاثاء، 2 يونيو 2026 — الساعة <strong style="color:#008F8F;">6:00 صباحاً</strong></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Stats Cards -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <!-- Max Capacity -->
                  <td style="width:33%;padding-right:8px;vertical-align:top;" class="stat-card">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:12px;text-align:center;">
                      <tr><td style="padding:18px 10px;">
                        <p style="margin:0 0 6px;font-size:22px;">🪑</p>
                        <p style="margin:0 0 2px;color:#64748B;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Max Capacity</p>
                        <p style="margin:0 0 4px;color:#94A3B8;font-size:10px;" dir="rtl">الحد الأقصى</p>
                        <p style="margin:0;color:#1E293B;font-size:28px;font-weight:700;line-height:1;">40</p>
                      </td></tr>
                    </table>
                  </td>
                  <!-- Bookings -->
                  <td style="width:33%;padding:0 4px;vertical-align:top;" class="stat-card">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F0FDFA;border:1.5px solid #008F8F;border-radius:12px;text-align:center;">
                      <tr><td style="padding:18px 10px;">
                        <p style="margin:0 0 6px;font-size:22px;">✅</p>
                        <p style="margin:0 0 2px;color:#008F8F;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Bookings</p>
                        <p style="margin:0 0 4px;color:#64748B;font-size:10px;" dir="rtl">إجمالي الحجوزات</p>
                        <p style="margin:0;color:#008F8F;font-size:28px;font-weight:700;line-height:1;">27</p>
                      </td></tr>
                    </table>
                  </td>
                  <!-- Remaining -->
                  <td style="width:33%;padding-left:8px;vertical-align:top;" class="stat-card">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F0FDF4;border:1.5px solid #16A34A;border-radius:12px;text-align:center;">
                      <tr><td style="padding:18px 10px;">
                        <p style="margin:0 0 6px;font-size:22px;">🟢</p>
                        <p style="margin:0 0 2px;color:#16A34A;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Remaining</p>
                        <p style="margin:0 0 4px;color:#64748B;font-size:10px;" dir="rtl">المقاعد المتبقية</p>
                        <p style="margin:0;color:#16A34A;font-size:28px;font-weight:700;line-height:1;">13</p>
                      </td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Stats Table (bilingual) -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:28px;">
                <!-- Table Header -->
                <tr style="background:#0A2540;">
                  <td style="padding:11px 20px;font-size:13px;font-weight:700;color:#ffffff;text-align:left;">
                    Metric / المقياس
                  </td>
                  <td style="padding:11px 20px;font-size:13px;font-weight:700;color:#ffffff;text-align:center;">
                    Value / القيمة
                  </td>
                </tr>
                <!-- Row 1 -->
                <tr style="background:#F8FAFC;">
                  <td style="padding:11px 20px;border-bottom:1px solid #F1F5F9;font-size:13px;color:#475569;font-weight:500;">
                    Max Capacity / <span dir="rtl">الحد الأقصى للمقاعد</span>
                  </td>
                  <td style="padding:11px 20px;border-bottom:1px solid #F1F5F9;text-align:center;">
                    <strong style="font-size:15px;color:#1E293B;">40</strong>
                  </td>
                </tr>
                <!-- Row 2 -->
                <tr>
                  <td style="padding:11px 20px;border-bottom:1px solid #F1F5F9;font-size:13px;color:#475569;font-weight:500;">
                    Total Bookings So Far / <span dir="rtl">إجمالي الحجوزات حتى الآن</span>
                  </td>
                  <td style="padding:11px 20px;border-bottom:1px solid #F1F5F9;text-align:center;">
                    <strong style="font-size:15px;color:#008F8F;">27</strong>
                  </td>
                </tr>
                <!-- Row 3 -->
                <tr style="background:#F8FAFC;">
                  <td style="padding:11px 20px;font-size:13px;color:#475569;font-weight:500;">
                    Remaining Seats / <span dir="rtl">المقاعد المتبقية</span>
                  </td>
                  <td style="padding:11px 20px;text-align:center;">
                    <strong style="font-size:15px;color:#16A34A;">13</strong>
                  </td>
                </tr>
              </table>

              <!-- Auto-report Notice (bilingual) -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background:#EFF6FF;border-left:4px solid #3B82F6;border-radius:0 10px 10px 0;padding:14px 18px;">
                    <div style="font-size:12px;color:#3B82F6;font-weight:700;margin-bottom:6px;">ℹ️ Note / ملاحظة</div>
                    <div style="font-size:13px;color:#1E40AF;line-height:1.7;margin-bottom:4px;">
                      This is an automated daily report tracking booking status. No reply is needed.
                    </div>
                    <div style="font-size:13px;color:#1E40AF;line-height:1.7;" dir="rtl">
                      هذا تقرير تلقائي يُرسل يومياً لمتابعة حالة الحجوزات. لا يلزم الرد على هذا البريد.
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-pad" style="background:#0A2540;padding:28px 36px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa" width="90"
                   style="display:block;margin:0 auto 14px;filter:brightness(0) invert(1);opacity:0.85;border:0;" />
              <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.45);">
                <a href="mailto:info@guestna.app" style="color:rgba(255,255,255,0.45);text-decoration:none;">info@guestna.app</a>
                <span style="color:rgba(255,255,255,0.2);margin:0 8px;">|</span>
                <a href="tel:+966547534666" style="color:rgba(255,255,255,0.45);text-decoration:none;display:inline-block;">+966547534666</a>
              </p>
              <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,0.3);">© 2025 GuestNa. All rights reserved.</p>
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);" dir="rtl">جميع الحقوق محفوظة.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
