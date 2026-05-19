export const walletWithdrawalHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>طلب سحب رصيد المحفظة - جستنا</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap");
    body { font-family: "IBM Plex Sans Arabic", Arial, Tahoma, sans-serif !important; direction: rtl; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 28px 20px 24px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .mobile-amount { font-size: 24px !important; padding: 16px 24px !important; }
      .mobile-btn { padding: 14px 28px !important; font-size: 14px !important; }
      td[style*="width:42%"], td[style*="width:38%"], td[style*="width:45%"], td[style*="width:55%"] {
        display: block !important; width: 100% !important;
        padding: 10px 18px 2px !important; text-align: right !important;
      }
      td[style*="width:42%"] + td, td[style*="width:38%"] + td, td[style*="width:45%"] + td, td[style*="width:55%"] + td {
        display: block !important; width: 100% !important;
        padding: 0 18px 12px !important; text-align: right !important;
      }
      a[href^="mailto"], a[href^="tel"] { word-break: break-all !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EEF2F7;color:#1E293B;font-family:'IBM Plex Sans Arabic',Arial,Tahoma,sans-serif;direction:rtl;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EEF2F7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="main-table" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td class="header-pad" style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:36px 36px 32px;text-align:center;">
              <img
                src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                alt="GuestNa Logo"
                width="130"
                style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;"
              />
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:5px 18px;font-size:11px;color:#ffffff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">
                Finance
              </div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">
                💰 طلب سحب رصيد المحفظة
              </div>
              <div style="font-size:14px;color:rgba(255,255,255,0.6);">
                طلب سحب جديد في انتظار المراجعة
              </div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#ED8A22,#F59E0B,#ED8A22);"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-pad" style="padding:32px 36px;">

              <!-- Alert Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#FFF8F0;border-right:4px solid #ED8A22;border-radius:10px 0 0 10px;padding:16px 20px;text-align:right;">
                    <div style="font-size:13px;color:#92400E;font-weight:600;line-height:1.6;">
                      تم استلام طلب سحب رصيد جديد من خلال لوحة التحكم. يُرجى مراجعة التفاصيل أدناه والمعالجة وفق سياسة السحب المعتمدة.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Amount Display -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <div class="mobile-amount" style="display:inline-block;background:linear-gradient(135deg,#ED8A2215,#ED8A2208);border:2px solid #ED8A2230;border-radius:14px;padding:20px 40px;text-align:center;">
                      <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#ED8A22;font-weight:700;margin-bottom:6px;">المبلغ المطلوب سحبه</div>
                      <div style="font-size:30px;font-weight:700;color:#ED8A22;">8,200.00 ر.س</div>
                      <div style="margin-top:8px;">
                        <span style="display:inline-block;background:#F59E0B;color:#fff;font-size:12px;font-weight:700;padding:4px 14px;border-radius:50px;">⏳ بانتظار المراجعة</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- School Info Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="width:42%;background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:right;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">بيانات المدرسة</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">اسم المدرسة</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">مدرسة النور الدولية</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">رقم الطلب</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">#WD-2025-0893</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">مرجع الرحلة</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">#GN-2025-4521 — رحلة المزرعة التعليمية</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">طريقة السحب</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">🏦 تحويل بنكي — بنك الراجحي</div>
                  </td>
                </tr>
              </table>

              <!-- Financial Summary -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="width:55%;background:#0A2540;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:right;">
                    <span style="font-size:12px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.8px;">ملخص المعاملة المالية</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;width:55%;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:13px;color:#64748B;">الرصيد قبل السحب</div>
                  </td>
                  <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">12,500.00 ر.س</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:55%;padding:14px 20px;border-bottom:1px solid #F1F5F9;background:#FFF8F0;text-align:right;">
                    <div style="font-size:13px;color:#ED8A22;font-weight:600;">المبلغ المطلوب سحبه</div>
                  </td>
                  <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;background:#FFF8F0;text-align:right;">
                    <div style="font-size:18px;color:#ED8A22;font-weight:700;">8,200.00 ر.س</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:55%;padding:14px 20px;background:#F0FDFA;text-align:right;">
                    <div style="font-size:13px;color:#008F8F;font-weight:700;">الرصيد المتبقي بعد السحب</div>
                  </td>
                  <td style="padding:14px 20px;background:#F0FDFA;text-align:right;">
                    <div style="font-size:18px;color:#008F8F;font-weight:700;">4,300.00 ر.س</div>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#FFFBEB;border-right:4px solid #F59E0B;border-radius:10px 0 0 10px;padding:16px 20px;text-align:right;">
                    <div style="font-size:13px;color:#92400E;font-weight:600;line-height:1.6;">
                      يُرجى التحقق من جميع تفاصيل الدفع قبل المعالجة. تواصل مع المدرسة إذا كانت أي معلومات غير صحيحة أو ناقصة.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-top:8px;">
                    <a class="mobile-btn" href="https://guestna-revamp-dashboard.vercel.app/b2b/withDrawals"
                       target="_blank"
                       style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 44px;border-radius:10px;box-shadow:0 4px 20px rgba(0,143,143,0.3);letter-spacing:0.3px;">
                      معالجة طلب السحب ←
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-pad" style="background:#0A2540;padding:28px 36px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa" width="90"
                   style="display:block;margin:0 auto 14px;filter:brightness(0) invert(1);opacity:0.85;border:0;" />
              <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.7);font-weight:600;">
</p>
              <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.45);">
                <a href="mailto:info@guestna.app" style="color:rgba(255,255,255,0.45);text-decoration:none;">info@guestna.app</a>
                <span style="color:rgba(255,255,255,0.2);margin:0 8px;">|</span>
                <a href="tel:+966552345678" dir="ltr" style="color:rgba(255,255,255,0.45);text-decoration:none;;display:inline-block;">&#8206;+966547534666&#8206;</a>
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:rgba(255,255,255,0.3);">© 2025 GuestNa. جميع الحقوق محفوظة.</p>
          
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
