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
  PaymentID: string;
  BookingID: number;
  CreatedAt: string;
}