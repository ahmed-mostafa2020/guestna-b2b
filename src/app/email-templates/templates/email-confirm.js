// Ref: accounts/confirmed Email_ar — تأكيد البريد الإلكتروني
export const emailConfirmHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>تأكيد بريدك الإلكتروني - جستنا</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap");
    body { font-family: "IBM Plex Sans Arabic", Arial, Tahoma, sans-serif !important; direction: rtl; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EEF2F7;color:#1E293B;font-family:'IBM Plex Sans Arabic',Arial,Tahoma,sans-serif;direction:rtl;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EEF2F7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="main-table"
               style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:40px 36px 36px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa Logo" width="120"
                   style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;" />
              <div style="font-size:44px;margin-bottom:12px;">✉️</div>
              <div style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">تأكيد بريدك الإلكتروني</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.75);">خطوة واحدة فقط لتفعيل حسابك</div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="content-pad" style="padding:36px 36px 24px;text-align:center;">
              <p style="margin:0 0 10px;font-size:20px;font-weight:700;color:#008F8F;">مرحباً، أ. أحمد مصطفى!</p>
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.8;">
                شكراً لتسجيلك في منصة جستنا. نحتاج إلى التحقق من بريدك الإلكتروني
                لضمان أمان حسابك. اضغط على الزر أدناه لإتمام التحقق.
              </p>

              <!-- Email Address Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:28px;background:#F0FDFA;border:1.5px solid #D0EAEA;border-radius:12px;">
                <tr>
                  <td align="center" style="padding:18px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">البريد المراد تأكيده</p>
                    <a href="mailto:ahmad.m@school.edu.sa"
                       style="font-size:17px;font-weight:700;color:#008F8F;text-decoration:none;">ahmad.m@school.edu.sa</a>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <a href="https://guestna.app/verify-email"
                 style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 52px;border-radius:12px;box-shadow:0 4px 20px rgba(0,143,143,0.35);">
                ✅ تأكيد البريد الإلكتروني
              </a>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td class="content-pad" style="padding:0 36px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FFFBEB;border:1.5px solid #FCD34D;border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#92400E;">⚠️ ملاحظة أمنية</p>
                    <p style="margin:0;font-size:13px;color:#92400E;line-height:1.7;">
                      إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذا البريد الإلكتروني.
                      هذا الرابط صالح لمدة <strong>٢٤ ساعة</strong> فقط.
                    </p>
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
                <a href="tel:+966547534666" dir="ltr" style="color:rgba(255,255,255,0.45);text-decoration:none;;display:inline-block;">&#8206;+966 55 234 5678&#8206;</a>
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:rgba(255,255,255,0.3);">© 2025 GuestNa. جميع الحقوق محفوظة.</p>
          
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
