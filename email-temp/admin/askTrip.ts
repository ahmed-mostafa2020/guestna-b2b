export const askTripTemplet = (
  schoolName: string,
  trip: string,
  url: string,
  email: string,
  phone: string,
  seats: number,
  date: string,
  requestDate: string
): string => {
  const htmlTemp = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>School Trip Request - GuestNa Admin</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #EEF2F7; color: #1E293B; font-family: Arial, Helvetica, sans-serif; width: 100%; min-width: 100%;">

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #EEF2F7;">
      <tr>
        <td align="center" style="padding: 32px 16px;">

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; margin: 0 auto; box-shadow: 0 8px 40px rgba(10,37,64,0.12);">

            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(150deg, #0A2540 0%, #0B6B85 60%, #0B9A9A 100%); padding: 36px 36px 32px; text-align: center;">
                <img
                  src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                  alt="GuestNa Logo"
                  width="130"
                  style="display: block; margin: 0 auto 20px; filter: brightness(0) invert(1); border: 0;"
                />
                <div style="display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; padding: 5px 18px; font-size: 15px; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 16px;">
                  Admin Notification
                </div>
                <div style="font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 8px; line-height: 1.3;">
                  New School Trip Request
                </div>
                <div style="font-size: 14px; color: rgba(255,255,255,0.6);">
                  A school group inquiry is awaiting your review
                </div>
              </td>
            </tr>

            <!-- Accent Line -->
            <tr>
              <td style="height: 4px; background: linear-gradient(90deg, #00B4D8, #0077B6, #00B4D8);"></td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 32px 36px;">

                <!-- Alert Box -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background: #F0FDFA; border-left: 4px solid #0B9A9A; border-radius: 0 10px 10px 0; padding: 16px 20px;">
                      <div style="font-size: 15px; color: #0B7A6A; font-weight: 600; line-height: 1.6;">
                        A school has submitted a trip request through your educational portal. Please review the details below and coordinate the group booking promptly within <strong>12 hours</strong>.
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Info Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
                  <!-- Card Header -->
                  <tr>
                    <td colspan="2" style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 12px 20px;">
                      <span style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px;">School Trip Details</span>
                    </td>
                  </tr>
                  <!-- Rows -->
                  <tr>
                    <td style="padding: 14px 20px 6px; width: 42%; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">School Name</div>
                    </td>
                    <td style="padding: 14px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${schoolName || "-"}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Email Address</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${email || "-"}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Phone Number</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${phone || "-"}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Requested Trip</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #0B7A6A; font-weight: 700;">${trip}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Number of Students</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${seats || "-"}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Preferred Date</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${date || "-"}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 14px;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Request Date</div>
                    </td>
                    <td style="padding: 10px 20px 14px;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${requestDate}</div>
                    </td>
                  </tr>
                </table>

                <!-- CTA Button -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="center" style="padding-top: 8px;">
                      <a href="${url}"
                         target="_blank"
                         style="display: inline-block; background: linear-gradient(135deg, #0B7A8A, #0A5A7C); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 15px 44px; border-radius: 10px; box-shadow: 0 4px 20px rgba(11,122,138,0.3); letter-spacing: 0.3px;">
                        Manage School Request &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #0A2540; padding: 24px 36px; text-align: center;">
                <img
                  src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                  alt="GuestNa"
                  width="90"
                  style="display: block; margin: 0 auto 12px; filter: brightness(0) invert(1); opacity: 0.85; border: 0;"
                />
                <p style="margin: 0 0 8px; font-size: 12px; color: rgba(255,255,255,0.35);">&copy; 2024 GuestNa. All rights reserved.</p>
                <p style="margin: 0; font-size: 12px;">
                  <a href="#" style="color: rgba(255,255,255,0.45); text-decoration: none;">Unsubscribe</a>
                  <span style="color: rgba(255,255,255,0.2); margin: 0 6px;">&middot;</span>
                  <a href="#" style="color: rgba(255,255,255,0.45); text-decoration: none;">Privacy Policy</a>
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
`;

  return htmlTemp;
};
