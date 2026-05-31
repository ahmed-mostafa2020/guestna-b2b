// Ref: trip-recommendations — توصيات رحلات مخصصة للمستخدم
export const tripRecommendationsHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <base target="_blank" />
  <title>رحلاتك المقترحة - جستنا</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap");
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "IBM Plex Sans Arabic", Arial, Tahoma, sans-serif !important;
      background-color: #EEF2F7 !important;
      color: #1E293B !important;
      direction: rtl;
      width: 100%; min-width: 100%;
    }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 0 14px !important; }
      .header-pad { padding: 24px 18px 20px !important; }
      .footer-pad { padding: 20px 14px !important; }
      .mobile-h1 { font-size: 18px !important; }
      .card-thumb { display: none !important; }
      .card-body { width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EEF2F7;font-family:'IBM Plex Sans Arabic',Arial,Tahoma,sans-serif;direction:rtl;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EEF2F7;">
    <tr>
      <td align="center" style="padding:28px 16px;">

        <table class="main-table" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600"
               style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td class="header-pad" style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:30px 32px 26px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa Logo" width="100"
                   style="display:block;margin:0 auto 16px;filter:brightness(0) invert(1);border:0;" />
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:4px 16px;font-size:11px;color:#ffffff;letter-spacing:1px;margin-bottom:12px;">
                رحلاتك المقترحة
              </div>
              <div class="mobile-h1" style="font-size:22px;font-weight:700;color:#ffffff;margin-bottom:6px;line-height:1.3;">
                🗺️ اخترنا لك أفضل الرحلات
              </div>
              <div style="font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">
                بناءً على ميزانيتكم، المرحلة الدراسية، وعدد الطلاب
              </div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- Section Label -->
          <tr>
            <td class="content-pad" style="padding:18px 28px 10px;">
              <p style="margin:0;font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1.2px;">الرحلات المقترحة</p>
            </td>
          </tr>

          <!-- ══════════════ TRIP 1 ══════════════ -->
          <tr>
            <td class="content-pad" style="padding:0 28px 12px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;background:#FAFCFF;">
                <tr>
                  <!-- Thumbnail -->
                  <td class="card-thumb" width="110" style="width:110px;padding:0;vertical-align:top;">
                    <div style="width:110px;min-height:140px;background:linear-gradient(160deg,#8B7355,#C4A882);position:relative;overflow:hidden;">
                      <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/trip-alula.jpg"
                           alt="رؤية العلا" width="110"
                           style="display:block;width:110px;height:100%;min-height:140px;object-fit:cover;border:0;"
                           onerror="this.style.display='none'" />
                      <!-- Match Badge -->
                      <div style="position:absolute;top:8px;right:6px;background:#008F8F;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;">
                        98% ✓
                      </div>
                    </div>
                  </td>
                  <!-- Body -->
                  <td class="card-body" style="padding:12px 14px;vertical-align:top;">
                    <!-- Title row -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td>
                          <div style="font-size:15px;font-weight:700;color:#0A2540;line-height:1.3;margin-bottom:3px;">رؤية العلا الاستكشافية</div>
                          <div style="font-size:11px;color:#64748B;">📍 الرياض &nbsp;·&nbsp; 🕐 6 ساعات</div>
                        </td>
                      </tr>
                    </table>
                    <!-- Reason -->
                    <div style="margin:8px 0;background:#F0FDF4;border-radius:6px;padding:5px 10px;font-size:11px;color:#166534;">
                      ✦ تطابق ممتاز مع الميزانية والمرحلة التعليمية
                    </div>
                    <!-- Stats inline -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:8px;">
                      <tr>
                        <td style="font-size:11px;color:#64748B;padding-left:12px;">
                          <span style="font-weight:700;color:#0A2540;font-size:13px;">250</span> <span style="color:#94A3B8;">ر.س</span> / طالب
                        </td>
                        <td style="font-size:11px;color:#64748B;padding-left:12px;">
                          <span style="font-weight:700;color:#008F8F;font-size:13px;">12,500</span> <span style="color:#94A3B8;">ر.س</span> إجمالي
                        </td>
                        <td style="font-size:11px;color:#64748B;">
                          <span style="font-weight:600;color:#0A2540;">50</span> مقعد
                        </td>
                      </tr>
                    </table>
                    <!-- Tags -->
                    <div style="margin-bottom:10px;">
                      <span style="display:inline-block;background:#F0F9FF;color:#0369A1;font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;margin-left:4px;">مرشد تعليمي</span>
                      <span style="display:inline-block;background:#FFF7ED;color:#C2410C;font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;">مواقع أثرية</span>
                    </div>
                    <!-- Buttons -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-left:6px;">
                          <a href="https://guestna-b2b.vercel.app/ar/discover/trip-alula" target="_blank"
                             style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#fff;text-decoration:none;font-size:12px;font-weight:700;padding:8px 16px;border-radius:7px;">
                            اختر الرحلة ←
                          </a>
                        </td>
                        <td>
                          <a href="https://guestna-b2b.vercel.app/ar/packageInfo/trip-alula" target="_blank"
                             style="display:inline-block;background:#fff;color:#008F8F;text-decoration:none;font-size:12px;font-weight:700;padding:7px 14px;border-radius:7px;border:1.5px solid #008F8F;">
                            التفاصيل
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ══════════════ TRIP 2 ══════════════ -->
          <tr>
            <td class="content-pad" style="padding:0 28px 12px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;background:#FAFCFF;">
                <tr>
                  <td class="card-thumb" width="110" style="width:110px;padding:0;vertical-align:top;">
                    <div style="width:110px;min-height:140px;background:linear-gradient(160deg,#1E3A5F,#2E5FA3);position:relative;overflow:hidden;">
                      <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/trip-innovation.jpg"
                           alt="مركز إثراء" width="110"
                           style="display:block;width:110px;height:100%;min-height:140px;object-fit:cover;border:0;"
                           onerror="this.style.display='none'" />
                      <div style="position:absolute;top:8px;right:6px;background:#008F8F;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;">
                        95% ✓
                      </div>
                    </div>
                  </td>
                  <td class="card-body" style="padding:12px 14px;vertical-align:top;">
                    <div style="font-size:15px;font-weight:700;color:#0A2540;line-height:1.3;margin-bottom:3px;">الابتكار في مركز إثراء المعرفي</div>
                    <div style="font-size:11px;color:#64748B;">📍 الظهران &nbsp;·&nbsp; 🕐 يوم كامل</div>
                    <div style="margin:8px 0;background:#F0FDF4;border-radius:6px;padding:5px 10px;font-size:11px;color:#166534;">
                      ✦ تطابق ممتاز مع الميزانية والمرحلة التعليمية
                    </div>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:8px;">
                      <tr>
                        <td style="font-size:11px;color:#64748B;padding-left:12px;">
                          <span style="font-weight:700;color:#0A2540;font-size:13px;">320</span> <span style="color:#94A3B8;">ر.س</span> / طالب
                        </td>
                        <td style="font-size:11px;color:#64748B;padding-left:12px;">
                          <span style="font-weight:700;color:#008F8F;font-size:13px;">14,400</span> <span style="color:#94A3B8;">ر.س</span> إجمالي
                        </td>
                        <td style="font-size:11px;color:#64748B;">
                          <span style="font-weight:600;color:#0A2540;">40</span> مقعد
                        </td>
                      </tr>
                    </table>
                    <div style="margin-bottom:10px;">
                      <span style="display:inline-block;background:#F5F3FF;color:#7C3AED;font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;margin-left:4px;">ورش ابتكار</span>
                      <span style="display:inline-block;background:#FFF7ED;color:#C2410C;font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;margin-left:4px;">علوم وتقنية</span>
                      <span style="display:inline-block;background:#F0F9FF;color:#0369A1;font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;">متحف تفاعلي</span>
                    </div>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-left:6px;">
                          <a href="https://guestna-b2b.vercel.app/ar/discover/trip-ithra" target="_blank"
                             style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#fff;text-decoration:none;font-size:12px;font-weight:700;padding:8px 16px;border-radius:7px;">
                            اختر الرحلة ←
                          </a>
                        </td>
                        <td>
                          <a href="https://guestna-b2b.vercel.app/ar/packageInfo/trip-ithra" target="_blank"
                             style="display:inline-block;background:#fff;color:#008F8F;text-decoration:none;font-size:12px;font-weight:700;padding:7px 14px;border-radius:7px;border:1.5px solid #008F8F;">
                            التفاصيل
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ══════════════ TRIP 3 ══════════════ -->
          <tr>
            <td class="content-pad" style="padding:0 28px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;background:#FAFCFF;">
                <tr>
                  <td class="card-thumb" width="110" style="width:110px;padding:0;vertical-align:top;">
                    <div style="width:110px;min-height:140px;background:linear-gradient(160deg,#2D5016,#4A7C59);position:relative;overflow:hidden;">
                      <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/trip-farm.jpg"
                           alt="المزرعة التعليمية" width="110"
                           style="display:block;width:110px;height:100%;min-height:140px;object-fit:cover;border:0;"
                           onerror="this.style.display='none'" />
                      <div style="position:absolute;top:8px;right:6px;background:#ED8A22;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;">
                        90% ✓
                      </div>
                    </div>
                  </td>
                  <td class="card-body" style="padding:12px 14px;vertical-align:top;">
                    <div style="font-size:15px;font-weight:700;color:#0A2540;line-height:1.3;margin-bottom:3px;">رحلة المزرعة التعليمية</div>
                    <div style="font-size:11px;color:#64748B;">📍 الرياض &nbsp;·&nbsp; 🕐 نصف يوم</div>
                    <div style="margin:8px 0;background:#F0FDF4;border-radius:6px;padding:5px 10px;font-size:11px;color:#166534;">
                      ✦ مثالية للمرحلة الابتدائية، ميزانية مناسبة
                    </div>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:8px;">
                      <tr>
                        <td style="font-size:11px;color:#64748B;padding-left:12px;">
                          <span style="font-weight:700;color:#0A2540;font-size:13px;">95</span> <span style="color:#94A3B8;">ر.س</span> / طالب
                        </td>
                        <td style="font-size:11px;color:#64748B;padding-left:12px;">
                          <span style="font-weight:700;color:#008F8F;font-size:13px;">4,275</span> <span style="color:#94A3B8;">ر.س</span> إجمالي
                        </td>
                        <td style="font-size:11px;color:#64748B;">
                          <span style="font-weight:600;color:#0A2540;">60</span> مقعد
                        </td>
                      </tr>
                    </table>
                    <div style="margin-bottom:10px;">
                      <span style="display:inline-block;background:#F0FDF4;color:#166534;font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;margin-left:4px;">بيئة وزراعة</span>
                      <span style="display:inline-block;background:#FFF7ED;color:#C2410C;font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;">مشرفون متخصصون</span>
                    </div>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-left:6px;">
                          <a href="https://guestna-b2b.vercel.app/ar/discover/trip-farm" target="_blank"
                             style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#fff;text-decoration:none;font-size:12px;font-weight:700;padding:8px 16px;border-radius:7px;">
                            اختر الرحلة ←
                          </a>
                        </td>
                        <td>
                          <a href="https://guestna-b2b.vercel.app/ar/packageInfo/trip-farm" target="_blank"
                             style="display:inline-block;background:#fff;color:#008F8F;text-decoration:none;font-size:12px;font-weight:700;padding:7px 14px;border-radius:7px;border:1.5px solid #008F8F;">
                            التفاصيل
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- View All CTA -->
          <tr>
            <td class="content-pad" align="center" style="padding:0 28px 20px;">
              <a href="https://guestna-b2b.vercel.app/ar/discover" target="_blank"
                 style="display:inline-block;background:transparent;color:#008F8F;text-decoration:none;font-size:13px;font-weight:700;padding:10px 28px;border-radius:8px;border:1.5px solid #008F8F;">
                استعرض جميع الرحلات المتاحة →
              </a>
            </td>
          </tr>

          <!-- Support Banner -->
          <tr>
            <td class="content-pad" style="padding:0 28px 22px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="background:#FFF8F0;border-right:3px solid #ED8A22;border-radius:8px 0 0 8px;">
                <tr>
                  <td style="padding:10px 16px;text-align:right;">
                    <span style="font-size:12px;font-weight:700;color:#ED8A22;">🤝 هل تحتاج مساعدة؟</span>
                    <span style="font-size:12px;color:#475569;margin-right:6px;">خبراؤنا متاحون لمساعدتكم —</span>
                    <a href="https://guestna-b2b.vercel.app/ar/contact-us" style="color:#ED8A22;font-weight:700;text-decoration:none;font-size:12px;">تحدث معنا</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-pad" style="background:#0A2540;padding:22px 28px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa" width="80"
                   style="display:block;margin:0 auto 12px;filter:brightness(0) invert(1);opacity:0.85;border:0;" />
              <p style="margin:0 0 5px;font-size:12px;color:rgba(255,255,255,0.45);">
                <a href="mailto:info@guestna.app" style="color:rgba(255,255,255,0.45);text-decoration:none;">info@guestna.app</a>
                <span style="color:rgba(255,255,255,0.2);margin:0 8px;">|</span>
                <a href="tel:+966547534666" dir="ltr" style="color:rgba(255,255,255,0.45);text-decoration:none;display:inline-block;">&#8206;+966 54 753 4666&#8206;</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">© 2025 GuestNa. جميع الحقوق محفوظة.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
