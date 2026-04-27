// Ref: email-temp/admin/templetAddB2bUser.ts
export const addB2bUserHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>حسابك جاهز - GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap");
    body { font-family: "Tajawal", Arial, sans-serif !important; direction: rtl; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EEF2F7;color:#1E293B;font-family:'Tajawal',Arial,sans-serif;direction:rtl;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EEF2F7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="main-table" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:36px 36px 32px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" alt="GuestNa Logo" width="130" style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;" />
              <div style="font-size:48px;margin-bottom:10px;">🎉</div>
              <div style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">حسابك جاهز!</div>
              <div style="font-size:14px;color:rgba(255,255,255,0.8);">مرحباً بك في منصة جستنا للرحلات التعليمية</div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-pad" style="padding:32px 36px;">

              <p style="font-size:20px;color:#008F8F;font-weight:700;text-align:center;margin:0 0 16px;">🎊 تهانينا، أ. أحمد مصطفى!</p>
              
              <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 24px;text-align:center;">
                يسعدنا انضمامك إلينا! تم إنشاء حسابك بنجاح على GuestNa. يمكنك الآن الوصول إلى جميع الميزات والبدء في استكشاف المنصة وإدارة رحلاتك التعليمية.
              </p>

              <!-- Account Details -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:center;">
                    <span style="font-size:13px;font-weight:700;color:#008F8F;text-transform:uppercase;letter-spacing:0.8px;">📋 تفاصيل الحساب</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">الاسم الكامل</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">أ. أحمد مصطفى</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">البريد الإلكتروني</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#008F8F;font-weight:500;">ahmad.m@school.edu.sa</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">رقم الهاتف</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:right;">
                    <div dir="ltr" style="font-size:15px;color:#1E293B;font-weight:600;display:inline-block;">+966 50 123 4567&#8206;</div>
                  </td>
                </tr>
              </table>

              <!-- Password Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;background:#FFFBEB;border:2px dashed #F59E0B;border-radius:12px;">
                <tr>
                  <td align="center" style="padding:20px;">
                    <div style="font-size:14px;font-weight:700;color:#1E293B;margin-bottom:10px;">🔑 كلمة المرور المؤقتة</div>
                    <div style="background:#ffffff;border:1px solid #FCD34D;color:#1E293B;font-size:22px;font-weight:700;padding:12px 24px;border-radius:8px;font-family:monospace;letter-spacing:3px;display:inline-block;margin-bottom:10px;" dir="ltr">TempPass#2025</div>
                    <div style="font-size:12px;font-weight:600;color:#D97706;">⚠️ يرجى حفظ كلمة المرور هذه في مكان آمن وتغييرها عند أول تسجيل دخول.</div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-top:10px;">
                    <a href="#" style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 44px;border-radius:10px;box-shadow:0 4px 20px rgba(0,143,143,0.3);">
                      تسجيل الدخول إلى حسابك ←
                    </a>
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
