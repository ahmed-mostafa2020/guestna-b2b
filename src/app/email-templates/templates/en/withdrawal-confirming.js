export const withdrawalConfirmingHTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Withdrawal Confirmed - GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
    body { font-family: "Inter", Arial, Helvetica, sans-serif !important; direction: ltr; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 28px 20px 24px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .mobile-amount { font-size: 26px !important; }
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
            <td class="header-pad" style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:36px 36px 32px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" alt="GuestNa Logo" width="130" style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;" />
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:5px 18px;font-size:11px;color:#fff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">Finance Alert</div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">✅ Withdrawal Confirmed & Processed</div>
              <div style="font-size:14px;color:rgba(255,255,255,0.6);">Your funds have been transferred successfully</div>
            </td>
          </tr>

          <!-- Green Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#10B981,#059669,#10B981);"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-pad" style="padding:32px 36px;">

              <!-- Alert Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#F0FDF4;border-left:4px solid #10B981;border-radius:0 10px 10px 0;padding:16px 20px;text-align:left;">
                    <div style="font-size:12px;font-weight:700;color:#059669;margin-bottom:6px;">💰 Transfer Complete</div>
                    <div style="font-size:14px;color:#065F46;line-height:1.7;">
                      We're pleased to inform you that your withdrawal request has been confirmed, processed, and the funds have been transferred to your account.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Amount Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td align="center" style="padding:24px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;">
                    <div style="font-size:13px;color:#64748B;font-weight:600;margin-bottom:8px;text-transform:uppercase;">Amount Transferred</div>
                    <div class="mobile-amount" style="font-size:32px;color:#1E293B;font-weight:700;margin-bottom:4px;">SAR 1,200.00</div>
                    <div style="font-size:12px;color:#10B981;font-weight:700;background:#D1FAE5;display:inline-block;padding:4px 12px;border-radius:50px;">Transferred ✓</div>
                  </td>
                </tr>
              </table>

              <!-- Transfer Info -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:left;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">Transfer Information</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Order Number</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">#ORD-9923</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Withdrawal Method</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Bank Transfer</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Recipient Bank</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Saudi National Bank</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Account Name</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Al-Noor International School</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">IBAN</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:14px;color:#008F8F;font-weight:600;font-family:monospace;word-break:break-all;">SA98 1000 0000 0001 **** **** 012</div>
                  </td>
                </tr>
              </table>

              <!-- Attachment Note -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:10px;text-align:center;">
                    <p style="margin:0;font-size:13px;color:#475569;">
                      📎 We've attached the bank transfer receipt and a copy of the invoice with this email for your future reference.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Info -->
              <p style="font-size:13px;color:#94A3B8;text-align:center;line-height:1.6;margin:0;">
                The amount usually reflects in your account within 1 to 3 business days, depending on your bank.<br/>
                Thank you for trusting GuestNa.
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
                <a href="mailto:finance@guestna.app" style="color:rgba(255,255,255,0.45);text-decoration:none;">finance@guestna.app</a>
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
