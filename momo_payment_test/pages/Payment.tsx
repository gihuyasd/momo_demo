import React, { useState } from 'react';
import axios from 'axios';
import type { PaymentCreateRequest, PaymentResponse } from '../interfaces/types';

const Payment: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [orderInfo, setOrderInfo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const API_URL = import.meta.env.VITE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: PaymentCreateRequest = {
        orderId: `TEST_PAYMENT_${Date.now()}`, 
        amount: Number(amount),
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
      alert("Không thể khởi tạo thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-800">Thanh toán đặt sân</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Số tiền (VND)</label>
          <input 
            type="number" 
            className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ví dụ: 200000"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung thanh toán</label>
          <textarea 
            className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" 
            value={orderInfo}
            onChange={(e) => setOrderInfo(e.target.value)}
            placeholder="Thanh toán tiền ..."
            required 
          />
        </div>
        <button 
          disabled={loading}
          className="w-full bg-[#A50064] text-white py-3 rounded-lg hover:bg-[#820050] transition-colors font-bold disabled:bg-gray-400"
        >
          {loading ? 'Đang xử lý...' : 'Thanh toán qua ví MoMo'}
        </button>
      </form>
    </div>
  );
};

export default Payment;