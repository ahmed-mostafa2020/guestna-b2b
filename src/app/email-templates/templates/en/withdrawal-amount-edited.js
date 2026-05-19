export const withdrawalAmountEditedHTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Withdrawal Amount Updated - GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
    body { font-family: "Inter", Arial, Helvetica, sans-serif !important; direction: ltr; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 28px 20px 24px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .amount-col { display: block !important; width: 100% !important; padding: 0 0 12px !important; }
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
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">✏️ Your Withdrawal Amount Has Been Updated</div>
              <div style="font-size:14px;color:rgba(255,255,255,0.6);">Your withdrawal request has been adjusted by the admin team</div>
            </td>
          </tr>

          <!-- Orange Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#ED8A22,#F59E0B,#ED8A22);"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-pad" style="padding:32px 36px;">

              <!-- Alert Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#FFF8F0;border-left:4px solid #ED8A22;border-radius:0 10px 10px 0;padding:16px 20px;text-align:left;">
                    <div style="font-size:12px;font-weight:700;color:#ED8A22;margin-bottom:6px;">📝 Amount Updated</div>
                    <div style="font-size:14px;color:#92400E;line-height:1.7;">
                      The withdrawal amount for your request has been updated by the admin team. The new amount will appear in your withdrawal request.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 24px;text-align:left;">
                <strong>Dear School Manager,</strong> we'd like to inform you that the amount for your withdrawal request has been updated. Please review the details below.
              </p>

              <!-- Amount Comparison -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td class="amount-col" style="width:50%;padding-right:8px;vertical-align:top;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FEF2F2;border:1.5px solid #FCA5A5;border-radius:12px;text-align:center;">
                      <tr><td style="padding:16px 12px;">
                        <p style="margin:0 0 4px;color:#DC2626;font-size:12px;font-weight:700;">Previous Amount</p>
                        <p style="margin:0;color:#991B1B;font-size:16px;font-weight:700;text-decoration:line-through;">SAR 1,500.00</p>
                      </td></tr>
                    </table>
                  </td>
                  <td class="amount-col" style="width:50%;padding-left:8px;vertical-align:top;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F0FDF4;border:1.5px solid #86EFAC;border-radius:12px;text-align:center;">
                      <tr><td style="padding:16px 12px;">
                        <p style="margin:0 0 4px;color:#16A34A;font-size:12px;font-weight:700;">New Amount</p>
                        <p style="margin:0;color:#166534;font-size:20px;font-weight:700;">SAR 1,200.00</p>
                      </td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Details Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="width:42%;background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:left;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">Request & Trip Details</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">🔢 Order Number</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">#ORD-9923</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">🚌 Trip Name</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#008F8F;font-weight:600;">Educational Farm Trip</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">🏫 School Name</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Al-Noor International School</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">📅 Update Date</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">April 12, 2025</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">👥 Total Bookings</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">45 students</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">🏫 School Earnings</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:700;">SAR 1,200.00</div>
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
