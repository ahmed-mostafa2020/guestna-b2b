import {
  B2bAskWithdrawalsStatus,
  B2bAskWithdrawalsType,
} from "@src/modules/b2b/askWithdrawal/dto/askWithdrawal.dto";

export const askWithdrawalTemplate = (
  orderId: number,
  organizationName: string,
  amount: number,
  type: B2bAskWithdrawalsType,
  status: B2bAskWithdrawalsStatus,
  note?: string,
  stcPayPhone?: string,
  bankName?: string,
  clientName?: string,
  iban?: string,
  requestDate?: string,
  adminUrl?: string
): string => {
  const statusColors = {
    DONE: { bg: "#d4edda", border: "#28a745", text: "#155724" },
    PENDING: { bg: "#fff3cd", border: "#ffc107", text: "#856404" },
    CANCLED: { bg: "#f8d7da", border: "#dc3545", text: "#721c24" },
  };

  const statusEmojis = {
    DONE: "✅",
    PENDING: "⏳",
    CANCLED: "❌",
  };

  const typeEmojis = {
    STC_PAY: "📱",
    BANK_TRANSFER: "🏦",
  };

  void statusColors[status]; // retained for potential future use
  const statusEmoji = statusEmojis[status];
  const typeEmoji = typeEmojis[type];

  const statusBadgeColors: Record<string, string> = {
    DONE: "#22C55E",
    PENDING: "#F59E0B",
    CANCLED: "#EF4444",
  };
  const statusBadgeColor = statusBadgeColors[status] || "#6C48EF";

  const htmlTemp = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Withdrawal Request - GuestNa Admin</title>
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
                  Finance
                </div>
                <div style="font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 8px; line-height: 1.3;">
                  ${typeEmoji} New Withdrawal Request
                </div>
                <div style="font-size: 14px; color: rgba(255,255,255,0.6);">
                  A business partner has submitted a withdrawal request
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

                <!-- Amount Display -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <div style="display: inline-block; background: linear-gradient(135deg, #6C48EF15, #6C48EF08); border: 2px solid #6C48EF30; border-radius: 14px; padding: 20px 40px; text-align: center;">
                        <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #6C48EF; font-weight: 700; margin-bottom: 6px;">Withdrawal Amount</div>
                        <div style="font-size: 26px; font-weight: 700; color: #6C48EF;">${amount.toLocaleString()} SAR</div>
                        <div style="margin-top: 8px;">
                          <span style="display: inline-block; background: ${statusBadgeColor}; color: #fff; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 50px;">
                            ${statusEmoji} ${status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Info Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
                  <tr>
                    <td colspan="2" style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 12px 20px;">
                      <span style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px;">Request Information</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 20px 6px; width: 42%; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Order ID</div>
                    </td>
                    <td style="padding: 14px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">#${orderId}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Organization</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${organizationName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Payment Method</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${typeEmoji} ${type.replace("_", " ")}</div>
                    </td>
                  </tr>
                  ${
                    requestDate
                      ? `
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Request Date</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${requestDate}</div>
                    </td>
                  </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding: 10px 20px 14px;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Status</div>
                    </td>
                    <td style="padding: 10px 20px 14px;">
                      <span style="display: inline-block; background: ${statusBadgeColor}18; color: ${statusBadgeColor}; font-size: 15px; font-weight: 700; padding: 4px 14px; border-radius: 50px; border: 1px solid ${statusBadgeColor}40;">
                        ${statusEmoji} ${status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                </table>

                <!-- Payment Details - STC -->
                ${
                  type === "STC_PAY" && stcPayPhone
                    ? `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
                  <tr>
                    <td colspan="2" style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 12px 20px;">
                      <span style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px;">STC Pay Details</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 20px;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Phone Number</div>
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600; margin-top: 4px;">${stcPayPhone}</div>
                    </td>
                  </tr>
                </table>
                `
                    : ""
                }

                <!-- Payment Details - Bank -->
                ${
                  type === "BANK_TRANSFER" && (bankName || clientName || iban)
                    ? `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
                  <tr>
                    <td colspan="2" style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 12px 20px;">
                      <span style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px;">Bank Transfer Details</span>
                    </td>
                  </tr>
                  ${
                    bankName
                      ? `
                  <tr>
                    <td style="padding: 14px 20px 6px; width: 42%; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Bank Name</div>
                    </td>
                    <td style="padding: 14px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${bankName}</div>
                    </td>
                  </tr>`
                      : ""
                  }
                  ${
                    clientName
                      ? `
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">Client Name</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9;">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${clientName}</div>
                    </td>
                  </tr>`
                      : ""
                  }
                  ${
                    iban
                      ? `
                  <tr>
                    <td style="padding: 10px 20px 14px;">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">IBAN</div>
                    </td>
                    <td style="padding: 10px 20px 14px;">
                      <div style="font-size: 14px; color: #1E293B; font-weight: 700; font-family: monospace; letter-spacing: 1px;">${iban}</div>
                    </td>
                  </tr>`
                      : ""
                  }
                </table>
                `
                    : ""
                }

                <!-- Note -->
                ${
                  note
                    ? `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background: #EFF6FF; border-left: 4px solid #3B82F6; border-radius: 0 10px 10px 0; padding: 16px 20px;">
                      <div style="font-size: 12px; font-weight: 700; color: #3B82F6; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Additional Note</div>
                      <div style="font-size: 14px; color: #1E40AF; line-height: 1.6;">${note}</div>
                    </td>
                  </tr>
                </table>
                `
                    : ""
                }

                <!-- Warning -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background: #FFFBEB; border-left: 4px solid #F59E0B; border-radius: 0 10px 10px 0; padding: 16px 20px;">
                      <div style="font-size: 15px; color: #92400E; font-weight: 600; line-height: 1.6;">
                        Please verify all payment details carefully before processing. Contact the organization if any information appears incorrect or incomplete.
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- CTA -->
                ${
                  adminUrl
                    ? `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="center" style="padding-top: 8px;">
                      <a href="${adminUrl}"
                         target="_blank"
                         style="display: inline-block; background: linear-gradient(135deg, #0B7A8A, #0A5A7C); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 15px 44px; border-radius: 10px; box-shadow: 0 4px 20px rgba(11,122,138,0.3); letter-spacing: 0.3px;">
                        Process Withdrawal &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
                `
                    : ""
                }

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
