"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, BookOpen, Users, Settings, MessageCircle, CheckCircle, 
  Plus, Trash2, LogIn, LogOut, FileText, LayoutDashboard, 
  ShieldCheck, ArrowUp, ArrowDown, Search, X, Bell, Clock, 
  AlertTriangle, Check, UploadCloud, CreditCard, Send, MapPin, 
  Globe, Phone, FileDigit, Download, ChevronRight, Calendar, Eye, Menu
} from 'lucide-react';

// ==========================================
// 1. DỮ LIỆU MÔ PHỎNG & HẰNG SỐ
// ==========================================
const ACADEMY_INFO = {
  name: "Học viện Kỹ thuật và Công nghệ an ninh",
  code: "KTH",
  locations: ["Hoà Lạc, Hà Nội", "Thuận Thành, Bắc Ninh"],
  website: "hvktcnan.bocongan.gov.vn",
  hotline: "098.995.3286",
};

const MAJORS = [
  { code: 'KTHDS01', name: 'Khoa học dữ liệu và Trí tuệ nhân tạo', quota: 20, combos: ['A00', 'A01', 'D01', 'X06', 'X10', 'X26'] },
  { code: 'KTHDS02', name: 'Công nghệ phần mềm', quota: 20, combos: ['A00', 'A01', 'D01', 'X06', 'X10', 'X26'] },
  { code: 'KTHDS03', name: 'An toàn hệ thống thông tin', quota: 20, combos: ['A00', 'A01', 'D01', 'X06', 'X10', 'X26'] },
  { code: 'KTHDS04', name: 'Công nghệ điện tử viễn thông', quota: 20, combos: ['A00', 'A01', 'C01', 'X06', 'X26'] },
  { code: 'KTHDS05', name: 'Công nghệ điện tử và vi mạch bán dẫn', quota: 20, combos: ['A00', 'A01', 'A02', 'C01', 'X07'] },
];

const METHODS = [
  { id: 1, name: 'Xét tuyển tài năng', desc: 'Xét tuyển thẳng, ưu tiên xét tuyển theo quy định của BGDĐT và xét tuyển dựa vào Hồ sơ năng lực (HSNL). Điểm HSNL = ĐHL (60%) + ĐTT (40%) + ĐƯT.' },
  { id: 2, name: 'Đánh giá năng lực / Đánh giá tư duy', desc: 'Dựa vào kết quả thi ĐGNL của ĐHQGHN, ĐHQG-HCM, ĐHSPHN và ĐGTD của ĐHBK Hà Nội năm 2026. Điểm xét = Điểm thi quy đổi + ĐƯT.' },
  { id: 3, name: 'Chứng chỉ quốc tế (SAT/ACT)', desc: 'Thí sinh có chứng chỉ SAT >= 800/1600 hoặc ACT >= 18/36 (còn thời hạn 2 năm tính đến ngày xét tuyển).' },
  { id: 4, name: 'Chứng chỉ Tiếng Anh + Học bạ', desc: 'IELTS >= 4.0, TOEFL iBT >= 25 kết hợp với điểm học bạ THPT. Điểm xét = Điểm T.Anh quy đổi + Điểm HB + ĐƯT.' },
  { id: 5, name: 'Kết quả thi THPT 2026', desc: 'Dựa vào điểm thi 3 môn thuộc tổ hợp xét tuyển kỳ thi Tốt nghiệp THPT 2026 theo quy định của BGDĐT.' },
];

const CURRENT_DATE = new Date('2026-07-10T10:00:00');
const DEADLINE_START = new Date('2026-07-02T00:00:00');
const DEADLINE_END = new Date('2026-08-21T17:00:00');

const INITIAL_CANDIDATES = [
  { id: 'C001', name: 'Nguyễn Văn A', cccd: '001099001111', region: 'KV1', target: 'UT1', isPaid: false, isConfirmed: false },
  { id: 'C002', name: 'Trần Thị B', cccd: '001099002222', region: 'KV2', target: 'NONE', isPaid: true, isConfirmed: false },
  { id: 'C003', name: 'Lê Văn C', cccd: '001099003333', region: 'KV3', target: 'NONE', isPaid: true, isConfirmed: false },
];

const INITIAL_WISHES = [
  { id: 'W1', candidateId: 'C001', majorCode: 'KTHDS01', methodId: 5, combo: 'A00', priority: 1, totalScore: 28.5, bonusScore: 2.5, status: 'PENDING' },
  { id: 'W2', candidateId: 'C001', majorCode: 'KTHDS02', methodId: 5, combo: 'A00', priority: 2, totalScore: 29.0, bonusScore: 2.5, status: 'PENDING' },
  { id: 'W3', candidateId: 'C002', majorCode: 'KTHDS01', methodId: 4, combo: 'D01', priority: 1, totalScore: 28.8, bonusScore: 0.25, status: 'PENDING' },
];

