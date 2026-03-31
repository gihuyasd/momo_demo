export interface PaymentCreateRequest {
  orderId: string;
  amount: number;
  orderInfo: string;
}

export interface PaymentResponse {
  payUrl: string;
  message: string;
  deeplink?: string;
}

export interface PaymentHistoryItem {
    paymentID: string;
    amount: number;
    content: string;
    createdAt: string;
}