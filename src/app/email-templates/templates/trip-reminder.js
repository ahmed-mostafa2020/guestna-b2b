export const tripReminderHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <base target="_blank" />
  <title>Trip Reminder — تذكير الرحلة | GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap");
    body { font-family: "Inter", "IBM Plex Sans Arabic", Arial, sans-serif !important; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 28px 20px 24px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .info-card { width: 100% !important; display: block !important; padding: 0 0 10px !important; }
      .booking-stack { display: block !important; width: 100% !important; text-align: left !important; padding: 8px 0 !important; }
      .emergency-stack { display: block !important; width: 100% !important; padding: 8px 0 !important; }
      .mobile-btn { padding: 14px 28px !important; font-size: 14px !important; }
      td[style*="width:38%"] { display: block !important; width: 100% !important; padding: 10px 18px 2px !important; }
      td[style*="width:38%"] + td { display: block !important; width: 100% !important; padding: 0 18px 12px !important; }
      a[href^="mailto"], a[href^="tel"] { word-break: break-all !important; }
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
                Trip Reminder — تذكير الرحلة
              </div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:6px;line-height:1.3;">
                ⏰ Your Trip is Tomorrow at 8:00 AM
              </div>
              <div style="font-size:16px;font-weight:600;color:rgba(255,255,255,0.8);margin-bottom:8px;" dir="rtl">
                رحلتكم غداً الساعة 8:00 صباحاً
              </div>
              <div style="font-size:13px;color:rgba(255,255,255,0.5);">
                Educational Farm Trip — <span dir="rtl">رحلة المزرعة التعليمية</span>
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

              <!-- Countdown Banner -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#ED8A22,#F59E0B);border-radius:12px;padding:20px;text-align:center;">
                    <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-bottom:6px;">
                      ⏰ Important Reminder — <span dir="rtl">تذكير مهم</span>
                    </div>
                    <div style="font-size:26px;font-weight:700;color:#ffffff;margin-bottom:4px;">Your Trip is Tomorrow</div>
                    <div style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.9);margin-bottom:4px;" dir="rtl">رحلتكم غداً</div>
                    <div style="font-size:14px;color:rgba(255,255,255,0.85);">Tuesday, May 20, 2025 — <span dir="rtl">الثلاثاء، 20 مايو 2025</span></div>
                  </td>
                </tr>
              </table>

              <!-- Quick Info Cards -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <!-- Date -->
                  <td style="width:33%;padding-right:8px;vertical-align:top;" class="info-card">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F0FDFA;border:1.5px solid #D0EAEA;border-radius:12px;text-align:center;">
                      <tr><td style="padding:16px 12px;">
                        <p style="margin:0 0 6px;font-size:22px;">📅</p>
                        <p style="margin:0 0 2px;color:#008F8F;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Date / التاريخ</p>
                        <p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;line-height:1.6;">Tuesday<br />May 20, 2025</p>
                        <p style="margin:4px 0 0;color:#64748B;font-size:11px;" dir="rtl">الثلاثاء<br />20 مايو 2025</p>
                      </td></tr>
                    </table>
                  </td>
                  <!-- Time -->
                  <td style="width:33%;padding:0 4px;vertical-align:top;" class="info-card">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F0FDFA;border:1.5px solid #D0EAEA;border-radius:12px;text-align:center;">
                      <tr><td style="padding:16px 12px;">
                        <p style="margin:0 0 6px;font-size:22px;">🕗</p>
                        <p style="margin:0 0 2px;color:#008F8F;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Departure / الانطلاق</p>
                        <p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;line-height:1.6;">8:00 AM<br />until 2:00 PM</p>
                        <p style="margin:4px 0 0;color:#64748B;font-size:11px;" dir="rtl">8:00 صباحاً<br />حتى 2:00 ظهراً</p>
                      </td></tr>
                    </table>
                  </td>
                  <!-- Meeting Point -->
                  <td style="width:33%;padding-left:8px;vertical-align:top;" class="info-card">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FFF8F0;border:1.5px solid #ED8A22;border-radius:12px;text-align:center;">
                      <tr><td style="padding:16px 12px;">
                        <p style="margin:0 0 6px;font-size:22px;">📍</p>
                        <a href="#" style="margin:0 0 2px;color:#ED8A22;font-size:11px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:0.5px;">Meeting Point / نقطة التجمع</a>
                        <p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;line-height:1.6;">Main School<br />Gate #2</p>
                        <p style="margin:4px 0 0;color:#64748B;font-size:11px;" dir="rtl">بوابة المدرسة<br />الرئيسية رقم 2</p>
                      </td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Booking Reference -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#F0FDFA;border:1.5px solid #D0EAEA;border-radius:14px;padding:20px 24px;">
                    <p style="margin:0 0 14px;color:#008F8F;font-size:13px;font-weight:700;">📋 Booking Details / تفاصيل الحجز</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="width:38%;padding:7px 0;vertical-align:top;">
                          <span style="font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Booking # / رقم الحجز</span>
                        </td>
                        <td style="padding:7px 0;vertical-align:top;">
                          <span style="font-size:14px;font-weight:700;color:#1E293B;font-family:monospace,sans-serif;background:#E0F5F5;padding:2px 10px;border-radius:6px;">#GN-2025-4521</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="width:38%;padding:7px 0;vertical-align:top;">
                          <span style="font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Trip / الرحلة</span>
                        </td>
                        <td style="padding:7px 0;vertical-align:top;">
                          <span style="font-size:14px;font-weight:600;color:#008F8F;">Educational Farm Trip</span>
                          <br />
                          <span style="font-size:13px;font-weight:500;color:#64748B;" dir="rtl">رحلة المزرعة التعليمية</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="width:38%;padding:7px 0;vertical-align:top;">
                          <span style="font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Students / الطلاب</span>
                        </td>
                        <td style="padding:7px 0;vertical-align:top;">
                          <span style="font-size:14px;font-weight:600;color:#1E293B;">Ahmed Mohammed Al-Saeed</span>
                          <br />
                          <span style="font-size:13px;font-weight:500;color:#64748B;" dir="rtl">أحمد محمد السعيد</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Student Checklist -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="background:#0A2540;padding:12px 20px;text-align:left;">
                    <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;">📋 Student Preparation Checklist / قائمة التجهيز للطلاب</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">

                      <tr><td style="padding:6px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                          <td width="30" style="padding-right:8px;vertical-align:top;"><div style="width:22px;height:22px;background:#008F8F;border-radius:5px;text-align:center;line-height:22px;"><span style="color:#fff;font-size:12px;font-weight:700;">✓</span></div></td>
                          <td style="text-align:left;">
                            <p style="margin:0;color:#334155;font-size:14px;">Student ID or school card</p>
                            <p style="margin:2px 0 0;color:#64748B;font-size:12px;" dir="rtl">بطاقة هوية الطالب أو بطاقة المدرسة</p>
                          </td>
                        </tr></table>
                      </td></tr>

                      <tr><td style="padding:6px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                          <td width="30" style="padding-right:8px;vertical-align:top;"><div style="width:22px;height:22px;background:#008F8F;border-radius:5px;text-align:center;line-height:22px;"><span style="color:#fff;font-size:12px;font-weight:700;">✓</span></div></td>
                          <td style="text-align:left;">
                            <p style="margin:0;color:#334155;font-size:14px;">Comfortable clothing suitable for outdoor activities</p>
                            <p style="margin:2px 0 0;color:#64748B;font-size:12px;" dir="rtl">ملابس مريحة ومناسبة للأنشطة الخارجية</p>
                          </td>
                        </tr></table>
                      </td></tr>

                      <tr><td style="padding:6px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                          <td width="30" style="padding-right:8px;vertical-align:top;"><div style="width:22px;height:22px;background:#008F8F;border-radius:5px;text-align:center;line-height:22px;"><span style="color:#fff;font-size:12px;font-weight:700;">✓</span></div></td>
                          <td style="text-align:left;">
                            <p style="margin:0;color:#334155;font-size:14px;">Water bottle (lunch is included)</p>
                            <p style="margin:2px 0 0;color:#64748B;font-size:12px;" dir="rtl">زجاجة ماء (وجبة الغداء مشمولة)</p>
                          </td>
                        </tr></table>
                      </td></tr>

                      <tr><td style="padding:6px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                          <td width="30" style="padding-right:8px;vertical-align:top;"><div style="width:22px;height:22px;background:#008F8F;border-radius:5px;text-align:center;line-height:22px;"><span style="color:#fff;font-size:12px;font-weight:700;">✓</span></div></td>
                          <td style="text-align:left;">
                            <p style="margin:0;color:#334155;font-size:14px;">Notebook and pen for educational notes</p>
                            <p style="margin:2px 0 0;color:#64748B;font-size:12px;" dir="rtl">دفتر وقلم لتدوين الملاحظات التعليمية</p>
                          </td>
                        </tr></table>
                      </td></tr>

                      <tr><td style="padding:6px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                          <td width="30" style="padding-right:8px;vertical-align:top;"><div style="width:22px;height:22px;background:#F1F5F9;border-radius:5px;text-align:center;line-height:22px;"><span style="color:#94A3B8;font-size:12px;font-weight:700;">✗</span></div></td>
                          <td style="text-align:left;">
                            <p style="margin:0;color:#94A3B8;font-size:14px;text-decoration:line-through;">No need to bring a meal — lunch is provided</p>
                            <p style="margin:2px 0 0;color:#CBD5E1;font-size:12px;text-decoration:line-through;" dir="rtl">لا داعي لإحضار وجبة — الغداء مقدَّم</p>
                          </td>
                        </tr></table>
                      </td></tr>

                    </table>
                  </td>
                </tr>
              </table>

              <!-- Emergency Contact -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FFF8F0;border:1.5px solid #ED8A22;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 12px;color:#ED8A22;font-size:13px;font-weight:700;">🚨 Emergency Contacts on Trip Day / جهات التواصل الطارئة يوم الرحلة</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td class="emergency-stack" style="padding-right:16px;vertical-align:top;">
                          <p style="margin:0 0 2px;color:#475569;font-size:12px;">Lead Supervisor / المشرفة المسؤولة</p>
                          <p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;">Ms. Sarah Al-Ahmadi</p>
                          <p style="margin:0;color:#64748B;font-size:12px;" dir="rtl">أ. سارة الأحمدي</p>
                          <p style="margin:4px 0 0;"><a href="tel:+966501234567" style="color:#ED8A22;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;" dir="ltr">&#8206;+966 50 123 4567&#8206;</a></p>
                        </td>
                        <td class="emergency-stack" style="vertical-align:top;">
                          <p style="margin:0 0 2px;color:#475569;font-size:12px;">GuestNa Support / دعم منصة جستنا</p>
                          <p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;">Support Team</p>
                          <p style="margin:0;color:#64748B;font-size:12px;" dir="rtl">فريق الدعم</p>
                          <p style="margin:4px 0 0;"><a href="tel:+966500000000" style="color:#ED8A22;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;" dir="ltr">&#8206;+966 50 000 0000&#8206;</a></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-top:8px;">
                    <a class="mobile-btn" href="https://guestna-b2b.vercel.app/ar/parents/camping-adventure-girls-sdfsdf-st-186"
                       target="_blank"
                       style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 44px;border-radius:10px;box-shadow:0 4px 20px rgba(0,143,143,0.3);letter-spacing:0.3px;">
                      View Full Trip Details → عرض تفاصيل الرحلة
                    </a>
                    <p style="margin:12px 0 0;color:#94A3B8;font-size:12px;text-align:center;">
                      Booking #: <strong>#GN-2025-4521</strong>
                      <span style="margin:0 8px;color:#CBD5E1;">|</span>
                      <span dir="rtl">رقم الحجز: <strong>#GN-2025-4521</strong></span>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Note -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:24px;">
                <tr>
                  <td style="background:#EFF6FF;border-left:4px solid #3B82F6;border-radius:0 10px 10px 0;padding:14px 18px;">
                    <div style="font-size:12px;color:#3B82F6;font-weight:700;margin-bottom:6px;">ℹ️ Note / ملاحظة</div>
                    <div style="font-size:13px;color:#1E40AF;line-height:1.7;margin-bottom:4px;">
                      Please ensure students arrive 15 minutes before departure time.
                    </div>
                    <div style="font-size:13px;color:#1E40AF;line-height:1.7;" dir="rtl">
                      يُرجى التأكد من وصول الطلاب قبل 15 دقيقة من وقت الانطلاق المحدد.
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
                <a href="tel:+966547534666" style="color:rgba(255,255,255,0.45);text-decoration:none;display:inline-block;" dir="ltr">&#8206;+966547534666&#8206;</a>
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
