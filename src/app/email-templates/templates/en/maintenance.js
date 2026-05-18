export const maintenanceHTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Scheduled Maintenance Notice - GuestNa</title>
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
      .mobile-cell-label { padding: 12px 16px !important; }
      .mobile-cell-value { padding: 12px 16px !important; }
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
            <td class="header-pad" style="background:linear-gradient(150deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:40px 36px 36px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa Logo" width="120"
                   style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;" />
              <div class="mobile-emoji" style="font-size:44px;margin-bottom:12px;line-height:1;">🔧</div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">Scheduled System Maintenance</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.75);">Notice of a planned temporary outage</div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#F59E0B,#ED8A22,#F59E0B);"></td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background:#FFFBEB;border-bottom:1px solid #FDE68A;padding:16px 36px;text-align:center;">
              <p style="margin:0;font-size:14px;font-weight:700;color:#92400E;">
                ⚠️ The system will be unavailable during the scheduled maintenance window
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="content-pad" style="padding:32px 36px 24px;text-align:center;">
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.8;">
                We're informing you that the GuestNa technical team will be performing scheduled maintenance to improve performance and update the platform's technical infrastructure.
                We apologize for any inconvenience this may cause.
              </p>
            </td>
          </tr>

          <!-- Maintenance Window -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="width:45%;background:#0f3460;padding:14px 20px;text-align:center;">
                    <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;">🗓️ Maintenance Window</p>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-cell-label" style="padding:16px 20px;width:45%;border-bottom:1px solid #F1F5F9;background:#F8FAFC;text-align:left;">
                    <p style="margin:0;font-size:12px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Date</p>
                  </td>
                  <td class="mobile-cell-value" style="padding:16px 20px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <p style="margin:0;font-size:15px;color:#1E293B;font-weight:700;">Tuesday, March 17, 2026</p>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-cell-label" style="padding:16px 20px;width:45%;border-bottom:1px solid #F1F5F9;background:#F8FAFC;text-align:left;">
                    <p style="margin:0;font-size:12px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Time</p>
                  </td>
                  <td class="mobile-cell-value" style="padding:16px 20px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <p style="margin:0;font-size:15px;color:#1E293B;font-weight:700;">11:00 PM — 1:00 AM (Riyadh Time)</p>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-cell-label" style="padding:16px 20px;width:45%;background:#F8FAFC;text-align:left;">
                    <p style="margin:0;font-size:12px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Expected Duration</p>
                  </td>
                  <td class="mobile-cell-value" style="padding:16px 20px;text-align:left;">
                    <span style="display:inline-block;background:#FEF3C7;color:#92400E;font-size:13px;font-weight:700;padding:4px 14px;border-radius:50px;">~2 hours</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What to Expect -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F0FDFA;border:1px solid #D0EAEA;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="background:#008F8F;padding:12px 20px;">
                    <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;">📋 What's happening during maintenance?</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr><td style="padding:6px 0;font-size:14px;color:#334155;">⚙️ &nbsp; Server infrastructure updates</td></tr>
                      <tr><td style="padding:6px 0;font-size:14px;color:#334155;">🔒 &nbsp; Enhanced security and protection measures</td></tr>
                      <tr><td style="padding:6px 0;font-size:14px;color:#334155;">⚡ &nbsp; Improved speed and platform performance</td></tr>
                      <tr><td style="padding:6px 0;font-size:14px;color:#334155;">🐛 &nbsp; Fixes for known technical issues</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Recommendations -->
          <tr>
            <td class="content-pad" style="padding:0 36px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1D4ED8;">💡 Our recommendations before maintenance</p>
                    <p style="margin:0;font-size:13px;color:#1E40AF;line-height:1.8;">
                      • Complete any urgent transactions or requests before maintenance begins<br/>
                      • Save any important data locally on your device<br/>
                      • The system will be fully operational immediately after maintenance ends
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td align="center" style="padding:0 36px 32px;">
              <p style="margin:0;font-size:13px;color:#64748B;line-height:1.7;">
                For urgent inquiries during maintenance, contact us at:
                <a href="mailto:support@guestna.app" style="color:#008F8F;font-weight:600;text-decoration:none;">support@guestna.app</a>
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
                <a href="https://guestna.app" style="color:rgba(255,255,255,0.7);text-decoration:none;">GuestNa Educational Trips Platform</a>
              </p>
              <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.45);">
                <a href="mailto:support@guestna.app" style="color:rgba(255,255,255,0.45);text-decoration:none;">support@guestna.app</a>
                <span style="color:rgba(255,255,255,0.2);margin:0 8px;">|</span>
                <a href="tel:+966552345678" style="color:rgba(255,255,255,0.45);text-decoration:none;display:inline-block;">+966 55 234 5678</a>
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
