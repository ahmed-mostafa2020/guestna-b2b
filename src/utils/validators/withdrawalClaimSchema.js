import * as Yup from "yup";

/**
 * Yup schema generator for the Withdrawal Claim (Ask-Withdrawals) form.
 *
 * All numeric fields are optional.
 * The only required field is the file (invoice), which is validated
 * outside the schema at submit time since it's a native File object.
 */
export const createWithdrawalClaimSchema = () => {
  return Yup.object().shape({
    amount: Yup.number().typeError("").nullable().optional(),
    totalTickets: Yup.number().typeError("").nullable().optional(),
    companionsCount: Yup.number().typeError("").nullable().optional(),
  });
};