// ==========================================
// 2. COMPONENT CHÍNH (APP LÕI)
// ==========================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [wishes, setWishes] = useState(INITIAL_WISHES);
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [auditLogs, setAuditLogs] = useState([]);
  const [showAI, setShowAI] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Hệ thống thông báo (Toasts)
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const login = (role) => {
    if (role === 'CANDIDATE') setCurrentUser(candidates[0]); // Đăng nhập mẫu Thí sinh A
    if (role === 'ADMIN') setCurrentUser({ id: 'A001', name: 'Ban Tuyển sinh', role: 'ADMIN' });
    setActiveTab(role === 'ADMIN' ? 'admin' : 'portal');
    setMobileMenuOpen(false);
    addToast(`Đăng nhập hệ thống thành công!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    setMobileMenuOpen(false);
  };

  const isSystemOpen = CURRENT_DATE >= DEADLINE_START && CURRENT_DATE <= DEADLINE_END;

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-800 flex flex-col">
      {/* Hiển thị Thông báo */}
      <div className="fixed top-24 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`flex items-center p-4 rounded-lg shadow-lg border text-sm font-bold transition-all pointer-events-auto
            ${toast.type === 'success' ? 'bg-white border-l-4 border-l-green-500 text-slate-700' : 
              toast.type === 'error' ? 'bg-white border-l-4 border-l-red-500 text-slate-700' : 
              'bg-white border-l-4 border-l-blue-500 text-slate-700'}`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 mr-3 text-green-500" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 mr-3 text-red-500" />}
            {toast.type === 'info' && <Bell className="w-5 h-5 mr-3 text-blue-500" />}
            {toast.message}
          </div>
        ))}
      </div>

      {/* THANH TRÊN CÙNG (PTIT STYLE) */}
      <div className="bg-[#cc0000] text-white text-xs py-2 hidden md:block border-b border-red-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6 font-medium">
            <span className="flex items-center hover:text-red-200 cursor-pointer transition"><Phone className="w-3.5 h-3.5 mr-1.5"/> Hotline: {ACADEMY_INFO.hotline}</span>
            <span className="flex items-center hover:text-red-200 cursor-pointer transition"><Globe className="w-3.5 h-3.5 mr-1.5"/> {ACADEMY_INFO.website}</span>
          </div>
          <div className="flex gap-5 uppercase font-bold tracking-wider">
            <a href="#" className="hover:text-red-200 transition">Tin tức</a>
            <a href="#" className="hover:text-red-200 transition">Tài liệu</a>
            <a href="#" className="hover:text-red-200 transition">Hỗ trợ</a>
          </div>
        </div>
      </div>

      {/* MENU CHÍNH */}
      <header className="bg-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-[#003366]" />
            <div>
              <h1 className="text-lg md:text-xl font-black uppercase tracking-wide text-[#003366] leading-tight">
                Học viện Kỹ thuật và <br className="hidden md:block"/> Công nghệ An ninh
              </h1>
            </div>
          </div>
          
          {/* Menu Máy tính */}
          <div className="hidden md:flex items-center space-x-3">
            {!currentUser ? (
              <>
                <button onClick={() => login('CANDIDATE')} className="text-sm font-bold text-[#003366] border border-[#003366] hover:bg-[#003366] hover:text-white px-5 py-2.5 rounded transition-colors flex items-center">
                  <LogIn className="w-4 h-4 mr-2" /> Dành cho Thí sinh
                </button>
                <button onClick={() => login('ADMIN')} className="bg-[#cc0000] hover:bg-red-800 text-white text-sm font-bold px-5 py-2.5 rounded transition-colors shadow-sm">
                  Quản trị viên
                </button>
              </>
            ) : (
              <div className="flex items-center bg-slate-50 rounded p-1.5 pr-4 border border-slate-200">
                <div className="bg-[#003366] text-white w-8 h-8 rounded flex items-center justify-center font-bold mr-3">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-sm mr-6">
                  <div className="font-bold text-[#003366]">{currentUser.name}</div>
                  <div className="text-xs text-slate-500">{currentUser.role === 'ADMIN' ? 'Hệ thống Quản trị' : `TS: ${currentUser.cccd}`}</div>
                </div>
                <button onClick={() => setActiveTab(currentUser.role === 'ADMIN' ? 'admin' : 'portal')} className="text-slate-400 hover:text-[#003366] p-2 transition-colors border-r border-slate-200 mr-1" title="Bảng điều khiển">
                  <LayoutDashboard className="w-5 h-5" />
                </button>
                <button onClick={logout} className="text-slate-400 hover:text-red-600 p-2 transition-colors" title="Đăng xuất">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Nút Menu Mobile */}
          <div className="md:hidden">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#003366] p-2">
               <Menu className="w-7 h-7" />
             </button>
          </div>
        </div>

        {/* Menu thả xuống Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 flex flex-col gap-3 shadow-inner">
            {!currentUser ? (
              <>
                <button onClick={() => login('CANDIDATE')} className="w-full text-center text-sm font-bold text-[#003366] border border-[#003366] py-3 rounded">Đăng nhập Thí sinh</button>
                <button onClick={() => login('ADMIN')} className="w-full text-center text-sm font-bold text-white bg-[#cc0000] py-3 rounded">Đăng nhập Quản trị</button>
              </>
            ) : (
              <>
                <div className="text-center font-bold text-[#003366] pb-2 border-b">Xin chào, {currentUser.name}</div>
                <button onClick={() => setActiveTab(currentUser.role === 'ADMIN' ? 'admin' : 'portal')} className="w-full text-center text-sm font-bold text-slate-700 bg-slate-100 py-3 rounded">Bảng điều khiển</button>
                <button onClick={logout} className="w-full text-center text-sm font-bold text-red-600 bg-red-50 py-3 rounded">Đăng xuất</button>
              </>
            )}
          </div>
        )}
      </header>

      {/* THANH TRẠNG THÁI HỆ THỐNG */}
      {isSystemOpen && (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#003366] py-2 px-4 text-center text-sm font-bold shadow-sm">
          <span className="flex items-center justify-center">
            <Clock className="w-4 h-4 mr-2 animate-pulse" /> 
            CỔNG ĐĂNG KÝ ĐANG MỞ. Hạn chót: 17h00 ngày 21/08/2026.
          </span>
        </div>
      )}

      {/* NỘI DUNG CHÍNH */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && <PublicHome onApplyClick={() => login('CANDIDATE')} />}
        {activeTab === 'portal' && currentUser && currentUser.role !== 'ADMIN' && (
          <CandidatePortal 
            user={currentUser} 
            setUser={(u) => {
              setCurrentUser(u);
              setCandidates(candidates.map(c => c.id === u.id ? u : c));
            }}
            wishes={wishes} 
            setWishes={setWishes} 
            addToast={addToast} 
            addAuditLog={(action, detail) => setAuditLogs(prev => [{id: Date.now(), time: new Date().toISOString(), actor: currentUser.id, action, detail}, ...prev])}
            isSystemOpen={isSystemOpen}
          />
        )}
        {activeTab === 'admin' && currentUser?.role === 'ADMIN' && (
          <AdminDashboard 
            wishes={wishes} 
            setWishes={setWishes} 
            candidates={candidates}
            auditLogs={auditLogs}
            setAuditLogs={setAuditLogs}
            addToast={addToast}
            adminUser={currentUser}
          />
        )}
      </main>

      {/* CHÂN TRANG (FOOTER) */}
      <footer className="bg-[#002244] text-slate-300 py-10 text-sm mt-auto border-t-[6px] border-[#cc0000]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
               <ShieldCheck className="w-8 h-8 text-[#cc0000] mr-2" />
               <h4 className="font-black text-white text-lg uppercase leading-tight">{ACADEMY_INFO.name}</h4>
            </div>
            <p className="mb-2 flex items-start"><MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-slate-400"/> Cơ sở 1: Hòa Lạc, Thạch Thất, TP. Hà Nội</p>
            <p className="mb-2 flex items-start"><MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-slate-400"/> Cơ sở 2: Thuận Thành, tỉnh Bắc Ninh</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-base mb-4 uppercase border-b border-slate-700 pb-2">Liên hệ Tuyển sinh</h4>
            <p className="mb-3 flex items-center"><Phone className="w-4 h-4 mr-2 text-slate-400"/> Điện thoại: <strong className="text-white ml-1">{ACADEMY_INFO.hotline}</strong></p>
            <p className="mb-3 flex items-center"><Globe className="w-4 h-4 mr-2 text-slate-400"/> Email: tuyensinh@hvktcnan.bocongan.gov.vn</p>
            <p className="mb-3 flex items-center"><Globe className="w-4 h-4 mr-2 text-slate-400"/> Website: <a href="#" className="hover:text-yellow-400">{ACADEMY_INFO.website}</a></p>
          </div>
          <div>
            <h4 className="font-bold text-white text-base mb-4 uppercase border-b border-slate-700 pb-2">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-yellow-400 transition flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-[#cc0000]"/> Đề án tuyển sinh 2026</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-[#cc0000]"/> Cổng thông tin BGDĐT</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-[#cc0000]"/> Hướng dẫn nộp lệ phí</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* CHATBOT */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {showAI && (
          <div className="bg-white rounded-lg shadow-2xl w-80 md:w-96 h-[400px] mb-4 flex flex-col border border-slate-200 overflow-hidden">
            <div className="bg-[#003366] text-white p-3 flex justify-between items-center">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="font-bold text-sm">Hỗ trợ trực tuyến KTH</span>
              </div>
              <button onClick={() => setShowAI(false)} className="text-white/70 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="flex-1 p-4 bg-slate-50 overflow-y-auto text-sm">
              <div className="bg-white text-slate-700 p-3 rounded-lg shadow-sm max-w-[85%] border border-slate-200">
                Chào bạn! Mình là trợ lý AI. Mình có thể giải đáp các thông tin trong Đề án tuyển sinh 2026. Bạn cần hỏi gì?
              </div>
            </div>
            <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input type="text" placeholder="Nhập tin nhắn..." className="flex-1 p-2 bg-slate-100 rounded outline-none text-sm focus:ring-1 focus:ring-[#003366]" />
              <button className="bg-[#cc0000] text-white p-2 rounded hover:bg-red-700"><Send className="w-4 h-4"/></button>
            </div>
          </div>
        )}
        <button onClick={() => setShowAI(!showAI)} className="bg-[#003366] hover:bg-blue-900 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-105">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 3. TRANG CHỦ (GIAO DIỆN BÁO CHÍ PTIT)
// ==========================================
function PublicHome({ onApplyClick }) {
  const [activeMethodTab, setActiveMethodTab] = useState(METHODS[0].id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in">
      
      {/* CỘT TRÁI: NỘI DUNG BÀI VIẾT */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Home className="w-3.5 h-3.5" /> <ChevronRight className="w-3 h-3"/> <span>Tuyển sinh Đại học</span> <ChevronRight className="w-3 h-3"/> <span className="font-bold text-[#cc0000]">Thông báo Tuyển sinh hệ Dân sự 2026</span>
        </div>

        <article className="bg-white p-6 md:p-10 rounded shadow-sm border border-slate-200">
          <h1 className="text-2xl md:text-3xl font-black text-[#003366] leading-snug mb-4 uppercase">
            Thông báo Tuyển sinh Đại học ngoài ngành Công an (Hệ dân sự) năm 2026
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-8 bg-slate-50 p-3 border border-slate-100 rounded">
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400"/> Ngày đăng: 10/02/2026</span>
            <span className="flex items-center"><Eye className="w-4 h-4 mr-1 text-slate-400"/> Lượt xem: 15,240</span>
            <span className="flex items-center"><FileText className="w-4 h-4 mr-1 text-slate-400"/> QĐ số: .../QĐ-T06-P3</span>
          </div>

          <div className="text-slate-700 leading-relaxed space-y-6 text-sm md:text-base">
            <p className="font-medium text-justify">
              Học viện Kỹ thuật và Công nghệ an ninh (Mã trường: <strong>KTH</strong>) trân trọng thông báo phương thức tuyển sinh đại học hệ chính quy (Hệ Dân sự) năm 2026. 
              Đây là năm đầu tiên Học viện tuyển sinh hệ dân sự với <strong>100 chỉ tiêu</strong> cho 5 chuyên ngành mũi nhọn nhằm đáp ứng nhu cầu nhân lực an toàn không gian mạng và vi mạch bán dẫn quốc gia.
            </p>

            <h3 className="text-lg font-black text-[#003366] border-l-4 border-[#cc0000] pl-3 uppercase mt-10">
              1. Chỉ tiêu & Mã ngành đào tạo
            </h3>
            
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-[#003366] text-white">
                    <th className="border border-slate-300 p-3 text-center w-12 font-bold">STT</th>
                    <th className="border border-slate-300 p-3 text-center font-bold">Mã ngành</th>
                    <th className="border border-slate-300 p-3 text-left font-bold">Tên ngành / Chuyên ngành</th>
                    <th className="border border-slate-300 p-3 text-center font-bold">Chỉ tiêu</th>
                    <th className="border border-slate-300 p-3 text-left font-bold">Tổ hợp môn xét tuyển</th>
                  </tr>
                </thead>
                <tbody>
                  {MAJORS.map((m, idx) => (
                    <tr key={m.code} className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-3 text-center">{idx + 1}</td>
                      <td className="border border-slate-300 p-3 font-bold text-[#cc0000] text-center">{m.code}</td>
                      <td className="border border-slate-300 p-3 font-bold text-[#003366]">{m.name}</td>
                      <td className="border border-slate-300 p-3 text-center font-bold">{m.quota}</td>
                      <td className="border border-slate-300 p-3 text-slate-600 font-medium tracking-wide">{m.combos.join(', ')}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold">
                    <td colSpan="3" className="border border-slate-300 p-3 text-right uppercase">Tổng cộng:</td>
                    <td className="border border-slate-300 p-3 text-center text-[#cc0000] text-lg">100</td>
                    <td className="border border-slate-300 p-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-black text-[#003366] border-l-4 border-[#cc0000] pl-3 uppercase mt-10">
              2. Các phương thức tuyển sinh
            </h3>
            <p className="text-sm text-slate-500 italic">Nhấp vào từng thẻ phương thức bên dưới để xem điều kiện và cách tính điểm chi tiết.</p>

            <div className="bg-white border border-slate-300 rounded shadow-sm mt-4">
              <div className="flex flex-wrap border-b border-slate-300 bg-slate-50">
                {METHODS.map(method => (
                  <button 
                    key={method.id}
                    onClick={() => setActiveMethodTab(method.id)}
                    className={`px-4 py-3 text-sm font-bold transition-colors flex-1 text-center border-r border-slate-300 last:border-0
                      ${activeMethodTab === method.id ? 'bg-white text-[#cc0000] border-t-2 border-t-[#cc0000] -mt-[1px]' : 'text-slate-600 hover:bg-slate-200'}`}
                  >
                    Phương thức {method.id}
                  </button>
                ))}
              </div>
              <div className="p-6 md:p-8 min-h-[150px]">
                {METHODS.map(method => (
                  <div key={method.id} className={`${activeMethodTab === method.id ? 'block' : 'hidden'} animate-fade-in`}>
                    <h4 className="font-bold text-[#003366] mb-3 text-base">{method.name}</h4>
                    <p className="text-slate-700 mb-4">{method.desc}</p>
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded text-sm text-blue-900">
                      <strong className="block mb-1 text-[#003366]">Hồ sơ yêu cầu tải lên:</strong>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Bản chụp CCCD/CMND hợp lệ.</li>
                        <li>Bản chụp Học bạ THPT (Bản gốc hoặc sao y bản chính).</li>
                        <li>Các minh chứng liên quan (IELTS, SAT, Giấy chứng nhận ĐGNL...).</li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-lg font-black text-[#003366] border-l-4 border-[#cc0000] pl-3 uppercase mt-10">
              3. Đăng ký & Nhập học trực tuyến
            </h3>
            <p>
              Thí sinh thực hiện đăng ký nguyện vọng xét tuyển hoàn toàn trực tuyến qua Cổng thông tin của Học viện. 
              Mỗi thí sinh được đăng ký tối đa <strong>15 nguyện vọng</strong>. Hệ thống tự động xét từ cao xuống thấp theo Điều 15 Thông tư 06 của BGDĐT.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-200">
              <button onClick={onApplyClick} className="bg-[#cc0000] hover:bg-red-700 text-white font-bold py-4 px-8 rounded shadow-md transition flex justify-center items-center gap-2 group uppercase">
                <FileDigit className="w-5 h-5 group-hover:scale-110 transition-transform" /> Đăng ký xét tuyển ngay
              </button>
              <button className="bg-slate-100 border border-slate-300 text-[#003366] font-bold py-4 px-8 rounded hover:bg-slate-200 transition flex justify-center items-center gap-2">
                <Download className="w-5 h-5" /> Tải Đề án tuyển sinh
              </button>
            </div>
          </div>
        </article>
      </div>

      {/* CỘT PHẢI: SIDEBAR */}
      <div className="lg:col-span-1 space-y-6">
        
        <div className="bg-white border border-[#003366] shadow-sm">
          <div className="bg-[#003366] text-white font-bold p-3 uppercase text-sm flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-400" /> Kế hoạch tuyển sinh
          </div>
          <div className="p-4 space-y-4">
            <div className="border-l-2 border-[#003366] pl-3 relative">
              <div className="absolute w-2.5 h-2.5 bg-[#003366] rounded-full -left-[5.5px] top-1"></div>
              <div className="font-bold text-[#003366] text-sm">02/07/2026</div>
              <div className="text-xs text-slate-600 mt-1">Bắt đầu nhận hồ sơ trực tuyến.</div>
            </div>
            <div className="border-l-2 border-[#cc0000] pl-3 relative">
              <div className="absolute w-2.5 h-2.5 bg-[#cc0000] rounded-full -left-[5.5px] top-1 animate-pulse"></div>
              <div className="font-bold text-[#cc0000] text-sm">17h00 - 14/07/2026</div>
              <div className="text-xs text-slate-600 mt-1">Đóng cổng đăng ký nguyện vọng.</div>
            </div>
            <div className="border-l-2 border-slate-300 pl-3 relative">
              <div className="absolute w-2.5 h-2.5 bg-slate-300 rounded-full -left-[5.5px] top-1"></div>
              <div className="font-bold text-slate-600 text-sm">21/08/2026</div>
              <div className="text-xs text-slate-600 mt-1">Công bố kết quả & Xác nhận nhập học.</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm">
          <div className="bg-slate-100 text-[#003366] font-bold p-3 uppercase text-sm border-b border-slate-200 flex items-center">
            <Download className="w-5 h-5 mr-2" /> Biểu mẫu - Tài liệu
          </div>
          <div className="p-2">
            <a href="#" className="flex items-start p-2 hover:bg-slate-50 transition border-b border-slate-100 group">
              <FileText className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#003366] group-hover:text-[#cc0000] transition">Đề án tuyển sinh KTH 2026</div>
                <div className="text-[11px] text-slate-500">Định dạng PDF</div>
              </div>
            </a>
            <a href="#" className="flex items-start p-2 hover:bg-slate-50 transition border-b border-slate-100 group">
              <FileText className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#003366] group-hover:text-[#cc0000] transition">Mẫu 01: Phiếu đăng ký XT</div>
                <div className="text-[11px] text-slate-500">Định dạng Word (.docx)</div>
              </div>
            </a>
            <a href="#" className="flex items-start p-2 hover:bg-slate-50 transition group">
              <FileText className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#003366] group-hover:text-[#cc0000] transition">Bảng quy đổi điểm Ngoại ngữ</div>
                <div className="text-[11px] text-slate-500">Phụ lục áp dụng cho PT4</div>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm">
          <div className="bg-slate-100 text-[#003366] font-bold p-3 uppercase text-sm border-b border-slate-200 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" /> Kênh Hỗ trợ
          </div>
          <div className="p-4 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded text-[#cc0000] border border-red-100"><Phone className="w-5 h-5"/></div>
              <div><div className="text-[11px] text-slate-500 uppercase">Đường dây nóng</div><div className="font-black text-[#cc0000] text-base">{ACADEMY_INFO.hotline}</div></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded text-[#003366] border border-blue-100"><Globe className="w-5 h-5"/></div>
              <div><div className="text-[11px] text-slate-500 uppercase">Hỗ trợ trực tuyến</div><div className="font-bold text-[#003366]">Fanpage KTH Official</div></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 4. KHU VỰC THÍ SINH (ĐĂNG KÝ NGUYỆN VỌNG)
// ==========================================
function CandidatePortal({ user, setUser, wishes, setWishes, addToast, addAuditLog, isSystemOpen }) {
  const [showForm, setShowForm] = useState(false);
  const [newWish, setNewWish] = useState({ majorCode: MAJORS[0].code, methodId: 5, combo: MAJORS[0].combos[0], totalScore: '' });
  
  const myWishes = useMemo(() => {
    return wishes.filter(w => w.candidateId === user.id).sort((a, b) => a.priority - b.priority);
  }, [wishes, user.id]);

  const isSystemLocked = !isSystemOpen || myWishes.some(w => ['ADMITTED', 'REJECTED', 'CANCELED'].includes(w.status));
  const isAdmitted = myWishes.some(w => w.status === 'ADMITTED');

  const handlePayment = () => {
    setUser({ ...user, isPaid: true });
    addAuditLog('PAYMENT', `Thanh toán lệ phí cho ${myWishes.length} nguyện vọng.`);
    addToast("Thanh toán thành công!", "success");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      addAuditLog('UPLOAD', `Tải tệp: ${file.name}`);
      addToast(`Đã tải lên tệp minh chứng.`, "success");
    } else {
      addToast("Chỉ chấp nhận file PDF.", "error");
    }
  };

  const handleAddWish = () => {
    if (!user.isPaid && myWishes.length > 0) { addToast("Vui lòng thanh toán lệ phí trước khi thêm.", "error"); return; }
    if (myWishes.length >= 15) { addToast("Tối đa 15 nguyện vọng.", "error"); return; }
    if (!newWish.totalScore || newWish.totalScore <= 0 || newWish.totalScore > 30) { addToast("Điểm không hợp lệ.", "error"); return; }

    const wishEntry = {
      id: `W_${Date.now()}`, candidateId: user.id, majorCode: newWish.majorCode, methodId: newWish.methodId, combo: newWish.combo,
      priority: myWishes.length + 1, totalScore: parseFloat(newWish.totalScore), bonusScore: 0, status: 'PENDING'
    };
    setWishes([...wishes, wishEntry]);
    addAuditLog('ADD_WISH', `Thêm NV: ${wishEntry.majorCode}`);
    addToast("Lưu nguyện vọng thành công!", "success");
    setShowForm(false);
  };

  const deleteWish = (wishId) => {
    if (isSystemLocked) return;
    const wishToDelete = myWishes.find(w => w.id === wishId);
    let updatedWishes = wishes.filter(w => w.id !== wishId).map(w => {
      if (w.candidateId === user.id && w.priority > wishToDelete.priority) return { ...w, priority: w.priority - 1 };
      return w;
    });
    setWishes(updatedWishes);
    addAuditLog('DELETE_WISH', `Xóa NV ${wishToDelete.majorCode}`);
    addToast("Đã xóa nguyện vọng.", "info");
  };

  const movePriority = (wishId, direction) => {
    if (isSystemLocked) return;
    let currentWishes = [...myWishes];
    const idx = currentWishes.findIndex(w => w.id === wishId);
    if (idx < 0) return;

    if (direction === 'UP' && idx > 0) {
      let temp = currentWishes[idx].priority; currentWishes[idx].priority = currentWishes[idx-1].priority; currentWishes[idx-1].priority = temp;
    } else if (direction === 'DOWN' && idx < currentWishes.length - 1) {
      let temp = currentWishes[idx].priority; currentWishes[idx].priority = currentWishes[idx+1].priority; currentWishes[idx+1].priority = temp;
    } else return;

    const updatedIds = currentWishes.map(w => w.id);
    setWishes(prev => prev.map(w => updatedIds.includes(w.id) ? currentWishes.find(cw => cw.id === w.id) : w));
    addAuditLog('REORDER_WISH', `Đổi thứ tự ưu tiên.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Hồ sơ */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 shadow-sm border border-slate-200 rounded">
          <div className="flex flex-col items-center mb-6 pb-6 border-b">
            <Users className="w-16 h-16 text-slate-300 mb-3" />
            <h3 className="font-bold text-[#003366] text-lg">{user.name}</h3>
            <p className="text-sm text-slate-500 font-mono">{user.cccd}</p>
          </div>
          
          <div className="space-y-4 text-sm mb-6">
            <div className="flex justify-between items-center bg-slate-50 p-3 border rounded">
              <span>Khu vực ưu tiên:</span><span className="font-bold text-[#003366]">{user.region}</span>
            </div>
            
            <div className={`p-4 border rounded ${user.isPaid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Lệ phí (50k/NV):</span>
                <span className={`font-bold ${user.isPaid ? 'text-green-600' : 'text-[#cc0000]'}`}>{(myWishes.length * 50000).toLocaleString()}đ</span>
              </div>
              {!user.isPaid && myWishes.length > 0 && (
                <button onClick={handlePayment} className="w-full bg-[#cc0000] text-white py-2 rounded text-xs font-bold hover:bg-red-700">Thanh toán trực tuyến</button>
              )}
              {user.isPaid && <div className="text-green-600 font-bold text-xs"><CheckCircle className="w-4 h-4 inline mr-1"/>Đã hoàn thành</div>}
            </div>
          </div>

          <div className="border-t pt-6">
            <label className="block text-sm font-bold mb-2 text-[#003366]">Minh chứng (PDF)</label>
            <div className="border-2 border-dashed border-slate-300 p-4 text-center relative cursor-pointer hover:bg-slate-50 rounded">
              <input type="file" accept=".pdf" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <UploadCloud className="w-6 h-6 mx-auto mb-1 text-slate-400" />
              <span className="text-[11px] text-slate-500">Tải lên Học bạ / IELTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Quản lý NV */}
      <div className="lg:col-span-3 space-y-6">
        {isSystemLocked && !isSystemOpen && (
          <div className={`p-6 shadow-sm border rounded flex flex-col md:flex-row items-center justify-between gap-4 ${isAdmitted ? 'bg-green-50 border-green-300' : 'bg-slate-50 border-slate-300'}`}>
            <div>
              <h4 className={`font-black text-xl mb-1 uppercase ${isAdmitted ? 'text-green-700' : 'text-slate-700'}`}>
                {isAdmitted ? 'CHÚC MỪNG TRÚNG TUYỂN!' : 'KẾT QUẢ: KHÔNG TRÚNG TUYỂN'}
              </h4>
              <p className="text-sm">
                {isAdmitted ? `Bạn đỗ NV${myWishes.find(w=>w.status==='ADMITTED')?.priority}. Vui lòng xác nhận nhập học để giữ chỗ.` : 'Bạn chưa đủ điểm chuẩn trong đợt này. Theo dõi đợt bổ sung trên web.'}
              </p>
            </div>
            {isAdmitted && (
              <button onClick={() => {setUser({...user, isConfirmed: true}); addToast("Đã xác nhận thành công!", "success");}} className={`text-white font-bold px-6 py-3 rounded shadow w-full md:w-auto ${user.isConfirmed ? 'bg-green-800' : 'bg-green-600 hover:bg-green-700'}`}>
                {user.isConfirmed ? 'ĐÃ XÁC NHẬN' : 'Xác nhận Nhập học'}
              </button>
            )}
          </div>
        )}

        <div className="bg-white p-6 md:p-8 shadow-sm border border-slate-200 rounded">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
            <h3 className="text-xl font-bold text-[#003366] uppercase">Danh sách Nguyện vọng</h3>
            <span className="text-xs bg-slate-100 text-[#003366] px-3 py-1 rounded border border-slate-300 font-bold">{myWishes.length} / 15 NV</span>
          </div>

          <div className="space-y-3 mb-6">
            {myWishes.length === 0 && <div className="text-center p-8 bg-slate-50 text-slate-400 text-sm border-2 border-dashed rounded">Chưa có nguyện vọng. Bấm thêm mới.</div>}
            {myWishes.map((wish, index) => (
              <div key={wish.id} className={`flex flex-col md:flex-row justify-between p-4 border shadow-sm rounded items-center ${wish.status === 'ADMITTED' ? 'bg-green-50 border-green-300' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-4 w-full">
                  <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center font-bold ${wish.status === 'ADMITTED' ? 'bg-green-600' : 'bg-[#003366]'}`}>{wish.priority}</div>
                  <div>
                    <div className="font-bold text-[#003366]">{MAJORS.find(m => m.code === wish.majorCode)?.name}</div>
                    <div className="text-xs text-slate-600 mt-1">Mã: <strong>{wish.majorCode}</strong> | PT{wish.methodId} | Tổ hợp: {wish.combo} | Điểm xét: <strong className="text-[#cc0000]">{wish.totalScore}</strong></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  <span className={`text-xs font-bold uppercase ${wish.status==='ADMITTED' ? 'text-green-600' : wish.status==='REJECTED' ? 'text-red-500' : 'text-slate-500'}`}>
                    {wish.status === 'PENDING' ? 'Chờ xét' : wish.status === 'ADMITTED' ? 'Trúng tuyển' : wish.status === 'CANCELED' ? 'Bị hủy' : 'Trượt'}
                  </span>
                  {!isSystemLocked && (
                    <div className="flex bg-slate-100 p-1 rounded border border-slate-200">
                      <button onClick={() => movePriority(wish.id, 'UP')} className="p-1 text-slate-500 hover:text-[#003366]"><ArrowUp className="w-4 h-4"/></button>
                      <button onClick={() => movePriority(wish.id, 'DOWN')} className="p-1 text-slate-500 hover:text-[#003366]"><ArrowDown className="w-4 h-4"/></button>
                      <button onClick={() => deleteWish(wish.id)} className="p-1 text-red-500 hover:text-red-700 ml-1"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isSystemLocked && (
            showForm ? (
              <div className="border border-blue-100 bg-blue-50/50 p-6 rounded">
                <h4 className="font-bold text-[#003366] text-sm mb-4 uppercase">Thêm Nguyện vọng Xét tuyển</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <select className="p-2 border border-slate-300 rounded" value={newWish.majorCode} onChange={e => {const m = MAJORS.find(x => x.code === e.target.value); setNewWish({...newWish, majorCode: m.code, combo: m.combos[0]})}}>
                    {MAJORS.map(m => <option key={m.code} value={m.code}>{m.code} - {m.name}</option>)}
                  </select>
                  <select className="p-2 border border-slate-300 rounded" value={newWish.methodId} onChange={e => setNewWish({...newWish, methodId: Number(e.target.value)})}>
                    {METHODS.map(m => <option key={m.id} value={m.id}>PT {m.id} - {m.name}</option>)}
                  </select>
                  <select className="p-2 border border-slate-300 rounded" value={newWish.combo} onChange={e => setNewWish({...newWish, combo: e.target.value})}>
                    {MAJORS.find(m => m.code === newWish.majorCode)?.combos.map(c => <option key={c} value={c}>Tổ hợp {c}</option>)}
                  </select>
                  <input type="number" placeholder="Nhập điểm tổng (VD: 27.5)" className="p-2 border border-slate-300 rounded font-bold text-[#cc0000]" value={newWish.totalScore} onChange={e => setNewWish({...newWish, totalScore: e.target.value})} />
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded hover:bg-slate-50">Hủy bỏ</button>
                  <button onClick={handleAddWish} className="px-5 py-2 bg-[#003366] text-white text-sm font-bold rounded hover:bg-blue-900 shadow-sm">Lưu thông tin</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-slate-300 text-slate-500 py-4 font-bold hover:border-[#003366] hover:text-[#003366] transition flex justify-center items-center rounded bg-slate-50">
                <Plus className="w-5 h-5 mr-2" /> Đăng ký thêm Nguyện vọng
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. ADMIN DASHBOARD (THUẬT TOÁN XÉT TUYỂN)
// ==========================================
function AdminDashboard({ wishes, setWishes, candidates, auditLogs, setAuditLogs, addToast, adminUser }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const runAdmissionAlgorithm = () => {
    setIsProcessing(true);
    addToast("Hệ thống đang chạy thuật toán lọc ảo BGDĐT...", "info");
    
    setTimeout(() => {
      let newWishes = JSON.parse(JSON.stringify(wishes));
      newWishes.forEach(w => w.status = 'PENDING');

      MAJORS.forEach(major => {
        let majorWishes = newWishes.filter(w => w.majorCode === major.code && w.status === 'PENDING');
        // Sort: Điểm cao -> Điểm ưu tiên thấp (Điểm thi cao) -> NV ưu tiên cao (số 1 > số 2)
        majorWishes.sort((a, b) => b.totalScore - a.totalScore || a.bonusScore - b.bonusScore || a.priority - b.priority);
        const admittedWishes = majorWishes.slice(0, major.quota);
        
        admittedWishes.forEach(aw => {
          newWishes.find(w => w.id === aw.id).status = 'ADMITTED';
          newWishes.forEach(w => { if (w.candidateId === aw.candidateId && w.priority > aw.priority && w.status === 'PENDING') w.status = 'CANCELED'; });
        });
      });

      newWishes.forEach(w => { if (w.status === 'PENDING') w.status = 'REJECTED'; });
      setWishes(newWishes);
      setAuditLogs(prev => [{ id: Date.now(), time: new Date().toISOString(), actor: adminUser.id, action: 'RUN_ALGORITHM', detail: 'Xét tuyển tự động hoàn tất.' }, ...prev]);
      setIsProcessing(false);
      addToast("Công bố kết quả thành công!", "success");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border flex flex-col md:flex-row justify-between items-center shadow-sm rounded gap-4">
        <div>
          <h2 className="text-xl font-black text-[#003366] uppercase">Bảng điều khiển Quản trị viên</h2>
          <p className="text-sm text-green-600 font-bold flex items-center mt-1"><span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> DB Online (Supabase)</p>
        </div>
        <button onClick={runAdmissionAlgorithm} disabled={isProcessing} className={`font-bold px-6 py-3 rounded text-white flex items-center w-full md:w-auto justify-center ${isProcessing ? 'bg-slate-400' : 'bg-[#cc0000] hover:bg-red-800'}`}>
          {isProcessing ? 'Đang chạy...' : <><Settings className="w-5 h-5 mr-2" /> Chạy Xét tuyển Lọc ảo</>}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[ { l: 'Tổng Chỉ tiêu', v: 100 }, { l: 'Tổng Thí sinh', v: candidates.length }, { l: 'Số NV đăng ký', v: wishes.length }, { l: 'Trúng tuyển', v: wishes.filter(w=>w.status==='ADMITTED').length }].map((k, i) => (
          <div key={i} className="bg-white p-6 border text-center shadow-sm rounded">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{k.l}</p>
            <h4 className="text-3xl font-black text-[#003366] mt-2">{k.v}</h4>
          </div>
        ))}
      </div>

      <div className="bg-white border shadow-sm rounded overflow-hidden">
        <div className="p-4 border-b bg-slate-50 font-bold text-[#003366] uppercase text-sm">Dữ liệu SQL (Postgres View)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#003366] text-white"><tr><th className="p-3">Thí sinh (ID)</th><th className="p-3">Ngành (NV)</th><th className="p-3">Điểm</th><th className="p-3">Trạng thái</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {wishes.map(w => (
                <tr key={w.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold">{w.candidateId}</td>
                  <td className="p-3 font-bold text-[#cc0000]">{w.majorCode} <span className="text-xs font-normal text-slate-500">(NV{w.priority})</span></td>
                  <td className="p-3">{w.totalScore}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${w.status === 'ADMITTED' ? 'bg-green-100 text-green-700' : w.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{w.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}