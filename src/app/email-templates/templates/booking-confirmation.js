export const bookingConfirmationHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>تأكيد الحجز - جستنا</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap");
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "Tajawal", Arial, Tahoma, sans-serif !important;
      background-color: #EEF2F7 !important;
      color: #1E293B !important;
      direction: rtl;
      width: 100%; min-width: 100%;
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EEF2F7;font-family:'Tajawal',Arial,Tahoma,sans-serif;direction:rtl;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EEF2F7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:36px 36px 32px;text-align:center;">
              <img
                src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                alt="GuestNa Logo"
                width="130"
                style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;"
              />
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:5px 18px;font-size:11px;color:#ffffff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">
                تأكيد الحجز
              </div>
              <div style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">
                ✅ تم تأكيد حجزكم بنجاح
              </div>
              <div style="font-size:14px;color:rgba(255,255,255,0.6);">
                رحلتكم المدرسية محجوزة ومؤكدة عبر جستنا
              </div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- Booking Reference Banner -->
          <tr>
            <td style="padding:24px 36px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F0FDFA;border-left:4px solid #008F8F;border-radius:0 10px 10px 0;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:12px;font-weight:700;color:#008F8F;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px;">رقم الحجز</div>
                    <div style="font-size:20px;font-weight:700;color:#0A2540;">#GN-2025-4521</div>
                    <div style="font-size:13px;color:#64748B;margin-top:4px;">تاريخ التأكيد: الثلاثاء، 12 أبريل 2025</div>
                  </td>
                  <td style="padding:16px 20px;text-align:left;">
                    <span style="display:inline-block;background:#008F8F;color:#fff;font-size:12px;font-weight:700;padding:6px 16px;border-radius:50px;letter-spacing:0.5px;">✓ مؤكد</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:0 36px 16px;">
              <p style="font-size:16px;color:#1E293B;font-weight:600;margin:0 0 6px;text-align:right;">السيد / رئيس قسم الأنشطة</p>
              <p style="font-size:14px;color:#475569;line-height:1.8;margin:0;text-align:right;">
                يسعدنا إبلاغكم بأنه تم تأكيد حجز رحلتكم المدرسية عبر منصة <strong style="color:#008F8F;">جستنا</strong>. يُرجى مراجعة التفاصيل أدناه والتأكد من إحاطة المسؤولين والطلاب بها قبل موعد الرحلة.
              </p>
            </td>
          </tr>

          <!-- Trip Details Card -->
          <tr>
            <td style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">تفاصيل الرحلة</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">اسم الرحلة</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#008F8F;font-weight:700;">رحلة المزرعة التعليمية — الرياض</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">التاريخ</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">الثلاثاء، 20 مايو 2025</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">وقت الانطلاق</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">8:00 صباحاً — 2:00 ظهراً</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">عدد الطلاب</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">45 طالب وطالبة</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">المشرف المسؤول</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">أ. سارة الأحمدي</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Meeting Point -->
          <tr>
            <td style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FFF8F0;border-left:4px solid #ED8A22;border-radius:0 10px 10px 0;">
                <tr>
                  <td style="padding:16px 20px;text-align:right;">
                    <div style="font-size:12px;font-weight:700;color:#ED8A22;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px;">📍 نقطة التجمع</div>
                    <div style="font-size:15px;color:#1E293B;font-weight:600;line-height:1.6;">مدخل المدرسة الرئيسي — بوابة رقم 2</div>
                    <div style="font-size:13px;color:#64748B;margin-top:6px;">يُرجى التواجد قبل 15 دقيقة من موعد الانطلاق</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Program Highlights -->
          <tr>
            <td style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:right;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">أبرز فعاليات البرنامج</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;text-align:right;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding:6px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                            <td width="28" style="text-align:right;padding-left:8px;"><div style="width:22px;height:22px;background-color:#008F8F;border-radius:50%;text-align:center;line-height:22px;"><span style="color:#fff;font-size:12px;font-weight:700;">✓</span></div></td>
                            <td style="text-align:right;"><p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">استكشاف بيئات الزراعة الحديثة وتقنيات الزراعة المائية</p></td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                            <td width="28" style="text-align:right;padding-left:8px;"><div style="width:22px;height:22px;background-color:#008F8F;border-radius:50%;text-align:center;line-height:22px;"><span style="color:#fff;font-size:12px;font-weight:700;">✓</span></div></td>
                            <td style="text-align:right;"><p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">ورش عمل تفاعلية في علوم البيئة والاستدامة</p></td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                            <td width="28" style="text-align:right;padding-left:8px;"><div style="width:22px;height:22px;background-color:#008F8F;border-radius:50%;text-align:center;line-height:22px;"><span style="color:#fff;font-size:12px;font-weight:700;">✓</span></div></td>
                            <td style="text-align:right;"><p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">وجبة غداء صحية متوازنة مشمولة في السعر</p></td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                            <td width="28" style="text-align:right;padding-left:8px;"><div style="width:22px;height:22px;background-color:#008F8F;border-radius:50%;text-align:center;line-height:22px;"><span style="color:#fff;font-size:12px;font-weight:700;">✓</span></div></td>
                            <td style="text-align:right;"><p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">مشرفون متخصصون وإجراءات سلامة معتمدة</p></td>
                          </tr></table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:0 36px 24px;">
              <a href="#"
                 target="_blank"
                 style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 44px;border-radius:10px;box-shadow:0 4px 20px rgba(0,143,143,0.3);letter-spacing:0.3px;">
                عرض الفاتورة وتفاصيل الدفع ←
              </a>
              <p style="margin:12px 0 0;color:#94A3B8;font-size:12px;text-align:center;">يمكنك متابعة الرحلة من لوحة التحكم الخاصة بالمدرسة</p>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td style="padding:20px 36px;background:#F8FAFC;border-top:1px solid #E2E8F0;text-align:right;">
              <div style="font-size:13px;font-weight:700;color:#1E293B;margin-bottom:10px;">هل تحتاج إلى مساعدة؟</div>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding-left:20px;">
                    <p style="margin:0;color:#475569;font-size:13px;direction:ltr;">📞 <a href="tel:+966500000000" style="color:#008F8F;text-decoration:none;font-weight:500;">+966 50 000 0000</a></p>
                  </td>
                  <td style="padding-left:20px;">
                    <p style="margin:0;color:#475569;font-size:13px;direction:ltr;">✉️ <a href="mailto:support@guestna-edu.com" style="color:#008F8F;text-decoration:none;font-weight:500;">support@guestna-edu.com</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0A2540;padding:28px 36px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa" width="90"
                   style="display:block;margin:0 auto 14px;filter:brightness(0) invert(1);opacity:0.85;border:0;" />
              <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.7);font-weight:600;">
                <a href="https://guestna.app" style="color:rgba(255,255,255,0.7);text-decoration:none;">منصة جستنا للرحلات التعليمية</a>
              </p>
              <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.45);">
                <a href="mailto:support@guestna.app" style="color:rgba(255,255,255,0.45);text-decoration:none;">support@guestna.app</a>
                <span style="color:rgba(255,255,255,0.2);margin:0 8px;">|</span>
                <a href="tel:+966552345678" dir="ltr" style="color:rgba(255,255,255,0.45);text-decoration:none;;display:inline-block;">&#8206;+966 55 234 5678&#8206;</a>
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:rgba(255,255,255,0.3);">© 2025 GuestNa. جميع الحقوق محفوظة.</p>
              <p style="margin:0;font-size:11px;">
                <a href="#" style="color:rgba(255,255,255,0.4);text-decoration:none;">إلغاء الاشتراك</a>
                <span style="color:rgba(255,255,255,0.15);margin:0 6px;">&middot;</span>
                <a href="#" style="color:rgba(255,255,255,0.4);text-decoration:none;">سياسة الخصوصية</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
