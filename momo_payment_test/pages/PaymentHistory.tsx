import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { PaymentHistoryItem } from '../interfaces/types';

const PaymentHistory: React.FC = () => {
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get<PaymentHistoryItem[]>(`${API_URL}/payment/history`);
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="text-center">Đang tải lịch sử...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Lịch sử thanh toán sân bóng</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Mã MoMo (TransID)</th>
              <th className="px-6 py-4 font-semibold text-center">Mã Đặt Sân</th>
              <th className="px-6 py-4 font-semibold">Thời gian giao dịch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.map((item) => (
              <tr key={item.PaymentID} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-gray-700">{item.PaymentID}</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    #{item.BookingID}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(item.CreatedAt).toLocaleString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;