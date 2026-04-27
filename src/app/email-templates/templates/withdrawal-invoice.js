// Ref: withdrawal/ask Withdrawals Invoice Confirming_ar — فاتورة/إيصال السحب (تصميم إيصال)
export const withdrawalInvoiceHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>إيصال سحب الأرباح - جستنا</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap");
    body { font-family: "Tajawal", Arial, Tahoma, sans-serif !important; direction: rtl; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-pad { padding: 16px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#D1D9E0;color:#1E293B;font-family:'Tajawal',Arial,Tahoma,sans-serif;direction:rtl;width:100%;min-width:100%;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#D1D9E0;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Receipt Paper -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" class="main-table"
               style="max-width:560px;background-color:#FAFAFA;margin:0 auto;
                      box-shadow:0 4px 6px rgba(0,0,0,0.07),0 10px 40px rgba(0,0,0,0.12);
                      border-radius:4px 4px 0 0;">

          <!-- Header Strip -->
          <tr>
            <td style="background:linear-gradient(150deg,#0A2540 0%,#006e6e 60%,#008F8F 100%);padding:28px 32px;text-align:center;border-radius:4px 4px 0 0;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa Logo" width="100"
                   style="display:block;margin:0 auto 10px;filter:brightness(0) invert(1);border:0;" />
              <p style="margin:0;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:2px;text-transform:uppercase;">منصة الرحلات التعليمية</p>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#008F8F,#ED8A22,#008F8F);"></td>
          </tr>

          <!-- Receipt Title & Number -->
          <tr>
            <td style="padding:20px 32px 16px;background:#ffffff;border-bottom:1px dashed #CBD5E1;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align:right;">
                    <div style="font-size:22px;font-weight:900;color:#0A2540;letter-spacing:1px;">إيصال سحب الأرباح</div>
                    <div style="font-size:12px;color:#94A3B8;margin-top:2px;">WITHDRAWAL RECEIPT</div>
                  </td>
                  <td style="text-align:left;">
                    <div style="background:#0A2540;color:#ffffff;font-size:14px;font-weight:700;padding:8px 16px;border-radius:8px;display:inline-block;font-family:monospace;">#WD-2025-0893</div>
                    <div style="font-size:11px;color:#94A3B8;margin-top:4px;text-align:center;">
                      ١٥ مايو ٢٠٢٥<br/>
                      <span style="color:#008F8F;font-weight:600;">✓ محوّل</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Beneficiary Info -->
          <tr>
            <td class="content-pad" style="padding:16px 32px;background:#ffffff;border-bottom:1px dashed #CBD5E1;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="width:50%;vertical-align:top;padding-left:12px;border-left:2px solid #E2E8F0;">
                    <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#008F8F;text-transform:uppercase;letter-spacing:1px;">الجهة المستفيدة</p>
                    <p style="margin:0;font-size:14px;font-weight:700;color:#1E293B;">مدرسة النور الدولية</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#64748B;line-height:1.7;">
                      <a href="https://maps.google.com/?q=جدة،+المملكة+العربية+السعودية" style="color:#64748B;text-decoration:none;">📍 جدة، المملكة العربية السعودية</a><br/>
                      رمز المؤسسة: SCH-00142<br/>
                      <a href="mailto:billing@alnour.edu.sa" style="color:#008F8F;text-decoration:none;">billing@alnour.edu.sa</a>
                    </p>
                  </td>
                  <td style="width:50%;vertical-align:top;">
                    <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#008F8F;text-transform:uppercase;letter-spacing:1px;">تفاصيل الرحلة</p>
                    <p style="margin:0;font-size:13px;font-weight:600;color:#1E293B;">رحلة المزرعة التعليمية</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#64748B;line-height:1.7;">
                      رمز الرحلة: TRP-9843<br/>
                      النظام التعليمي: عام — بنين<br/>
                      المرحلة: المتوسطة
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Header -->
          <tr>
            <td style="background:#F1F5F9;padding:10px 32px;border-bottom:1px solid #E2E8F0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align:right;"><p style="margin:0;font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;">الصف / البرنامج</p></td>
                  <td style="width:60px;text-align:center;"><p style="margin:0;font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;">الطلاب</p></td>
                  <td style="width:80px;text-align:center;"><p style="margin:0;font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;">ربح / طالب</p></td>
                  <td style="width:90px;text-align:left;"><p style="margin:0;font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;">الإجمالي</p></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Item 1 -->
          <tr>
            <td style="background:#ffffff;padding:14px 32px;border-bottom:1px dashed #E2E8F0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="vertical-align:top;text-align:right;">
                    <p style="margin:0;font-size:13px;font-weight:600;color:#1E293B;">رحلة المزرعة — الصف الأول المتوسط</p>
                  </td>
                  <td style="width:60px;text-align:center;vertical-align:top;"><p style="margin:0;font-size:13px;color:#475569;">20</p></td>
                  <td style="width:80px;text-align:center;vertical-align:top;"><p style="margin:0;font-size:13px;color:#475569;font-family:monospace;">30.00</p></td>
                  <td style="width:90px;text-align:left;vertical-align:top;"><p style="margin:0;font-size:13px;font-weight:600;color:#1E293B;font-family:monospace;">600.00</p></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Item 2 -->
          <tr>
            <td style="background:#F8FAFC;padding:14px 32px;border-bottom:1px dashed #E2E8F0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="vertical-align:top;text-align:right;">
                    <p style="margin:0;font-size:13px;font-weight:600;color:#1E293B;">رحلة المزرعة — الصف الثاني المتوسط</p>
                  </td>
                  <td style="width:60px;text-align:center;vertical-align:top;"><p style="margin:0;font-size:13px;color:#475569;">20</p></td>
                  <td style="width:80px;text-align:center;vertical-align:top;"><p style="margin:0;font-size:13px;color:#475569;font-family:monospace;">30.00</p></td>
                  <td style="width:90px;text-align:left;vertical-align:top;"><p style="margin:0;font-size:13px;font-weight:600;color:#1E293B;font-family:monospace;">600.00</p></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Grand Total -->
          <tr>
            <td style="background:#0A2540;padding:18px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#ffffff;">إجمالي مبلغ السحب</p>
                    <p style="margin:2px 0 0;font-size:11px;color:rgba(255,255,255,0.5);">المبلغ المحوّل للحساب البنكي</p>
                  </td>
                  <td style="text-align:left;">
                    <p style="margin:0;font-size:24px;font-weight:900;color:#ffffff;font-family:monospace;">1,200.00</p>
                    <p style="margin:2px 0 0;font-size:12px;color:rgba(255,255,255,0.6);text-align:center;">ر.س</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Transfer Details -->
          <tr>
            <td style="background:#ffffff;padding:16px 32px;border-top:4px solid #ED8A22;border-bottom:1px dashed #CBD5E1;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#ED8A22;text-transform:uppercase;letter-spacing:1px;">تفاصيل التحويل</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding:4px 0;width:33%;">
                    <p style="margin:0;font-size:10px;color:#94A3B8;font-weight:600;">طريقة التحويل</p>
                    <p style="margin:2px 0 0;font-size:13px;color:#1E293B;font-weight:600;">تحويل بنكي</p>
                  </td>
                  <td style="padding:4px 0;width:33%;text-align:center;">
                    <p style="margin:0;font-size:10px;color:#94A3B8;font-weight:600;">تاريخ التحويل</p>
                    <p style="margin:2px 0 0;font-size:13px;color:#1E293B;font-weight:600;">١٥ مايو ٢٠٢٥</p>
                  </td>
                  <td style="padding:4px 0;width:33%;text-align:left;">
                    <p style="margin:0;font-size:10px;color:#94A3B8;font-weight:600;">رقم المرجع</p>
                    <p style="margin:2px 0 0;font-size:12px;color:#1E293B;font-weight:600;font-family:monospace;">TRF-7842-WD</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Barcode Visual -->
          <tr>
            <td style="background:#F8FAFC;padding:16px 32px;border-bottom:1px dashed #CBD5E1;text-align:center;">
              <div style="display:inline-block;margin-bottom:6px;">
                <div style="font-size:9px;color:#94A3B8;letter-spacing:4px;margin-bottom:4px;font-family:monospace;">WD2025089300142SCH</div>
                <div style="height:36px;background:repeating-linear-gradient(90deg,#1E293B 0,#1E293B 2px,transparent 2px,transparent 4px,#1E293B 4px,#1E293B 5px,transparent 5px,transparent 8px,#1E293B 8px,#1E293B 11px,transparent 11px,transparent 13px,#1E293B 13px,#1E293B 14px,transparent 14px,transparent 17px,#1E293B 17px,#1E293B 19px,transparent 19px,transparent 22px);width:200px;opacity:0.8;"></div>
              </div>
              <p style="margin:6px 0 0;font-size:11px;color:#94A3B8;">
                <a href="https://guestna.app/withdrawal/WD-2025-0893" style="color:#008F8F;text-decoration:none;font-weight:600;">🔗 عرض الإيصال الإلكتروني</a>
              </p>
            </td>
          </tr>

          <!-- Legal Note -->
          <tr>
            <td style="background:#F8FAFC;padding:14px 32px;text-align:center;border-bottom:1px dashed #CBD5E1;">
              <p style="margin:0;font-size:11px;color:#94A3B8;line-height:1.6;">
                هذا الإيصال بمثابة مستند إثبات إلكتروني لعملية سحب أرباح المدرسة المعتمدة.<br/>
                لأي استفسار، تواصل مع
                <a href="mailto:finance@guestna.app" style="color:#008F8F;text-decoration:none;">finance@guestna.app</a>
              </p>
            </td>
          </tr>

          <!-- Tear Line -->
          <tr>
            <td style="padding:0;background:#D1D9E0;">
              <div style="border-top:2px dashed #94A3B8;margin:0 12px;"></div>
            </td>
          </tr>

          <!-- Footer Stub -->
          <tr>
            <td style="background:#0A2540;padding:20px 32px;text-align:center;">
              <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507"
                   alt="GuestNa" width="80"
                   style="display:block;margin:0 auto 10px;filter:brightness(0) invert(1);opacity:0.85;border:0;" />
              <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,0.7);font-weight:600;">
                <a href="https://guestna.app" style="color:rgba(255,255,255,0.7);text-decoration:none;">منصة جستنا للرحلات التعليمية</a>
              </p>
              <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.45);">
                <a href="mailto:finance@guestna.app" style="color:rgba(255,255,255,0.45);text-decoration:none;">finance@guestna.app</a>
                <span style="color:rgba(255,255,255,0.2);margin:0 6px;">|</span>
                <a href="tel:+966547534666" dir="ltr" style="color:rgba(255,255,255,0.45);text-decoration:none;;display:inline-block;">&#8206;+966 55 234 5678&#8206;</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);">© 2025 GuestNa. جميع الحقوق محفوظة.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
