export const askTripRejectTemplate = (
  lang: 'en' | 'ar',
  schoolName: string,
  email: string,
  phone: string,
  reason: string,
  orderId: string,
) => {
  const isAr = lang === 'ar';

  const texts = {
    header: isAr ? '❌ تم رفض طلب الرحلة' : '❌ Trip Request Rejected',
    title: isAr ? 'تحديث طلب الرحلة' : 'Trip Request Update',
    body: isAr
      ? 'شكرًا لتقديم طلب الرحلة. بعد المراجعة الدقيقة، نأسف لإبلاغكم أن الطلب لم يتم الموافقة عليه في الوقت الحالي.'
      : 'Thank you for submitting your trip request. After careful review, we regret to inform you that the request could not be approved at this time.',
    orderId: isAr ? '🆔 رقم الطلب' : '🆔 Order Id',

    organization: isAr ? '🏢 المؤسسة' : '🏢 Organization',
    emailLabel: isAr ? '📧 البريد الإلكتروني' : '📧 Email',
    phoneLabel: isAr ? '📱 رقم الهاتف' : '📱 Phone',
    rejectionReason: isAr ? '📝 سبب الرفض' : '📝 Reason for Rejection',
    noReason: isAr
      ? 'لم يتم تقديم سبب محدد.'
      : 'No specific reason was provided.',
    footer: isAr
      ? 'يمكنك تقديم طلب جديد مع تفاصيل محدثة، وسيسر فريقنا مراجعته مرة أخرى.'
      : 'You are welcome to submit a new request with updated details. Our team will be happy to review it again.',
    dir: isAr ? 'rtl' : 'ltr',
    textAlign: isAr ? 'right' : 'left',
  };

  return `<!doctype html>
<html lang="${lang}" dir="${texts.dir}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${texts.header} - GuestNa</title>
  </head>
  <body style="margin:0;padding:0;background-color:#EEF2F7;color:#1E293B;font-family:Arial,Helvetica,sans-serif;width:100%;min-width:100%;direction:${texts.dir};text-align:${texts.textAlign};">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF2F7;">
      <tr>
        <td align="center" style="padding:32px 16px;">

          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(150deg,#0A2540 0%,#0B6B85 60%,#0B9A9A 100%);padding:36px 36px 32px;text-align:center;">
                <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" alt="GuestNa Logo" width="130" style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;">
                <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:5px 18px;font-size:11px;color:#ffffff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">
                  Trip Update
                </div>
                <div style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">${texts.title}</div>
                <div style="font-size:14px;color:rgba(255,255,255,0.6);">${texts.header}</div>
              </td>
            </tr>

            <!-- Accent Line -->
            <tr>
              <td style="height:4px;background:linear-gradient(90deg,#EF4444,#DC2626,#EF4444);"></td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px 36px;">

                <!-- Body Text -->
                <p style="font-size:15px;line-height:1.7;color:#475569;margin:0 0 24px;text-align:${texts.textAlign};">${texts.body}</p>

                <!-- Info Card -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                  <tr>
                    <td colspan="2" style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;">
                      <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">Request Details</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:${texts.textAlign};">
                      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">${texts.orderId}</div>
                    </td>
                    <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:${texts.textAlign};">
                      <div style="font-size:15px;color:#EF4444;font-weight:700;">${orderId || '-'}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:${texts.textAlign};">
                      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">${texts.organization}</div>
                    </td>
                    <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:${texts.textAlign};">
                      <div style="font-size:15px;color:#1E293B;font-weight:600;">${schoolName || '-'}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:${texts.textAlign};">
                      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">${texts.emailLabel}</div>
                    </td>
                    <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:${texts.textAlign};">
                      <div style="font-size:15px;color:#1E293B;font-weight:600;">${email || '-'}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 20px 14px;text-align:${texts.textAlign};">
                      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">${texts.phoneLabel}</div>
                    </td>
                    <td style="padding:10px 20px 14px;text-align:${texts.textAlign};">
                      <div style="font-size:15px;color:#1E293B;font-weight:600;">${phone || '-'}</div>
                    </td>
                  </tr>
                </table>

                <!-- Rejection Reason -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="background:#FEF2F2;border-left:4px solid #EF4444;border-radius:0 10px 10px 0;padding:16px 20px;">
                      <div style="font-size:12px;font-weight:700;color:#EF4444;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px;">${texts.rejectionReason}</div>
                      <div style="font-size:14px;color:#7F1D1D;line-height:1.7;">${reason || texts.noReason}</div>
                    </td>
                  </tr>
                </table>

                <!-- Footer Note -->
                <p style="font-size:14px;color:#64748B;line-height:1.7;text-align:${texts.textAlign};margin:0;">${texts.footer}</p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#0A2540;padding:24px 36px;text-align:center;">
                <img
                  src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                  alt="GuestNa"
                  width="90"
                  style="display:block;margin:0 auto 12px;filter:brightness(0) invert(1);opacity:0.85;border:0;"
                />
                <p style="margin:0 0 8px;font-size:12px;color:rgba(255,255,255,0.35);">&copy; 2024 GuestNa. All rights reserved.</p>
                <p style="margin:0;font-size:12px;">
                  <a href="#" style="color:rgba(255,255,255,0.45);text-decoration:none;">Unsubscribe</a>
                  <span style="color:rgba(255,255,255,0.2);margin:0 6px;">&middot;</span>
                  <a href="#" style="color:rgba(255,255,255,0.45);text-decoration:none;">Privacy Policy</a>
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>`;
};
