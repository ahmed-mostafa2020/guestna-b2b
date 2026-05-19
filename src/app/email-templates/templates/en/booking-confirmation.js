export const bookingConfirmationHTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Booking Confirmation - GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "Inter", Arial, Helvetica, sans-serif !important;
      background-color: #EEF2F7 !important;
      color: #1E293B !important;
      direction: ltr;
      width: 100%; min-width: 100%;
    }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 0 18px !important; }
      .content-pad-y { padding: 24px 18px !important; }
      .header-pad { padding: 28px 20px 24px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .ref-stack { display: block !important; width: 100% !important; padding: 14px 18px !important; text-align: left !important; }
      .support-stack { display: block !important; width: 100% !important; padding: 6px 0 !important; }
      .mobile-btn { padding: 14px 28px !important; font-size: 14px !important; }
      /* Stack 2-column detail rows on mobile */
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
<body style="margin:0;padding:0;background-color:#EEF2F7;font-family:'Inter',Arial,Helvetica,sans-serif;direction:ltr;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EEF2F7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="main-table" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td class="header-pad" style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:36px 36px 32px;text-align:center;">
              <img
                src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                alt="GuestNa Logo"
                width="130"
                style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;"
              />
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:5px 18px;font-size:11px;color:#ffffff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">
                Booking Confirmation
              </div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">
                ✅ Your Booking is Confirmed
              </div>
              <div style="font-size:14px;color:rgba(255,255,255,0.6);">
                Your school trip is booked and confirmed via GuestNa
              </div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- Booking Reference Banner -->
          <tr>
            <td class="content-pad" style="padding:24px 36px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F0FDFA;border-left:4px solid #008F8F;border-radius:0 10px 10px 0;margin-bottom:24px;">
                <tr>
                  <td class="ref-stack" style="padding:16px 20px;text-align:left;">
                    <div style="font-size:12px;font-weight:700;color:#008F8F;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px;">Booking Number</div>
                    <div style="font-size:20px;font-weight:700;color:#0A2540;">#GN-2025-4521</div>
                    <div style="font-size:13px;color:#64748B;margin-top:4px;">Confirmation Date: Tuesday, April 12, 2025</div>
                  </td>
                  <td class="ref-stack" style="padding:16px 20px;text-align:right;">
                    <span style="display:inline-block;background:#008F8F;color:#fff;font-size:12px;font-weight:700;padding:6px 16px;border-radius:50px;letter-spacing:0.5px;">✓ Confirmed</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td class="content-pad" style="padding:0 36px 16px;">
              <p style="font-size:16px;color:#1E293B;font-weight:600;margin:0 0 6px;text-align:left;">Dear Parent / Guardian</p>
              <p style="font-size:14px;color:#475569;line-height:1.8;margin:0;text-align:left;">
                We are pleased to inform you that your school trip booking has been confirmed through the <strong style="color:#008F8F;">GuestNa</strong> platform.
              </p>
            </td>
          </tr>

          <!-- Trip Details Card -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="width:42%;background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:left;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">Trip Details</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Trip Name</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;font-weight:700;">
                      <a href="#" style="color:#008F8F;text-decoration:none;border-bottom:1px dashed #008F8F;">Educational Farm Trip — Riyadh ↗</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Date</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Tuesday, May 20, 2025</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Departure Time</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">8:00 AM — 2:00 PM</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Number of Students</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">2 students</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Student Names</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Ahmed Mohammed — Sarah Ali</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Supervisor</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Ms. Sarah Al-Ahmadi</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Price Details Card -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="width:42%;background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:left;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">Price Details</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;width:42%;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:13px;color:#475569;font-weight:600;">Subtotal</div>
                  </td>
                  <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:14px;color:#1E293B;font-weight:600;font-family:monospace;">SAR 1,500.00</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:12px 20px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:13px;color:#475569;font-weight:600;">VAT (15%)</div>
                  </td>
                  <td style="padding:12px 20px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:14px;color:#1E293B;font-weight:600;font-family:monospace;">SAR 225.00</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:12px 20px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:13px;color:#475569;font-weight:600;">Quantity</div>
                  </td>
                  <td style="padding:12px 20px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:14px;color:#1E293B;font-weight:600;font-family:monospace;">25</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:14px 20px;background:#F0FDFA;text-align:left;">
                    <div style="font-size:14px;color:#0A2540;font-weight:700;">Grand Total</div>
                  </td>
                  <td style="padding:14px 20px;background:#F0FDFA;text-align:right;">
                    <div style="font-size:16px;color:#008F8F;font-weight:800;font-family:monospace;">SAR 1,725.00</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Meeting Point -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FFF8F0;border-left:4px solid #ED8A22;border-radius:0 10px 10px 0;">
                <tr>
                  <td style="padding:16px 20px;text-align:left;">
                    <a href="#" style="font-size:12px;font-weight:700;color:#ED8A22;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px;text-decoration:none;display:block;">📍 Meeting Point</a>
                    <div style="font-size:15px;color:#1E293B;font-weight:600;line-height:1.6;">Main School Entrance — Gate #2</div>
                    <div style="font-size:13px;color:#64748B;margin-top:6px;">Please arrive 15 minutes before the departure time</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Program Highlights -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:left;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">Program Highlights</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;text-align:left;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding:6px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                            <td width="28" style="text-align:left;padding-right:8px;vertical-align:top;"><div style="width:22px;height:22px;background-color:#008F8F;border-radius:50%;text-align:center;line-height:22px;"><span style="color:#fff;font-size:12px;font-weight:700;">✓</span></div></td>
                            <td style="text-align:left;"><p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">Explore modern farming environments and hydroponics techniques</p></td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                            <td width="28" style="text-align:left;padding-right:8px;vertical-align:top;"><div style="width:22px;height:22px;background-color:#008F8F;border-radius:50%;text-align:center;line-height:22px;"><span style="color:#fff;font-size:12px;font-weight:700;">✓</span></div></td>
                            <td style="text-align:left;"><p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">Interactive workshops on environmental science and sustainability</p></td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                            <td width="28" style="text-align:left;padding-right:8px;vertical-align:top;"><div style="width:22px;height:22px;background-color:#008F8F;border-radius:50%;text-align:center;line-height:22px;"><span style="color:#fff;font-size:12px;font-weight:700;">✓</span></div></td>
                            <td style="text-align:left;"><p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">Balanced, healthy lunch included in the price</p></td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                            <td width="28" style="text-align:left;padding-right:8px;vertical-align:top;"><div style="width:22px;height:22px;background-color:#008F8F;border-radius:50%;text-align:center;line-height:22px;"><span style="color:#fff;font-size:12px;font-weight:700;">✓</span></div></td>
                            <td style="text-align:left;"><p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">Specialized supervisors and certified safety protocols</p></td>
                          </tr></table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" class="content-pad" style="padding:0 36px 24px;">
              <a href="#" target="_blank" class="mobile-btn"
                 style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 44px;border-radius:10px;box-shadow:0 4px 20px rgba(0,143,143,0.3);letter-spacing:0.3px;">
                View Invoice & Payment Details →
              </a>
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
