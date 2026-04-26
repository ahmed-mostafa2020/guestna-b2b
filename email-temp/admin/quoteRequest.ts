export const quoteRequestAdmin = (
  lang: string,
  trip: string,
  url: string,
  email: string,
  date: string,
  name: string
): string => {
  const htmlTemp = `<!DOCTYPE html>
<html lang="${lang === "ar" ? "ar" : "en"}" dir="${lang === "ar" ? "rtl" : "ltr"}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Trip Quote Request - GuestNa</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap");
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body, table, td, p, a, li, blockquote {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      .ReadMsgBody { width: 100%; }
      .ExternalClass { width: 100%; }
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
      body {
        font-family: ${lang === "ar" ? '"Tajawal", Arial, Tahoma, sans-serif' : '"Tajawal", Arial, Helvetica, sans-serif'} !important;
        margin: 0 !important; padding: 0 !important;
        background-color: #EEF2F7 !important;
        color: #1E293B !important;
        width: 100% !important; min-width: 100% !important;
        direction: ${lang === "ar" ? "rtl" : "ltr"};
      }
      .email-wrapper { background-color: #EEF2F7; padding: 32px 16px; }
      .main-table {
        width: 100%; max-width: 600px; margin: 0 auto;
        background-color: #ffffff; border-radius: 20px; overflow: hidden;
        box-shadow: 0 8px 40px rgba(10,37,64,0.12);
      }
      .header-section {
        background: linear-gradient(150deg, #0A2540 0%, #0B6B85 60%, #0B9A9A 100%);
        padding: 36px 36px 32px; text-align: center;
      }
      .header-logo { display: block; margin: 0 auto 20px; filter: brightness(0) invert(1); width: 130px; }
      .header-badge {
        display: inline-block; background: rgba(255,255,255,0.15);
        border: 1px solid rgba(255,255,255,0.3); border-radius: 50px;
        padding: 5px 18px; font-size: 15px; color: #ffffff;
        letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 16px;
      }
      .header-title { font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 8px; line-height: 1.3; }
      .header-subtitle { font-size: 14px; color: rgba(255,255,255,0.6); }
      .accent-line { height: 4px; background: linear-gradient(90deg, #00B4D8, #0077B6, #00B4D8); }
      .content-section { padding: 32px 36px; }
      .info-card {
        border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; margin-bottom: 24px;
      }
      .card-header {
        background: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 12px 20px;
        font-size: 12px; font-weight: 700; color: #64748B;
        text-transform: uppercase; letter-spacing: 0.8px;
      }
      .card-row-label {
        padding: 14px 20px 6px; width: 42%; border-bottom: 1px solid #F1F5F9;
        font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px;
        color: #94A3B8; font-weight: 600;
        text-align: ${lang === "ar" ? "right" : "left"};
      }
      .card-row-value {
        padding: 14px 20px 6px; border-bottom: 1px solid #F1F5F9;
        font-size: 15px; color: #1E293B; font-weight: 600;
        text-align: ${lang === "ar" ? "right" : "left"};
      }
      .card-row-label-last {
        padding: 10px 20px 14px; width: 42%;
        font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px;
        color: #94A3B8; font-weight: 600;
        text-align: ${lang === "ar" ? "right" : "left"};
      }
      .card-row-value-last {
        padding: 10px 20px 14px;
        font-size: 15px; color: #1E293B; font-weight: 600;
        text-align: ${lang === "ar" ? "right" : "left"};
      }
      .alert-box {
        background: #FFFBEB; border-left: 4px solid #F59E0B;
        border-radius: 0 10px 10px 0; padding: 16px 20px; margin-bottom: 24px;
        font-size: 15px; color: #92400E; font-weight: 600; line-height: 1.6;
      }
      .cta-section { text-align: center; padding: 8px 36px 32px; }
      .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #0B7A8A, #0A5A7C) !important;
        color: #ffffff !important; text-decoration: none !important;
        font-size: 15px !important; font-weight: 700 !important;
        padding: 15px 44px !important; border-radius: 10px !important;
        box-shadow: 0 4px 20px rgba(11,122,138,0.3) !important;
        letter-spacing: 0.3px; line-height: 1.2;
      }
      .footer-section {
        background: #0A2540; padding: 24px 36px; text-align: center;
      }
      .footer-logo { display: block; margin: 0 auto 12px; filter: brightness(0) invert(1); opacity: 0.85; width: 90px; }
      .footer-copy { margin: 0 0 8px; font-size: 12px; color: rgba(255,255,255,0.35); }
      .footer-links { margin: 0; font-size: 12px; }
      .footer-link { color: rgba(255,255,255,0.45); text-decoration: none; }
      .footer-sep { color: rgba(255,255,255,0.2); margin: 0 6px; }
      @media only screen and (max-width: 600px) {
        .main-table { width: 100% !important; border-radius: 0 !important; }
        .header-section, .content-section, .cta-section { padding: 20px !important; }
        .cta-button { width: 90% !important; padding: 14px 20px !important; font-size: 14px !important; }
      }
      @media (prefers-color-scheme: dark) {
        .main-table { background-color: #ffffff !important; }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <table role="presentation" class="main-table" cellspacing="0" cellpadding="0">

        <!-- Header -->
        <tr>
          <td class="header-section">
            <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" alt="GuestNa Logo" class="header-logo" width="130" />
            <div class="header-badge">${lang === "ar" ? "إشعار إداري" : "Admin Notification"}</div>
            <div class="header-title">${lang === "ar" ? "🌟 طلب عرض سعر جديد للرحلة" : "🌟 New Trip Quote Request"}</div>
            <div class="header-subtitle">${lang === "ar" ? "استفسار عميل جديد!" : "New Customer Inquiry!"}</div>
          </td>
        </tr>

        <!-- Accent Line -->
        <tr><td class="accent-line"></td></tr>

        <!-- Content -->
        <tr>
          <td class="content-section">

            <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 24px;text-align:${lang === "ar" ? "right" : "left"};">
              ${
                lang === "ar"
                  ? "عميل محتمل مهتم بإحدى رحلاتكم الرائعة وطلب عرض سعر مخصص. يرجى مراجعة تفاصيله أدناه والرد بسرعة."
                  : "A potential customer is interested in one of your amazing trips and has requested a personalized quote. Please review their details below and respond promptly."
              }
            </p>

            <!-- Info Card -->
            <div class="info-card">
              <div class="card-header">${lang === "ar" ? "تفاصيل الاستفسار" : "Inquiry Details"}</div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="card-row-label" style="border-bottom:1px solid #F1F5F9;">${lang === "ar" ? "اسم العميل" : "Customer Name"}</td>
                  <td class="card-row-value" style="border-bottom:1px solid #F1F5F9;">${name || "-"}</td>
                </tr>
                <tr>
                  <td class="card-row-label" style="padding-top:10px;border-bottom:1px solid #F1F5F9;">${lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</td>
                  <td class="card-row-value" style="padding-top:10px;border-bottom:1px solid #F1F5F9;">${email || "-"}</td>
                </tr>
                <tr>
                  <td class="card-row-label" style="padding-top:10px;border-bottom:1px solid #F1F5F9;">${lang === "ar" ? "الرحلة المطلوبة" : "Requested Trip"}</td>
                  <td class="card-row-value" style="padding-top:10px;border-bottom:1px solid #F1F5F9;color:#0B7A6A;font-weight:700;">${trip}</td>
                </tr>
                <tr>
                  <td class="card-row-label-last">${lang === "ar" ? "تاريخ الطلب" : "Request Date"}</td>
                  <td class="card-row-value-last">${date}</td>
                </tr>
              </table>
            </div>

            <!-- Alert -->
            <div class="alert-box">
              ${
                lang === "ar"
                  ? "<strong>⏰ مهم:</strong> يرجى الرد خلال 24 ساعة لتقديم أفضل تجربة للعميل وزيادة فرص الحجز."
                  : "<strong>⏰ Important:</strong> Please respond within 24 hours to provide the best customer experience and increase booking chances."
              }
            </div>

          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td class="cta-section">
            <a href="${url}" class="cta-button" target="_blank">
              ${lang === "ar" ? "عرض التفاصيل في لوحة التحكم &larr;" : "View Details in Dashboard &rarr;"}
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td class="footer-section">
            <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" alt="GuestNa" class="footer-logo" width="90" />
            <p class="footer-copy">&copy; 2024 GuestNa. All rights reserved.</p>
            <p class="footer-links">
              <a href="#" class="footer-link">Unsubscribe</a>
              <span class="footer-sep">&middot;</span>
              <a href="#" class="footer-link">Privacy Policy</a>
            </p>
          </td>
        </tr>

      </table>
    </div>
  </body>
</html>

`;

  return htmlTemp;
};
