export enum ClientActionStatus {
  CANCLED = 'CANCLED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

interface ClientActionConfig {
  color: string;
  bgColor: string;
  icon: string;
  title: string;
  adminMessage: string;
  urgency: 'high' | 'medium' | 'low';
}

const clientActionConfigs: Record<ClientActionStatus, ClientActionConfig> = {
  [ClientActionStatus.APPROVED]: {
    color: '#22C55E',
    bgColor: '#F0FDF4',
    icon: '✅',
    title: 'Client Approved Trip',
    adminMessage:
      'The client has reviewed and approved their trip request. Please proceed with the booking arrangements.',
    urgency: 'high',
  },
  [ClientActionStatus.REJECTED]: {
    color: '#EF4444',
    bgColor: '#FEF2F2',
    icon: '❌',
    title: 'Client Rejected Trip',
    adminMessage:
      'The client has declined this trip request. No further action is required for this booking.',
    urgency: 'medium',
  },
  [ClientActionStatus.CANCLED]: {
    color: '#EF4444',
    bgColor: '#FEF2F2',
    icon: '🚫',
    title: 'Client Cancelled Trip',
    adminMessage:
      'The client has cancelled their trip request. Please update the booking status and handle any refund if applicable.',
    urgency: 'high',
  },
};

export const clientActionTemplate = (
  orderId: string,
  tripDate: string,
  clientName: string,
  schoolName: string,
  action: ClientActionStatus,
  url: string,
  tripName?: string,
  clientNote?: string,
  actionDate?: string,
): string => {
  const config = clientActionConfigs[action];
  const currentDate =
    actionDate ||
    new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

  const htmlTemp = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Client Action - ${action} - GuestNa Admin</title>
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
                <div style="display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; padding: 5px 18px; font-size: 11px; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 16px;">
                  Admin Notification
                </div>
                <div style="font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 8px; line-height: 1.3;">
                  ${config.icon} ${config.title}
                </div>
                <div style="font-size: 14px; color: rgba(255,255,255,0.6);">
                  Client Action Notification
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

                ${
                  config.urgency === 'high'
                    ? `
                <!-- Urgent Banner -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                  <tr>
                    <td style="background: #FFFBEB; border-left: 4px solid #F59E0B; border-radius: 0 10px 10px 0; padding: 12px 20px;">
                      <div style="font-size: 13px; font-weight: 700; color: #92400E;">⚡ URGENT ACTION REQUIRED</div>
                    </td>
                  </tr>
                </table>
                `
                    : ''
                }

                <!-- Action Badge -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <span style="display: inline-block; background: ${config.color}; color: #ffffff; font-size: 13px; font-weight: 700; padding: 8px 24px; border-radius: 50px; letter-spacing: 0.5px;">
                        ${config.icon} CLIENT ACTION: ${action}
                      </span>
                    </td>
                  </tr>
                </table>

                <!-- Admin Message -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background: ${config.bgColor}; border-left: 4px solid ${config.color}; border-radius: 0 10px 10px 0; padding: 16px 20px;">
                      <div style="font-size: 13px; color: #1E293B; font-weight: 600; line-height: 1.6;">
                        <strong>${schoolName}</strong> has taken action on their trip request. ${config.adminMessage}
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Info Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
                  <tr>
                    <td colspan="2" style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 12px 20px;">
                      <span style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px;">Booking Information</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 20px 6px; width: 42%; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Order ID</div>
                    </td>
                    <td style="padding: 14px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${orderId}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Client Name</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${clientName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">School Name</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${schoolName}</div>
                    </td>
                  </tr>
                  ${
                    tripName
                      ? `
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Trip Name</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${tripName}</div>
                    </td>
                  </tr>
                  `
                      : ''
                  }
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Trip Date</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${tripDate}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Client Action</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <span style="display: inline-block; background: ${config.bgColor}; color: ${config.color}; font-size: 13px; font-weight: 700; padding: 4px 14px; border-radius: 50px; border: 1px solid ${config.color}40;">
                        ${config.icon} ${action}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 14px;">
                      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Action Date</div>
                    </td>
                    <td style="padding: 10px 20px 14px;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${currentDate}</div>
                    </td>
                  </tr>
                </table>

                ${
                  clientNote
                    ? `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background: #FFFBEB; border-left: 4px solid #F59E0B; border-radius: 0 10px 10px 0; padding: 16px 20px;">
                      <div style="font-size: 12px; font-weight: 700; color: #F59E0B; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Client's Message</div>
                      <div style="font-size: 14px; color: #92400E; line-height: 1.6; font-style: italic;">"${clientNote}"</div>
                    </td>
                  </tr>
                </table>
                `
                    : ''
                }

                <!-- Next Steps -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background: #EFF6FF; border-left: 4px solid #3B82F6; border-radius: 0 10px 10px 0; padding: 16px 20px;">
                      <div style="font-size: 12px; font-weight: 700; color: #3B82F6; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px;">Next Steps</div>
                      <div style="font-size: 13px; color: #1E40AF; line-height: 1.8;">
                        ${
                          action === ClientActionStatus.APPROVED
                            ? '• Update booking status to SCHEDULED<br/>• Send confirmation email to client<br/>• Arrange trip logistics and transportation<br/>• Prepare necessary documentation'
                            : action === ClientActionStatus.CANCLED
                              ? '• Update booking status to CANCELLED<br/>• Process refund if applicable<br/>• Send cancellation confirmation<br/>• Update availability for the date'
                              : '• Update booking status to REJECTED<br/>• Archive the request<br/>• Send acknowledgment to client<br/>• Update availability records'
                        }
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
                        Manage Booking &rarr;
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
