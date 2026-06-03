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

          <!-- Polite Apology Banner -->
          <tr>
            <td class="content-pad" style="padding:24px 28px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="background:linear-gradient(135deg,#FFF8F0,#FFF3E0);border:1.5px solid #ED8A22;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 22px;text-align:right;">
                    <div style="font-size:22px;margin-bottom:8px;">🙏</div>
                    <div style="font-size:15px;font-weight:700;color:#0A2540;margin-bottom:8px;line-height:1.4;">
                      نعتذر منكم — الرحلة المطلوبة غير متاحة حالياً
                    </div>
                    <div style="font-size:13px;color:#475569;line-height:1.7;">
                      نقدّر ثقتكم بنا ونأسف لعدم توفّر الرحلة التي طلبتموها في الوقت الراهن.
                      لكننا لم نتركم بدون خيارات — اخترنا لكم بعناية أفضل الرحلات المتاحة التي تتناسب مع احتياجاتكم.
                    </div>
                    <div style="margin-top:14px;">
                      <a href="https://guestna-b2b.vercel.app/ar/discover" target="_blank"
                         style="display:inline-block;background:linear-gradient(135deg,#ED8A22,#F59E0B);color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 24px;border-radius:8px;box-shadow:0 3px 12px rgba(237,138,34,0.3);">
                        استعرض الرحلات المقترحة ←
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
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
