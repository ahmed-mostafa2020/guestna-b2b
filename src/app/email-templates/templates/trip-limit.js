// Ref: email-temp/admin/askTripLimit.ts
export const tripLimitHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>طلب زيادة حد الرحلات - GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap");
    body { font-family: "IBM Plex Sans Arabic", Arial, sans-serif !important; direction: rtl; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 28px 20px 24px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .mobile-emoji { font-size: 32px !important; }
      .mobile-stat { font-size: 28px !important; }
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
<body style="margin:0;padding:0;background-color:#EEF2F7;color:#1E293B;font-family:'IBM Plex Sans Arabic',Arial,sans-serif;direction:rtl;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EEF2F7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="main-table" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;margin:0 auto;box-shadow:0 8px 40px rgba(10,37,64,0.12);">

          <!-- Header -->
          <tr>
            <td class="header-pad" style="background:linear-gradient(150deg,#0A2540 0%,#0B6B85 60%,#0B9A9A 100%);padding:36px 36px 32px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" alt="GuestNa Logo" width="130" style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;" />
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:5px 18px;font-size:11px;color:#fff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">Admin Alert</div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">⚠️ طلب زيادة حد الرحلات</div>
              <div style="font-size:14px;color:rgba(255,255,255,0.6);">تم الوصول للحد الأقصى للرحلات</div>
            </td>
          </tr>

          <!-- Orange Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#F59E0B,#D97706,#F59E0B);"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-pad" style="padding:32px 36px;">

              <!-- Alert Badge -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#FFF8F0;border:2px solid #F59E0B;border-radius:12px;padding:20px;text-align:center;">
                    <div class="mobile-emoji" style="font-size:36px;margin-bottom:10px;">🚨</div>
                    <div style="background:#F59E0B;color:#fff;display:inline-block;padding:6px 20px;border-radius:20px;font-size:13px;font-weight:700;margin-bottom:10px;letter-spacing:0.5px;">تم الوصول للحد الأقصى للرحلات</div>
                    <p style="color:#92400E;font-weight:600;margin:8px 0 0;font-size:14px;line-height:1.6;">
                      حاول أحد أعضاء الفريق طلب رحلة جديدة ولكنه وصل إلى الحد الأقصى
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 24px;text-align:right;">
                عزيزي مدير المدرسة، وصل أحد أعضاء فريقك إلى الحد الأقصى للرحلات ويحتاج إلى موافقة لطلب رحلات إضافية. يرجى مراجعة التفاصيل أدناه وتقرير رفع الحصة.
              </p>

              <!-- Trip Status Visual -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td align="center" style="padding:20px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;">
                    <div style="font-size:13px;font-weight:700;color:#92400E;margin-bottom:10px;">📊 حالة الرحلات الحالية</div>
                    <div style="font-size:13px;color:#78350F;margin-bottom:12px;">الرحلات المستخدمة / الحد الأقصى المسموح</div>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
                      <tr>
                        <td align="center" style="padding:6px 20px;">
                          <div class="mobile-stat" style="font-size:36px;font-weight:700;color:#EF4444;">5</div>
                          <div style="font-size:11px;color:#64748B;font-weight:600;text-transform:uppercase;">مستخدم</div>
                        </td>
                        <td align="center" style="padding:6px 10px;">
                          <div style="font-size:24px;color:#CBD5E1;">/</div>
                        </td>
                        <td align="center" style="padding:6px 20px;">
                          <div class="mobile-stat" style="font-size:36px;font-weight:700;color:#F59E0B;">5</div>
                          <div style="font-size:11px;color:#64748B;font-weight:600;text-transform:uppercase;">الحد الأقصى</div>
                        </td>
                      </tr>
                    </table>
                    <!-- Progress Bar -->
                    <div style="background:#FDE68A;border-radius:50px;height:10px;width:220px;margin:14px auto 0;overflow:hidden;">
                      <div style="background:#EF4444;height:10px;width:100%;border-radius:50px;"></div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Client Info Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="width:42%;background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:right;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">بيانات العميل</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">👤 اسم العميل</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">م. خالد العتيبي</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">📧 البريد الإلكتروني</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#008F8F;font-weight:500;">k.alateebi@ufuq-school.edu.sa</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">🏫 المؤسسة</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">مدرسة الأفق العلمي</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">📈 الحد الحالي</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#F59E0B;font-weight:700;">5 رحلات</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">🎒 الرحلات المستخدمة</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:15px;color:#EF4444;font-weight:700;">5 رحلات (مكتمل)</div>
                  </td>
                </tr>
              </table>

              <!-- What This Means -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#EFF6FF;border-right:4px solid #3B82F6;border-radius:10px 0 0 10px;padding:16px 20px;text-align:right;">
                    <div style="font-size:12px;font-weight:700;color:#3B82F6;margin-bottom:8px;">💡 ماذا يعني هذا:</div>
                    <div style="font-size:14px;color:#1E40AF;line-height:1.8;">
                      • م. خالد العتيبي استخدم جميع الـ 5 فرص الرحلات المتاحة<br/>
                      • يحتاج إلى المزيد من الرحلات لمواصلة حجز التجارب التعليمية<br/>
                      • يمكنك زيادة الحد الخاص به للسماح بطلبات رحلات إضافية<br/>
                      • سيسري هذا التغيير فورًا بعد الموافقة
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Required -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#FFF8F0;border-right:4px solid #ED8A22;border-radius:10px 0 0 10px;padding:16px 20px;text-align:right;">
                    <div style="font-size:12px;font-weight:700;color:#ED8A22;margin-bottom:6px;">⚡ مطلوب إجراء</div>
                    <div style="font-size:14px;color:#92400E;line-height:1.7;">
                      يرجى النقر على الزر أدناه لمراجعة وزيادة حد الرحلات لـ <strong>م. خالد العتيبي</strong>. بمجرد الموافقة، سيتمكن من طلب رحلات إضافية على الفور.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a class="mobile-btn" href="#" style="display:inline-block;background:linear-gradient(135deg,#F59E0B,#D97706);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 44px;border-radius:10px;box-shadow:0 4px 20px rgba(245,158,11,0.4);">
                      📈 زيادة حد الرحلات ←
                    </a>
                    <p style="margin:10px 0 0;font-size:12px;color:#94A3B8;text-align:center;">ستساعد زيادة الحد هذه فريقك على تنظيم المزيد من التجارب التعليمية.</p>
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
