export const bookingConfirmationHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>تأكيد حجز الرحلة - جستنا</title>
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

          <!-- ─── Success Banner ─── -->
          <tr>
            <td style="background-color:#e6f5f5;padding:28px 40px;text-align:center;border-bottom:1px solid #d0eaea;">
              <div style="display:inline-block;width:56px;height:56px;background-color:#008F8F;border-radius:50%;line-height:56px;text-align:center;margin-bottom:14px;">
                <span style="color:#ffffff;font-size:26px;font-weight:700;line-height:56px;display:block;">✓</span>
              </div>
              <h1 style="margin:0 0 6px;color:#008F8F;font-size:22px;font-weight:700;">تم تأكيد الحجز بنجاح</h1>
              <p style="margin:0;color:#555;font-size:14px;">رقم الحجز: <strong style="color:#008F8F;">#GN-2025-4521</strong></p>
            </td>
          </tr>

          <!-- ─── Greeting ─── -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0 0 6px;color:#1a1a1a;font-size:16px;font-weight:600;">السيد / رئيس قسم الأنشطة</p>
              <p style="margin:0;color:#444;font-size:14px;line-height:1.7;">مدرسة النور الدولية</p>
              <p style="margin:16px 0 0;color:#444;font-size:14px;line-height:1.8;">
                يسعدنا إبلاغكم بأنه تم تأكيد حجز رحلتكم المدرسية عبر منصة <strong style="color:#008F8F;">جستنا</strong>. نرجو مراجعة التفاصيل أدناه والتأكد من إحاطة المسؤولين والطلاب بها قبل موعد الرحلة.
              </p>
            </td>
          </tr>

          <!-- ─── Trip Info Box ─── -->
          <tr>
            <td style="padding:24px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8fbfb;border:1px solid #d0eaea;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="background-color:#008F8F;padding:14px 20px;">
                    <p style="margin:0;color:#ffffff;font-size:15px;font-weight:700;">تفاصيل الرحلة</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">

                      <tr style="border-bottom:1px solid #e8f0f0;">
                        <td style="padding:14px 20px;width:40%;vertical-align:top;">
                          <p style="margin:0;color:#888;font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">اسم الرحلة</p>
                        </td>
                        <td style="padding:14px 20px;vertical-align:top;">
                          <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">رحلة المزرعة التعليمية — الرياض</p>
                        </td>
                      </tr>

                      <tr style="border-bottom:1px solid #e8f0f0;">
                        <td style="padding:14px 20px;background-color:#fafcfc;">
                          <p style="margin:0;color:#888;font-size:12px;font-weight:500;">التاريخ</p>
                        </td>
                        <td style="padding:14px 20px;background-color:#fafcfc;">
                          <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">الثلاثاء، 20 مايو 2025</p>
                        </td>
                      </tr>

                      <tr style="border-bottom:1px solid #e8f0f0;">
                        <td style="padding:14px 20px;">
                          <p style="margin:0;color:#888;font-size:12px;font-weight:500;">وقت الانطلاق</p>
                        </td>
                        <td style="padding:14px 20px;">
                          <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">8:00 صباحاً ← 2:00 ظهراً</p>
                        </td>
                      </tr>

                      <tr style="border-bottom:1px solid #e8f0f0;">
                        <td style="padding:14px 20px;background-color:#fafcfc;">
                          <p style="margin:0;color:#888;font-size:12px;font-weight:500;">عدد الطلاب</p>
                        </td>
                        <td style="padding:14px 20px;background-color:#fafcfc;">
                          <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">45 طالب وطالبة</p>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:14px 20px;">
                          <p style="margin:0;color:#888;font-size:12px;font-weight:500;">المشرف المسؤول</p>
                        </td>
                        <td style="padding:14px 20px;">
                          <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">أ. سارة الأحمدي</p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── Meeting Point ─── -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#fff8f0;border:1.5px solid #ED8A22;border-radius:12px;padding:20px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px;color:#ED8A22;font-size:13px;font-weight:700;letter-spacing:0.3px;">📍 نقطة التجمع</p>
                    <p style="margin:0;color:#1a1a1a;font-size:15px;font-weight:600;line-height:1.6;">مدخل المدرسة الرئيسي — بوابة رقم 2</p>
                    <p style="margin:6px 0 0;color:#666;font-size:13px;">يُرجى التواجد قبل 15 دقيقة من موعد الانطلاق</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── Program Highlights ─── -->
          <tr>
            <td style="padding:0 40px 24px;">
              <p style="margin:0 0 14px;color:#1a1a1a;font-size:15px;font-weight:700;">أبرز فعاليات البرنامج</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">

                <tr>
                  <td style="padding:8px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="32" valign="top" style="padding-top:2px;">
                          <div style="width:24px;height:24px;background-color:#e6f5f5;border-radius:50%;text-align:center;line-height:24px;">
                            <span style="color:#008F8F;font-size:13px;">✓</span>
                          </div>
                        </td>
                        <td style="padding-right:8px;">
                          <p style="margin:0;color:#333;font-size:14px;line-height:1.6;">استكشاف بيئات الزراعة الحديثة وتقنيات الزراعة المائية</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="32" valign="top" style="padding-top:2px;">
                          <div style="width:24px;height:24px;background-color:#e6f5f5;border-radius:50%;text-align:center;line-height:24px;">
                            <span style="color:#008F8F;font-size:13px;">✓</span>
                          </div>
                        </td>
                        <td style="padding-right:8px;">
                          <p style="margin:0;color:#333;font-size:14px;line-height:1.6;">ورش عمل تفاعلية في علوم البيئة والاستدامة</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="32" valign="top" style="padding-top:2px;">
                          <div style="width:24px;height:24px;background-color:#e6f5f5;border-radius:50%;text-align:center;line-height:24px;">
                            <span style="color:#008F8F;font-size:13px;">✓</span>
                          </div>
                        </td>
                        <td style="padding-right:8px;">
                          <p style="margin:0;color:#333;font-size:14px;line-height:1.6;">وجبة غداء صحية متوازنة مشمولة في السعر</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="32" valign="top" style="padding-top:2px;">
                          <div style="width:24px;height:24px;background-color:#e6f5f5;border-radius:50%;text-align:center;line-height:24px;">
                            <span style="color:#008F8F;font-size:13px;">✓</span>
                          </div>
                        </td>
                        <td style="padding-right:8px;">
                          <p style="margin:0;color:#333;font-size:14px;line-height:1.6;">مشرفون متخصصون وإجراءات سلامة معتمدة</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- ─── CTA: Invoice ─── -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <a href="#" style="display:inline-block;background-color:#ED8A22;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 40px;border-radius:8px;letter-spacing:0.3px;">
                عرض الفاتورة وتفاصيل الدفع
              </a>
              <p style="margin:12px 0 0;color:#888;font-size:12px;">يمكنك أيضاً تتبع الرحلة من لوحة التحكم الخاصة بالمدرسة</p>
            </td>
          </tr>

          <!-- ─── Support ─── -->
          <tr>
            <td style="padding:24px 40px;background-color:#f8fbfb;border-top:1px solid #e0eded;">
              <p style="margin:0 0 10px;color:#1a1a1a;font-size:14px;font-weight:600;">هل تحتاج إلى مساعدة؟</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-left:24px;">
                    <p style="margin:0;color:#555;font-size:13px;line-height:1.7; direction: ltr;">
                      📞 &nbsp;<a href="tel:+966500000000" style="color:#008F8F;text-decoration:none;font-weight:500;">+966 50 000 0000</a>
                    </p>
                  </td>
                  <td style="padding-left:24px;">
                    <p style="margin:0;color:#555;font-size:13px;line-height:1.7; direction: ltr;">
                      ✉️ &nbsp;<a href="mailto:support@guestna-edu.com" style="color:#008F8F;text-decoration:none;font-weight:500;">support@guestna-edu.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── Footer ─── -->
          <tr>
            <td style="background-color:#006e6e;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;color:rgba(255,255,255,0.9);font-size:13px;font-weight:600;">منصة جستنا للرحلات التعليمية</p>
              <p style="margin:0;color:rgba(255,255,255,0.55);font-size:12px;">© 2025 Guestna. جميع الحقوق محفوظة.</p>
              <p style="margin:12px 0 0;color:rgba(255,255,255,0.45);font-size:11px;">تلقيت هذا البريد لأنك مسجل كمسؤول مدرسة على منصة جستنا. لإلغاء الاشتراك <a href="#" style="color:rgba(255,255,255,0.6);text-decoration:underline;">اضغط هنا</a></p>
            </td>
          </tr>

        </table>
        <!-- ─── / Email Card ─── -->

      </td>
    </tr>
  </table>

</body>
</html>`;
