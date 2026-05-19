export const emailConfirmHTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <base target="_blank" />
  <title>Confirm Your Email - GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
    body { font-family: "Inter", Arial, Helvetica, sans-serif !important; direction: ltr; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 30px 20px 26px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .mobile-h2 { font-size: 18px !important; }
      .mobile-emoji { font-size: 36px !important; }
      .mobile-btn { padding: 14px 32px !important; font-size: 15px !important; }
      .mobile-email { font-size: 14px !important; }
      td[style*="width:42%"], td[style*="width:38%"], td[style*="width:45%"], td[style*="width:55%"] {
        display: block !important; width: 100% !important;
        padding: 10px 18px 2px !important; text-align: left !important;
      }
      td[style*="width:42%"] + td, td[style*="width:38%"] + td, td[style*="width:45%"] + td, td[style*="width:55%"] + td {
        display: block !important; width: 100% !important;
        padding: 0 18px 12px !important; text-align: left !important;
      }
      a[href^="mailto"], a[href^="tel"] { word-break: break-all !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EEF2F7;color:#1E293B;font-family:'Inter',Arial,Helvetica,sans-serif;direction:ltr;width:100%;min-width:100%;">

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
              <div class="mobile-emoji" style="font-size:44px;margin-bottom:12px;line-height:1;">✉️</div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">Confirm Your Email</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.75);">Just one step to activate your account</div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="content-pad" style="padding:36px 36px 24px;text-align:center;">
              <p class="mobile-h2" style="margin:0 0 10px;font-size:20px;font-weight:700;color:#008F8F;">Hello, Ahmed Mostafa!</p>
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.8;">
                Thank you for registering with GuestNa. We need to verify your email address
                to ensure your account is secure. Click the button below to complete the verification.
              </p>

              <!-- Email Address Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:28px;background:#F0FDFA;border:1.5px solid #D0EAEA;border-radius:12px;">
                <tr>
                  <td align="center" style="padding:18px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Email to confirm</p>
                    <a href="mailto:ahmad.m@school.edu.sa" class="mobile-email"
                       style="font-size:17px;font-weight:700;color:#008F8F;text-decoration:none;word-break:break-all;">ahmad.m@school.edu.sa</a>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <a href="https://guestna.vercel.app/ar/profile" class="mobile-btn"
                 style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 52px;border-radius:12px;box-shadow:0 4px 20px rgba(0,143,143,0.35);">
                ✅ Confirm Email
              </a>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td class="content-pad" style="padding:0 36px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FFFBEB;border:1.5px solid #FCD34D;border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#92400E;">⚠️ Security Notice</p>
                    <p style="margin:0;font-size:13px;color:#92400E;line-height:1.7;">
                      If you didn't create this account, please ignore this email.
                      This link is valid for <strong>30 minutes</strong> only.
                    </p>
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
              <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.7);font-weight:600;">
                
              </p>
              <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.45);">
                <a href="mailto:info@guestna.app" style="color:rgba(255,255,255,0.45);text-decoration:none;">info@guestna.app</a>
                <span style="color:rgba(255,255,255,0.2);margin:0 8px;">|</span>
                <a href="tel:+966552345678" style="color:rgba(255,255,255,0.45);text-decoration:none;display:inline-block;">+966547534666</a>
              </p>
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);">© 2025 GuestNa. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
