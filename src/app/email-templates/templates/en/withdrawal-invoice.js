export const withdrawalInvoiceHTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <base target="_blank" />
  <title>Withdrawal Receipt - GuestNa</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
    body { font-family: "Inter", Arial, Helvetica, sans-serif !important; direction: ltr; }
    .mono { font-family: "Courier New", Consolas, monospace; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; }
      .content-pad { padding: 10px 16px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EEEEEE;color:#111111;font-family:'Inter',Arial,Helvetica,sans-serif;direction:ltr;width:100%;min-width:100%;">

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
              <p style="margin:0;font-size:14px;font-weight:700;color:#111111;">GuestNa Platform</p>
              <p style="margin:2px 0 0;font-size:11px;color:#666666;">Riyadh, Saudi Arabia</p>
              <p style="margin:2px 0 0;font-size:11px;color:#666666;">+966 54 753 4666 &nbsp;|&nbsp; info@guestna.app</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:8px 20px 0;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Receipt Title -->
          <tr>
            <td class="content-pad" style="padding:10px 20px 6px;text-align:center;">
              <p style="margin:0;font-size:15px;font-weight:700;letter-spacing:3px;color:#111111;">WITHDRAWAL RECEIPT</p>
              <p style="margin:2px 0 0;font-size:10px;color:#666666;letter-spacing:2px;">EARNINGS WITHDRAWAL</p>
            </td>
          </tr>

          <!-- Meta -->
          <tr>
            <td class="content-pad" style="padding:8px 20px 10px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:12px;color:#222222;">
                <tr>
                  <td style="padding:2px 0;">Receipt No.</td>
                  <td class="mono" style="padding:2px 0;text-align:right;">WD-2025-0893</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">Date</td>
                  <td class="mono" style="padding:2px 0;text-align:right;">2025/05/15</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">Status</td>
                  <td style="padding:2px 0;text-align:right;font-weight:700;">Transferred ✓</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Beneficiary -->
          <tr>
            <td class="content-pad" style="padding:10px 20px;font-size:12px;color:#222222;">
              <p style="margin:0 0 4px;font-size:11px;color:#666666;">BENEFICIARY</p>
              <p style="margin:0;font-weight:700;">Al-Noor International School</p>
              <p style="margin:2px 0 0;color:#555555;">Jeddah — School ID: SCH-00142</p>
              <p style="margin:6px 0 4px;font-size:11px;color:#666666;">TRIP</p>
              <p style="margin:0;">Educational Farm Trip — TRP-9843</p>
              <p style="margin:2px 0 0;color:#555555;">Public — Boys — Middle School</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Items header -->
          <tr>
            <td class="content-pad" style="padding:8px 20px 4px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:11px;color:#666666;">
                <tr>
                  <td style="text-align:left;">Item</td>
                  <td style="width:40px;text-align:center;">Qty</td>
                  <td style="width:60px;text-align:center;">Unit</td>
                  <td style="width:70px;text-align:right;">Total</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Item 1 -->
          <tr>
            <td class="content-pad" style="padding:4px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:12px;color:#222222;">
                <tr>
                  <td style="text-align:left;">Farm Trip — Grade 7</td>
                  <td class="mono" style="width:40px;text-align:center;">20</td>
                  <td class="mono" style="width:60px;text-align:center;">30.00</td>
                  <td class="mono" style="width:70px;text-align:right;">600.00</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Item 2 -->
          <tr>
            <td class="content-pad" style="padding:4px 20px 8px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:12px;color:#222222;">
                <tr>
                  <td style="text-align:left;">Farm Trip — Grade 8</td>
                  <td class="mono" style="width:40px;text-align:center;">20</td>
                  <td class="mono" style="width:60px;text-align:center;">30.00</td>
                  <td class="mono" style="width:70px;text-align:right;">600.00</td>
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
                  <td style="font-size:14px;font-weight:700;color:#111111;">Total Withdrawal</td>
                  <td style="text-align:right;">
                    <span class="mono" style="font-size:18px;font-weight:700;color:#111111;">1,200.00</span>
                    <span style="font-size:11px;color:#666666;">&nbsp;SAR</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider double -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px solid #111111;"></div></td></tr>
          <tr><td style="padding:1px 20px 0;"><div style="border-top:1px solid #111111;"></div></td></tr>

          <!-- Transfer details -->
          <tr>
            <td class="content-pad" style="padding:10px 20px;font-size:12px;color:#222222;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding:2px 0;">Method</td>
                  <td style="padding:2px 0;text-align:right;">Bank Transfer</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">Transfer Date</td>
                  <td class="mono" style="padding:2px 0;text-align:right;">2025/05/15</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">Reference</td>
                  <td class="mono" style="padding:2px 0;text-align:right;">TRF-7842-WD</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Thank you -->
          <tr>
            <td class="content-pad" style="padding:6px 20px 16px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#222222;">Thank you for your business</p>
              <p style="margin:4px 0 0;font-size:10px;color:#666666;line-height:1.6;">
                Electronic proof of school's earnings withdrawal.<br/>
                Inquiries: <a href="mailto:info@guestna.app" style="color:#111111;text-decoration:none;">info@guestna.app</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
