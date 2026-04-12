export const invoiceHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>فاتورة الدفع - جستنا</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#f0f4f4;font-family:'IBM Plex Sans Arabic',Arial,sans-serif;direction:rtl;">

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f0f4f4;padding:48px 16px;">
    <tr>
      <td align="center">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,143,143,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#008F8F 0%,#006e6e 100%);padding:32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <img src="https://guestna-edu.com/logo.png" alt="جستنا" width="100" style="display:block;" />
                    <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">منصة الرحلات التعليمية للمدارس</p>
                  </td>
                  <td style="text-align:left;">
                    <div style="background-color:rgba(255,255,255,0.15);border-radius:8px;padding:12px 18px;display:inline-block;">
                      <p style="margin:0;color:#ffffff;font-size:11px;opacity:0.8;">رقم الفاتورة</p>
                      <p style="margin:4px 0 0;color:#ffffff;font-size:18px;font-weight:700;">#INV-2025-0742</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- PAID Badge -->
          <tr>
            <td style="background-color:#e6f5f5;padding:20px 40px;border-bottom:1px solid #d0eaea;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin:0;color:#555;font-size:13px;">تاريخ الإصدار: <strong style="color:#1a1a1a;">12 أبريل 2025</strong></p>
                    <p style="margin:4px 0 0;color:#555;font-size:13px;">تاريخ الاستحقاق: <strong style="color:#1a1a1a;">19 أبريل 2025</strong></p>
                  </td>
                  <td style="text-align:left;">
                    <div style="background-color:#008F8F;border-radius:6px;padding:8px 20px;display:inline-block;">
                      <span style="color:#ffffff;font-size:13px;font-weight:700;letter-spacing:1px;">✓ مدفوعة</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- From / To -->
          <tr>
            <td style="padding:28px 40px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="width:50%;vertical-align:top;padding-left:16px;">
                    <p style="margin:0 0 8px;color:#008F8F;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">من</p>
                    <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:700;">منصة جستنا التعليمية</p>
                    <p style="margin:4px 0 0;color:#666;font-size:13px;line-height:1.7;">
                      الرياض، المملكة العربية السعودية<br />
                      ر.ض: 1234567890<br />
                      finance@guestna-edu.com
                    </p>
                  </td>
                  <td style="width:50%;vertical-align:top;">
                    <p style="margin:0 0 8px;color:#008F8F;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">إلى</p>
                    <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:700;">مدرسة النور الدولية</p>
                    <p style="margin:4px 0 0;color:#666;font-size:13px;line-height:1.7;">
                      جدة، المملكة العربية السعودية<br />
                      رقم العميل: SCH-00142<br />
                      billing@alnour-school.edu.sa
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Trip Summary -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8fbfb;border:1px solid #d0eaea;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="background-color:#008F8F;padding:11px 18px;">
                    <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;">تفاصيل الخدمة</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <!-- Table Header -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr style="background-color:#e6f5f5;border-bottom:1px solid #d0eaea;">
                        <td style="padding:10px 18px;"><p style="margin:0;color:#008F8F;font-size:11px;font-weight:700;">البيان</p></td>
                        <td style="padding:10px 10px;text-align:center;"><p style="margin:0;color:#008F8F;font-size:11px;font-weight:700;">الكمية</p></td>
                        <td style="padding:10px 10px;text-align:center;"><p style="margin:0;color:#008F8F;font-size:11px;font-weight:700;">سعر الوحدة</p></td>
                        <td style="padding:10px 18px;text-align:left;"><p style="margin:0;color:#008F8F;font-size:11px;font-weight:700;">الإجمالي</p></td>
                      </tr>

                      <tr style="border-bottom:1px solid #f0f0f0;">
                        <td style="padding:14px 18px;">
                          <p style="margin:0;color:#1a1a1a;font-size:13px;font-weight:600;">رحلة المزرعة التعليمية — الرياض</p>
                          <p style="margin:3px 0 0;color:#888;font-size:12px;">20 مايو 2025 | 8:00 ص – 2:00 م</p>
                        </td>
                        <td style="padding:14px 10px;text-align:center;"><p style="margin:0;color:#333;font-size:13px;">45</p></td>
                        <td style="padding:14px 10px;text-align:center;"><p style="margin:0;color:#333;font-size:13px;">95.00 ر.س</p></td>
                        <td style="padding:14px 18px;text-align:left;"><p style="margin:0;color:#1a1a1a;font-size:13px;font-weight:600;">4,275.00 ر.س</p></td>
                      </tr>

                      <tr style="border-bottom:1px solid #f0f0f0;background-color:#fafcfc;">
                        <td style="padding:14px 18px;">
                          <p style="margin:0;color:#1a1a1a;font-size:13px;font-weight:600;">رسوم إدارة المنصة</p>
                          <p style="margin:3px 0 0;color:#888;font-size:12px;">5% من إجمالي قيمة الرحلة</p>
                        </td>
                        <td style="padding:14px 10px;text-align:center;"><p style="margin:0;color:#333;font-size:13px;">—</p></td>
                        <td style="padding:14px 10px;text-align:center;"><p style="margin:0;color:#333;font-size:13px;">—</p></td>
                        <td style="padding:14px 18px;text-align:left;"><p style="margin:0;color:#1a1a1a;font-size:13px;font-weight:600;">213.75 ر.س</p></td>
                      </tr>

                      <!-- Totals -->
                      <tr style="border-top:2px solid #e0e0e0;">
                        <td colspan="3" style="padding:12px 18px;text-align:left;">
                          <p style="margin:0;color:#666;font-size:13px;">المجموع قبل الضريبة</p>
                        </td>
                        <td style="padding:12px 18px;text-align:left;">
                          <p style="margin:0;color:#1a1a1a;font-size:13px;font-weight:600;">4,488.75 ر.س</p>
                        </td>
                      </tr>
                      <tr style="border-top:1px solid #f0f0f0;">
                        <td colspan="3" style="padding:12px 18px;text-align:left;">
                          <p style="margin:0;color:#666;font-size:13px;">ضريبة القيمة المضافة (15%)</p>
                        </td>
                        <td style="padding:12px 18px;text-align:left;">
                          <p style="margin:0;color:#1a1a1a;font-size:13px;font-weight:600;">673.31 ر.س</p>
                        </td>
                      </tr>
                      <tr style="background-color:#008F8F;">
                        <td colspan="3" style="padding:16px 18px;text-align:left;">
                          <p style="margin:0;color:#ffffff;font-size:14px;font-weight:700;">إجمالي المبلغ المدفوع</p>
                        </td>
                        <td style="padding:16px 18px;text-align:left;">
                          <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">5,162.06 ر.س</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Method -->
          <tr>
            <td style="padding:20px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#fff8f0;border:1.5px solid #ED8A22;border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;color:#ED8A22;font-size:12px;font-weight:700;">طريقة الدفع</p>
                          <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">محفظة جستنا + مدى</p>
                        </td>
                        <td style="text-align:left;">
                          <p style="margin:0 0 4px;color:#ED8A22;font-size:12px;font-weight:700;">تاريخ الدفع</p>
                          <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">11 أبريل 2025، 3:22 م</p>
                        </td>
                        <td style="text-align:left;">
                          <p style="margin:0 0 4px;color:#ED8A22;font-size:12px;font-weight:700;">رقم المرجع</p>
                          <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">TXN-9934-XKPL</p>
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
            <td style="padding:0 40px 32px;text-align:center;">
              <a href="#" style="display:inline-block;background-color:#ED8A22;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 36px;border-radius:8px;margin-left:12px;">
                تنزيل الفاتورة PDF
              </a>
              <a href="#" style="display:inline-block;background-color:#f0f4f4;color:#008F8F;text-decoration:none;font-size:14px;font-weight:600;padding:13px 28px;border-radius:8px;border:1px solid #d0eaea;">
                عرض في لوحة التحكم
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#006e6e;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:rgba(255,255,255,0.9);font-size:13px;font-weight:600;">منصة جستنا للرحلات التعليمية</p>
              <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;">هذه الفاتورة صادرة إلكترونياً ولا تحتاج إلى ختم أو توقيع. © 2025 Guestna</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
