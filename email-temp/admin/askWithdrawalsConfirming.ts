import { LocalizationLanguages } from "@src/common/dto";
import { AskWithdrawalOneInfo } from "@src/modules/_dashboard/b2b/askWithDrawals/interfaces/askWithdrawalsResponse";
import { B2bAskWithdrawalsType } from "@src/modules/b2b/askWithdrawal/dto/askWithdrawal.dto";
import { Types } from "mongoose";

export const customerWithdrawalConfirmationTemplate = (
  withdrawal: AskWithdrawalOneInfo,
  processedDate: string,
  lang: "ar" | "en" = "ar",
  selectedGradesData?: {
    _id: Types.ObjectId;
    name: LocalizationLanguages;
    quantity: number;
    isPayed: boolean;
  }[],
  selectedGradesAmount?: number
): string => {
  const guestnaEmail = process.env.GUESTNA_EMAIL || "info@guestna.app";
  const guestnaNumber = process.env.GUESTNA_NUMBER || "";

  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const translations = {
    title: isAr ? "تم تأكيد السحب - GuestNa" : "Withdrawal Confirmed - GuestNa",
    headerBadge: isAr ? "✅ تم تأكيد السحب" : "✅ Withdrawal Confirmed",
    headerTitle: isAr ? "دفعتك في طريقها إليك!" : "Your Payment is On Its Way!",
    paymentApprovedBadge: isAr
      ? "✅ تمت الموافقة على الدفع"
      : "✅ PAYMENT APPROVED",
    successNotice: isAr
      ? "أخبار رائعة! تم تأكيد طلب السحب الخاص بك ومعالجته من قبل فريق الإدارة لدينا."
      : "Great news! Your withdrawal request has been confirmed and processed by our admin team.",
    dearUser: isAr
      ? `عزيزي ${withdrawal.createdBy.name}، تمت معالجة عملية السحب بنجاح. يرجى الاطلاع على التفاصيل أدناه.`
      : `Dear ${withdrawal.createdBy.name}, your withdrawal has been successfully processed. Please find the details below.`,
    orderIdLabel: isAr ? "🔢 رقم الطلب" : "🔢 Order ID",
    amountLabel: isAr ? "💰 المبلغ" : "💰 Amount",
    tripNameLabel: isAr ? "🚌 اسم الرحلة" : "🚌 Trip Name",
    schoolNameLabel: isAr ? "🏫 اسم المدرسة" : "🏫 School Name",
    processedDateLabel: isAr ? "✅ تاريخ المعالجة" : "✅ Processed Date",
    sarUnit: isAr ? "ريال سعودي" : "SAR",
    paymentSentToMobile: isAr ? "📱 تم إرسال الدفعة إلى" : "📱 PAYMENT SENT TO",
    paymentSentToBank: isAr ? "🏦 تم إرسال الدفعة إلى" : "🏦 PAYMENT SENT TO",
    stcPayPhoneLabel: isAr ? "📱 رقم الهاتف (STC Pay)" : "📱 STC Pay Phone",
    stcPayNotice: isAr
      ? "💡 يجب أن تستلم الأموال في محفظة STC Pay الخاصة بك في غضون دقائق قليلة."
      : "💡 You should receive the funds in your STC Pay wallet within a few minutes.",
    bankNameLabel: isAr ? "🏦 اسم البنك" : "🏦 Bank Name",
    accountNameLabel: isAr ? "👤 اسم الحساب" : "👤 Account Name",
    ibanLabel: isAr ? "🏧 الآيبان (IBAN)" : "🏧 IBAN",
    bankNotice: isAr
      ? "💡 تستغرق التحويلات البنكية عادةً من 1 إلى 3 أيام عمل للمعالجة."
      : "💡 Bank transfers typically take 1-3 business days to process.",
    importantInfoLabel: isAr ? "ℹ️ معلومات هامة" : "ℹ️ IMPORTANT INFORMATION",
    importantInfoList: isAr
      ? [
          "يرجى الانتظار الوقت المقدر لظهور الأموال في حسابك",
          "احتفظ برقم الطلب الخاص بك لأي استفسارات مستقبلية",
          "تحقق من حسابك أو محفظتك للتأكد من وصول الدفعة",
          "اتصل بفريق الدعم لدينا إذا لم تستلم الأموال في غضون الإطار الزمني المتوقع",
        ]
      : [
          "Please allow the estimated time for the funds to reflect in your account",
          "Keep your order Id number for any future inquiries",
          "Check your account or wallet for the incoming payment",
          "Contact our support team if you don't receive the funds within the expected timeframe",
        ],
    needHelpLabel: isAr ? "هل تحتاج إلى مساعدة؟" : "NEED HELP?",
    needHelpText: isAr
      ? "إذا كان لديك أي أسئلة أو استفسارات حول هذا التحديث، فريق الدعم لدينا هنا لمساعدتك على مدار الساعة طوال أيام الأسبوع."
      : "If you have any questions or concerns about this update, our support team is here to assist you 24/7.",
    thankYou: isAr
      ? "شكراً لكونك شريكاً قيماً! 🙏"
      : "Thank you for being a valued partner! 🙏",
    appreciation: isAr
      ? "نحن نقدر عملك ونتطلع إلى استمرار شراكتنا."
      : "We appreciate your business and look forward to continuing our partnership.",
  };

  const tripName = isAr
    ? withdrawal.trip?.name?.ar || withdrawal.trip?.name?.en
    : withdrawal.trip?.name?.en;
  const orgName = isAr
    ? withdrawal.organization?.name?.ar || withdrawal.organization?.name?.en
    : withdrawal.organization?.name?.en;

  const htmlTemp = `
<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${translations.title}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4; color: #333333; font-family: Arial, Helvetica, sans-serif; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    
    <!-- Main Container Table -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tr>
        <td align="center" style="padding: 20px 10px;">
          
          <!-- Email Content Table -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: 100%; background-color: #ffffff; margin: 0 auto; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
            
            <!-- Header Section -->
            <tr>
              <td style="background-color: #f8fdff; padding: 20px; text-align: center;">
                <img 
                  src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" 
                  alt="GuestNa Logo" 
                  width="120" 
                  height="60" 
                  style="width: 120px; height: 60px; display: block; margin: 0 auto 20px; border: 0;"
                />
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="center">
                      <div style="background-color: #28a745; color: #ffffff; display: inline-block; padding: 12px 30px; font-size: 18px; font-weight: 600; border-radius: 25px; margin-bottom: 15px; text-decoration: none;">
                        ${translations.headerBadge}
                      </div>
                    </td>
                  </tr>
                </table>
                
                <div style="font-size: 24px; font-weight: 700; color: #003c4e; margin: 15px 0; line-height: 1.4;">
                  ${translations.headerTitle}
                </div>
                <div style="width: 60px; height: 3px; background-color: #28a745; margin: 10px auto 20px; border-radius: 2px;"></div>
              </td>
            </tr>

            <!-- Content Section -->
            <tr>
              <td style="padding: 30px 20px;">
                
                <!-- Success Badge -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #d4edda; border: 2px solid #28a745; border-radius: 12px; margin: 20px 0;">
                  <tr>
                    <td style="padding: 20px; text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
                      <div style="background-color: #28a745; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 10px;">
                        ${translations.paymentApprovedBadge}
                      </div>
                      <p style="color: #155724; font-weight: 500; margin: 10px 0 0 0; font-size: 15px; line-height: 1.5;">
                        ${translations.successNotice}
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 16px; color: #6c5ce7; margin-bottom: 25px; line-height: 1.6; font-weight: 500; text-align: center;">
                  ${translations.dearUser}
                </p>

                <!-- Withdrawal Information Table -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fdff; border: 2px solid #6c5ce7; border-radius: 12px; margin: 25px 0;">
                  <tr>
                    <td style="padding: 20px;">
                      
                      <!-- Request Info Rows -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.orderIdLabel}
                          </td>
                          <td style="padding: 8px 0; color: #6c5ce7; font-size: 15px; background-color: #e8f4f8; padding: 10px 15px; border-radius: 8px; border: 1px solid #6c5ce7; font-weight: 500;">
                            #${withdrawal.orderId}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.amountLabel}
                          </td>
                          <td style="padding: 8px 0; color: #28a745; font-size: 20px; background-color: #d4edda; padding: 12px 15px; border-radius: 8px; border: 2px solid #28a745; font-weight: 700;">
                            ${selectedGradesAmount ?? withdrawal.amount} ${translations.sarUnit}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.tripNameLabel}
                          </td>
                          <td style="padding: 8px 0; color: #6c5ce7; font-size: 15px; background-color: #e8f4f8; padding: 10px 15px; border-radius: 8px; border: 1px solid #6c5ce7; font-weight: 500;">
                            ${tripName}
                          </td>
                        </tr>
                        ${
                          selectedGradesData && selectedGradesData.length > 0
                            ? `
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${isAr ? "الصفوف المدفوعة" : "Paid Grades"}
                          </td>
                          <td style="padding: 8px 0; color: #6c5ce7; font-size: 15px; background-color: #e8f4f8; padding: 10px 15px; border-radius: 8px; border: 1px solid #6c5ce7; font-weight: 500;">
                            ${selectedGradesData.map((g) => (isAr ? g?.name?.ar || g?.name?.en : g?.name?.en)).join(", ")}
                          </td>
                        </tr>
                        `
                            : ""
                        }
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.schoolNameLabel}
                          </td>
                          <td style="padding: 8px 0; color: #6c5ce7; font-size: 15px; background-color: #e8f4f8; padding: 10px 15px; border-radius: 8px; border: 1px solid #6c5ce7; font-weight: 500;">
                            ${orgName}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.processedDateLabel}
                          </td>
                          <td style="padding: 8px 0; color: #6c5ce7; font-size: 15px; background-color: #e8f4f8; padding: 10px 15px; border-radius: 8px; border: 1px solid #6c5ce7; font-weight: 500;">
                            ${processedDate}
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                </table>

                <!-- Payment Destination Details -->
                ${
                  withdrawal.type === B2bAskWithdrawalsType.STC_PAY &&
                  withdrawal?.stcPay
                    ? `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fff8e1; border: 2px solid #ff9800; border-radius: 12px; margin: 25px 0;">
                  <tr>
                    <td style="padding: 20px;">
                      <div style="background-color: #ff9800; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 15px;">
                        ${translations.paymentSentToMobile}
                      </div>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.stcPayPhoneLabel}
                          </td>
                          <td style="padding: 8px 0; color: #ff9800; font-size: 16px; background-color: #fff; padding: 10px 15px; border-radius: 8px; border: 1px solid #ff9800; font-weight: 600;">
                            ${withdrawal.stcPay.phone}
                          </td>
                        </tr>
                      </table>
                      <p style="color: #f57c00; font-size: 15px; margin: 15px 0 0 0; line-height: 1.5;">
                        ${translations.stcPayNotice}
                      </p>
                    </td>
                  </tr>
                </table>
                `
                    : ""
                }

                ${
                  withdrawal.type === B2bAskWithdrawalsType.BANK_TRANSFER &&
                  withdrawal?.bankTransfer
                    ? `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #e8f5e8; border: 2px solid #4caf50; border-radius: 12px; margin: 25px 0;">
                  <tr>
                    <td style="padding: 20px;">
                      <div style="background-color: #4caf50; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 15px;">
                        ${translations.paymentSentToBank}
                      </div>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        ${
                          withdrawal.bankTransfer.bankName
                            ? `
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.bankNameLabel}
                          </td>
                          <td style="padding: 8px 0; color: #4caf50; font-size: 15px; background-color: #fff; padding: 10px 15px; border-radius: 8px; border: 1px solid #4caf50; font-weight: 500;">
                            ${withdrawal.bankTransfer.bankName}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        `
                            : ""
                        }
                        ${
                          withdrawal.bankTransfer.clientName
                            ? `
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.accountNameLabel}
                          </td>
                          <td style="padding: 8px 0; color: #4caf50; font-size: 15px; background-color: #fff; padding: 10px 15px; border-radius: 8px; border: 1px solid #4caf50; font-weight: 500;">
                            ${withdrawal.bankTransfer.clientName}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        `
                            : ""
                        }
                        ${
                          withdrawal.bankTransfer.iban
                            ? `
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.ibanLabel}
                          </td>
                          <td style="padding: 8px 0; color: #4caf50; font-size: 14px; background-color: #fff; padding: 10px 15px; border-radius: 8px; border: 1px solid #4caf50; font-weight: 600; font-family: monospace;">
                            ${withdrawal.bankTransfer.iban}
                          </td>
                        </tr>
                        `
                            : ""
                        }
                      </table>
                      <p style="color: #2e7d32; font-size: 15px; margin: 15px 0 0 0; line-height: 1.5;">
                        ${translations.bankNotice}
                      </p>
                    </td>
                  </tr>
                </table>
                `
                    : ""
                }

                <!-- Important Information -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #e3f2fd; border: 2px solid #2196f3; border-radius: 12px; margin: 25px 0;">
                  <tr>
                    <td style="padding: 20px;">
                      <div style="background-color: #2196f3; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 15px;">
                        ${translations.importantInfoLabel}
                      </div>
                      <ul style="color: #1565c0; font-size: 14px; line-height: 1.8; margin: 0; padding-${isAr ? "right" : "left"}: 20px;">
                        ${translations.importantInfoList.map((item) => `<li>${item}</li>`).join("")}
                      </ul>
                    </td>
                  </tr>
                </table>

                <!-- Need Help Section -->
                 <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3e5f5; border: 2px solid #9c27b0; border-radius: 12px; margin: 25px 0;">
                  <tr>
                    <td style="padding: 20px; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 10px;">💬</div>
                      <div style="background-color: #9c27b0; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 10px;">
                        ${translations.needHelpLabel}
                      </div>
                      <p style="color: #6a1b9a; font-size: 14px; line-height: 1.6; margin: 10px 0 0 0;">
                        ${translations.needHelpText}
                      </p>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 15px auto 0;">
                        <tr>
                          <td style="padding: 8px 15px;">
                            <span style="color: #6a1b9a; font-size: 14px; font-weight: 600;">📧 ${guestnaEmail}</span>
                          </td>
                        </tr>
                        ${
                          guestnaNumber
                            ? `
                        <tr>
                          <td style="padding: 8px 15px;">
                            <span style="color: #6a1b9a; font-size: 14px; font-weight: 600;">📞 ${guestnaNumber}</span>
                          </td>
                        </tr>
                        `
                            : ""
                        }
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Thank You Message -->
                <p style="font-size: 16px; color: #6c5ce7; text-align: center; margin: 30px 0 10px 0; line-height: 1.6; font-weight: 600;">
                  ${translations.thankYou}
                </p>
                <p style="font-size: 14px; color: #003c4e; text-align: center; margin: 0; line-height: 1.5;">
                  ${translations.appreciation}
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="height: 30px; background-image: url('https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(5).png?updatedAt=1751797506745'); background-repeat: no-repeat; background-position: center; background-size: cover;">
                &nbsp;
              </td>
            </tr>
            
          </table>
          
          <!-- Mobile Styles -->
          <style>
            @media only screen and (max-width: 600px) {
              .mobile-center { text-align: center !important; }
              .mobile-full { width: 100% !important; }
              .mobile-padding { padding: 15px !important; }
              .mobile-small-text { font-size: 14px !important; }
            }
            
            /* Outlook specific fixes */
            @media screen and (-webkit-min-device-pixel-ratio: 0) {
              .outlook-fix { 
                width: 100% !important; 
              }
            }
          </style>
          
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  return htmlTemp;
};
