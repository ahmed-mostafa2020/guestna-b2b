export const invoiceHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>فاتورة الدفع - جستنا</title>
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
                    <img
                      src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                      alt="GuestNa Logo"
                      width="110"
                      style="display:block;filter:brightness(0) invert(1);border:0;margin-bottom:6px;"
                    />
                    <p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;">منصة الرحلات التعليمية للمدارس</p>
                  </td>
                  <td style="text-align:left;">
                    <div style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);border-radius:12px;padding:14px 20px;display:inline-block;">
                      <p style="margin:0;color:rgba(255,255,255,0.6);font-size:11px;text-transform:uppercase;letter-spacing:0.8px;">رقم الفاتورة</p>
                      <p style="margin:4px 0 0;color:#ffffff;font-size:20px;font-weight:700;">#INV-2025-0742</p>
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

          <!-- Invoice Meta Bar -->
          <tr>
            <td style="background:#F0FDFA;padding:16px 36px;border-bottom:1px solid #D0EAEA;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align:right;">
                    <p style="margin:0;color:#475569;font-size:13px;">تاريخ الإصدار: <strong style="color:#1E293B;">12 أبريل 2025</strong></p>
                    <p style="margin:4px 0 0;color:#475569;font-size:13px;">تاريخ الاستحقاق: <strong style="color:#1E293B;">19 أبريل 2025</strong></p>
                  </td>
                  <td style="text-align:left;">
                    <span style="display:inline-block;background:#008F8F;color:#fff;font-size:12px;font-weight:700;padding:6px 18px;border-radius:50px;letter-spacing:0.5px;">✓ مدفوعة</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- From / To -->
          <tr>
            <td class="content-pad" style="padding:28px 36px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="width:50%;vertical-align:top;padding-left:16px;">
                    <p style="margin:0 0 6px;color:#008F8F;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">من</p>
                    <p style="margin:0;color:#1E293B;font-size:14px;font-weight:700;">منصة جستنا التعليمية</p>
                    <p style="margin:4px 0 0;color:#64748B;font-size:13px;line-height:1.7;">
                      الرياض، المملكة العربية السعودية<br />
                      ر.ض: 1234567890<br />
                      finance@guestna-edu.com
                    </p>
                  </td>
                  <td style="width:50%;vertical-align:top;">
                    <p style="margin:0 0 6px;color:#008F8F;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">إلى</p>
                    <p style="margin:0;color:#1E293B;font-size:14px;font-weight:700;">مدرسة النور الدولية</p>
                    <p style="margin:4px 0 0;color:#64748B;font-size:13px;line-height:1.7;">
                      جدة، المملكة العربية السعودية<br />
                      رقم العميل: SCH-00142<br />
                      billing@alnour-school.edu.sa
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
                    <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;">تفاصيل الخدمة</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <!-- Table Header -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr style="background:#F0FDFA;border-bottom:1px solid #D0EAEA;">
                        <td style="padding:10px 18px;text-align:right;"><p style="margin:0;color:#008F8F;font-size:11px;font-weight:700;">البيان</p></td>
                        <td style="padding:10px 10px;text-align:center;"><p style="margin:0;color:#008F8F;font-size:11px;font-weight:700;">الكمية</p></td>
                        <td style="padding:10px 10px;text-align:center;"><p style="margin:0;color:#008F8F;font-size:11px;font-weight:700;">سعر الوحدة</p></td>
                        <td style="padding:10px 18px;text-align:left;"><p style="margin:0;color:#008F8F;font-size:11px;font-weight:700;">الإجمالي</p></td>
                      </tr>
                      <tr style="border-bottom:1px solid #F1F5F9;">
                        <td style="padding:14px 18px;text-align:right;">
                          <p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;">رحلة المزرعة التعليمية — الرياض</p>
                          <p style="margin:3px 0 0;color:#94A3B8;font-size:12px;">20 مايو 2025 | 8:00 ص – 2:00 م</p>
                        </td>
                        <td style="padding:14px 10px;text-align:center;"><p style="margin:0;color:#334155;font-size:13px;">45</p></td>
                        <td style="padding:14px 10px;text-align:center;"><p style="margin:0;color:#334155;font-size:13px;">95.00 ر.س</p></td>
                        <td style="padding:14px 18px;text-align:left;"><p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;">4,275.00 ر.س</p></td>
                      </tr>
                      <tr style="border-bottom:1px solid #F1F5F9;background:#F8FAFC;">
                        <td style="padding:14px 18px;text-align:right;">
                          <p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;">رسوم إدارة المنصة</p>
                          <p style="margin:3px 0 0;color:#94A3B8;font-size:12px;">5% من إجمالي قيمة الرحلة</p>
                        </td>
                        <td style="padding:14px 10px;text-align:center;"><p style="margin:0;color:#334155;font-size:13px;">—</p></td>
                        <td style="padding:14px 10px;text-align:center;"><p style="margin:0;color:#334155;font-size:13px;">—</p></td>
                        <td style="padding:14px 18px;text-align:left;"><p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;">213.75 ر.س</p></td>
                      </tr>
                      <!-- Subtotal -->
                      <tr style="border-top:2px solid #E2E8F0;">
                        <td colspan="3" style="padding:12px 18px;text-align:right;"><p style="margin:0;color:#64748B;font-size:13px;">المجموع قبل الضريبة</p></td>
                        <td style="padding:12px 18px;text-align:left;"><p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;">4,488.75 ر.س</p></td>
                      </tr>
                      <tr style="border-top:1px solid #F1F5F9;">
                        <td colspan="3" style="padding:12px 18px;text-align:right;"><p style="margin:0;color:#64748B;font-size:13px;">ضريبة القيمة المضافة (15%)</p></td>
                        <td style="padding:12px 18px;text-align:left;"><p style="margin:0;color:#1E293B;font-size:13px;font-weight:600;">673.31 ر.س</p></td>
                      </tr>
                      <tr style="background:#008F8F;">
                        <td colspan="3" style="padding:16px 18px;text-align:right;"><p style="margin:0;color:#ffffff;font-size:14px;font-weight:700;">إجمالي المبلغ المدفوع</p></td>
                        <td style="padding:16px 18px;text-align:left;"><p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">5,162.06 ر.س</p></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Details -->
          <tr>
            <td class="content-pad" style="padding:20px 36px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FFF8F0;border:1.5px solid #ED8A22;border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="text-align:right;">
                          <p style="margin:0 0 4px;color:#ED8A22;font-size:12px;font-weight:700;">طريقة الدفع</p>
                          <p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;">محفظة جستنا + مدى</p>
                        </td>
                        <td style="text-align:center;">
                          <p style="margin:0 0 4px;color:#ED8A22;font-size:12px;font-weight:700;">تاريخ الدفع</p>
                          <p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;">11 أبريل 2025، 3:22 م</p>
                        </td>
                        <td style="text-align:left;">
                          <p style="margin:0 0 4px;color:#ED8A22;font-size:12px;font-weight:700;">رقم المرجع</p>
                          <p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;font-family:monospace;">TXN-9934-XKPL</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:0 36px 32px;">
              <a href="#" style="display:inline-block;background:linear-gradient(135deg,#ED8A22,#d4701a);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 36px;border-radius:10px;box-shadow:0 4px 20px rgba(237,138,34,0.3);margin-left:10px;">
                تنزيل الفاتورة PDF
              </a>
              <a href="#" style="display:inline-block;background:#F8FAFC;color:#008F8F;text-decoration:none;font-size:14px;font-weight:600;padding:13px 28px;border-radius:10px;border:1.5px solid #D0EAEA;">
                عرض في لوحة التحكم
              </a>
            </td>
          </tr>

          <!-- Legal Note -->
          <tr>
            <td style="padding:0 36px 20px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">هذه الفاتورة صادرة إلكترونياً ولا تحتاج إلى ختم أو توقيع.</p>
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
              <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.7);font-weight:600;">منصة جستنا للرحلات التعليمية</p>
              <p style="margin:0 0 8px;font-size:12px;color:rgba(255,255,255,0.35);">© 2025 GuestNa. جميع الحقوق محفوظة.</p>
              <p style="margin:0;font-size:12px;">
                <a href="#" style="color:rgba(255,255,255,0.45);text-decoration:none;">إلغاء الاشتراك</a>
                <span style="color:rgba(255,255,255,0.2);margin:0 6px;">&middot;</span>
                <a href="#" style="color:rgba(255,255,255,0.45);text-decoration:none;">سياسة الخصوصية</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
