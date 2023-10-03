import Razorpay from "razorpay";
import { WCoreError } from "../exceptions";
import { WCORE_ERRORS } from "../constants/errors";

export const getRazorPayInstance = async () => {
  const instance = new Razorpay({
    key_id: `${process.env.RAZOR_PAY_API_KEY_ID}`,
    key_secret: `${process.env.RAZOR_PAY_API_SECRED_KEY}`
  });
  return instance;
};

export const getRazorPayOrder = async razorPayOrderId => {
  try {
    const instance = await getRazorPayInstance();
    const response = await instance.orders.fetch(razorPayOrderId);
    if (response == null || response === undefined) {
      throw new WCoreError(WCORE_ERRORS.PAYMENT_REQUEST_FAILED);
    }
    return response;
  } catch (error) {
    console.log(error);
    throw new WCoreError(WCORE_ERRORS.PAYMENT_REQUEST_FAILED);
  }
};

export const razorpayPaymentRefund = async (
  paymentId: string,
  amount?: number,
  notes?: object
) => {
  const instance = await getRazorPayInstance();
  try {
    const refund = await instance.payments.refund(paymentId, {
      amount,
      notes
    });
    return refund;
  } catch (error) {
    throw new WCoreError(WCORE_ERRORS.REFUND_REQUEST_FAILED);
  }
};

export const createRazorPayRefund = async (
  orderId: string,
  amount?: number,
  notes?: object
) => {
  try {
    const instance = await getRazorPayInstance();
    const payments = await getOrderPayment(orderId);
    console.log("payments", payments);
    const refunds: IRazorPayRefund[] = [];
    for (const payment of payments) {
      if (payment.status == "captured") {
        const refund = await razorpayPaymentRefund(payment.id, amount, notes);
        refunds.push(refund);
      }
    }

    return refunds;
  } catch (error) {
    console.log(error);
    throw new WCoreError(WCORE_ERRORS.REFUND_REQUEST_FAILED);
  }
};

export const getRazorPayRefunds = async (
  from?: Date,
  to?: Date,
  count?: number,
  skip?: number,
  paymentId?: string
) => {
  try {
    const instance = await getRazorPayInstance();
    const refunds = await instance.refunds.all({
      from,
      to,
      count,
      skip,
      paymentId
    });
    return refunds;
  } catch (error) {
    console.log(error);
    throw new WCoreError(WCORE_ERRORS.ERROR_FETCHING_REFUNDS);
  }
};

export const getRazorPayRefund = async (
  refundId: string,
  paymentId?: string
) => {
  try {
    const instance = await getRazorPayInstance();
    const refund = await instance.refunds.fetch(refundId, {
      payment_id: paymentId
    });
    return refund;
  } catch (error) {
    console.log(error);
    throw new WCoreError(WCORE_ERRORS.ERROR_FETCHING_REFUNDS);
  }
};

export const getOrderPayment = async (orderId: string) => {
  try {
    const instance = await getRazorPayInstance();
    const {
      items
    }: { items: IRazorPayPayments[] } = await instance.orders.fetchPayments(
      orderId
    );
    return items;
  } catch (error) {
    console.log("getOrderPayment", error);
    throw new WCoreError(WCORE_ERRORS.PAYMENT_REQUEST_FAILED);
  }
};

export const createRazorPayOrder = async data => {
  try {
    const instance = await getRazorPayInstance();
    const response = await instance.orders.create(data);
    if (response == null || response === undefined) {
      throw new WCoreError(WCORE_ERRORS.PAYMENT_REQUEST_FAILED);
    }
    return response;
  } catch (error) {
    console.log(error);
    throw new WCoreError(WCORE_ERRORS.PAYMENT_REQUEST_FAILED);
  }
};

export const getRazorPayPayments = async (
  data: IGetPaymentsInputData
): Promise<IGetPaymentsOutPutData> => {
  const { from, to, count, skip } = data;
  try {
    const instance = await getRazorPayInstance();
    const response = instance.payments.all({ from, count, skip });
    if (response == null || response === undefined) {
      throw new WCoreError(WCORE_ERRORS.PAYMENT_REQUEST_FAILED);
    }
    return response;
  } catch (error) {
    console.log("getRazorPayPayments", error);
    throw new WCoreError(WCORE_ERRORS.PAYMENT_REQUEST_FAILED);
  }
};

export interface IGetPaymentsOutPutData {
  items: IRazorPayPayments[];
  count: number;
  entity: string;
}
interface IGetPaymentsInputData {
  from: number;
  count: number;
  skip: number;
  to?: number;
}

export interface IRazorPayPayments {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  fee: number;
  tax: number;
}

interface IRazorPayRefund {
  id: string;
  entity: string;
  speed: string;
  amount: number;
  currency: string;
  payment_id: string;
  notes: [];
  receipt: string;
  status: string;
  speed_processed: string;
  speed_requested: string;
}
