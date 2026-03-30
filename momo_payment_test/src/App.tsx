import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PaymentForm from '../pages/Payment';
import PaymentHistory from '../pages/PaymentHistory';
import PaymentResult from '../pages/PaymentResult';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#A50064] text-white p-1.5 rounded-lg shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-800 tracking-tight">
                Test thanh toán MoMo  
              </span>
            </div>

            <div className="flex items-center gap-6">
              <Link 
                to="/" 
                className="text-sm font-semibold text-gray-600 hover:text-[#A50064] transition-colors"
              >
                Thanh toán
              </Link>
              <Link 
                to="/history" 
                className="text-sm font-semibold text-gray-600 hover:text-[#A50064] transition-colors"
              >
                Lịch sử giao dịch
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-grow container mx-auto max-w-5xl px-4 py-12">
          <Routes>
            <Route path="/" element={<PaymentForm />} />
            <Route path="/history" element={<PaymentHistory />} />
            <Route path="/result" element={<PaymentResult />} />
          </Routes>
        </main>

        <footer className="py-8 border-t border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-sm text-gray-400">
            </p>
            <p className="text-xs text-gray-300 mt-1">
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;