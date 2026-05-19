export const invoiceHTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <base target="_blank" />
  <title>Tax Invoice - GuestNa</title>
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
              <p style="margin:0;font-size:14px;font-weight:700;color:#111111;">GuestNa Educational Platform</p>
              <p style="margin:2px 0 0;font-size:11px;color:#666666;">Riyadh, Saudi Arabia</p>
              <p style="margin:2px 0 0;font-size:11px;color:#666666;">VAT No.: 1234567890</p>
              <p style="margin:2px 0 0;font-size:11px;color:#666666;">+966 54 753 4666 &nbsp;|&nbsp; finance@guestna-edu.com</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:8px 20px 0;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Title -->
          <tr>
            <td class="content-pad" style="padding:10px 20px 6px;text-align:center;">
              <p style="margin:0;font-size:15px;font-weight:700;letter-spacing:3px;color:#111111;">SIMPLIFIED TAX INVOICE</p>
              <p style="margin:2px 0 0;font-size:10px;color:#666666;letter-spacing:2px;">VAT INCLUSIVE</p>
            </td>
          </tr>

          <!-- Meta -->
          <tr>
            <td class="content-pad" style="padding:8px 20px 10px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:12px;color:#222222;">
                <tr>
                  <td style="padding:2px 0;">Invoice No.</td>
                  <td class="mono" style="padding:2px 0;text-align:right;">INV-2025-0742</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">Issued</td>
                  <td class="mono" style="padding:2px 0;text-align:right;">2025/04/12</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">Status</td>
                  <td style="padding:2px 0;text-align:right;font-weight:700;">Paid ✓</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Billed To -->
          <tr>
            <td class="content-pad" style="padding:10px 20px;font-size:12px;color:#222222;">
              <p style="margin:0 0 4px;font-size:11px;color:#666666;">BILLED TO</p>
              <p style="margin:0;font-weight:700;">Al-Noor International School</p>
              <p style="margin:2px 0 0;color:#555555;">Jeddah — Customer ID: SCH-00142</p>
              <p style="margin:2px 0 0;color:#555555;">billing@alnour-school.edu.sa</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Items header -->
          <tr>
            <td class="content-pad" style="padding:8px 20px 4px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:11px;color:#666666;">
                <tr>
                  <td style="text-align:left;">Description</td>
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
                  <td style="text-align:left;vertical-align:top;">
                    Educational Farm Trip
                    <div style="font-size:10px;color:#666666;margin-top:2px;">2025/05/20 — 8:00 AM</div>
                  </td>
                  <td class="mono" style="width:40px;text-align:center;vertical-align:top;">45</td>
                  <td class="mono" style="width:60px;text-align:center;vertical-align:top;">95.00</td>
                  <td class="mono" style="width:70px;text-align:right;vertical-align:top;">4,275.00</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Item 2 -->
          <tr>
            <td class="content-pad" style="padding:4px 20px 8px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:12px;color:#222222;">
                <tr>
                  <td style="text-align:left;vertical-align:top;">
                    Platform Management Fee
                    <div style="font-size:10px;color:#666666;margin-top:2px;">5% of trip value</div>
                  </td>
                  <td class="mono" style="width:40px;text-align:center;vertical-align:top;">—</td>
                  <td class="mono" style="width:60px;text-align:center;vertical-align:top;">—</td>
                  <td class="mono" style="width:70px;text-align:right;vertical-align:top;">213.75</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Subtotals -->
          <tr>
            <td class="content-pad" style="padding:8px 20px 4px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:12px;color:#222222;">
                <tr>
                  <td style="padding:2px 0;">Subtotal</td>
                  <td class="mono" style="padding:2px 0;text-align:right;">4,488.75</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">VAT 15%</td>
                  <td class="mono" style="padding:2px 0;text-align:right;">673.31</td>
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
                  <td style="font-size:14px;font-weight:700;color:#111111;">Total Due</td>
                  <td style="text-align:right;">
                    <span class="mono" style="font-size:18px;font-weight:700;color:#111111;">5,162.06</span>
                    <span style="font-size:11px;color:#666666;">&nbsp;SAR</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider double -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px solid #111111;"></div></td></tr>
          <tr><td style="padding:1px 20px 0;"><div style="border-top:1px solid #111111;"></div></td></tr>

          <!-- Payment -->
          <tr>
            <td class="content-pad" style="padding:10px 20px;font-size:12px;color:#222222;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding:2px 0;">Method</td>
                  <td style="padding:2px 0;text-align:right;">GuestNa Wallet + Mada</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">Paid On</td>
                  <td class="mono" style="padding:2px 0;text-align:right;">2025/04/11</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;">Reference</td>
                  <td class="mono" style="padding:2px 0;text-align:right;">TXN-9934-XKPL</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 20px;"><div style="border-top:1px dashed #999999;"></div></td></tr>

          <!-- Barcode -->
          <tr>
            <td class="content-pad" style="padding:12px 20px;text-align:center;">
              <div style="height:34px;background:repeating-linear-gradient(90deg,#111111 0,#111111 2px,transparent 2px,transparent 4px,#111111 4px,#111111 5px,transparent 5px,transparent 8px,#111111 8px,#111111 11px,transparent 11px,transparent 13px,#111111 13px,#111111 14px,transparent 14px,transparent 17px,#111111 17px,#111111 19px,transparent 19px,transparent 22px);width:180px;max-width:100%;margin:0 auto;"></div>
              <p class="mono" style="margin:6px 0 0;font-size:10px;color:#444444;letter-spacing:3px;">INV2025074200142SCH</p>
            </td>
          </tr>

          <!-- Thank you -->
          <tr>
            <td class="content-pad" style="padding:6px 20px 16px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#222222;">Thank you for your business</p>
              <p style="margin:4px 0 0;font-size:10px;color:#666666;line-height:1.6;">
                Electronic invoice — no stamp or signature required.<br/>
                <a href="https://guestna.app/invoice/INV-2025-0742/pdf" style="color:#111111;text-decoration:underline;">Download PDF</a>
                &nbsp;|&nbsp;
                <a href="mailto:finance@guestna-edu.com" style="color:#111111;text-decoration:none;">finance@guestna-edu.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
