// Ref: bookings/confirmed Invoices Booking — فاتورة ضريبية لحجز الرحلة (تصميم إيصال كاشير)
export const invoiceHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <base target="_blank" />
  <title>فاتورة ضريبية - جستنا</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap");
    body { font-family: "IBM Plex Sans Arabic", Arial, Tahoma, sans-serif !important; direction: rtl; }
    .mono { font-family: "Courier New", Consolas, monospace; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; }
      .content-pad { padding: 10px 16px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EEEEEE;color:#111111;font-family:'IBM Plex Sans Arabic',Arial,Tahoma,sans-serif;direction:rtl;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EEEEEE;">
    <tr>
      <td align="center" style="padding:24px 12px;">

        <!-- Receipt Paper -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="420" class="main-table"
               style="max-width:420px;background-color:#FFFFFF;margin:0 auto;border:1px solid #D9D9D9;">

          <!-- Logo / Store -->
          <tr>
            <td class="content-pad" style="padding:18px 20px 6px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa" width="70"
                   style="display:block;margin:0 auto 6px;border:0;" />
              <p style="margin:0;font-size:14px;font-weight:700;color:#111111;">منصة جستنا</p>
              <p style="margin:2px 0 0;font-size:11px;color:#666666;">الرياض، المملكة العربية السعودية</p>
              <p style="margin:2px 0 0;font-size:11px;color:#666666;">الرقم الضريبي: 1234567890</p>
              <p style="margin:2px 0 0;font-size:11px;color:#666666;" dir="ltr">+966 54 753 4666 &nbsp;|&nbsp; info@guestna.app</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:8px 20px 0;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Title -->
          <tr>
            <td class="content-pad" style="padding:10px 20px 6px;text-align:center;">
              <p style="margin:0;font-size:15px;font-weight:700;letter-spacing:3px;color:#111111;">فاتورة مبسطة</p>
              <p style="margin:2px 0 0;font-size:10px;color:#666666;letter-spacing:2px;">SIMPLIFIED INVOICE</p>
            </td>
          </tr>

          <!-- Meta -->
          <tr>
            <td class="content-pad" style="padding:8px 20px 10px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:12px;color:#222222;">
                <tr>
                  <td style="padding:2px 0;">رقم الفاتورة</td>
                  <td class="mono" style="padding:2px 0;text-align:left;">INV-2025-0742</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">تاريخ الإصدار</td>
                  <td class="mono" style="padding:2px 0;text-align:left;">2025/04/12</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">الحالة</td>
                  <td style="padding:2px 0;text-align:left;font-weight:700;">مسددة ✓</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">مرجع الرحلة (Trip ID)</td>
                  <td class="mono" style="padding:2px 0;text-align:left;">#GN-2025-4521</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Billed To -->
          <tr>
            <td class="content-pad" style="padding:10px 20px;font-size:12px;color:#222222;">
              <p style="margin:0 0 4px;font-size:11px;color:#666666;">العميل (ولي الأمر)</p>
              <p style="margin:0;font-weight:700;">أحمد محمد الأحمدي</p>
              <p style="margin:2px 0 0;color:#555555;">الرياض — رقم الحجز: BKG-00142</p>
              <p style="margin:2px 0 0;color:#555555;">parent@example.com</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Items header -->
          <tr>
            <td class="content-pad" style="padding:8px 20px 4px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:11px;color:#666666;">
                <tr>
                  <td style="text-align:right;">البيان</td>
                  <td style="width:40px;text-align:center;">الكمية</td>
                  <td style="width:60px;text-align:center;">السعر</td>
                  <td style="width:70px;text-align:left;">الإجمالي</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Item 1 -->
          <tr>
            <td class="content-pad" style="padding:4px 20px 8px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:12px;color:#222222;">
                <tr>
                  <td style="text-align:right;vertical-align:top;">
                    رحلة المزرعة التعليمية
                    <div style="font-size:10px;color:#666666;margin-top:2px;">2025/05/20 — 08:00 ص</div>
                  </td>
                  <td class="mono" style="width:40px;text-align:center;vertical-align:top;">45</td>
                  <td class="mono" style="width:60px;text-align:center;vertical-align:top;">95.00</td>
                  <td class="mono" style="width:70px;text-align:left;vertical-align:top;">4,275.00</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Subtotals -->
          <tr>
            <td class="content-pad" style="padding:8px 20px 4px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:12px;color:#222222;">
                <tr>
                  <td style="padding:2px 0;">المجموع قبل الضريبة</td>
                  <td class="mono" style="padding:2px 0;text-align:left;">4,275.00</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">ضريبة القيمة المضافة ١٥٪</td>
                  <td class="mono" style="padding:2px 0;text-align:left;">641.25</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Total -->
          <tr>
            <td class="content-pad" style="padding:10px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="font-size:14px;font-weight:700;color:#111111;">الإجمالي المستحق</td>
                  <td style="text-align:left;">
                    <span class="mono" style="font-size:18px;font-weight:700;color:#111111;">4,916.25</span>
                    <span style="font-size:11px;color:#666666;">&nbsp;ر.س</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider double -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px solid #111111;"></div></td></tr>
          <tr><td style="padding:1px 20px 0;"><div style="border-top:1px solid #111111;"></div></td></tr>

          <!-- Payment -->
          <tr>
            <td class="content-pad" style="padding:10px 20px;font-size:12px;color:#222222;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding:2px 0;">طريقة الدفع</td>
                  <td style="padding:2px 0;text-align:left;">محفظة جستنا + مدى</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">تاريخ الدفع</td>
                  <td class="mono" style="padding:2px 0;text-align:left;">2025/04/11</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">رقم المرجع</td>
                  <td class="mono" style="padding:2px 0;text-align:left;">TXN-9934-XKPL</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Thank you -->
          <tr>
            <td class="content-pad" style="padding:6px 20px 16px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#222222;">شكراً لتعاملكم معنا</p>
              <p style="margin:4px 0 0;font-size:10px;color:#666666;line-height:1.6;">
                فاتورة إلكترونية معتمدة، لا تحتاج إلى ختم أو توقيع.<br/>
                <a href="https://guestna.app/invoice/INV-2025-0742/pdf" style="color:#111111;text-decoration:underline;">تحميل PDF</a>
                &nbsp;|&nbsp;
                <a href="mailto:info@guestna.app" style="color:#111111;text-decoration:none;">info@guestna.app</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
