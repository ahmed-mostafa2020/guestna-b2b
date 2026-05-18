export const adminNewUserHTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>New B2B User - Admin Panel</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
    body { font-family: "Inter", Arial, Helvetica, sans-serif !important; direction: ltr; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 30px 20px 26px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .mobile-emoji { font-size: 36px !important; }
      .mobile-btn-stack { display: block !important; padding: 0 !important; margin-bottom: 10px !important; }
      .mobile-btn { display: block !important; padding: 13px 20px !important; font-size: 14px !important; }
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
              <div class="mobile-emoji" style="font-size:44px;margin-bottom:12px;line-height:1;">🏫</div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">New Educational Institution Joined</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.75);">Admin alert — review and activation required</div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- Alert Bar -->
          <tr>
            <td style="background:#F0FDFA;border-bottom:1px solid #D0EAEA;padding:14px 36px;text-align:center;">
              <span style="display:inline-block;background:#008F8F;color:#fff;font-size:12px;font-weight:700;padding:6px 20px;border-radius:50px;">🆕 New registration awaiting review</span>
            </td>
          </tr>

          <!-- School Details -->
          <tr>
            <td class="content-pad" style="padding:28px 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:center;">
                    <span style="font-size:13px;font-weight:700;color:#008F8F;">🏫 Institution Details</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;width:38%;border-bottom:1px solid #F1F5F9;background:#FAFAFA;text-align:left;">
                    <p style="margin:0;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Institution Name</p>
                  </td>
                  <td style="padding:12px 20px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <p style="margin:0;font-size:14px;color:#1E293B;font-weight:700;">Al-Noor International School</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;background:#FAFAFA;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <p style="margin:0;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Responsible Manager</p>
                  </td>
                  <td style="padding:12px 20px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <p style="margin:0;font-size:14px;color:#1E293B;font-weight:600;">Mr. Ahmed Mostafa</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;background:#FAFAFA;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <p style="margin:0;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Email</p>
                  </td>
                  <td style="padding:12px 20px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <a href="mailto:ahmad.m@school.edu.sa" style="font-size:14px;color:#008F8F;font-weight:500;text-decoration:none;word-break:break-all;">ahmad.m@school.edu.sa</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;background:#FAFAFA;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <p style="margin:0;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Phone Number</p>
                  </td>
                  <td style="padding:12px 20px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <a href="tel:+966501234567" style="font-size:14px;color:#1E293B;font-weight:600;text-decoration:none;">+966 50 123 4567</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;background:#FAFAFA;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <p style="margin:0;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Location</p>
                  </td>
                  <td style="padding:12px 20px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <a href="https://maps.google.com/?q=Jeddah,Saudi+Arabia"
                       style="font-size:14px;color:#008F8F;font-weight:500;text-decoration:none;">📍 Jeddah, Saudi Arabia</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;background:#FAFAFA;text-align:left;">
                    <p style="margin:0;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Registration Date</p>
                  </td>
                  <td style="padding:12px 20px;text-align:left;">
                    <p style="margin:0;font-size:14px;color:#1E293B;font-weight:600;">March 17, 2026 — 12:51 PM</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FFFBEB;border:1.5px solid #FCD34D;border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;text-align:center;">
                    <span style="display:inline-block;background:#FEF3C7;color:#92400E;font-size:13px;font-weight:700;padding:6px 20px;border-radius:50px;margin-bottom:8px;">⏳ Account Pending Review and Activation</span>
                    <p style="margin:6px 0 0;font-size:13px;color:#92400E;line-height:1.7;">
                      Please review the institution's information and complete the necessary verification before activating the account
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Buttons -->
          <tr>
            <td align="center" style="padding:0 36px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td class="mobile-btn-stack" style="padding-right:8px;text-align:center;">
                    <a href="https://guestna.app/admin/users/approve" class="mobile-btn"
                       style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 28px;border-radius:10px;box-shadow:0 4px 16px rgba(0,143,143,0.3);">
                      ✅ Activate Account
                    </a>
                  </td>
                  <td class="mobile-btn-stack" style="padding-left:8px;text-align:center;">
                    <a href="https://guestna.app/admin/users" class="mobile-btn"
                       style="display:inline-block;background:#F8FAFC;color:#475569;text-decoration:none;font-size:14px;font-weight:600;padding:13px 28px;border-radius:10px;border:1.5px solid #E2E8F0;">
                      👁️ View in Dashboard
                    </a>
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
                <a href="https://guestna.app" style="color:rgba(255,255,255,0.7);text-decoration:none;">GuestNa Educational Trips Platform</a>
              </p>
              <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.45);">
                <a href="mailto:support@guestna.app" style="color:rgba(255,255,255,0.45);text-decoration:none;">support@guestna.app</a>
                <span style="color:rgba(255,255,255,0.2);margin:0 8px;">|</span>
                <a href="tel:+966552345678" style="color:rgba(255,255,255,0.45);text-decoration:none;">+966 55 234 5678</a>
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
