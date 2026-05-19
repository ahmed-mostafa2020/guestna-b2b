// Ref: accounts/complete New account Email_ar — تفعيل الحساب وإنشاء كلمة المرور
export const newAccountHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <base target="_blank" />
  <title>أكمل إنشاء حسابك - جستنا</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap");
    body { font-family: "IBM Plex Sans Arabic", Arial, Tahoma, sans-serif !important; direction: rtl; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 30px 20px 26px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .mobile-h2 { font-size: 18px !important; }
      .mobile-emoji { font-size: 36px !important; }
      .mobile-btn { padding: 14px 28px !important; font-size: 15px !important; }
      td[style*="width:42%"], td[style*="width:38%"], td[style*="width:45%"], td[style*="width:55%"] {
        display: block !important; width: 100% !important;
        padding: 10px 18px 2px !important; text-align: right !important;
      }
      td[style*="width:42%"] + td, td[style*="width:38%"] + td, td[style*="width:45%"] + td, td[style*="width:55%"] + td {
        display: block !important; width: 100% !important;
        padding: 0 18px 12px !important; text-align: right !important;
      }
      a[href^="mailto"], a[href^="tel"] { word-break: break-all !important; }
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
            <td class="header-pad" style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:40px 36px 36px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa Logo" width="120"
                   style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;" />
              <div class="mobile-emoji" style="font-size:44px;margin-bottom:12px;">🎯</div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">أكمل إنشاء حسابك!</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.75);">خطوة أخيرة لتفعيل حسابك في منصة جستنا</div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td class="content-pad" style="padding:36px 36px 0;">
              <p class="mobile-h2" style="margin:0 0 10px;font-size:20px;font-weight:700;color:#008F8F;text-align:center;">مرحباً، أ. أحمد مصطفى!</p>
              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.8;text-align:center;">
                يسعدنا أن نُخبرك أن حسابك في منصة جستنا للرحلات التعليمية قد تم إنشاؤه بنجاح.<br/>
                لتفعيل حسابك والبدء في استخدام المنصة، يرجى إنشاء كلمة مرور خاصة بك.
              </p>
            </td>
          </tr>

          <!-- Steps -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F0FDFA;border:1px solid #D0EAEA;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="background:#008F8F;padding:12px 20px;">
                    <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;">📋 خطوات البدء</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding:8px 0;vertical-align:top;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                            <td width="38" style="vertical-align:top;"><div style="background:#008F8F;color:#fff;border-radius:50%;width:26px;height:26px;text-align:center;line-height:26px;font-size:13px;font-weight:700;">١</div></td>
                            <td style="font-size:14px;color:#334155;line-height:1.6;">اضغط على زر "إنشاء كلمة المرور" أدناه</td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;vertical-align:top;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                            <td width="38" style="vertical-align:top;"><div style="background:#ED8A22;color:#fff;border-radius:50%;width:26px;height:26px;text-align:center;line-height:26px;font-size:13px;font-weight:700;">٢</div></td>
                            <td style="font-size:14px;color:#334155;line-height:1.6;">أنشئ كلمة مرور قوية وآمنة</td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;vertical-align:top;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                            <td width="38" style="vertical-align:top;"><div style="background:#0A2540;color:#fff;border-radius:50%;width:26px;height:26px;text-align:center;line-height:26px;font-size:13px;font-weight:700;">٣</div></td>
                            <td style="font-size:14px;color:#334155;line-height:1.6;">سجّل الدخول وابدأ بإدارة رحلاتك التعليمية</td>
                          </tr></table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Account Info -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:center;">
                    <span style="font-size:13px;font-weight:700;color:#008F8F;">👤 بيانات الحساب</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;width:40%;border-bottom:1px solid #F1F5F9;">
                    <div style="font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">الاسم</div>
                  </td>
                  <td style="padding:12px 20px;border-bottom:1px solid #F1F5F9;">
                    <div style="font-size:14px;color:#1E293B;font-weight:600;">أ. أحمد مصطفى</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;width:40%;border-bottom:1px solid #F1F5F9;">
                    <div style="font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">البريد الإلكتروني</div>
                  </td>
                  <td style="padding:12px 20px;border-bottom:1px solid #F1F5F9;">
                    <a href="mailto:ahmad.m@school.edu.sa" style="font-size:14px;color:#008F8F;font-weight:500;text-decoration:none;">ahmad.m@school.edu.sa</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;width:40%;">
                    <div style="font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">المؤسسة</div>
                  </td>
                  <td style="padding:12px 20px;">
                    <div style="font-size:14px;color:#1E293B;font-weight:600;">مدرسة النور الدولية</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:0 36px 12px;">
              <a class="mobile-btn" href="https://guestna-b2b.vercel.app/ar/reset-password"
                 style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 48px;border-radius:12px;box-shadow:0 4px 20px rgba(0,143,143,0.35);">
                🔐 إنشاء كلمة المرور
              </a>
            </td>
          </tr>

          <!-- Expiry Warning -->
          <tr>
            <td align="center" style="padding:12px 36px 32px;">
              <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.7;">
                ⏰ هذا الرابط صالح لمدة <strong style="color:#ED8A22;">30 دقيقة</strong> من وقت الإرسال.<br/>
                إذا انتهت صلاحيته، تواصل مع فريق الدعم على
                <a href="mailto:info@guestna.app" style="color:#008F8F;text-decoration:none;">info@guestna.app</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-pad" style="background:#0A2540;padding:28px 36px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa" width="90"
                   style="display:block;margin:0 auto 14px;filter:brightness(0) invert(1);opacity:0.85;border:0;" />
              <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.7);font-weight:600;">
</p>
              <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.45);">
                <a href="mailto:info@guestna.app" style="color:rgba(255,255,255,0.45);text-decoration:none;">info@guestna.app</a>
                <span style="color:rgba(255,255,255,0.2);margin:0 8px;">|</span>
                <a href="tel:+966547534666" dir="ltr" style="color:rgba(255,255,255,0.45);text-decoration:none;;display:inline-block;">&#8206;+966547534666&#8206;</a>
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
