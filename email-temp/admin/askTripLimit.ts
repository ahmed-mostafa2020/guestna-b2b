export const maxTripsLimitRequestTemplate = (
  clientName: string,
  clientEmail: string,
  organizationName: string,
  currentMaxTrips: number,
  currentTripsCount: number,
  url: string,
  language: "en" | "ar" = "en",
  track?: string
): string => {
  const content = {
    en: {
      title: "Trip Limit Increase Request - GuestNa",
      header: "⚠️ Trip Limit Reached",
      mainTitle: "Increase Trip Limit Request",
      alertBadge: "🚨 MAXIMUM TRIPS LIMIT REACHED",
      alertText:
        "A team member has attempted to request a new trip but has reached their limit",
      greeting: "Dear School Manager,",
      intro:
        "One of your team members has reached the maximum trip limit and needs approval to request additional trips. Please review the details below and decide whether to increase their trip allowance.",
      statusTitle: "📊 Current Trip Status",
      statusLabel: "Trips Used / Maximum Allowed",
      clientNameLabel: "👤 Client Name",
      emailLabel: "📧 Email Address",
      organizationLabel: "🏫 Organization",
      trackLabel: "🎯 Track",
      currentLimitLabel: "📈 Current Limit",
      tripsUsedLabel: "🎒 Trips Used",
      trips: "Trips",
      whatMeansTitle: "💡 What This Means:",
      whatMeansText: (name: string, max: number) => `
        • <strong>${name}</strong> has used all ${max} available trip slots<br/>
        • They need more trips to continue booking educational experiences<br/>
        • You can increase their limit to allow additional trip requests<br/>
        • This change will take effect immediately after approval
      `,
      actionTitle: "⚡ Action Required",
      actionText: (name: string) =>
        `Please click the button below to review and increase the trip limit for <strong>${name}</strong>. Once approved, they will be able to request additional trips immediately.`,
      buttonText: "📈 Increase Trip Limit",
      footerText:
        "If you have any questions or need assistance, please contact our support team.<br/>This limit increase will help your team organize more educational experiences.",
      dir: "ltr",
      textAlign: "left" as const,
      buttonAlign: "center" as const,
    },
    ar: {
      title: "طلب زيادة حد الرحلات - GuestNa",
      header: "⚠️ تم الوصول لحد الرحلات",
      mainTitle: "طلب زيادة حد الرحلات",
      alertBadge: "🚨 تم الوصول للحد الأقصى للرحلات",
      alertText:
        "حاول أحد أعضاء الفريق طلب رحلة جديدة ولكنه وصل إلى الحد الأقصى",
      greeting: "عزيزي مدير المدرسة،",
      intro:
        "وصل أحد أعضاء فريقك إلى الحد الأقصى للرحلات ويحتاج إلى موافقة لطلب رحلات إضافية. يرجى مراجعة التفاصيل أدناه وتقرير ما إذا كنت تريد زيادة حصة الرحلات الخاصة بهم.",
      statusTitle: "📊 حالة الرحلات الحالية",
      statusLabel: "الرحلات المستخدمة / الحد الأقصى المسموح",
      clientNameLabel: "👤 اسم العميل",
      emailLabel: "📧 البريد الإلكتروني",
      organizationLabel: "🏫 المؤسسة",
      trackLabel: "🎯 المسار",
      currentLimitLabel: "📈 الحد الحالي",
      tripsUsedLabel: "🎒 الرحلات المستخدمة",
      trips: "رحلات",
      whatMeansTitle: "💡 ماذا يعني هذا:",
      whatMeansText: (name: string, max: number) => `
        • <strong>${name}</strong> استخدم جميع الـ ${max} فرص الرحلات المتاحة<br/>
        • يحتاج إلى المزيد من الرحلات لمواصلة حجز التجارب التعليمية<br/>
        • يمكنك زيادة الحد الخاص به للسماح بطلبات رحلات إضافية<br/>
        • سيسري هذا التغيير فورًا بعد الموافقة
      `,
      actionTitle: "⚡ مطلوب إجراء",
      actionText: (name: string) =>
        `يرجى النقر على الزر أدناه لمراجعة وزيادة حد الرحلات لـ <strong>${name}</strong>. بمجرد الموافقة، سيتمكن من طلب رحلات إضافية على الفور.`,
      buttonText: "📈 زيادة حد الرحلات",
      footerText:
        "إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، يرجى الاتصال بفريق الدعم لدينا.<br/>ستساعد زيادة الحد هذه فريقك على تنظيم المزيد من التجارب التعليمية.",
      dir: "rtl",
      textAlign: "right" as const,
      buttonAlign: "center" as const,
    },
  };

  const t = content[language];

  const htmlTemp = `
  <!DOCTYPE html>
<html lang="${language}" dir="${t.dir}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${t.title}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #EEF2F7; color: #1E293B; font-family: ${language === "ar" ? "Arial, Tahoma, sans-serif" : "Arial, Helvetica, sans-serif"}; width: 100%; min-width: 100%; direction: ${t.dir};">

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
                  Alert
                </div>
                <div style="font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 8px; line-height: 1.3;">
                  ${t.mainTitle}
                </div>
                <div style="font-size: 14px; color: rgba(255,255,255,0.6);">
                  ${t.alertText}
                </div>
              </td>
            </tr>

            <!-- Accent Line -->
            <tr>
              <td style="height: 4px; background: linear-gradient(90deg, #F59E0B, #D97706, #F59E0B);"></td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 32px 36px;">

                <!-- Greeting -->
                <p style="font-size: 16px; color: #1E293B; font-weight: 600; margin: 0 0 8px; text-align: ${t.textAlign};">${t.greeting}</p>
                <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 24px; text-align: ${t.textAlign};">${t.intro}</p>

                <!-- Status Counter -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <div style="display: inline-block; background: linear-gradient(135deg, #FEF3C715, #FEF3C708); border: 2px solid #F59E0B40; border-radius: 14px; padding: 20px 40px; text-align: center;">
                        <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #F59E0B; font-weight: 700; margin-bottom: 8px;">${t.statusTitle}</div>
                        <div style="font-size: 36px; font-weight: 700; color: #EF4444;">${currentTripsCount} / ${currentMaxTrips}</div>
                        <div style="font-size: 15px; color: #94A3B8; margin-top: 6px;">${t.statusLabel}</div>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Alert Box -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background: #FFFBEB; border-left: 4px solid #F59E0B; border-radius: 0 10px 10px 0; padding: 16px 20px;">
                      <div style="font-size: 15px; color: #92400E; font-weight: 600; line-height: 1.7;">${t.whatMeansText(clientName, currentMaxTrips)}</div>
                    </td>
                  </tr>
                </table>

                <!-- Info Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; margin-bottom: 24px;" dir="${t.dir}">
                  <tr>
                    <td colspan="2" style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 12px 20px;">
                      <span style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px;">Client Information</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 20px 6px; width: 42%; border-bottom: 1px solid #F1F5F9; text-align: ${t.textAlign};">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">${t.clientNameLabel}</div>
                    </td>
                    <td style="padding: 14px 20px 6px; border-bottom: 1px solid #F1F5F9; text-align: ${t.textAlign};">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${clientName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9; text-align: ${t.textAlign};">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">${t.emailLabel}</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9; text-align: ${t.textAlign};">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${clientEmail}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9; text-align: ${t.textAlign};">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">${t.organizationLabel}</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9; text-align: ${t.textAlign};">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${organizationName}</div>
                    </td>
                  </tr>
                  ${
                    track
                      ? `
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9; text-align: ${t.textAlign};">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">${t.trackLabel}</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9; text-align: ${t.textAlign};">
                      <div style="font-size: 15px; color: #1E293B; font-weight: 600;">${track}</div>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                  <tr>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9; text-align: ${t.textAlign};">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">${t.currentLimitLabel}</div>
                    </td>
                    <td style="padding: 10px 20px 6px; border-bottom: 1px solid #F1F5F9; text-align: ${t.textAlign};">
                      <span style="display: inline-block; background: #FEF2F2; color: #EF4444; font-size: 15px; font-weight: 700; padding: 4px 14px; border-radius: 50px; border: 1px solid #FECACA;">${currentMaxTrips} ${t.trips}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 20px 14px; text-align: ${t.textAlign};">
                      <div style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.6px; color: #94A3B8; font-weight: 600;">${t.tripsUsedLabel}</div>
                    </td>
                    <td style="padding: 10px 20px 14px; text-align: ${t.textAlign};">
                      <span style="display: inline-block; background: #FFFBEB; color: #F59E0B; font-size: 15px; font-weight: 700; padding: 4px 14px; border-radius: 50px; border: 1px solid #FDE68A;">${currentTripsCount} ${t.trips}</span>
                    </td>
                  </tr>
                </table>

                <!-- Action Info -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background: #EFF6FF; border-left: 4px solid #3B82F6; border-radius: 0 10px 10px 0; padding: 16px 20px;">
                      <div style="font-size: 15px; font-weight: 700; color: #1D4ED8; margin-bottom: 6px;">${t.actionTitle}</div>
                      <div style="font-size: 15px; color: #1E40AF; line-height: 1.6;">${t.actionText(clientName)}</div>
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
                        ${t.buttonText} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 15px; color: #94A3B8; margin-top: 20px; line-height: 1.6; text-align: ${t.textAlign};">
                  ${t.footerText}
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
