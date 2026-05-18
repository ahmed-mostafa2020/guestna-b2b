export const tripLimitHTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Trip Limit Increase Request - GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
    body { font-family: "Inter", Arial, Helvetica, sans-serif !important; direction: ltr; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 28px 20px 24px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .mobile-emoji { font-size: 32px !important; }
      .mobile-stat { font-size: 28px !important; }
      .mobile-btn { padding: 14px 28px !important; font-size: 14px !important; }
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

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="main-table" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td class="header-pad" style="background:linear-gradient(150deg,#0A2540 0%,#0B6B85 60%,#0B9A9A 100%);padding:36px 36px 32px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" alt="GuestNa Logo" width="130" style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;" />
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:5px 18px;font-size:11px;color:#fff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">Admin Alert</div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">⚠️ Trip Limit Increase Request</div>
              <div style="font-size:14px;color:rgba(255,255,255,0.6);">Maximum trip limit has been reached</div>
            </td>
          </tr>

          <!-- Orange Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#F59E0B,#D97706,#F59E0B);"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-pad" style="padding:32px 36px;">

              <!-- Alert Badge -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#FFF8F0;border:2px solid #F59E0B;border-radius:12px;padding:20px;text-align:center;">
                    <div class="mobile-emoji" style="font-size:36px;margin-bottom:10px;line-height:1;">🚨</div>
                    <div style="background:#F59E0B;color:#fff;display:inline-block;padding:6px 20px;border-radius:20px;font-size:13px;font-weight:700;margin-bottom:10px;letter-spacing:0.5px;">Maximum Trip Limit Reached</div>
                    <p style="color:#92400E;font-weight:600;margin:8px 0 0;font-size:14px;line-height:1.6;">
                      A team member attempted to request a new trip but has reached the maximum limit
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 24px;text-align:left;">
                Dear School Manager, one of your team members has reached the maximum trip limit and needs approval to request additional trips. Please review the details below and decide whether to raise their quota.
              </p>

              <!-- Trip Status Visual -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td align="center" style="padding:20px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;">
                    <div style="font-size:13px;font-weight:700;color:#92400E;margin-bottom:10px;">📊 Current Trip Status</div>
                    <div style="font-size:13px;color:#78350F;margin-bottom:12px;">Trips Used / Maximum Allowed</div>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
                      <tr>
                        <td align="center" style="padding:6px 20px;">
                          <div class="mobile-stat" style="font-size:36px;font-weight:700;color:#EF4444;">5</div>
                          <div style="font-size:11px;color:#64748B;font-weight:600;text-transform:uppercase;">Used</div>
                        </td>
                        <td align="center" style="padding:6px 10px;">
                          <div style="font-size:24px;color:#CBD5E1;">/</div>
                        </td>
                        <td align="center" style="padding:6px 20px;">
                          <div class="mobile-stat" style="font-size:36px;font-weight:700;color:#F59E0B;">5</div>
                          <div style="font-size:11px;color:#64748B;font-weight:600;text-transform:uppercase;">Limit</div>
                        </td>
                      </tr>
                    </table>
                    <div style="background:#FDE68A;border-radius:50px;height:10px;width:220px;margin:14px auto 0;overflow:hidden;">
                      <div style="background:#EF4444;height:10px;width:100%;border-radius:50px;"></div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Client Info Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:left;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">Client Information</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">👤 Client Name</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Mr. Khalid Al-Otaibi</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">📧 Email</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#008F8F;font-weight:500;word-break:break-all;">k.alateebi@ufuq-school.edu.sa</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">🏫 Institution</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Al-Ufuq Scientific School</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">📈 Current Limit</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#F59E0B;font-weight:700;">5 trips</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">🎒 Trips Used</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:15px;color:#EF4444;font-weight:700;">5 trips (full)</div>
                  </td>
                </tr>
              </table>

              <!-- What This Means -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#EFF6FF;border-left:4px solid #3B82F6;border-radius:0 10px 10px 0;padding:16px 20px;text-align:left;">
                    <div style="font-size:12px;font-weight:700;color:#3B82F6;margin-bottom:8px;">💡 What this means:</div>
                    <div style="font-size:14px;color:#1E40AF;line-height:1.8;">
                      • Mr. Khalid Al-Otaibi has used all 5 available trip slots<br/>
                      • He needs more trips to continue booking educational experiences<br/>
                      • You can increase his limit to allow additional trip requests<br/>
                      • The change takes effect immediately upon approval
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Required -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#FFF8F0;border-left:4px solid #ED8A22;border-radius:0 10px 10px 0;padding:16px 20px;text-align:left;">
                    <div style="font-size:12px;font-weight:700;color:#ED8A22;margin-bottom:6px;">⚡ Action Required</div>
                    <div style="font-size:14px;color:#92400E;line-height:1.7;">
                      Click the button below to review and increase the trip limit for <strong>Mr. Khalid Al-Otaibi</strong>. Once approved, he'll be able to request additional trips immediately.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="#" class="mobile-btn" style="display:inline-block;background:linear-gradient(135deg,#F59E0B,#D97706);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 44px;border-radius:10px;box-shadow:0 4px 20px rgba(245,158,11,0.4);">
                      📈 Increase Trip Limit →
                    </a>
                    <p style="margin:10px 0 0;font-size:12px;color:#94A3B8;text-align:center;">Increasing this limit will help your team organize more educational experiences.</p>
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
