export const tripRejectHTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Trip Request Update - GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
    body { font-family: "Inter", Arial, Helvetica, sans-serif !important; direction: ltr; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 28px 20px 24px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
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
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:5px 18px;font-size:11px;color:#fff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">Trip Update</div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">Trip Request Update</div>
              <div style="font-size:14px;color:rgba(255,255,255,0.6);">❌ Your trip request has been declined</div>
            </td>
          </tr>

          <!-- Red Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#EF4444,#DC2626,#EF4444);"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-pad" style="padding:32px 36px;">

              <!-- Body Text -->
              <p style="font-size:15px;line-height:1.7;color:#475569;margin:0 0 24px;text-align:left;">
                Thank you for submitting your trip request. After careful review, we regret to inform you that the request hasn't been approved at this time.
              </p>

              <!-- Info Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="width:42%;background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:left;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">Request Details</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">🆔 Request Number</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#EF4444;font-weight:700;">#REQ-2025-0211</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">🏢 Institution</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Al-Ufuq Scientific School</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">📧 Email</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;word-break:break-all;">k.alateebi@ufuq-school.edu.sa</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">📱 Phone Number</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">+966547534666</div>
                  </td>
                </tr>
              </table>

              <!-- Rejection Reason -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#FEF2F2;border-left:4px solid #EF4444;border-radius:0 10px 10px 0;padding:16px 20px;text-align:left;">
                    <div style="font-size:12px;font-weight:700;color:#EF4444;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px;">📝 Reason for Decline</div>
                    <div style="font-size:14px;color:#7F1D1D;line-height:1.7;">
                      Unfortunately, there is insufficient capacity available on the requested date. Please choose an alternative date or inquire about available programs.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Footer Note -->
              <p style="font-size:14px;color:#64748B;line-height:1.7;text-align:left;margin:0 0 24px;">
                You're welcome to submit a new request with updated details, and our team will be happy to review it again.
              </p>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="#" class="mobile-btn" style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 44px;border-radius:10px;box-shadow:0 4px 20px rgba(0,143,143,0.3);">
                      Submit a New Request →
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
