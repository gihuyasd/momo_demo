import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

interface StatusDetail {
  title: string;
  message: string;
  color: string;
  icon: string;
}

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resultCode = searchParams.get('resultCode');
  const amount = searchParams.get('amount');
  const orderId = searchParams.get('orderId');

  const getStatusDetail = (code: string | null): StatusDetail => {
    switch (code) {
      case '0':
        return {
          title: 'Thanh toán thành công!',
          message: 'Cảm ơn bạn! Sân bóng của bạn đã được đặt và xác nhận.',
          color: 'text-green-600 bg-green-100',
          icon: '✓'
        };
      case '1006':
      case '49':
        return {
          title: 'Giao dịch đã hủy',
          message: 'Bạn đã hủy yêu cầu thanh toán trên ứng dụng MoMo.',
          color: 'text-orange-600 bg-orange-100',
          icon: '!'
        };
      case '1007':
      case '1008':
        return {
          title: 'Hết hạn thanh toán',
          message: 'Phiên giao dịch đã hết thời gian chờ. Vui lòng thử lại.',
          color: 'text-yellow-600 bg-yellow-100',
          icon: '⏳'
        };
      default:
        return {
          title: 'Thanh toán thất bại',
          message: 'Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng kiểm tra số dư hoặc thử lại sau.',
          color: 'text-red-600 bg-red-100',
          icon: '✕'
        };
    }
  };

  const detail = getStatusDetail(resultCode);

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-3xl shadow-2xl text-center border border-gray-50">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto text-4xl mb-6 ${detail.color}`}>
          {detail.icon}
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-2">{detail.title}</h2>
        <p className="text-gray-500 mb-6 px-4">{detail.message}</p>

        <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Mã đơn hàng:</span>
            <span className="font-mono font-bold text-gray-700">{orderId || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
            <span className="text-gray-400">Số tiền:</span>
            <span className="font-bold text-gray-900 text-lg">
              {amount ? Number(amount).toLocaleString() : '0'} VND
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {resultCode === '0' ? (
            <Link 
              to="/history" 
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-200"
            >
              Xem lịch sử đặt sân
            </Link>
          ) : (
            <Link 
              to="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
            >
              Thử thanh toán lại
            </Link>
          )}
          
          <Link 
            to="/" 
            className="text-gray-400 hover:text-gray-600 text-sm font-medium py-2"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default PaymentResult;