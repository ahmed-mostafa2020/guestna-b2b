export const tripRequestHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>طلب رحلة مدرسية - جستنا</title>
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
            <td style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:36px 36px 32px;text-align:center;">
              <img
                src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                alt="GuestNa Logo"
                width="130"
                style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);border:0;"
              />
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;padding:5px 18px;font-size:11px;color:#ffffff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">
                إشعار داخلي — فريق جستنا
              </div>
              <div style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;line-height:1.3;">
                📋 طلب رحلة مدرسية جديد
              </div>
              <div style="font-size:14px;color:rgba(255,255,255,0.6);">
                تم استلام طلب رحلة مخصص - يُرجى المراجعة والمتابعة
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

              <!-- Request Reference -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#F0FDFA;border-right:4px solid #008F8F;border-radius:10px 0 0 10px;padding:16px 20px;text-align:right;">
                    <div style="font-size:12px;color:#008F8F;font-weight:700;margin-bottom:4px;">رقم الطلب</div>
                    <div style="font-size:20px;font-weight:700;color:#0A2540;">#REQ-2025-0211</div>
                    <div style="font-size:13px;color:#64748B;margin-top:4px;">تاريخ الطلب: السبت، 12 أبريل 2025</div>
                  </td>
                  <td style="padding:16px 20px;text-align:left;">
                    <span style="display:inline-block;background:#F59E0B;color:#fff;font-size:12px;font-weight:700;padding:6px 16px;border-radius:50px;">⏳ قيد المراجعة</span>
                  </td>
                </tr>
              </table>

              <!-- Alert -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#FFF8F0;border-right:4px solid #ED8A22;border-radius:10px 0 0 10px;padding:16px 20px;text-align:right;">
                    <div style="font-size:13px;color:#92400E;font-weight:600;line-height:1.6;">
                      تم تسجيل طلب رحلة مخصصة جديد. يُرجى المراجعة والتواصل مع المدرسة خلال <strong>يومي عمل</strong> لتأكيد التفاصيل وإرسال العرض.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- School Info Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:right;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">بيانات المدرسة الطالبة</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">اسم المدرسة</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">مدرسة الأفق العلمي — جدة</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">المسؤول عن الطلب</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">م. خالد العتيبي — منسق الأنشطة</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">البريد الإلكتروني</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#008F8F;font-weight:500;">k.alateebi@ufuq-school.edu.sa</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">رقم الجوال</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">+966 55 234 5678</div>
                  </td>
                </tr>
              </table>

              <!-- Trip Requirements -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:12px 20px;text-align:right;">
                    <span style="font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">متطلبات الرحلة المطلوبة</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px 6px;width:42%;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">نوع الرحلة</div>
                  </td>
                  <td style="padding:14px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#008F8F;font-weight:700;">رحلة علمية — مختبر الفضاء والتكنولوجيا</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">عدد الطلاب</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">60 طالب</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">الفئة العمرية / المرحلة</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">المرحلة المتوسطة (12–15 سنة)</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">التاريخ المقترح</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">الفترة: 1–15 يونيو 2025</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">المدة</div>
                  </td>
                  <td style="padding:10px 20px 6px;border-bottom:1px solid #F1F5F9;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">يوم كامل (6–8 ساعات)</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#94A3B8;font-weight:600;">الميزانية التقريبية</div>
                  </td>
                  <td style="padding:10px 20px 14px;text-align:right;">
                    <div style="font-size:15px;color:#1E293B;font-weight:600;">80–120 ر.س / طالب</div>
                  </td>
                </tr>
              </table>

              <!-- Special Requirements -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#EFF6FF;border-right:4px solid #3B82F6;border-radius:10px 0 0 10px;padding:16px 20px;text-align:right;">
                    <div style="font-size:12px;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px;">💬 متطلبات خاصة</div>
                    <div style="font-size:14px;color:#1E40AF;line-height:1.7;">
                      يُفضل أن يكون البرنامج مرتبطاً بمناهج العلوم للصف الأول متوسط. كما يُطلب توفير ورش عمل تفاعلية لا تتجاوز 20 طالباً في كل مجموعة، مع توفير وجبة خفيفة خلال الرحلة.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="text-align:right;padding-bottom:12px;">
                    <div style="font-size:14px;font-weight:700;color:#1E293B;">الخطوات التالية</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                      <td width="40" style="text-align:right;padding-left:12px;"><div style="width:28px;height:28px;background:#008F8F;border-radius:50%;text-align:center;line-height:28px;"><span style="color:#fff;font-size:13px;font-weight:700;">1</span></div></td>
                      <td style="text-align:right;">
                        <p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;">مراجعة متطلبات الرحلة</p>
                        <p style="margin:2px 0 0;color:#94A3B8;font-size:12px;">يقوم فريق جستنا بمراجعة الطلب واختيار أفضل الموردين المتاحين</p>
                      </td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                      <td width="40" style="text-align:right;padding-left:12px;"><div style="width:28px;height:28px;background:#ED8A22;border-radius:50%;text-align:center;line-height:28px;"><span style="color:#fff;font-size:13px;font-weight:700;">2</span></div></td>
                      <td style="text-align:right;">
                        <p style="margin:0;color:#1E293B;font-size:14px;font-weight:600;">إرسال العرض المخصص</p>
                        <p style="margin:2px 0 0;color:#94A3B8;font-size:12px;">ستصلكم مقترحات مع تفاصيل البرامج والأسعار خلال يومي عمل</p>
                      </td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr>
                      <td width="40" style="text-align:right;padding-left:12px;"><div style="width:28px;height:28px;background:#CBD5E1;border-radius:50%;text-align:center;line-height:28px;"><span style="color:#64748B;font-size:13px;font-weight:700;">3</span></div></td>
                      <td style="text-align:right;">
                        <p style="margin:0;color:#64748B;font-size:14px;font-weight:600;">تأكيد الحجز ومعالجة الدفع</p>
                        <p style="margin:2px 0 0;color:#94A3B8;font-size:12px;">بعد موافقتكم يتم الحجز الرسمي وإصدار الفاتورة</p>
                      </td>
                    </tr></table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-top:8px;">
                    <a href="#"
                       target="_blank"
                       style="display:inline-block;background:linear-gradient(135deg,#008F8F,#006e6e);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 44px;border-radius:10px;box-shadow:0 4px 20px rgba(0,143,143,0.3);letter-spacing:0.3px;">
                      متابعة الطلب من لوحة التحكم ←
                    </a>
                    <p style="margin:12px 0 0;color:#94A3B8;font-size:12px;text-align:center;">سيتم التواصل مع المدرسة مباشرةً عبر البريد أو الجوال</p>
                  </td>
                </tr>
              </table>

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
