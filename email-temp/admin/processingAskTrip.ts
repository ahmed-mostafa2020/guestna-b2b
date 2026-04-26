import { B2bAskTripsStatus } from "@src/modules/b2b/askTrips/dto/askTrip.dto";

interface StatusConfig {
  color: string;
  bgColor: string;
  icon: string;
  title: string;
  message: string;
}

const statusConfigs: Record<B2bAskTripsStatus, StatusConfig> = {
  [B2bAskTripsStatus.PENDING]: {
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    icon: "⏳",
    title: "Request Under Review",
    message:
      "Your trip request is currently being reviewed by our team. We will get back to you shortly with confirmation.",
  },
  [B2bAskTripsStatus.PENDING_COMPANY_APPROVAL]: {
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    icon: "📋",
    title: "Awaiting Company Approval",
    message:
      "Your trip request has been processed and is now pending final approval from our management team.",
  },
  [B2bAskTripsStatus.APPROVED]: {
    color: "#22C55E",
    bgColor: "#F0FDF4",
    icon: "✅",
    title: "Request Approved!",
    message:
      "Great news! Your school trip request has been approved. Please review the details below.",
  },
  [B2bAskTripsStatus.SCHEDULED]: {
    color: "#0B9A9A",
    bgColor: "#F0FDFA",
    icon: "📅",
    title: "Trip Scheduled",
    message:
      "Your school trip has been scheduled and confirmed. All arrangements are in place for your educational adventure!",
  },
  [B2bAskTripsStatus.DONE]: {
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
    icon: "🎉",
    title: "Trip Completed",
    message:
      "Your school trip has been completed successfully. We hope you had a wonderful educational experience!",
  },
  [B2bAskTripsStatus.ENDED]: {
    color: "#64748B",
    bgColor: "#F1F5F9",
    icon: "🏁",
    title: "Trip Ended",
    message:
      "This school trip has concluded. Thank you for choosing GuestNa for your educational journey.",
  },
  [B2bAskTripsStatus.REJECTED]: {
    color: "#EF4444",
    bgColor: "#FEF2F2",
    icon: "❌",
    title: "Request Not Approved",
    message:
      "Unfortunately, we are unable to accommodate your trip request at this time. Please see the details below.",
  },
  [B2bAskTripsStatus.CANCLED]: {
    color: "#EF4444",
    bgColor: "#FEF2F2",
    icon: "🚫",
    title: "Trip Cancelled",
    message:
      "This trip request has been cancelled. If you have any questions, please contact our support team.",
  },
  [B2bAskTripsStatus.ON_HOLD]: {
    color: "#F97316",
    bgColor: "#FFF7ED",
    icon: "⏸️",
    title: "Request On Hold",
    message:
      "Your trip request is temporarily on hold. We will update you as soon as we have more information.",
  },
};

export const askTripProcessingTemplate = (
  orderId: string,
  tripDate: string,
  clientName: string,
  schoolName: string,
  status: B2bAskTripsStatus,
  url: string,
  note?: string,
  newPrice?: number
): string => {
  const config = statusConfigs[status];

  const htmlTemp = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Trip Request Response - GuestNa</title>
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
                  Trip Update
                </div>
                <div style="font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 8px; line-height: 1.3;">
                  ${config.icon} ${config.title}
                </div>
                <div style="font-size: 14px; color: rgba(255,255,255,0.6);">
                  Trip Request Update
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

                <!-- Greeting -->
                <p style="font-size: 16px; color: #1E293B; font-weight: 600; margin: 0 0 8px;">
                  Dear <strong>${clientName}</strong>,
                </p>
                <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 24px;">
                  ${config.message}
                </p>

                <!-- Status Badge -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <span style="display: inline-block; background: ${config.color}; color: #ffffff; font-size: 15px; font-weight: 700; padding: 8px 24px; border-radius: 50px; letter-spacing: 0.5px;">
                        ${config.icon} STATUS: ${status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                </table>

                <!-- Info Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
                  <tr>
                    <td colspan="2" style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 12px 20px;">
                      <span style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px;">Trip Details</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 20px 6px; width: 42%; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Order ID</div>
                    </td>
                    <td style="padding: 14px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${orderId}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">School Name</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${schoolName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Trip Date</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${tripDate}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px ${newPrice ? "6px" : "14px"}; border-bottom: ${newPrice ? "1px solid #F1F5F9" : "none"};">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Status</div>
                    </td>
                    <td style="padding: 10px 20px ${newPrice ? "6px" : "14px"}; border-bottom: ${newPrice ? "1px solid #F1F5F9" : "none"};">
                      <span style="display: inline-block; background: ${config.bgColor}; color: ${config.color}; font-size: 15px; font-weight: 700; padding: 4px 14px; border-radius: 50px; border: 1px solid ${config.color}40;">
                        ${config.icon} ${status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                  ${
                    newPrice
                      ? `
                  <tr>
                    <td style="padding: 10px 20px 14px;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Price</div>
                    </td>
                    <td style="padding: 10px 20px 14px;">
                      <div style="font-size: 26px; font-weight: 700; color: #22C55E;">${newPrice.toLocaleString()} EGP</div>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                </table>

                ${
                  note
                    ? `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background: #FFFBEB; border-left: 4px solid #F59E0B; border-radius: 0 10px 10px 0; padding: 16px 20px;">
                      <div style="font-size: 12px; font-weight: 700; color: #F59E0B; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Important Note</div>
                      <div style="font-size: 14px; color: #92400E; line-height: 1.6;">${note}</div>
                    </td>
                  </tr>
                </table>
                `
                    : ""
                }

                <!-- Help Box -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background: #EFF6FF; border-left: 4px solid #3B82F6; border-radius: 0 10px 10px 0; padding: 16px 20px;">
                      <div style="font-size: 15px; color: #1E40AF; font-weight: 600; line-height: 1.6;">
                        <strong>Need assistance?</strong> Our team is here to help! Contact us for any questions about your school trip.
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- CTA -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="center" style="padding-top: 8px;">
                      <a href="${url}"
                         target="_blank"
                         style="display: inline-block; background: linear-gradient(135deg, #0B7A8A, #0A5A7C); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 15px 44px; border-radius: 10px; box-shadow: 0 4px 20px rgba(11,122,138,0.3); letter-spacing: 0.3px;">
                        View Trip Details &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 15px; color: #94A3B8; margin-top: 20px; line-height: 1.6; text-align: center;">
                  Thank you for choosing GuestNa for your educational trips!<br/>
                  We look forward to providing an excellent experience for your students.
                </p>

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
