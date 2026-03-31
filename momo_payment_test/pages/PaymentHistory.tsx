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
        const res = await axios.get<PaymentHistoryItem[]>(`${API_URL}/payment`);
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [API_URL]);

  if (loading) return (
    <div className="flex justify-center items-center py-10">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A50064]"></div>
       <span className="ml-3">Đang tải lịch sử...</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-6 bg-gradient-to-r from-[#A50064] to-[#820050]">
        <h2 className="text-xl font-bold text-white">Lịch sử giao dịch MoMo</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-bold">Mã Giao Dịch</th>
              <th className="px-6 py-4 font-bold">Nội dung</th>
              <th className="px-6 py-4 font-bold text-right">Số tiền</th>
              <th className="px-6 py-4 font-bold text-center">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">Chưa có giao dịch nào</td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item.paymentID} className="hover:bg-pink-50/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-700">
                    {item.paymentID}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 italic">
                    {item.content || "Không có nội dung"}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">
                    {item.amount.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;