// Ref: accounts/reset Password Email_ar — إعادة تعيين كلمة المرور
export const resetPasswordHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>إعادة تعيين كلمة المرور - جستنا</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap");
    body { font-family: "Tajawal", Arial, Tahoma, sans-serif !important; direction: rtl; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EEF2F7;color:#1E293B;font-family:'Tajawal',Arial,Tahoma,sans-serif;direction:rtl;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EEF2F7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="main-table"
               style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(150deg,#0A2540 0%,#3d1a1a 60%,#7f1d1d 100%);padding:40px 36px 36px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa Logo" width="120"
                   style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;" />
              <div style="font-size:44px;margin-bottom:12px;">🔑</div>
              <div style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">إعادة تعيين كلمة المرور</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.75);">طلب إعادة تعيين كلمة مرور حسابك في جستنا</div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#dc2626,#ED8A22,#dc2626);"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="content-pad" style="padding:36px 36px 24px;text-align:center;">
              <p style="margin:0 0 10px;font-size:20px;font-weight:700;color:#1E293B;">مرحباً، أ. أحمد مصطفى</p>
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.8;">
                تلقّينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك المرتبط بالبريد
                <a href="mailto:ahmad.m@school.edu.sa" style="color:#008F8F;text-decoration:none;font-weight:600;">ahmad.m@school.edu.sa</a>.
                اضغط على الزر أدناه لإنشاء كلمة مرور جديدة.
              </p>
            </td>
          </tr>

          <!-- Request Details -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="background:#F0FDFA;border-bottom:1px solid #D0EAEA;padding:12px 20px;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:#008F8F;">🔍 تفاصيل الطلب</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;width:45%;border-bottom:1px solid #F1F5F9;">
                    <p style="margin:0;font-size:12px;color:#94A3B8;font-weight:600;">وقت الطلب</p>
                  </td>
                  <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;">
                    <p style="margin:0;font-size:14px;color:#1E293B;font-weight:600;">١٧ مارس ٢٠٢٦، ١٢:٥١ م</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;width:45%;">
                    <p style="margin:0;font-size:12px;color:#94A3B8;font-weight:600;">صلاحية الرابط</p>
                  </td>
                  <td style="padding:14px 20px;">
                    <span style="display:inline-block;background:#FEF3C7;color:#92400E;font-size:12px;font-weight:700;padding:4px 12px;border-radius:50px;">⏰ ١٥ دقيقة فقط</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:0 36px 16px;">
              <a href="https://guestna.app/reset-password"
                 style="display:inline-block;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 48px;border-radius:12px;box-shadow:0 4px 20px rgba(220,38,38,0.3);">
                🔐 إعادة تعيين كلمة المرور
              </a>
            </td>
          </tr>

          <!-- Direct Link -->
          <tr>
            <td align="center" style="padding:0 36px 24px;">
              <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.7;">
                أو انسخ هذا الرابط في متصفحك:<br/>
                <a href="https://guestna.app/reset-password"
                   style="color:#008F8F;text-decoration:none;word-break:break-all;font-size:12px;">https://guestna.app/reset-password</a>
              </p>
            </td>
          </tr>

          <!-- Security Warning -->
          <tr>
            <td class="content-pad" style="padding:0 36px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FFF1F2;border:1.5px solid #FECDD3;border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#9F1239;">🚨 تحذير أمني</p>
                    <p style="margin:0;font-size:13px;color:#9F1239;line-height:1.7;">
                      إذا لم تطلب إعادة تعيين كلمة المرور، يُرجى تجاهل هذا البريد. حسابك آمن ولن يتم إجراء أي تغيير.
                      للإبلاغ عن نشاط مشبوه، تواصل معنا على
                      <a href="mailto:security@guestna.app" style="color:#9F1239;font-weight:600;">security@guestna.app</a>
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
                <span style="direction:ltr;unicode-bidi:isolate;display:inline-block;"><a href="tel:+966547534666" style="color:rgba(255,255,255,0.45);text-decoration:none;">&lrm;+966 55 234 5678&lrm;</a></span>
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
