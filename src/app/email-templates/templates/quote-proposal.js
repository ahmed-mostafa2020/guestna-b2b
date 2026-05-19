export const quoteProposalHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>عرض السعر - جستنا</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap");
    body { font-family: "IBM Plex Sans Arabic", Arial, Tahoma, sans-serif !important; direction: rtl; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 24px 18px !important; }
      .header-pad { padding: 28px 20px 24px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .mobile-h1 { font-size: 20px !important; line-height:1.3 !important; }
      .ref-stack { display: block !important; width: 100% !important; padding: 14px 18px !important; text-align: right !important; }
      .col-stack { display: block !important; width: 100% !important; padding: 0 0 10px !important; }
      .cta-stack { display: block !important; padding: 6px 0 !important; }
      .mobile-btn { display:inline-block !important; padding: 13px 24px !important; font-size: 14px !important; margin: 0 !important; }
      .mobile-grand { font-size: 22px !important; }
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
                عرض سعر رسمي — صالح 7 أيام
              </div>
              <div class="mobile-h1" style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">
                📑 عرض برنامج رحلة علمية مخصص
              </div>
              <div style="font-size:14px;color:rgba(255,255,255,0.6);">
                استناداً لطلبكم — جاهز للمراجعة والاعتماد
              </div>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-pad" style="padding:32px 36px;">

              <!-- Quote Reference -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td class="ref-stack" style="background:#F0FDFA;border-right:4px solid #008F8F;border-radius:10px 0 0 10px;padding:16px 20px;text-align:right;">
                    <div style="font-size:12px;font-weight:700;color:#008F8F;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.6px;">رقم العرض</div>
                    <div style="font-size:20px;font-weight:700;color:#0A2540;">#QT-2025-0156</div>
                    <div style="font-size:13px;color:#64748B;margin-top:4px;">صادر: 12 أبريل 2025 — <strong>صالح حتى: 20 أبريل 2025</strong></div>
                  </td>
                  <td class="ref-stack" style="padding:16px 20px;text-align:left;">
                    <span style="display:inline-block;background:#008F8F;color:#fff;font-size:12px;font-weight:700;padding:6px 16px;border-radius:50px;">⏳ ينتهي خلال 7 أيام</span>
                  </td>
                </tr>
              </table>

              <!-- Addressed To -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#F8FAFC;border-right:4px solid #ED8A22;border-radius:10px 0 0 10px;padding:16px 20px;text-align:right;">
                    <div style="font-size:12px;font-weight:700;color:#ED8A22;margin-bottom:4px;">مقدَّم إلى</div>
                    <div style="font-size:15px;font-weight:700;color:#1E293B;">م. خالد العتيبي — مدرسة الأفق العلمي</div>
                    <div style="font-size:13px;color:#64748B;margin-top:4px;line-height:1.6;">
                      استناداً لطلبكم <strong style="color:#1E293B;">#REQ-2025-0211</strong>، يسعدنا تقديم هذا العرض المخصص لبرنامج رحلتكم العلمية.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Program Details -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="width:42%;background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:right;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">تفاصيل البرنامج المقترح</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">اسم البرنامج</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#008F8F;font-weight:700;">مختبر الفضاء والتكنولوجيا — قاعدة كيان</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">المكان</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">جدة — حي الشاطئ</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">الفئة المستهدفة</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">المرحلة المتوسطة (12–15 سنة)</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">المدة</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">7 ساعات (9:00 ص – 4:00 م)</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">التواريخ المتاحة</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">5، 10، 15 يونيو 2025</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:42%;padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">الطاقة الاستيعابية</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">60 طالب (مجموعات من 20)</div>
                  </td>
                </tr>
              </table>

              <!-- Included / Not Included -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td class="col-stack" style="width:50%;padding-left:8px;vertical-align:top;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F0FDFA;border:1.5px solid #D0EAEA;border-radius:12px;">
                      <tr><td style="padding:14px 16px;border-bottom:1px solid #D0EAEA;text-align:right;">
                        <p style="margin:0;color:#008F8F;font-size:13px;font-weight:700;">✓ يشمل البرنامج</p>
                      </td></tr>
                      <tr><td style="padding:14px 16px;text-align:right;">
                        <p style="margin:0 0 8px;color:#334155;font-size:13px;">• جلسات تفاعلية في الفضاء والروبوتات</p>
                        <p style="margin:0 0 8px;color:#334155;font-size:13px;">• مشرف متخصص لكل مجموعة</p>
                        <p style="margin:0 0 8px;color:#334155;font-size:13px;">• وجبة غداء + مشروبات</p>
                        <p style="margin:0 0 8px;color:#334155;font-size:13px;">• شهادات مشاركة للطلاب</p>
                        <p style="margin:0;color:#334155;font-size:13px;">• تأمين ضد الحوادث</p>
                      </td></tr>
                    </table>
                  </td>
                  <td class="col-stack" style="width:50%;padding-right:8px;vertical-align:top;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;">
                      <tr><td style="padding:14px 16px;border-bottom:1px solid #E2E8F0;text-align:right;">
                        <p style="margin:0;color:#94A3B8;font-size:13px;font-weight:700;">✗ غير مشمول</p>
                      </td></tr>
                      <tr><td style="padding:14px 16px;text-align:right;">
                        <p style="margin:0 0 8px;color:#94A3B8;font-size:13px;">• التنقل من المدرسة وإليها</p>
                        <p style="margin:0 0 8px;color:#94A3B8;font-size:13px;">• مصاريف شخصية إضافية</p>
                        <p style="margin:0;color:#94A3B8;font-size:13px;">• تصوير احترافي (متاح بتكلفة إضافية)</p>
                      </td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Pricing -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:2px solid #008F8F;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="background:#008F8F;padding:14px 20px;text-align:center;">
                    <p style="margin:0;color:#ffffff;font-size:14px;font-weight:700;">تفاصيل التسعيرة</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;text-align:right;"><p style="margin:0;color:#475569;font-size:13px;">سعر الطالب الواحد</p></td>
                  <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;text-align:left;"><p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;">110.00 ر.س</p></td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;background:#F8FAFC;text-align:right;"><p style="margin:0;color:#475569;font-size:13px;">عدد الطلاب</p></td>
                  <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;background:#F8FAFC;text-align:left;"><p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;">60 طالب</p></td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;text-align:right;"><p style="margin:0;color:#475569;font-size:13px;">الإجمالي قبل الضريبة</p></td>
                  <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;text-align:left;"><p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;">6,600.00 ر.س</p></td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;background:#F8FAFC;text-align:right;"><p style="margin:0;color:#475569;font-size:13px;">ضريبة القيمة المضافة (15%)</p></td>
                  <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;background:#F8FAFC;text-align:left;"><p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;">990.00 ر.س</p></td>
                </tr>
                <tr style="background:#F0FDFA;">
                  <td style="padding:18px 20px;text-align:right;">
                    <p style="margin:0;color:#008F8F;font-size:15px;font-weight:700;">الإجمالي الكلي</p>
                    <p style="margin:4px 0 0;color:#94A3B8;font-size:12px;">صالح لـ 60 طالب — يشمل جميع الخدمات</p>
                  </td>
                  <td style="padding:18px 20px;text-align:left;">
                    <p class="mobile-grand" style="margin:0;color:#008F8F;font-size:24px;font-weight:700;">7,590.00 ر.س</p>
                  </td>
                </tr>
              </table>

              <!-- Validity Warning -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#FFF8F0;border-right:4px solid #ED8A22;border-radius:10px 0 0 10px;padding:16px 20px;text-align:right;">
                    <div style="font-size:13px;font-weight:700;color:#ED8A22;margin-bottom:6px;">⚠️ هذا العرض صالح حتى: الأحد، 20 أبريل 2025</div>
                    <div style="font-size:13px;color:#64748B;line-height:1.6;">المقاعد محدودة. للحجز يُرجى الموافقة على العرض قبل انتهاء المدة لضمان التواريخ المطلوبة.</div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <span class="cta-stack" style="display:inline-block;">
                      <a class="mobile-btn" href="https://guestna-b2b.vercel.app/ar/profile/bookings-management/orders" style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 40px;border-radius:10px;box-shadow:0 4px 20px rgba(0,143,143,0.3);margin-left:10px;">
                        ✓ قبول العرض وتأكيد الحجز أو طلب تعديل
                      </a>
                    </span>
                 
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
