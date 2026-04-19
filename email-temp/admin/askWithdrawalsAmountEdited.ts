export const withdrawalAmountEditedTemplate = (
  orderId: number,
  managerName: string,
  oldAmount: number,
  newAmount: number,
  tripName: string,
  schoolName: string,
  editedDate: string,
  totalBookings: number,
  schoolProfit: number,
  lang: 'ar' | 'en' = 'ar',
): string => {
  const guestnaEmail = process.env.GUESTNA_EMAIL || 'info@guestna.app';
  const guestnaNumber = process.env.GUESTNA_NUMBER || '';

  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const translations = {
    title: isAr
      ? 'تحديث مبلغ السحب - GuestNa'
      : 'Withdrawal Amount Updated - GuestNa',
    headerBadge: isAr
      ? '✏️ تم تحديث مبلغ السحب'
      : '✏️ Withdrawal Amount Updated',
    headerTitle: isAr
      ? 'لقد تم تعديل مبلغ السحب الخاص بك'
      : 'Your Withdrawal Amount Has Been Adjusted',
    amountUpdatedBadge: isAr ? '✏️ تم تحديث المبلغ' : '✏️ AMOUNT UPDATED',
    adminUpdatedNotice: isAr
      ? 'لقد تم تحديث مبلغ السحب لطلبك من قبل فريق الإدارة.'
      : 'The withdrawal amount for your request has been updated by the admin team.',
    dearManager: isAr
      ? `عزيزي ${managerName}، نود إبلاغك بأنه تم تحديث المبلغ لطلب السحب الخاص بك. يرجى مراجعة التفاصيل أدناه.`
      : `Dear ${managerName}, we'd like to inform you that the amount for your withdrawal request has been updated. Please review the details below.`,
    orderIdLabel: isAr ? '🔢 رقم الطلب' : '🔢 Order ID',
    previousAmountLabel: isAr ? '💰 المبلغ السابق' : '💰 Previous Amount',
    newAmountLabel: isAr ? '💰 المبلغ الجديد' : '💰 New Amount',
    tripNameLabel: isAr ? '🚌 اسم الرحلة' : '🚌 Trip Name',
    schoolNameLabel: isAr ? '🏫 اسم المدرسة' : '🏫 School Name',
    updatedDateLabel: isAr ? '📅 تاريخ التحديث' : '📅 Updated Date',
    totalBookingsLabel: isAr ? '👥 إجمالي الحجوزات' : '👥 Total Bookings',
    schoolProfitLabel: isAr ? '🏫 ربح المدرسة' : '🏫 School Profit',
    studentUnit: isAr ? 'طالب' : 'Student',
    sarUnit: isAr ? 'ريال سعودي' : 'SAR',
    importantInfoLabel: isAr ? 'ℹ️ معلومات هامة' : 'ℹ️ IMPORTANT INFORMATION',
    importantInfoList: isAr
      ? [
          'تم تعديل مبلغ السحب من قبل فريق الإدارة',
          'سيظهر المبلغ المحدث في طلب السحب الخاص بك',
          'احتفظ برقم الطلب الخاص بك لأي استفسارات مستقبلية',
          'اتصل بفريق الدعم لدينا إذا كان لديك أي أسئلة حول هذا التغيير',
        ]
      : [
          'The withdrawal amount has been adjusted by the admin team',
          'The updated amount will be reflected in your withdrawal request',
          'Keep your order ID number for any future inquiries',
          'Contact our support team if you have any questions about this change',
        ],
    needHelpLabel: isAr ? 'هل تحتاج إلى مساعدة؟' : 'NEED HELP?',
    needHelpText: isAr
      ? 'إذا كان لديك أي أسئلة أو استفسارات حول هذا التحديث، فريق الدعم لدينا هنا لمساعدتك على مدار الساعة طوال أيام الأسبوع.'
      : 'If you have any questions or concerns about this update, our support team is here to assist you 24/7.',
    thankYou: isAr
      ? 'شكراً لكونك شريكاً قيماً! 🙏'
      : 'Thank you for being a valued partner! 🙏',
    appreciation: isAr
      ? 'نحن نقدر عملك ونتطلع إلى استمرار شراكتنا.'
      : 'We appreciate your business and look forward to continuing our partnership.',
  };

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
                      <div style="background-color: #ff9800; color: #ffffff; display: inline-block; padding: 12px 30px; font-size: 18px; font-weight: 600; border-radius: 25px; margin-bottom: 15px; text-decoration: none;">
                        ${translations.headerBadge}
                      </div>
                    </td>
                  </tr>
                </table>
                
                <div style="font-size: 24px; font-weight: 700; color: #003c4e; margin: 15px 0; line-height: 1.4;">
                  ${translations.headerTitle}
                </div>
                <div style="width: 60px; height: 3px; background-color: #ff9800; margin: 10px auto 20px; border-radius: 2px;"></div>
              </td>
            </tr>

            <!-- Content Section -->
            <tr>
              <td style="padding: 30px 20px;">
                
                <!-- Notice Badge -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fff8e1; border: 2px solid #ff9800; border-radius: 12px; margin: 20px 0;">
                  <tr>
                    <td style="padding: 20px; text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 10px;">📝</div>
                      <div style="background-color: #ff9800; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 10px;">
                        ${translations.amountUpdatedBadge}
                      </div>
                      <p style="color: #e65100; font-weight: 500; margin: 10px 0 0 0; font-size: 15px; line-height: 1.5;">
                        ${translations.adminUpdatedNotice}
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 16px; color: #6c5ce7; margin-bottom: 25px; line-height: 1.6; font-weight: 500; text-align: center;">
                  ${translations.dearManager}
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
                            #${orderId}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.previousAmountLabel}
                          </td>
                          <td style="padding: 8px 0; color: #e53935; font-size: 18px; background-color: #ffebee; padding: 12px 15px; border-radius: 8px; border: 2px solid #e53935; font-weight: 700; text-decoration: line-through;">
                            ${oldAmount} ${translations.sarUnit}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.newAmountLabel}
                          </td>
                          <td style="padding: 8px 0; color: #28a745; font-size: 20px; background-color: #d4edda; padding: 12px 15px; border-radius: 8px; border: 2px solid #28a745; font-weight: 700;">
                            ${newAmount} ${translations.sarUnit}
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
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.schoolNameLabel}
                          </td>
                          <td style="padding: 8px 0; color: #6c5ce7; font-size: 15px; background-color: #e8f4f8; padding: 10px 15px; border-radius: 8px; border: 1px solid #6c5ce7; font-weight: 500;">
                            ${schoolName}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.updatedDateLabel}
                          </td>
                          <td style="padding: 8px 0; color: #6c5ce7; font-size: 15px; background-color: #e8f4f8; padding: 10px 15px; border-radius: 8px; border: 1px solid #6c5ce7; font-weight: 500;">
                            ${editedDate}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.totalBookingsLabel}
                          </td>
                          <td style="padding: 8px 0; color: #2196f3; font-size: 18px; background-color: #e3f2fd; padding: 12px 15px; border-radius: 8px; border: 2px solid #2196f3; font-weight: 700;">
                            ${totalBookings} ${translations.studentUnit}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ${translations.schoolProfitLabel}
                          </td>
                          <td style="padding: 8px 0; color: #9c27b0; font-size: 18px; background-color: #f3e5f5; padding: 12px 15px; border-radius: 8px; border: 2px solid #9c27b0; font-weight: 700;">
                            ${schoolProfit} ${translations.sarUnit}
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                </table>

                <!-- Important Information -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #e3f2fd; border: 2px solid #2196f3; border-radius: 12px; margin: 25px 0;">
                  <tr>
                    <td style="padding: 20px;">
                      <div style="background-color: #2196f3; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 15px;">
                        ${translations.importantInfoLabel}
                      </div>
                      <ul style="color: #1565c0; font-size: 14px; line-height: 1.8; margin: 0; padding-${isAr ? 'right' : 'left'}: 20px;">
                        ${translations.importantInfoList.map((item) => `<li>${item}</li>`).join('')}
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
                            : ''
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
