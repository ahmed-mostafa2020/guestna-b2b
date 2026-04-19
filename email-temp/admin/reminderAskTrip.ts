export const askTripReminderTemplate = (
  schoolName: string,
  url: string,
  email: string,
  phone: string,
  seats: number,
  date: string,
  originalRequestDate: string,
  daysSinceRequest: number,
): string => {
  const htmlTemp = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>URGENT: School Trip Request Follow-Up - GuestNa Admin</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #fff5f5; color: #003c4e; font-family: Arial, Helvetica, sans-serif; width: 100%; min-width: 100%;">
    
    <!-- Main Container Table -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fff5f5;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          
          <!-- Email Content Table -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; margin: 0 auto; border: 3px solid #ff6b6b;">
            
            <!-- Header Section -->
            <tr>
              <td style="background-color: #fff8f0; padding: 20px; text-align: center;">
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
                      <div style="background-color: #ff9500; color: #ffffff; display: inline-block; padding: 12px 30px; font-size: 18px; font-weight: 600; border-radius: 25px; margin-bottom: 15px; text-decoration: none;">
                        🔔 Follow-Up Reminder
                      </div>
                    </td>
                  </tr>
                </table>
                
                <div style="font-size: 20px; font-weight: 700; color: #cc7a00; margin: 15px 0; line-height: 1.4;">
                  School Trip Request Awaiting Response
                </div>
                <div style="font-size: 16px; color: #ff9500; font-weight: 600; margin: 10px 0;">
                  Submitted ${daysSinceRequest} days ago
                </div>
                <div style="width: 80px; height: 4px; background-color: #ff9500; margin: 10px auto 20px; border-radius: 2px;"></div>
              </td>
            </tr>

            <!-- Gentle Notice Section -->
            <tr>
              <td style="padding: 0 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fff4e6; border: 2px solid #ff9500; border-radius: 12px; margin: 20px 0;">
                  <tr>
                    <td style="padding: 20px; text-align: center;">
                      <div style="background-color: #ff9500; color: #ffffff; padding: 10px 25px; border-radius: 20px; font-size: 16px; font-weight: 600; display: inline-block; margin-bottom: 15px;">
                        ⏰ Awaiting Your Response
                      </div>
                      <p style="color: #cc7a00; font-weight: 600; margin: 0; font-size: 16px; line-height: 1.5;">
                        This school trip request was submitted <strong>${daysSinceRequest} days ago</strong>.<br>
                        A response at your earliest convenience would be appreciated.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Content Section -->
            <tr>
              <td style="padding: 30px 20px;">
                
                <!-- School Badge -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f8ff; border: 2px solid #ff9500; border-radius: 12px; margin: 20px 0;">
                  <tr>
                    <td style="padding: 15px; text-align: center;">
                      <div style="background-color: #ff9500; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 10px;">
                        🏫 PENDING RESPONSE
                      </div>
                      <p style="color: #cc7a00; font-weight: 500; margin: 0; font-size: 15px;">
                        School group awaiting confirmation for their educational trip
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 17px; color: #cc7a00; margin-bottom: 25px; line-height: 1.6; font-weight: 500; text-align: center;">
                  <strong>Friendly Reminder:</strong> This school submitted their trip request on <strong>${originalRequestDate}</strong>. 
                  They would appreciate a response when you have a moment to review their request.
                </p>

                <!-- School Information Table -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fff8f0; border: 2px solid #ff9500; border-radius: 12px; margin: 25px 0;">
                  <tr>
                    <td style="padding: 20px;">
                      
                      <!-- School Info Rows -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td width="140" style="padding: 8px 15px 8px 0; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            🏫 School Name
                          </td>
                          <td style="padding: 8px 0; color: #cc7a00; font-size: 15px; background-color: #fff4e6; padding: 10px 15px; border-radius: 8px; border: 1px solid #ff9500; font-weight: 600;">
                            ${schoolName}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px 8px 0; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            📧 Email Address
                          </td>
                          <td style="padding: 8px 0; color: #cc7a00; font-size: 15px; background-color: #fff4e6; padding: 10px 15px; border-radius: 8px; border: 1px solid #ff9500; font-weight: 600;">
                            <a href="${email}" style="color: #cc7a00; text-decoration: none; font-weight: 600;">${email}</a>
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px 8px 0; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            📱 Phone Number
                          </td>
                          <td style="padding: 8px 0; color: #cc7a00; font-size: 15px; background-color: #fff4e6; padding: 10px 15px; border-radius: 8px; border: 1px solid #ff9500; font-weight: 600;">
                           ${phone}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px 8px 0; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            👥 Number of Students
                          </td>
                          <td style="padding: 8px 0; color: #cc7a00; font-size: 15px; background-color: #fff4e6; padding: 10px 15px; border-radius: 8px; border: 1px solid #ff9500; font-weight: 600;">
                            ${seats}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px 8px 0; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            📅 Preferred Date
                          </td>
                          <td style="padding: 8px 0; color: #cc7a00; font-size: 15px; background-color: #fff4e6; padding: 10px 15px; border-radius: 8px; border: 1px solid #ff9500; font-weight: 600;">
                           ${date}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px 8px 0; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            🕒 Original Request
                          </td>
                          <td style="padding: 8px 0; color: #cc7a00; font-size: 15px; background-color: #fff4e6; padding: 10px 15px; border-radius: 8px; border: 1px solid #ff9500; font-weight: 600;">
                            ${originalRequestDate}
                          </td>
                        </tr>
                        <tr><td colspan="2" style="height: 5px;"></td></tr>
                        <tr>
                          <td width="140" style="padding: 8px 15px 8px 0; vertical-align: top; font-weight: 600; color: #003c4e; font-size: 14px;">
                            ⏱️ Days Since Request
                          </td>
                          <td style="padding: 8px 0; color: #ffffff; font-size: 16px; background-color: #ff9500; padding: 10px 15px; border-radius: 8px; border: 2px solid #cc7a00; font-weight: 600; text-align: center;">
                            ${daysSinceRequest} Days
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                </table>

                <!-- Polite Notice -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f8ff; border: 2px solid #3498db; border-radius: 12px; margin: 25px 0;">
                  <tr>
                    <td style="padding: 25px; color: #2980b9; font-weight: 600; font-size: 16px; line-height: 1.6; text-align: center;">
                      <div style="background-color: #3498db; color: #ffffff; padding: 8px 20px; border-radius: 15px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 15px;">
                        💡 Gentle Reminder
                      </div>
                      <div style="margin-bottom: 15px;">
                        This school group would appreciate hearing from you soon!
                      </div>
                      <div style="font-size: 15px; font-weight: 500;">
                        • Valuable educational trip opportunity<br>
                        • School planning their academic calendar<br>
                        • Students excited about learning experience
                      </div>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- CTA Section -->
            <tr>
              <td style="padding: 20px; text-align: center;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                  <tr>
                    <td style="background-color: #ff9500; border-radius: 25px; padding: 16px 40px; border: 2px solid #cc7a00;">
                      <a href="${url}" 
                         style="color: #ffffff; font-size: 18px; font-weight: 600; text-decoration: none; display: block; letter-spacing: 0.5px; line-height: 1.2;"
                         target="_blank">
                        🎒 Review Request
                      </a>
                    </td>
                  </tr>
                </table>
                
                <p style="margin-top: 15px; font-size: 14px; color: #cc7a00; font-weight: 500;">
                  Thank you for your attention to this request
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
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
            
            @media only screen and (max-width: 600px) {
              .mobile-center { text-align: center !important; }
              .mobile-full { width: 100% !important; }
              .mobile-padding { padding: 15px !important; }
              .mobile-small-text { font-size: 14px !important; }
              .mobile-button { 
                width: 90% !important; 
                padding: 16px 25px !important; 
                font-size: 18px !important; 
              }
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
