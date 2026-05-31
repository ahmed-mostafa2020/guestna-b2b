// Ref: trip-recommendations (EN) — Personalised trip recommendations for user
export const tripRecommendationsHTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <base target="_blank" />
  <title>Your Recommended Trips - GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "Inter", Arial, sans-serif !important;
      background-color: #EEF2F7 !important;
      color: #1E293B !important;
      direction: ltr;
      width: 100%; min-width: 100%;
    }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 0 16px !important; }
      .header-pad { padding: 28px 20px 24px !important; }
      .footer-pad { padding: 24px 16px !important; }
      .mobile-h1 { font-size: 20px !important; }
      .stat-cell { display: block !important; width: 100% !important; text-align: left !important; padding: 8px 0 !important; }
      .btn-row td { display: block !important; width: 100% !important; padding: 6px 0 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EEF2F7;font-family:'Inter',Arial,sans-serif;direction:ltr;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EEF2F7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table class="main-table" role="presentation" cellspacing="0" cellpadding="0" border="0" width="620"
               style="max-width:620px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td class="header-pad" style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:36px 36px 32px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa Logo" width="120"
                   style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;" />
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:5px 18px;font-size:11px;color:#ffffff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">
                Your Recommended Trips
              </div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">
                🗺️ Trips Picked Just for You
              </div>
              <div style="font-size:14px;color:rgba(255,255,255,0.65);line-height:1.6;">
                Based on your request details and educational requirements, we've carefully selected these trips for you
              </div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- How We Picked Banner -->
          <tr>
            <td class="content-pad" style="padding:24px 36px 8px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="background:#F0FDFA;border-left:4px solid #008F8F;border-radius:0 10px 10px 0;">
                <tr>
                  <td style="padding:14px 20px;">
                    <div style="font-size:12px;font-weight:700;color:#008F8F;margin-bottom:4px;">💡 How were these trips selected?</div>
                    <div style="font-size:13px;color:#475569;line-height:1.7;">
                      We analysed your request based on: <strong style="color:#0A2540;">budget, educational stage, and student count</strong> — trips below are ranked by match percentage with your needs.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section Label -->
          <tr>
            <td class="content-pad" style="padding:20px 36px 12px;">
              <p style="margin:0;font-size:13px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;">Recommended Trips</p>
            </td>
          </tr>

          <!-- ═══════════════════════════════════ TRIP 1 ═══════════════════════════════════ -->
          <tr>
            <td class="content-pad" style="padding:0 36px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;">

                <tr>
                  <td style="padding:0;">
                    <div style="position:relative;width:100%;height:160px;overflow:hidden;background:linear-gradient(135deg,#8B7355,#C4A882);">
                      <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/trip-alula.jpg"
                           alt="AlUla Exploratory Journey"
                           width="100%" height="160"
                           style="display:block;width:100%;height:160px;object-fit:cover;border:0;"
                           onerror="this.style.display='none'" />
                      <div style="position:absolute;top:12px;right:12px;background:#008F8F;color:#ffffff;font-size:13px;font-weight:700;padding:5px 14px;border-radius:20px;box-shadow:0 2px 8px rgba(0,143,143,0.4);">
                        98% Match
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 20px 0;">
                    <div style="font-size:18px;font-weight:700;color:#0A2540;margin-bottom:6px;">AlUla Exploratory Journey</div>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-right:14px;">
                          <span style="font-size:13px;color:#64748B;">📍 Riyadh</span>
                        </td>
                        <td>
                          <span style="font-size:13px;color:#64748B;">🕐 6 hours</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px 20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                           style="background:#F0FDF4;border-radius:8px;">
                      <tr>
                        <td style="padding:10px 14px;">
                          <span style="font-size:11px;font-weight:700;color:#16A34A;">✦ Why recommended:</span>
                          <span style="font-size:12px;color:#334155;margin-left:4px;">Excellent match with your budget and educational stage</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                           style="border:1px solid #F1F5F9;border-radius:10px;overflow:hidden;">
                      <tr>
                        <td class="stat-cell" style="padding:10px 14px;text-align:center;border-right:1px solid #F1F5F9;">
                          <div style="font-size:11px;color:#94A3B8;margin-bottom:4px;">Available Seats</div>
                          <div style="font-size:16px;font-weight:700;color:#0A2540;">50 <span style="font-size:11px;font-weight:400;color:#64748B;">seats</span></div>
                        </td>
                        <td class="stat-cell" style="padding:10px 14px;text-align:center;border-right:1px solid #F1F5F9;">
                          <div style="font-size:11px;color:#94A3B8;margin-bottom:4px;">Per Student</div>
                          <div style="font-size:16px;font-weight:700;color:#0A2540;">SAR 250</div>
                        </td>
                        <td class="stat-cell" style="padding:10px 14px;text-align:center;">
                          <div style="font-size:11px;color:#94A3B8;margin-bottom:4px;">Total Price</div>
                          <div style="font-size:16px;font-weight:700;color:#008F8F;">SAR 12,500</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px 20px 0;">
                    <span style="display:inline-block;background:#F0F9FF;color:#0369A1;font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;margin-right:6px;">Educational Guide</span>
                    <span style="display:inline-block;background:#FFF7ED;color:#C2410C;font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;">Heritage Sites</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding:16px 20px 18px;">
                    <table class="btn-row" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-right:8px;">
                          <a href="https://guestna-b2b.vercel.app/en/discover/trip-alula"
                             target="_blank"
                             style="display:block;text-align:center;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 20px;border-radius:8px;">
                            Choose This Trip →
                          </a>
                        </td>
                        <td style="width:130px;">
                          <a href="https://guestna-b2b.vercel.app/en/packageInfo/trip-alula"
                             target="_blank"
                             style="display:block;text-align:center;background:#ffffff;color:#008F8F;text-decoration:none;font-size:14px;font-weight:700;padding:11px 20px;border-radius:8px;border:1.5px solid #008F8F;">
                            Details
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- ═══════════════════════════════════ TRIP 2 ═══════════════════════════════════ -->
          <tr>
            <td class="content-pad" style="padding:0 36px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;">

                <tr>
                  <td style="padding:0;">
                    <div style="position:relative;width:100%;height:160px;overflow:hidden;background:linear-gradient(135deg,#1E3A5F,#2E5FA3);">
                      <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/trip-innovation.jpg"
                           alt="Innovation at Ithra Knowledge Hub"
                           width="100%" height="160"
                           style="display:block;width:100%;height:160px;object-fit:cover;border:0;"
                           onerror="this.style.display='none'" />
                      <div style="position:absolute;top:12px;right:12px;background:#008F8F;color:#ffffff;font-size:13px;font-weight:700;padding:5px 14px;border-radius:20px;box-shadow:0 2px 8px rgba(0,143,143,0.4);">
                        95% Match
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 20px 0;">
                    <div style="font-size:18px;font-weight:700;color:#0A2540;margin-bottom:6px;">Innovation at Ithra Knowledge Hub</div>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-right:14px;">
                          <span style="font-size:13px;color:#64748B;">📍 Dhahran</span>
                        </td>
                        <td>
                          <span style="font-size:13px;color:#64748B;">🕐 Full Day</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px 20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                           style="background:#F0FDF4;border-radius:8px;">
                      <tr>
                        <td style="padding:10px 14px;">
                          <span style="font-size:11px;font-weight:700;color:#16A34A;">✦ Why recommended:</span>
                          <span style="font-size:12px;color:#334155;margin-left:4px;">Excellent match with your budget and educational stage</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                           style="border:1px solid #F1F5F9;border-radius:10px;overflow:hidden;">
                      <tr>
                        <td class="stat-cell" style="padding:10px 14px;text-align:center;border-right:1px solid #F1F5F9;">
                          <div style="font-size:11px;color:#94A3B8;margin-bottom:4px;">Available Seats</div>
                          <div style="font-size:16px;font-weight:700;color:#0A2540;">40 <span style="font-size:11px;font-weight:400;color:#64748B;">seats</span></div>
                        </td>
                        <td class="stat-cell" style="padding:10px 14px;text-align:center;border-right:1px solid #F1F5F9;">
                          <div style="font-size:11px;color:#94A3B8;margin-bottom:4px;">Per Student</div>
                          <div style="font-size:16px;font-weight:700;color:#0A2540;">SAR 320</div>
                        </td>
                        <td class="stat-cell" style="padding:10px 14px;text-align:center;">
                          <div style="font-size:11px;color:#94A3B8;margin-bottom:4px;">Total Price</div>
                          <div style="font-size:16px;font-weight:700;color:#008F8F;">SAR 14,400</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px 20px 0;">
                    <span style="display:inline-block;background:#F5F3FF;color:#7C3AED;font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;margin-right:6px;">Innovation Labs</span>
                    <span style="display:inline-block;background:#FFF7ED;color:#C2410C;font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;margin-right:6px;">STEM</span>
                    <span style="display:inline-block;background:#F0F9FF;color:#0369A1;font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;">Interactive Museum</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding:16px 20px 18px;">
                    <table class="btn-row" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-right:8px;">
                          <a href="https://guestna-b2b.vercel.app/en/discover/trip-ithra"
                             target="_blank"
                             style="display:block;text-align:center;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 20px;border-radius:8px;">
                            Choose This Trip →
                          </a>
                        </td>
                        <td style="width:130px;">
                          <a href="https://guestna-b2b.vercel.app/en/packageInfo/trip-ithra"
                             target="_blank"
                             style="display:block;text-align:center;background:#ffffff;color:#008F8F;text-decoration:none;font-size:14px;font-weight:700;padding:11px 20px;border-radius:8px;border:1.5px solid #008F8F;">
                            Details
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- ═══════════════════════════════════ TRIP 3 ═══════════════════════════════════ -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;">

                <tr>
                  <td style="padding:0;">
                    <div style="position:relative;width:100%;height:160px;overflow:hidden;background:linear-gradient(135deg,#2D5016,#4A7C59);">
                      <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/trip-farm.jpg"
                           alt="Educational Farm Trip"
                           width="100%" height="160"
                           style="display:block;width:100%;height:160px;object-fit:cover;border:0;"
                           onerror="this.style.display='none'" />
                      <div style="position:absolute;top:12px;right:12px;background:#ED8A22;color:#ffffff;font-size:13px;font-weight:700;padding:5px 14px;border-radius:20px;box-shadow:0 2px 8px rgba(237,138,34,0.4);">
                        90% Match
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 20px 0;">
                    <div style="font-size:18px;font-weight:700;color:#0A2540;margin-bottom:6px;">Educational Farm Trip</div>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-right:14px;">
                          <span style="font-size:13px;color:#64748B;">📍 Riyadh</span>
                        </td>
                        <td>
                          <span style="font-size:13px;color:#64748B;">🕐 Half Day</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px 20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                           style="background:#F0FDF4;border-radius:8px;">
                      <tr>
                        <td style="padding:10px 14px;">
                          <span style="font-size:11px;font-weight:700;color:#16A34A;">✦ Why recommended:</span>
                          <span style="font-size:12px;color:#334155;margin-left:4px;">Ideal for primary level, budget-friendly</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                           style="border:1px solid #F1F5F9;border-radius:10px;overflow:hidden;">
                      <tr>
                        <td class="stat-cell" style="padding:10px 14px;text-align:center;border-right:1px solid #F1F5F9;">
                          <div style="font-size:11px;color:#94A3B8;margin-bottom:4px;">Available Seats</div>
                          <div style="font-size:16px;font-weight:700;color:#0A2540;">60 <span style="font-size:11px;font-weight:400;color:#64748B;">seats</span></div>
                        </td>
                        <td class="stat-cell" style="padding:10px 14px;text-align:center;border-right:1px solid #F1F5F9;">
                          <div style="font-size:11px;color:#94A3B8;margin-bottom:4px;">Per Student</div>
                          <div style="font-size:16px;font-weight:700;color:#0A2540;">SAR 95</div>
                        </td>
                        <td class="stat-cell" style="padding:10px 14px;text-align:center;">
                          <div style="font-size:11px;color:#94A3B8;margin-bottom:4px;">Total Price</div>
                          <div style="font-size:16px;font-weight:700;color:#008F8F;">SAR 4,275</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px 20px 0;">
                    <span style="display:inline-block;background:#F0FDF4;color:#166534;font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;margin-right:6px;">Ecology & Farming</span>
                    <span style="display:inline-block;background:#FFF7ED;color:#C2410C;font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;">Specialist Supervisors</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding:16px 20px 18px;">
                    <table class="btn-row" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-right:8px;">
                          <a href="https://guestna-b2b.vercel.app/en/discover/trip-farm"
                             target="_blank"
                             style="display:block;text-align:center;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 20px;border-radius:8px;">
                            Choose This Trip →
                          </a>
                        </td>
                        <td style="width:130px;">
                          <a href="https://guestna-b2b.vercel.app/en/packageInfo/trip-farm"
                             target="_blank"
                             style="display:block;text-align:center;background:#ffffff;color:#008F8F;text-decoration:none;font-size:14px;font-weight:700;padding:11px 20px;border-radius:8px;border:1.5px solid #008F8F;">
                            Details
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- View All CTA -->
          <tr>
            <td class="content-pad" align="center" style="padding:0 36px 28px;">
              <a href="https://guestna-b2b.vercel.app/en/discover"
                 target="_blank"
                 style="display:inline-block;background:transparent;color:#008F8F;text-decoration:none;font-size:14px;font-weight:700;padding:13px 36px;border-radius:10px;border:1.5px solid #008F8F;letter-spacing:0.3px;">
                Browse All Available Trips →
              </a>
            </td>
          </tr>

          <!-- Support Banner -->
          <tr>
            <td class="content-pad" style="padding:0 36px 28px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="background:#FFF8F0;border-left:4px solid #ED8A22;border-radius:0 10px 10px 0;">
                <tr>
                  <td style="padding:14px 20px;">
                    <div style="font-size:13px;font-weight:700;color:#ED8A22;margin-bottom:4px;">🤝 Need help?</div>
                    <div style="font-size:13px;color:#475569;line-height:1.6;">
                      Our trip experts are available to help you customise the itinerary —
                      <a href="https://guestna-b2b.vercel.app/en/contact-us" style="color:#ED8A22;font-weight:700;text-decoration:none;">Talk to us</a>
                    </div>
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
              <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.45);">
                <a href="mailto:info@guestna.app" style="color:rgba(255,255,255,0.45);text-decoration:none;">info@guestna.app</a>
                <span style="color:rgba(255,255,255,0.2);margin:0 8px;">|</span>
                <a href="tel:+966547534666" style="color:rgba(255,255,255,0.45);text-decoration:none;display:inline-block;">+966 54 753 4666</a>
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:rgba(255,255,255,0.3);">© 2025 GuestNa. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
