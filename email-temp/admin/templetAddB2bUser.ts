export const templetAddB2bUser = (
  url: string,
  email: string,
  name: string,
  phone: string,
  password: string,
  language: 'en' | 'ar' = 'en',
): string => {
  const isArabic = language === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  const translations = {
    en: {
      accountReady: 'Your Account is Ready!',
      welcome: 'Welcome',
      congratulations: '🎊 Congratulations on Your New Account!',
      welcomeMessage:
        "We're excited to have you on board! Your account has been successfully created on GuestNa. You can now access all our features and start exploring.",
      accountDetails: '📋 Your Account Details',
      fullName: 'Full Name',
      emailAddress: 'Email Address',
      phoneNumber: 'Phone Number',
      loginPassword: '🔑 Your Login Password',
      savePassword: '⚠️ Please save this password in a secure location',
      securityMessage:
        'For security reasons, we strongly recommend changing your password after your first login. You can easily do this from your account settings.',
      changePasswordBtn: '🔐 Change Your Password',
      securityTitle: '🛡️ Security Recommendations',
      securityPoints: `• Use a unique password that you don't use on other websites<br>
          • Create a strong password with at least 8 characters<br>
          • Include uppercase, lowercase letters, numbers, and symbols<br>
          • Never share your password with anyone<br>
          • Enable two-factor authentication if available`,
      accountQuestion:
        "If you didn't create this account or have any questions, please contact our support team immediately.",
      needHelp:
        'Need help? Reply to this email and our support team will assist you.',
      copyright: '© 2024 GuestNa. All rights reserved.',
      automated:
        'This is an automated message, please do not reply directly to this email.',
    },
    ar: {
      accountReady: 'حسابك جاهز!',
      welcome: 'مرحباً',
      congratulations: '🎊 تهانينا على حسابك الجديد!',
      welcomeMessage:
        'يسعدنا انضمامك إلينا! تم إنشاء حسابك بنجاح على GuestNa. يمكنك الآن الوصول إلى جميع ميزاتنا والبدء في الاستكشاف.',
      accountDetails: '📋 تفاصيل حسابك',
      fullName: 'الاسم الكامل',
      emailAddress: 'البريد الإلكتروني',
      phoneNumber: 'رقم الهاتف',
      loginPassword: '🔑 كلمة المرور الخاصة بك',
      savePassword: '⚠️ يرجى حفظ كلمة المرور هذه في مكان آمن',
      securityMessage:
        'لأسباب أمنية، نوصي بشدة بتغيير كلمة المرور بعد تسجيل الدخول الأول. يمكنك القيام بذلك بسهولة من إعدادات حسابك.',
      changePasswordBtn: '🔐 تغيير كلمة المرور',
      securityTitle: '🛡️ توصيات الأمان',
      securityPoints: `• استخدم كلمة مرور فريدة لا تستخدمها في مواقع أخرى<br>
          • أنشئ كلمة مرور قوية تتكون من 8 أحرف على الأقل<br>
          • قم بتضمين أحرف كبيرة وصغيرة وأرقام ورموز<br>
          • لا تشارك كلمة المرور الخاصة بك مع أي شخص<br>
          • قم بتفعيل المصادقة الثنائية إذا كانت متاحة`,
      accountQuestion:
        'إذا لم تقم بإنشاء هذا الحساب أو لديك أي أسئلة، يرجى الاتصال بفريق الدعم لدينا على الفور.',
      needHelp:
        'هل تحتاج مساعدة؟ قم بالرد على هذا البريد الإلكتروني وسيساعدك فريق الدعم لدينا.',
      copyright: '© 2024 GuestNa. جميع الحقوق محفوظة.',
      automated:
        'هذه رسالة آلية، يرجى عدم الرد مباشرة على هذا البريد الإلكتروني.',
    },
  };

  const t = translations[language];

  const htmlTemp = `<!DOCTYPE html>
<html lang="${language}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.accountReady}</title>
  <style>
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #f4f4f4;
      font-family: ${isArabic ? "'Cairo', 'Segoe UI', 'Arial', sans-serif" : "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"};
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      direction: ${dir};
    }
    .header {
      background: linear-gradient(135deg, #0b9297 0%, #0a7b7f 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header-subtitle {
      color: #ffffff;
      font-size: 18px;
      font-weight: 600;
      margin-top: 10px;
    }
    .celebration-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .content {
      padding: 40px 30px;
      text-align: ${isArabic ? 'right' : 'left'};
    }
    .welcome-title {
      color: #333333;
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 15px;
      text-align: center;
    }
    .congratulations-text {
      color: #0b9297;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 25px;
    }
    .message-text {
      color: #666666;
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 25px;
    }
    .user-info {
      background-color: #f8fdfd;
      border: 2px solid #e6f7f7;
      padding: 25px;
      margin: 30px 0;
      border-radius: 12px;
    }
    .user-info-title {
      color: #0b9297;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: center;
    }
    .user-detail {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding: 8px 0;
      direction: ${dir};
    }
    .user-detail-icon {
      ${isArabic ? 'margin-left' : 'margin-right'}: 10px;
      font-size: 20px;
    }
    .user-detail-content {
      flex: 1;
    }
    .user-detail-label {
      font-weight: bold;
      color: #333333;
      font-size: 14px;
      margin-bottom: 3px;
    }
    .user-detail-value {
      color: #666666;
      font-size: 15px;
      direction: ltr;
      text-align: ${isArabic ? 'right' : 'left'};
    }
    .password-box {
      background-color: #fff9e6;
      border: 2px dashed #ffc107;
      padding: 20px;
      margin: 25px 0;
      border-radius: 12px;
      text-align: center;
    }
    .password-label {
      color: #333333;
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .password-value {
      background-color: #ffffff;
      color: #333333;
      font-family: 'Courier New', monospace;
      font-size: 20px;
      font-weight: bold;
      padding: 15px 20px;
      border-radius: 8px;
      border: 2px solid #ffc107;
      display: inline-block;
      margin: 10px 0;
      letter-spacing: 2px;
      direction: ltr;
    }
    .password-warning {
      color: #ff6b6b;
      font-size: 13px;
      margin-top: 10px;
      font-weight: 600;
    }
    .cta-container {
      text-align: center;
      margin: 35px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #0b9297 0%, #0a7b7f 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(11, 146, 151, 0.3);
      transition: all 0.3s ease;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(11, 146, 151, 0.4);
    }
    .security-info {
      background-color: #f8f9fa;
      border-${isArabic ? 'right' : 'left'}: 4px solid #0b9297;
      padding: 20px;
      margin: 30px 0;
      border-radius: ${isArabic ? '8px 0 0 8px' : '0 8px 8px 0'};
    }
    .security-title {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .security-text {
      color: #666666;
      font-size: 14px;
      line-height: 1.8;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 25px 30px;
      text-align: center;
      color: #999999;
      font-size: 13px;
      border-top: 1px solid #e0e0e0;
    }

    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      .header {
        padding: 30px 20px !important;
      }
      .content {
        padding: 30px 20px !important;
      }
      .welcome-title {
        font-size: 24px !important;
      }
      .congratulations-text {
        font-size: 18px !important;
      }
      .message-text {
        font-size: 15px !important;
      }
      .password-value {
        font-size: 16px !important;
        padding: 12px 15px !important;
      }
      .cta-button {
        padding: 14px 28px !important;
        font-size: 15px !important;
      }
    }
  </style>
  ${isArabic ? '<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">' : ''}
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="celebration-icon">🎉</div>
      <img src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" alt="GuestNa Logo" style="max-width: 150px; height: auto; margin: 15px 0;">
      <div class="header-subtitle">${t.accountReady}</div>
    </div>

    <!-- Main Content -->
    <div class="content">
      <h1 class="welcome-title">${t.welcome}, ${name}!</h1>
      <p class="congratulations-text">${t.congratulations}</p>

      <p class="message-text">
        ${t.welcomeMessage}
      </p>

      <!-- User Information -->
      <div class="user-info">
        <div class="user-info-title">${t.accountDetails}</div>
        <div class="user-detail">
          <span class="user-detail-icon">👤</span>
          <div class="user-detail-content">
            <div class="user-detail-label">${t.fullName}</div>
            <div class="user-detail-value">${name}</div>
          </div>
        </div>
        <div class="user-detail">
          <span class="user-detail-icon">📧</span>
          <div class="user-detail-content">
            <div class="user-detail-label">${t.emailAddress}</div>
            <div class="user-detail-value">${email}</div>
          </div>
        </div>
        <div class="user-detail">
          <span class="user-detail-icon">📱</span>
          <div class="user-detail-content">
            <div class="user-detail-label">${t.phoneNumber}</div>
            <div class="user-detail-value">${phone}</div>
          </div>
        </div>
      </div>

      <!-- Password Box -->
      <div class="password-box">
        <div class="password-label">${t.loginPassword}</div>
        <div class="password-value">${password}</div>
        <div class="password-warning">${t.savePassword}</div>
      </div>

      <p class="message-text">
        ${t.securityMessage}
      </p>

      <div class="cta-container">
        <a href="${url}" class="cta-button">${t.changePasswordBtn}</a>
      </div>

      <!-- Security Information -->
      <div class="security-info">
        <div class="security-title">${t.securityTitle}</div>
        <div class="security-text">
          ${t.securityPoints}
        </div>
      </div>

      <p class="message-text">
        ${t.accountQuestion}
      </p>

      <p class="message-text" style="text-align: center; margin-top: 40px;">
        ${t.needHelp}
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 10px 0;">${t.copyright}</p>
      <p style="margin: 0;">${t.automated}</p>
    </div>
  </div>
</body>
</html>`;

  return htmlTemp;
};
