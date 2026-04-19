import { LocalizationLanguages } from '@src/common/dto';
import { AskWithdrawalOneInfo } from '@src/modules/_dashboard/b2b/askWithDrawals/interfaces/askWithdrawalsResponse';
import { Types } from 'mongoose';

export const withdrawalInvoiceConfirmingTemplate = (
  withdrawal: AskWithdrawalOneInfo,
  invoiceDate: string,
  lang: 'ar' | 'en' = 'ar',
  selectedGradesData?: {
    _id: Types.ObjectId;
    name: LocalizationLanguages;
    quantity: number;
    isPayed: boolean;
  }[],
  selectedGradesAmount?: number,
): string => {
  const guestnaEmail = process.env.GUESTNA_EMAIL || 'info@guestna.app';
  const guestnaNumber = process.env.GUESTNA_NUMBER || '+966 54 753 4666';

  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const translations = {
    title: isAr ? 'فاتورة السحب - GuestNa' : 'Withdrawal Invoice - GuestNa',
    companyName: isAr ? 'قستنا (GuestNa)' : 'GuestNa',
    address: isAr
      ? 'حي العقيق، الرياض 13519، المملكة العربية السعودية'
      : 'حي العقيق، الرياض 13519, Saudi Arabia',
    invoiceHeader: isAr ? 'فاتورة سحب' : 'WITHDRAWAL INVOICE',
    orderIdLabel: isAr ? 'رقم الطلب #' : 'ORDER #',
    invoiceDateLabel: isAr ? 'تاريخ الفاتورة :' : 'Invoice Date :',
    schoolNameLabel: isAr ? 'اسم المدرسة :' : 'School Name :',
    tripCodeLabel: isAr ? 'رمز الرحلة :' : 'Trip Code :',
    tripPriceLabel: isAr
      ? 'سعر الرحلة (للطالب الواحد) :'
      : 'Trip Price (per student) :',
    educationSystemLabel: isAr ? 'النظام التعليمي :' : 'Education System :',
    genderLabel: isAr ? 'الجنس :' : 'Gender :',
    academicStagesLabel: isAr ? 'المراحل الدراسية :' : 'Academic Stages :',
    gradesLabel: isAr ? 'الصفوف :' : 'Grades :',
    itemsDetailsLabel: isAr ? 'تفاصيل العناصر' : 'ITEMS DETAILS',
    itemHeader: isAr ? 'العنصر' : 'Item',
    qtyHeader: isAr ? 'الكمية' : 'Qty',
    unitPriceHeader: isAr ? 'سعر الوحدة' : 'Unit Price',
    totalHeader: isAr ? 'الإجمالي' : 'Total',
    totalWithdrawalAmountLabel: isAr
      ? 'إجمالي مبلغ السحب :'
      : 'Total Withdrawal Amount :',
    questionsFooter: isAr
      ? 'هل لديك أسئلة؟ اتصل بفريق الدعم لدينا'
      : 'Questions? Contact our support team',
    sarUnit: isAr ? 'ريال سعودي' : 'SAR',
  };

  const orgName = isAr
    ? withdrawal.organization?.name?.ar || withdrawal.organization?.name?.en
    : withdrawal.organization?.name?.en;
  const tripName = isAr
    ? withdrawal.trip?.name?.ar || withdrawal.trip?.name?.en
    : withdrawal.trip?.name?.en;
  const eduSystem = isAr
    ? withdrawal?.track?.educationSystem?.name?.ar ||
      withdrawal?.track?.educationSystem?.name?.en
    : withdrawal?.track?.educationSystem?.name?.en;

  const academicStages = withdrawal?.academicStages
    ?.map((stage) =>
      isAr ? stage?.name?.ar || stage?.name?.en : stage?.name?.en,
    )
    .join(', ');

  const grades =
    selectedGradesData && selectedGradesData.length > 0
      ? selectedGradesData
          .map((grade) =>
            isAr ? grade?.name?.ar || grade?.name?.en : grade?.name?.en,
          )
          .join(', ')
      : withdrawal?.grades
          ?.map((grade) =>
            isAr ? grade?.name?.ar || grade?.name?.en : grade?.name?.en,
          )
          .join(', ');

  const htmlTemp = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="${lang}" dir="${dir}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${translations.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;">

<div style="width: 100%; padding: 20px 0;">
  <div style="max-width: 700px; margin: 0 auto; border: 2px solid #87cefa; padding: 15px; background-color: #ffffff;">

    <!-- Company Info -->
    <div style="width: 100%; border-bottom: 2px solid #87cefa; padding-bottom: 15px; margin-bottom: 10px;">
      <img 
        src="https://ik.imagekit.io/v51ywmzjoGuestna/uploads/Layer_1%20(4).png?updatedAt=1751797506507" 
        alt="GuestNa Logo" 
        width="100" 
        height="50" 
        style="width: 100px; height: 50px; display: block; margin-bottom: 10px; border: 0;"
      />
      <p style="font-size: 20px; font-weight: 700; margin: 0 0 5px 0;">${translations.companyName}</p>
      <p style="font-size: 14px; margin: 0 0 3px 0; color: #555;">
        ${translations.address}
      </p>
      <p style="font-size: 14px; margin: 0; color: #555;">https://guestna.app</p>
    </div>

    <!-- Invoice Header -->
    <div style="background-color: #003c4e; padding: 12px 15px; margin: 10px 0;">
      <p style="font-size: 22px; font-weight: 800; margin: 0; color: #ffffff;">
        ${translations.invoiceHeader}
      </p>
    </div>

    <!-- Order & Date Info -->
    <div style="background-color: #c0c0c0; padding: 10px; margin: 10px 0 0 0;">
      <p style="font-size: 18px; font-weight: 800; margin: 0;">
        ${translations.orderIdLabel} : ${withdrawal.orderId}
      </p>
    </div>

    <div style="border: 2px solid #c0c0c0; padding: 10px; margin: 0 0 10px 0;">
      <p style="font-size: 15px; margin: 0 0 5px 0;">
        <strong>${translations.invoiceDateLabel}</strong> ${invoiceDate}
      </p>
      <p style="font-size: 15px; margin: 0 0 5px 0;">
        <strong>${translations.schoolNameLabel}</strong> ${orgName}
      </p>
      <p style="font-size: 15px; margin: 0 0 5px 0">
        <strong>${translations.tripCodeLabel}</strong> ${withdrawal.orgTrip.orderId}
      </p>
      <p style="font-size: 15px; margin: 0 0 5px 0">
        <strong>${translations.tripPriceLabel}</strong> ${withdrawal.orgTrip.pricing.total} ${translations.sarUnit}
      </p>
      <p style="font-size: 15px; margin: 0 0 5px 0">
        <strong>${translations.educationSystemLabel}</strong> ${eduSystem}
      </p>
      <p style="font-size: 15px; margin: 0 0 5px 0">
      <strong>${translations.genderLabel}</strong> ${withdrawal?.track?.gender}
      </p>
      <p style="font-size: 15px; margin: 0 0 5px 0">
        <strong>${translations.academicStagesLabel}</strong> ${academicStages}
      </p>
      <p style="font-size: 15px; margin: 0 0 5px 0">
        <strong>${translations.gradesLabel}</strong> ${grades}
      </p>
    </div>

    <!-- Trip & Pricing Details -->
    <div style="background-color: #c0c0c0; padding: 10px; margin: 10px 0 0 0;">
      <p style="font-size: 18px; font-weight: 800; margin: 0;">
        ${translations.itemsDetailsLabel}
      </p>
    </div>

    <div style="border: 2px solid #c0c0c0; padding: 0; margin: 0 0 10px 0;">
      <!-- Table Header -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-bottom: 1px solid #c0c0c0; padding: 10px;">
        <tr>
          <td style="font-size: 16px; font-weight: 700; width: 40%;">${translations.itemHeader}</td>
          <td style="font-size: 16px; font-weight: 700; width: 20%; text-align: center;">${translations.qtyHeader}</td>
          <td style="font-size: 16px; font-weight: 700; width: 20%; text-align: center;">${translations.unitPriceHeader}</td>
          <td style="font-size: 16px; font-weight: 700; width: 20%; text-align: ${isAr ? 'left' : 'right'};">${translations.totalHeader}</td>
        </tr>
      </table>

      <!-- Trip Rows -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-bottom: 1px solid #c0c0c0; padding: 10px;">
        ${
          selectedGradesData && selectedGradesData.length > 0
            ? selectedGradesData
                .map((g) => {
                  const gradeName = isAr
                    ? g?.name?.ar || g?.name?.en
                    : g?.name?.en;
                  const totalGradeAmount =
                    g.quantity * withdrawal.orgTrip.pricing.schoolProfit;
                  return `
        <tr>
          <td style="font-size: 15px; font-weight: 600; width: 40%; padding: 5px 0;">${tripName} - ${gradeName}</td>
          <td style="font-size: 15px; width: 20%; text-align: center; padding: 5px 0;">${g.quantity}</td>
          <td style="font-size: 15px; width: 20%; text-align: center; padding: 5px 0;">${withdrawal.orgTrip.pricing.schoolProfit} ${translations.sarUnit}</td>
          <td style="font-size: 15px; font-weight: 600; width: 20%; text-align: ${isAr ? 'left' : 'right'}; padding: 5px 0;">${totalGradeAmount} ${translations.sarUnit}</td>
        </tr>
                `;
                })
                .join('')
            : `
        <tr>
          <td style="font-size: 15px; font-weight: 600; width: 40%; padding: 5px 0;">${tripName}</td>
          <td style="font-size: 15px; width: 20%; text-align: center; padding: 5px 0;">${withdrawal.totalBookingsQuantity}</td>
          <td style="font-size: 15px; width: 20%; text-align: center; padding: 5px 0;">${withdrawal.orgTrip.pricing.schoolProfit} ${translations.sarUnit}</td>
          <td style="font-size: 15px; font-weight: 600; width: 20%; text-align: ${isAr ? 'left' : 'right'}; padding: 5px 0;">${withdrawal.amount} ${translations.sarUnit}</td>
        </tr>
            `
        }
      </table>

      <!-- Summary Section -->
      <div style="padding: 10px; border-top: 2px solid #c0c0c0;">
        <p style="font-size: 18px; font-weight: 800; margin: 0; color: #003c4e;">
          ${translations.totalWithdrawalAmountLabel} ${selectedGradesAmount ?? withdrawal.amount} ${translations.sarUnit}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 10px; margin-top: 10px; border-top: 2px solid #87cefa;">
      <p style="font-size: 14px; font-weight: 600; margin: 0 0 5px 0; color: #333;">
        ${translations.questionsFooter}
      </p>
      <p style="font-size: 14px; margin: 0 0 3px 0; color: #555;">
        📧 ${guestnaEmail}
      </p>
      <p style="font-size: 14px; margin: 0; color: #555;">
        📞 ${guestnaNumber}
      </p>
    </div>

  </div>
</div>

</body>
</html>`;

  return htmlTemp;
};
