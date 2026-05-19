export const tripRequestHTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <base target="_blank" />
  <title>New School Trip Request - GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
    body { font-family: "Inter", Arial, Helvetica, sans-serif !important; direction: ltr; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 28px 20px 24px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .ref-stack { display: block !important; width: 100% !important; padding: 16px !important; text-align: left !important; }
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
            <td class="header-pad" style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:36px 36px 32px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" alt="GuestNa Logo" width="130" style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;" />
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:5px 18px;font-size:11px;color:#ffffff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">
                Internal Alert — GuestNa Team
              </div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">
                📋 New School Trip Request
              </div>
              <div style="font-size:14px;color:rgba(255,255,255,0.6);">
                A custom trip request has been received — please review and follow up
              </div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-pad" style="padding:32px 36px;">

              <!-- Request Reference -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;background:#F0FDFA;border-left:4px solid #008F8F;border-radius:0 10px 10px 0;">
                <tr>
                  <td class="ref-stack" style="padding:16px 20px;text-align:left;">
                    <div style="font-size:12px;color:#008F8F;font-weight:700;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.6px;">Request Number</div>
                    <div style="font-size:20px;font-weight:700;color:#0A2540;">#REQ-2025-0211</div>
                    <div style="font-size:13px;color:#64748B;margin-top:4px;">Request Date: Saturday, April 12, 2025</div>
                  </td>
                  <td class="ref-stack" style="padding:16px 20px;text-align:right;">
                    <span style="display:inline-block;background:#F59E0B;color:#fff;font-size:12px;font-weight:700;padding:6px 16px;border-radius:50px;">⏳ Under Review</span>
                  </td>
                </tr>
              </table>

              <!-- Alert -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#FFF8F0;border-left:4px solid #ED8A22;border-radius:0 10px 10px 0;padding:16px 20px;text-align:left;">
                    <div style="font-size:13px;color:#92400E;font-weight:600;line-height:1.6;">
                      A new custom trip request has been registered. Please review and contact the school within <strong>2 business days</strong> to confirm details and send a quote.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- School Info Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="width:42%;background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:left;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">Requesting School Information</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">School Name</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Al-Ufuq Scientific School — Jeddah</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Contact Person</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Mr. Khalid Al-Otaibi — Activities Coordinator</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Email</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#008F8F;font-weight:500;word-break:break-all;">k.alateebi@ufuq-school.edu.sa</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Mobile Number</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">+966547534666</div>
                  </td>
                </tr>
              </table>

              <!-- Trip Requirements -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="width:42%;background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:left;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">Trip Requirements</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Trip Type</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#008F8F;font-weight:700;">Scientific Trip — Space & Tech Lab</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Number of Students</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">60 students</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Age Group / Grade</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Middle School (ages 12–15)</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Preferred Date</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Window: June 1–15, 2025</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Duration</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">Full day (6–8 hours)</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">Approximate Budget</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:left;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">SAR 80–120 / student</div>
                  </td>
                </tr>
              </table>

              <!-- Special Requirements -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#EFF6FF;border-left:4px solid #3B82F6;border-radius:0 10px 10px 0;padding:16px 20px;text-align:left;">
                    <div style="font-size:12px;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px;">💬 Special Requirements</div>
                    <div style="font-size:14px;color:#1E40AF;line-height:1.7;">
                      The program should align with the Grade 7 science curriculum. Interactive workshops are requested with no more than 20 students per group, and a light snack should be provided during the trip.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="text-align:left;padding-bottom:12px;">
                    <div style="font-size:14px;font-weight:700;color:#1E293B;">Next Steps</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                      <td width="40" style="text-align:left;padding-right:12px;vertical-align:top;"><div style="width:28px;height:28px;background:#008F8F;border-radius:50%;text-align:center;line-height:28px;"><span style="color:#fff;font-size:13px;font-weight:700;">1</span></div></td>
                      <td style="text-align:left;">
                        <p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;">Review trip requirements</p>
                        <p style="margin:2px 0 0;color:#94A3B8;font-size:12px;">GuestNa team reviews the request and selects the best available providers</p>
                      </td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                      <td width="40" style="text-align:left;padding-right:12px;vertical-align:top;"><div style="width:28px;height:28px;background:#ED8A22;border-radius:50%;text-align:center;line-height:28px;"><span style="color:#fff;font-size:13px;font-weight:700;">2</span></div></td>
                      <td style="text-align:left;">
                        <p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;">Send custom proposal</p>
                        <p style="margin:2px 0 0;color:#94A3B8;font-size:12px;">Proposals with program details and pricing within 2 business days</p>
                      </td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                      <td width="40" style="text-align:left;padding-right:12px;vertical-align:top;"><div style="width:28px;height:28px;background:#CBD5E1;border-radius:50%;text-align:center;line-height:28px;"><span style="color:#64748B;font-size:13px;font-weight:700;">3</span></div></td>
                      <td style="text-align:left;">
                        <p style="margin:0;color:#64748B;font-size:14px;font-weight:600;">Confirm booking and process payment</p>
                        <p style="margin:2px 0 0;color:#94A3B8;font-size:12px;">After approval, the booking is finalized and an invoice is issued</p>
                      </td>
                    </tr></table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-top:8px;">
                    <a href="https://guestna-revamp-dashboard.vercel.app/b2b/askTrips" target="_blank" class="mobile-btn"
                       style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 44px;border-radius:10px;box-shadow:0 4px 20px rgba(0,143,143,0.3);letter-spacing:0.3px;">
                      Follow Up on Request →
                    </a>
                    <p style="margin:12px 0 0;color:#94A3B8;font-size:12px;text-align:center;">The school will be contacted directly via email or phone</p>
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
