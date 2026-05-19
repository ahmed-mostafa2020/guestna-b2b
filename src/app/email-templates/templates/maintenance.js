// Ref: accounts/maintenance Templet — إشعار صيانة النظام
export const maintenanceHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>إشعار صيانة مجدولة - جستنا</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap");
    body { font-family: "IBM Plex Sans Arabic", Arial, Tahoma, sans-serif !important; direction: rtl; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 30px 20px 26px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .mobile-emoji { font-size: 36px !important; }
      .mobile-cell-label { padding: 12px 16px !important; }
      .mobile-cell-value { padding: 12px 16px !important; }
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

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="main-table"
               style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td class="header-pad" style="background:linear-gradient(150deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:40px 36px 36px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa Logo" width="120"
                   style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;" />
              <div class="mobile-emoji" style="font-size:44px;margin-bottom:12px;">🔧</div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">صيانة مجدولة للنظام</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.75);">إشعار بتوقف مؤقت مخطط له مسبقاً</div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#F59E0B,#ED8A22,#F59E0B);"></td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background:#FFFBEB;border-bottom:1px solid #FDE68A;padding:16px 36px;text-align:center;">
              <p style="margin:0;font-size:14px;font-weight:700;color:#92400E;">
                ⚠️ سيكون النظام غير متاح خلال فترة الصيانة المجدولة
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="content-pad" style="padding:32px 36px 24px;text-align:center;">
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.8;">
                نُعلمكم بأن فريق جستنا التقني سيقوم بإجراء أعمال صيانة مجدولة للنظام بهدف تحسين الأداء وتحديث البنية التقنية للمنصة.
                نعتذر عن أي إزعاج قد يسببه ذلك.
              </p>
            </td>
          </tr>

          <!-- Maintenance Window -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="width:45%;background:#0f3460;padding:14px 20px;text-align:center;">
                    <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;">🗓️ نافذة الصيانة</p>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-cell-label" style="padding:16px 20px;width:45%;border-bottom:1px solid #F1F5F9;background:#F8FAFC;">
                    <p style="margin:0;font-size:12px;color:#94A3B8;font-weight:600;text-transform:uppercase;">التاريخ</p>
                  </td>
                  <td class="mobile-cell-value" style="padding:16px 20px;border-bottom:1px solid #F1F5F9;">
                    <p style="margin:0;font-size:15px;color:#1E293B;font-weight:700;">الثلاثاء، ١٧ مارس ٢٠٢٦</p>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-cell-label" style="padding:16px 20px;width:45%;border-bottom:1px solid #F1F5F9;background:#F8FAFC;">
                    <p style="margin:0;font-size:12px;color:#94A3B8;font-weight:600;text-transform:uppercase;">الوقت</p>
                  </td>
                  <td class="mobile-cell-value" style="padding:16px 20px;border-bottom:1px solid #F1F5F9;">
                    <p style="margin:0;font-size:15px;color:#1E293B;font-weight:700;">١١:٠٠ م — ١:٠٠ ص (بتوقيت الرياض)</p>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-cell-label" style="padding:16px 20px;width:45%;background:#F8FAFC;">
                    <p style="margin:0;font-size:12px;color:#94A3B8;font-weight:600;text-transform:uppercase;">المدة المتوقعة</p>
                  </td>
                  <td class="mobile-cell-value" style="padding:16px 20px;">
                    <span style="display:inline-block;background:#FEF3C7;color:#92400E;font-size:13px;font-weight:700;padding:4px 14px;border-radius:50px;">ساعتان تقريباً</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What to Expect -->
          <tr>
            <td class="content-pad" style="padding:0 36px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F0FDFA;border:1px solid #D0EAEA;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="background:#008F8F;padding:12px 20px;">
                    <p style="margin:0;color:#ffffff;font-size:13px;font-weight:700;">📋 ما الذي يحدث خلال الصيانة؟</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr><td style="padding:6px 0;font-size:14px;color:#334155;">⚙️ &nbsp; تحديث البنية التحتية لخوادم المنصة</td></tr>
                      <tr><td style="padding:6px 0;font-size:14px;color:#334155;">🔒 &nbsp; تعزيز إجراءات الأمان والحماية</td></tr>
                      <tr><td style="padding:6px 0;font-size:14px;color:#334155;">⚡ &nbsp; تحسين سرعة وأداء المنصة</td></tr>
                      <tr><td style="padding:6px 0;font-size:14px;color:#334155;">🐛 &nbsp; إصلاح الأخطاء التقنية المعروفة</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Recommendations -->
          <tr>
            <td class="content-pad" style="padding:0 36px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1D4ED8;">💡 توصياتنا قبل فترة الصيانة</p>
                    <p style="margin:0;font-size:13px;color:#1E40AF;line-height:1.8;">
                      • أتمّ أي معاملات أو طلبات عاجلة قبل بدء الصيانة<br/>
                      • احفظ أي بيانات مهمة محلياً على جهازك<br/>
                      • سيعود النظام للعمل الكامل فور انتهاء الصيانة
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td align="center" style="padding:0 36px 32px;">
              <p style="margin:0;font-size:13px;color:#64748B;line-height:1.7;">
                للاستفسارات العاجلة خلال فترة الصيانة، تواصل معنا عبر:
                <a href="mailto:info@guestna.app" style="color:#008F8F;font-weight:600;text-decoration:none;">info@guestna.app</a>
              </p>
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
                <a href="tel:+966547534666" dir="ltr" style="color:rgba(255,255,255,0.45);text-decoration:none;;display:inline-block;">&#8206;+966547534666&#8206;</a>
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
