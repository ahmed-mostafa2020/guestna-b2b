export const walletWithdrawalHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>طلب سحب رصيد المحفظة - جستنا</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#f0f4f4;font-family:'IBM Plex Sans Arabic',Arial,sans-serif;direction:rtl;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f0f4f4;padding:48px 16px;">
    <tr>
      <td align="center">

        <!-- ─── Email Card ─── -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,143,143,0.10);">

          <!-- ─── Header ─── -->
          <tr>
            <td style="background:linear-gradient(135deg,#008F8F 0%,#006e6e 100%);padding:36px 40px;text-align:center;">
              <img src="https://guestna-edu.com/logo.png" alt="جستنا" width="110" style="display:block;margin:0 auto 12px;" />
              <p style="margin:0;color:rgba(255,255,255,0.75);font-size:13px;letter-spacing:0.5px;">منصة الرحلات التعليمية للمدارس</p>
            </td>
          </tr>

          <!-- ─── Status Banner ─── -->
          <tr>
            <td style="background-color:#fff8f0;padding:24px 40px;text-align:center;border-bottom:1px solid #f0ddc0;">
              <div style="display:inline-block;background-color:#ED8A22;border-radius:8px;padding:6px 20px;margin-bottom:14px;">
                <span style="color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.5px;">بانتظار المراجعة</span>
              </div>
              <h1 style="margin:0 0 6px;color:#1a1a1a;font-size:22px;font-weight:700;">طلب سحب رصيد المحفظة</h1>
              <p style="margin:0;color:#666;font-size:14px;">رقم الطلب: <strong style="color:#ED8A22;">#WD-2025-0893</strong></p>
            </td>
          </tr>

          <!-- ─── Greeting ─── -->
          <tr>
            <td style="padding:32px 40px 24px;">
              <p style="margin:0 0 6px;color:#1a1a1a;font-size:16px;font-weight:600;">إلى: فريق العمليات المالية — جستنا</p>
              <p style="margin:12px 0 0;color:#444;font-size:14px;line-height:1.8;">
                تم استلام طلب سحب رصيد جديد من خلال لوحة التحكم. يُرجى مراجعة التفاصيل أدناه والمعالجة وفق سياسة السحب المعتمدة.
              </p>
            </td>
          </tr>

          <!-- ─── School Info ─── -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8fbfb;border:1px solid #d0eaea;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="background-color:#008F8F;padding:12px 20px;">
                    <p style="margin:0;color:#ffffff;font-size:14px;font-weight:700;">بيانات المدرسة</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">

                      <tr style="border-bottom:1px solid #e8f0f0;">
                        <td style="padding:13px 20px;width:45%;background-color:#fafcfc;">
                          <p style="margin:0;color:#888;font-size:12px;font-weight:500;">اسم المدرسة</p>
                        </td>
                        <td style="padding:13px 20px;background-color:#fafcfc;">
                          <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">مدرسة النور الدولية</p>
                        </td>
                      </tr>

                      <tr style="border-bottom:1px solid #e8f0f0;">
                        <td style="padding:13px 20px;">
                          <p style="margin:0;color:#888;font-size:12px;font-weight:500;">رقم الحساب</p>
                        </td>
                        <td style="padding:13px 20px;">
                          <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">#SCH-00142</p>
                        </td>
                      </tr>

                      <tr style="border-bottom:1px solid #e8f0f0;">
                        <td style="padding:13px 20px;background-color:#fafcfc;">
                          <p style="margin:0;color:#888;font-size:12px;font-weight:500;">مرجع الرحلة</p>
                        </td>
                        <td style="padding:13px 20px;background-color:#fafcfc;">
                          <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">#GN-2025-4521 — رحلة المزرعة التعليمية</p>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:13px 20px;">
                          <p style="margin:0;color:#888;font-size:12px;font-weight:500;">طريقة السحب</p>
                        </td>
                        <td style="padding:13px 20px;">
                          <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">تحويل بنكي — بنك الراجحي</p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── Financial Summary ─── -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="background-color:#1a1a1a;padding:12px 20px;">
                    <p style="margin:0;color:#ffffff;font-size:14px;font-weight:700;">ملخص المعاملة المالية</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">

                      <tr style="border-bottom:1px solid #f0f0f0;">
                        <td style="padding:16px 20px;width:55%;">
                          <p style="margin:0;color:#666;font-size:13px;">الرصيد قبل السحب</p>
                        </td>
                        <td style="padding:16px 20px;text-align:left;">
                          <p style="margin:0;color:#1a1a1a;font-size:15px;font-weight:600;">12,500.00 ر.س</p>
                        </td>
                      </tr>

                      <tr style="border-bottom:1px solid #f0f0f0;background-color:#fff8f0;">
                        <td style="padding:16px 20px;">
                          <p style="margin:0;color:#ED8A22;font-size:13px;font-weight:600;">المبلغ المطلوب سحبه</p>
                        </td>
                        <td style="padding:16px 20px;text-align:left;">
                          <p style="margin:0;color:#ED8A22;font-size:18px;font-weight:700;">8,200.00 ر.س</p>
                        </td>
                      </tr>

                      <tr style="border-bottom:1px solid #f0f0f0;">
                        <td style="padding:16px 20px;">
                          <p style="margin:0;color:#666;font-size:13px;">رسوم المعالجة</p>
                        </td>
                        <td style="padding:16px 20px;text-align:left;">
                          <p style="margin:0;color:#1a1a1a;font-size:15px;font-weight:600;">0.00 ر.س</p>
                        </td>
                      </tr>

                      <tr style="background-color:#e6f5f5;">
                        <td style="padding:16px 20px;">
                          <p style="margin:0;color:#008F8F;font-size:13px;font-weight:700;">الرصيد المتبقي بعد السحب</p>
                        </td>
                        <td style="padding:16px 20px;text-align:left;">
                          <p style="margin:0;color:#008F8F;font-size:18px;font-weight:700;">4,300.00 ر.س</p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── Status Timeline ─── -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0 0 16px;color:#1a1a1a;font-size:15px;font-weight:700;">مراحل المعالجة</p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="28" valign="top" style="padding-top:2px;">
                    <div style="width:20px;height:20px;background-color:#008F8F;border-radius:50%;text-align:center;line-height:20px;">
                      <span style="color:#fff;font-size:11px;font-weight:700;">✓</span>
                    </div>
                  </td>
                  <td style="padding-right:12px;padding-bottom:16px;border-right:2px solid #d0eaea;">
                    <p style="margin:0;color:#008F8F;font-size:13px;font-weight:700;">تم استلام الطلب</p>
                    <p style="margin:2px 0 0;color:#888;font-size:12px;">12 أبريل 2025، 10:45 ص</p>
                  </td>
                </tr>
                <tr>
                  <td width="28" valign="top" style="padding-top:2px;">
                    <div style="width:20px;height:20px;background-color:#ED8A22;border-radius:50%;text-align:center;line-height:20px;">
                      <span style="color:#fff;font-size:11px;font-weight:700;">2</span>
                    </div>
                  </td>
                  <td style="padding-right:12px;padding-bottom:16px;border-right:2px solid #f0e0c8;">
                    <p style="margin:0;color:#ED8A22;font-size:13px;font-weight:700;">قيد المراجعة المالية</p>
                    <p style="margin:2px 0 0;color:#888;font-size:12px;">يستغرق عادةً 1-2 يوم عمل</p>
                  </td>
                </tr>
                <tr>
                  <td width="28" valign="top" style="padding-top:2px;">
                    <div style="width:20px;height:20px;background-color:#e0e0e0;border-radius:50%;text-align:center;line-height:20px;">
                      <span style="color:#999;font-size:11px;font-weight:700;">3</span>
                    </div>
                  </td>
                  <td style="padding-right:12px;">
                    <p style="margin:0;color:#999;font-size:13px;font-weight:600;">التحويل البنكي</p>
                    <p style="margin:2px 0 0;color:#bbb;font-size:12px;">سيتم إشعارك عند الاكتمال</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── CTA ─── -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <a href="#" style="display:inline-block;background-color:#008F8F;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 36px;border-radius:8px;margin-left:12px;">
                متابعة الطلب
              </a>
              <a href="#" style="display:inline-block;background-color:#f0f4f4;color:#008F8F;text-decoration:none;font-size:14px;font-weight:600;padding:13px 36px;border-radius:8px;border:1px solid #d0eaea;">
                لوحة تحكم المدرسة
              </a>
            </td>
          </tr>

          <!-- ─── Footer ─── -->
          <tr>
            <td style="background-color:#006e6e;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;color:rgba(255,255,255,0.9);font-size:13px;font-weight:600;">منصة جستنا للرحلات التعليمية</p>
              <p style="margin:0;color:rgba(255,255,255,0.55);font-size:12px;">© 2025 Guestna. جميع الحقوق محفوظة.</p>
              <p style="margin:12px 0 0;color:rgba(255,255,255,0.45);font-size:11px;">هذا البريد تلقائي — لا تقم بالرد عليه مباشرةً. للتواصل: <a href="mailto:finance@guestna-edu.com" style="color:rgba(255,255,255,0.65);text-decoration:underline;">finance@guestna-edu.com</a></p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
