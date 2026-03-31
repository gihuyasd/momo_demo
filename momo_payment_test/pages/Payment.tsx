import React, { useState } from 'react';
import axios from 'axios';
import type { PaymentCreateRequest, PaymentResponse } from '../interfaces/types';

const Payment: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [orderInfo, setOrderInfo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Thêm trạng thái lỗi
  
  const API_URL = import.meta.env.VITE_URL;

  // Hàm chặn các ký tự không phải số (e, +, -, .)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAmount = Number(amount);

    // Kiểm tra số tiền tối thiểu theo quy định MoMo (thường là 1000đ)
    if (numericAmount < 1000) {
      setError("Số tiền tối thiểu phải là 1,000đ");
      return;
    }

    setLoading(true);
    try {
      const payload: PaymentCreateRequest = {
        orderId: `TEST_PAYMENT_${Date.now()}`, 
        amount: numericAmount,
        orderInfo: orderInfo
      };

      const { data } = await axios.post<PaymentResponse>(
        `${API_URL}/payment/create-url`, 
        payload
      );

      if (data.payUrl) {
        window.location.href = data.payUrl; 
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setError("Không thể khởi tạo thanh toán. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-800 text-center">Thanh toán đặt sân</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Số tiền (VND)</label>
          <input 
            type="number" 
            min="1000" // Ràng buộc ở phía trình duyệt
            step="1"   // Chỉ cho phép số nguyên
            onKeyDown={handleKeyDown} // Chặn ký tự đặc biệt
            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition-all ${
              error ? 'border-red-500' : 'border-gray-300'
            }`} 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Tối thiểu 1,000đ"
            required 
          />
          {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung thanh toán</label>
          <textarea 
            className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none h-24 resize-none" 
            value={orderInfo}
            onChange={(e) => setOrderInfo(e.target.value)}
            placeholder="Ví dụ: Thanh toán sân A sáng chủ nhật..."
            required 
          />
        </div>

        <button 
          disabled={loading || !amount || Number(amount) < 1000}
          className="w-full bg-[#A50064] text-white py-3 rounded-lg hover:bg-[#820050] transition-colors font-bold disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md active:scale-95 transform"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </span>
          ) : 'Thanh toán qua ví MoMo'}
        </button>
      </form>
    </div>
  );
};

export default Payment;