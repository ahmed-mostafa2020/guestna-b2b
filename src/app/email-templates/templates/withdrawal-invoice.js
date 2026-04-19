// Ref: email-temp/admin/askWithdrawalsInvoiceConfirming.ts
export const withdrawalInvoiceHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>فاتورة السحب - GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap");
    body { font-family: "Tajawal", Arial, Tahoma, sans-serif !important; direction: rtl; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EEF2F7;color:#1E293B;font-family:'Tajawal',Arial,Tahoma,sans-serif;direction:rtl;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EEF2F7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="main-table" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:32px 36px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align:right;">
                    <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" alt="GuestNa Logo" width="110" style="display:block;filter:brightness(0) invert(1);border:0;margin-bottom:6px;" />
                    <p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;">منصة الرحلات التعليمية للمدارس</p>
                  </td>
                  <td style="text-align:left;">
                    <div style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);border-radius:12px;padding:14px 20px;display:inline-block;">
                      <p style="margin:0;color:rgba(255,255,255,0.6);font-size:11px;text-transform:uppercase;letter-spacing:0.8px;">رقم السحب</p>
                      <p style="margin:4px 0 0;color:#ffffff;font-size:20px;font-weight:700;">#WD-2025-0893</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- Invoice Title Bar -->
          <tr>
            <td style="background:#F0FDFA;padding:16px 36px;border-bottom:1px solid #D0EAEA;text-align:center;">
              <p style="margin:0;color:#008F8F;font-size:16px;font-weight:700;">🧾 فاتورة سحب الرصيد المؤسسي</p>
            </td>
          </tr>

          <!-- Meta Data -->
          <tr>
            <td class="content-pad" style="padding:28px 36px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="width:50%;vertical-align:top;padding-left:16px;">
                    <p style="margin:0 0 6px;color:#008F8F;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">الجهة المستفيدة</p>
                    <p style="margin:0;color:#1E293B;font-size:14px;font-weight:700;">مدرسة النور الدولية</p>
                    <p style="margin:4px 0 0;color:#64748B;font-size:13px;line-height:1.7;">
                      رمز الرحلة: TRP-9843<br />
                      تاريخ الإصدار: 15 مايو 2025
                    </p>
                  </td>
                  <td style="width:50%;vertical-align:top;">
                    <p style="margin:0 0 6px;color:#008F8F;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">تفاصيل الرحلة</p>
                    <p style="margin:4px 0 0;color:#64748B;font-size:13px;line-height:1.7;">
                      النظام التعليمي: عام<br />
                      الجنس: بنين<br />
                      المراحل: المرحلة المتوسطة
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Service Details -->
          <tr>
            <td class="content-pad" style="padding:24px 36px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="background:#008F8F;padding:12px 18px;">
                    <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;">تفاصيل العناصر المسحوبة</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <!-- Table Header -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr style="background:#F0FDFA;border-bottom:1px solid #D0EAEA;">
                        <td style="padding:10px 18px;text-align:right;"><p style="margin:0;color:#008F8F;font-size:11px;font-weight:700;">الصف / البرنامج</p></td>
                        <td style="padding:10px 10px;text-align:center;"><p style="margin:0;color:#008F8F;font-size:11px;font-weight:700;">الكمية</p></td>
                        <td style="padding:10px 10px;text-align:center;"><p style="margin:0;color:#008F8F;font-size:11px;font-weight:700;">ربح الوحدة</p></td>
                        <td style="padding:10px 18px;text-align:left;"><p style="margin:0;color:#008F8F;font-size:11px;font-weight:700;">الإجمالي</p></td>
                      </tr>
                      <!-- Single Row example for grade split -->
                      <tr style="border-bottom:1px solid #F1F5F9;">
                        <td style="padding:14px 18px;text-align:right;">
                          <p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;">رحلة المزرعة — الصف الأول</p>
                        </td>
                        <td style="padding:14px 10px;text-align:center;"><p style="margin:0;color:#334155;font-size:13px;">20</p></td>
                        <td style="padding:14px 10px;text-align:center;"><p style="margin:0;color:#334155;font-size:13px;">30.00 ر.س</p></td>
                        <td style="padding:14px 18px;text-align:left;"><p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;">600.00 ر.س</p></td>
                      </tr>
                      <tr style="border-bottom:1px solid #F1F5F9;">
                        <td style="padding:14px 18px;text-align:right;">
                          <p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;">رحلة المزرعة — الصف الثاني</p>
                        </td>
                        <td style="padding:14px 10px;text-align:center;"><p style="margin:0;color:#334155;font-size:13px;">20</p></td>
                        <td style="padding:14px 10px;text-align:center;"><p style="margin:0;color:#334155;font-size:13px;">30.00 ر.س</p></td>
                        <td style="padding:14px 18px;text-align:left;"><p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;">600.00 ر.س</p></td>
                      </tr>
                      
                      <!-- Total -->
                      <tr style="background:#008F8F;">
                        <td colspan="3" style="padding:16px 18px;text-align:right;"><p style="margin:0;color:#ffffff;font-size:14px;font-weight:700;">إجمالي مبلغ السحب</p></td>
                        <td style="padding:16px 18px;text-align:left;"><p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">1,200.00 ر.س</p></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Legal Note -->
          <tr>
            <td style="padding:28px 36px 20px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">هذه القسيمة بمثابة مستند إثبات إلكتروني لعملية سحب أرباح المدرسة المعتمدة.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0A2540;padding:24px 36px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" alt="GuestNa" width="90" style="display:block;margin:0 auto 12px;filter:brightness(0) invert(1);opacity:0.85;border:0;" />
              <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.7);font-weight:600;">منصة جستنا للرحلات التعليمية</p>
              <p style="margin:0;font-size:12px;">
                <a href="mailto:finance@guestna.app" style="color:#00B4D8;text-decoration:none;">للتواصل: finance@guestna.app</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
