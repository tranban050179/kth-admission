"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, BookOpen, Users, Settings, MessageCircle, CheckCircle, 
  Plus, Trash2, LogIn, LogOut, FileText, LayoutDashboard, 
  ShieldCheck, ArrowUp, ArrowDown, Search, X, Bell, Clock, 
  AlertTriangle, Check, UploadCloud, CreditCard, Send, MapPin, 
  Globe, Phone, FileDigit, Download, ChevronRight, Calendar, Eye, 
  Menu, Lock, User, KeyRound, CheckSquare, FileCheck
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
  { id: 'C001', name: 'Nguyễn Văn A', cccd: '001099001111', password: 'password', region: 'KV1', target: 'UT1', isPaid: false, isConfirmed: false, phone: '0901234567', email: 'nguyenvana@gmail.com' },
  { id: 'C002', name: 'Trần Thị B', cccd: '001099002222', password: 'password', region: 'KV2', target: 'NONE', isPaid: true, isConfirmed: false, phone: '0987654321', email: 'tranthib@gmail.com' },
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
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'login', 'portal', 'admin'
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

  const handleLogin = (cccd, password, role) => {
    if (role === 'ADMIN' && cccd === 'admin' && password === 'admin') {
      setCurrentUser({ id: 'A001', name: 'Ban Tuyển sinh', role: 'ADMIN' });
      setActiveTab('admin');
      addToast('Đăng nhập Quản trị thành công!', 'success');
      return;
    }

    const user = candidates.find(c => c.cccd === cccd && c.password === password);
    if (user) {
      setCurrentUser(user);
      setActiveTab('portal');
      addToast('Đăng nhập thành công!', 'success');
    } else {
      addToast('CCCD hoặc mật khẩu không chính xác!', 'error');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    setMobileMenuOpen(false);
  };

  const isSystemOpen = CURRENT_DATE >= DEADLINE_START && CURRENT_DATE <= DEADLINE_END;

  // Nếu đang ở trang portal hoặc admin, render layout riêng (App-like Layout)
  if (activeTab === 'portal' || activeTab === 'admin') {
    return (
      <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-800 flex flex-col">
        {/* Toasts */}
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className={`flex items-center p-4 rounded-lg shadow-lg border text-sm font-bold transition-all pointer-events-auto
              ${toast.type === 'success' ? 'bg-white border-l-4 border-l-green-500 text-slate-700' : 
                toast.type === 'error' ? 'bg-white border-l-4 border-l-red-500 text-slate-700' : 
                'bg-white border-l-4 border-l-blue-500 text-slate-700'}`}>
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 mr-3 text-green-500" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 mr-3 text-red-500" />}
              {toast.type === 'info' && <Bell className="w-5 h-5 mr-3 text-blue-500" />}
              {toast.message}
            </div>
          ))}
        </div>

        {/* Dashboard Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
             <ShieldCheck className="h-8 w-8 text-[#003366]" />
             <span className="font-black text-lg text-[#003366] uppercase hidden sm:block">KTH Admissions</span>
          </div>
          <div className="flex items-center gap-4">
             {isSystemOpen && <div className="hidden md:flex items-center text-xs font-bold bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full"><Clock className="w-4 h-4 mr-1"/> Đang mở đăng ký</div>}
             <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full py-1 pr-4 pl-1">
               <div className="w-8 h-8 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold">{currentUser?.name.charAt(0)}</div>
               <div className="flex flex-col text-xs">
                 <span className="font-bold text-[#003366] leading-none">{currentUser?.name}</span>
                 <span className="text-slate-500 mt-0.5">{currentUser?.role === 'ADMIN' ? 'Quản trị viên' : `TS: ${currentUser?.cccd}`}</span>
               </div>
             </div>
             <button onClick={logout} className="text-slate-400 hover:text-red-500 transition p-2" title="Đăng xuất"><LogOut className="w-5 h-5"/></button>
          </div>
        </header>

        {activeTab === 'portal' && <CandidatePortal user={currentUser} setUser={(u) => {setCurrentUser(u); setCandidates(candidates.map(c => c.id === u.id ? u : c));}} wishes={wishes} setWishes={setWishes} addToast={addToast} addAuditLog={(action, detail) => setAuditLogs(prev => [{id: Date.now(), time: new Date().toISOString(), actor: currentUser.id, action, detail}, ...prev])} isSystemOpen={isSystemOpen} />}
        {activeTab === 'admin' && <AdminDashboard wishes={wishes} setWishes={setWishes} candidates={candidates} auditLogs={auditLogs} setAuditLogs={setAuditLogs} addToast={addToast} adminUser={currentUser} />}
      </div>
    );
  }

  // ==================== LAYOUT TRANG CHỦ & ĐĂNG NHẬP (PUBLIC) ====================
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

      {/* THANH TRÊN CÙNG */}
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
          
          <div className="hidden md:flex items-center space-x-3">
            <button onClick={() => setActiveTab('login')} className="text-sm font-bold text-[#003366] border border-[#003366] hover:bg-[#003366] hover:text-white px-5 py-2.5 rounded transition-colors flex items-center">
              <LogIn className="w-4 h-4 mr-2" /> Đăng nhập / Đăng ký
            </button>
          </div>

          <div className="md:hidden">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#003366] p-2">
               <Menu className="w-7 h-7" />
             </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 flex flex-col gap-3 shadow-inner">
            <button onClick={() => {setActiveTab('login'); setMobileMenuOpen(false);}} className="w-full text-center text-sm font-bold text-[#003366] border border-[#003366] py-3 rounded">Đăng nhập Thí sinh</button>
          </div>
        )}
      </header>

      {/* NỘI DUNG CHÍNH (PUBLIC ROUTING) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && <PublicHome onApplyClick={() => setActiveTab('login')} />}
        {activeTab === 'login' && <LoginPage onLogin={handleLogin} onCancel={() => setActiveTab('home')} />}
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
          </div>
          <div>
            <h4 className="font-bold text-white text-base mb-4 uppercase border-b border-slate-700 pb-2">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-yellow-400 transition flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-[#cc0000]"/> Đề án tuyển sinh 2026</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-[#cc0000]"/> Cổng thông tin BGDĐT</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// TRANG ĐĂNG NHẬP (LOGIN & REGISTER)
// ==========================================
function LoginPage({ onLogin, onCancel }) {
  const [isLogin, setIsLogin] = useState(true);
  const [cccd, setCccd] = useState('001099001111');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(cccd, password, 'CANDIDATE'); // Để demo, mặc định role CANDIDATE, admin dùng id 'admin' pw 'admin'
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col md:flex-row animate-fade-in">
      {/* Panel hướng dẫn */}
      <div className="md:w-5/12 bg-[#003366] text-white p-8 flex flex-col justify-between">
        <div>
          <ShieldCheck className="w-12 h-12 text-[#cc0000] mb-6" />
          <h2 className="text-2xl font-black uppercase mb-4 leading-tight">Cổng Xét tuyển<br/>Trực tuyến 2026</h2>
          <p className="text-blue-100 text-sm mb-6 leading-relaxed">
            Chào mừng bạn đến với hệ thống tuyển sinh của KTH. Vui lòng đăng nhập bằng Số CCCD đã đăng ký để quản lý hồ sơ và nguyện vọng.
          </p>
          <ul className="space-y-3 text-sm text-blue-200">
            <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-yellow-400 flex-shrink-0"/> Đăng ký tối đa 15 nguyện vọng.</li>
            <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-yellow-400 flex-shrink-0"/> Nộp lệ phí trực tuyến an toàn.</li>
            <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-yellow-400 flex-shrink-0"/> Xem kết quả và xác nhận nhập học.</li>
          </ul>
        </div>
        <div className="mt-8 text-xs text-blue-300 border-t border-blue-800 pt-4">
          Gặp khó khăn? Gọi ngay Hotline: <strong className="text-white">{ACADEMY_INFO.hotline}</strong>
        </div>
      </div>

      {/* Panel Form */}
      <div className="md:w-7/12 p-8 md:p-12 relative">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-6 h-6"/></button>
        
        <h3 className="text-2xl font-bold text-[#003366] mb-2">{isLogin ? 'Đăng nhập Hệ thống' : 'Đăng ký Tài khoản'}</h3>
        <p className="text-sm text-slate-500 mb-8">{isLogin ? 'Nhập CCCD và mật khẩu để tiếp tục.' : 'Tạo tài khoản mới bằng số Thẻ Căn cước công dân của bạn.'}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Số Thẻ CCCD</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-400" /></div>
              <input type="text" value={cccd} onChange={e => setCccd(e.target.value)} required placeholder="Nhập 12 số CCCD" className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Nhập mật khẩu" className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition" />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-600 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-slate-300 text-[#003366] focus:ring-[#003366]" /> Ghi nhớ đăng nhập
              </label>
              <a href="#" className="font-bold text-[#cc0000] hover:underline">Quên mật khẩu?</a>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Xác nhận mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><KeyRound className="h-5 w-5 text-slate-400" /></div>
                <input type="password" placeholder="Nhập lại mật khẩu" className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition" />
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-[#cc0000] text-white font-bold py-3.5 rounded-lg shadow-md hover:bg-red-700 transition uppercase tracking-wide mt-4">
            {isLogin ? 'Đăng nhập' : 'Đăng ký ngay'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600 border-t border-slate-100 pt-6">
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#003366] hover:underline">
            {isLogin ? "Đăng ký tại đây" : "Đăng nhập ngay"}
          </button>
        </div>
        
        {/* Helper Note */}
        <div className="mt-6 bg-yellow-50 p-3 rounded text-xs text-yellow-800 border border-yellow-200">
          <strong>Demo Tài khoản:</strong><br/>
          Thí sinh: CCCD: <code>001099001111</code> | Pass: <code>password</code><br/>
          Admin: ID: <code>admin</code> | Pass: <code>admin</code>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TRANG CHỦ (GIAO DIỆN BÁO CHÍ PTIT)
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
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. KHU VỰC THÍ SINH (DASHBOARD CHUẨN PTIT)
// ==========================================
function CandidatePortal({ user, setUser, wishes, setWishes, addToast, addAuditLog, isSystemOpen }) {
  const [activeMenu, setActiveMenu] = useState('wishes'); // 'profile', 'records', 'wishes', 'payment', 'results'
  const [showForm, setShowForm] = useState(false);
  const [newWish, setNewWish] = useState({ majorCode: MAJORS[0].code, methodId: 5, combo: MAJORS[0].combos[0], totalScore: '' });
  
  const myWishes = useMemo(() => {
    return wishes.filter(w => w.candidateId === user.id).sort((a, b) => a.priority - b.priority);
  }, [wishes, user.id]);

  const isSystemLocked = !isSystemOpen || myWishes.some(w => ['ADMITTED', 'REJECTED', 'CANCELED'].includes(w.status));
  const isAdmitted = myWishes.some(w => w.status === 'ADMITTED');

  // Logic Handlers
  const handlePayment = () => {
    setUser({ ...user, isPaid: true });
    addAuditLog('PAYMENT', `Thanh toán lệ phí cho ${myWishes.length} nguyện vọng.`);
    addToast("Thanh toán thành công!", "success");
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

  const MENU_ITEMS = [
    { id: 'profile', icon: User, label: 'Thông tin cá nhân' },
    { id: 'records', icon: BookOpen, label: 'Hồ sơ học tập' },
    { id: 'wishes', icon: FileCheck, label: 'Đăng ký Nguyện vọng' },
    { id: 'payment', icon: CreditCard, label: 'Thanh toán lệ phí' },
    { id: 'results', icon: CheckSquare, label: 'Kết quả xét tuyển' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full pt-6">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden sticky top-24">
          <div className="p-4 bg-[#003366] text-white">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Cổng Thí sinh</h3>
            <p className="text-xs text-blue-200">Mã TS: {user.id}</p>
          </div>
          <nav className="flex flex-col py-2">
            {MENU_ITEMS.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`flex items-center px-5 py-3 text-sm font-medium transition-colors text-left border-l-4
                  ${activeMenu === item.id 
                    ? 'border-[#cc0000] bg-red-50 text-[#cc0000] font-bold' 
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#003366]'}`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${activeMenu === item.id ? 'text-[#cc0000]' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 pb-12">
        {/* TAB 1: THÔNG TIN CÁ NHÂN */}
        {activeMenu === 'profile' && (
          <div className="bg-white rounded shadow-sm border border-slate-200 p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-[#003366] mb-6 border-b border-slate-200 pb-3">Thông tin Lý lịch & Liên hệ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Họ và tên</label><input type="text" disabled value={user.name} className="w-full p-2.5 border rounded bg-slate-50 text-slate-700 font-bold" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Số Thẻ CCCD</label><input type="text" disabled value={user.cccd} className="w-full p-2.5 border rounded bg-slate-50 text-slate-700 font-bold" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Số điện thoại</label><input type="text" defaultValue={user.phone} className="w-full p-2.5 border rounded focus:border-[#003366] outline-none" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Email liên hệ</label><input type="email" defaultValue={user.email} className="w-full p-2.5 border rounded focus:border-[#003366] outline-none" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Khu vực ưu tiên</label><input type="text" disabled value={user.region} className="w-full p-2.5 border rounded bg-slate-50 text-slate-700 font-bold" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Đối tượng ưu tiên</label><input type="text" disabled value={user.target} className="w-full p-2.5 border rounded bg-slate-50 text-slate-700 font-bold" /></div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button className="bg-[#003366] text-white font-bold px-6 py-2.5 rounded shadow-sm hover:bg-blue-900 transition">Cập nhật thông tin</button>
            </div>
          </div>
        )}

        {/* TAB 2: HỒ SƠ HỌC TẬP (MINH CHỨNG) */}
        {activeMenu === 'records' && (
          <div className="bg-white rounded shadow-sm border border-slate-200 p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-[#003366] mb-6 border-b border-slate-200 pb-3">Hồ sơ Học tập & Minh chứng</h3>
            <div className="bg-blue-50 p-4 rounded border border-blue-100 text-sm text-blue-800 mb-6">
              Tải lên bản scan rõ nét (định dạng PDF) các loại giấy tờ để làm minh chứng xét tuyển. Dung lượng tối đa 5MB/file.
            </div>
            <div className="space-y-6">
              {['Học bạ THPT (Lớp 10,11,12)', 'Chứng chỉ Ngoại ngữ (IELTS/TOEFL)', 'Giấy chứng nhận Điểm ĐGNL/ĐGTD', 'Minh chứng đối tượng ưu tiên'].map((doc, idx) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-200 rounded">
                  <div className="mb-3 md:mb-0">
                    <h4 className="font-bold text-slate-700">{doc}</h4>
                    <p className="text-xs text-slate-500 mt-1">Chưa cập nhật tệp tin.</p>
                  </div>
                  <div className="relative overflow-hidden inline-block">
                    <button className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold py-2 px-4 rounded text-sm flex items-center transition cursor-pointer">
                      <UploadCloud className="w-4 h-4 mr-2" /> Chọn File
                    </button>
                    <input type="file" accept=".pdf" className="absolute left-0 top-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => {
                      if(e.target.files[0]) { addToast(`Đã tải lên: ${e.target.files[0].name}`, 'success'); }
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ĐĂNG KÝ NGUYỆN VỌNG */}
        {activeMenu === 'wishes' && (
          <div className="bg-white rounded shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b border-slate-200 pb-4 gap-4">
              <h3 className="text-xl font-bold text-[#003366] uppercase">Đăng ký Nguyện vọng</h3>
              <span className="text-xs bg-[#003366] text-white px-3 py-1.5 rounded font-bold self-start">Đã dùng: {myWishes.length} / 15 NV</span>
            </div>

            <div className="space-y-3 mb-8">
              {myWishes.length === 0 && <div className="text-center p-8 bg-slate-50 text-slate-400 text-sm border-2 border-dashed rounded">Chưa có nguyện vọng. Bấm thêm mới bên dưới.</div>}
              {myWishes.map((wish, index) => (
                <div key={wish.id} className={`flex flex-col md:flex-row justify-between p-4 border shadow-sm rounded items-center ${wish.status === 'ADMITTED' ? 'bg-green-50 border-green-300' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-4 w-full">
                    <div className={`w-8 h-8 text-white rounded-full flex flex-shrink-0 items-center justify-center font-bold ${wish.status === 'ADMITTED' ? 'bg-green-600' : 'bg-[#003366]'}`}>{wish.priority}</div>
                    <div>
                      <div className="font-bold text-[#003366] text-base leading-tight">{MAJORS.find(m => m.code === wish.majorCode)?.name}</div>
                      <div className="text-xs text-slate-600 mt-1.5 flex flex-wrap gap-2 items-center">
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium border">Mã: {wish.majorCode}</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium border">PT{wish.methodId}</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium border">Tổ hợp {wish.combo}</span>
                        <span className="text-[#cc0000] font-bold">Điểm xét: {wish.totalScore}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
                    <span className={`text-xs font-bold uppercase ${wish.status==='ADMITTED' ? 'text-green-600' : wish.status==='REJECTED' ? 'text-red-500' : 'text-slate-500'}`}>
                      {wish.status === 'PENDING' ? 'Chờ duyệt' : wish.status === 'ADMITTED' ? 'Trúng tuyển' : wish.status === 'CANCELED' ? 'Bị hủy' : 'Trượt'}
                    </span>
                    {!isSystemLocked && (
                      <div className="flex bg-slate-50 p-1 rounded border border-slate-200">
                        <button disabled={index===0} onClick={() => movePriority(wish.id, 'UP')} className="p-1.5 text-slate-500 hover:text-[#003366] disabled:opacity-30"><ArrowUp className="w-4 h-4"/></button>
                        <button disabled={index===myWishes.length-1} onClick={() => movePriority(wish.id, 'DOWN')} className="p-1.5 text-slate-500 hover:text-[#003366] disabled:opacity-30"><ArrowDown className="w-4 h-4"/></button>
                        <div className="w-px bg-slate-200 mx-1"></div>
                        <button onClick={() => deleteWish(wish.id)} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!isSystemLocked && (
              showForm ? (
                <div className="border border-blue-200 bg-blue-50/50 p-6 rounded shadow-inner">
                  <h4 className="font-bold text-[#003366] text-sm mb-4 uppercase">Đăng ký NV Mới</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 text-sm">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Chọn Ngành đào tạo</label>
                      <select className="p-2.5 border border-slate-300 rounded w-full bg-white font-medium" value={newWish.majorCode} onChange={e => {const m = MAJORS.find(x => x.code === e.target.value); setNewWish({...newWish, majorCode: m.code, combo: m.combos[0]})}}>
                        {MAJORS.map(m => <option key={m.code} value={m.code}>{m.code} - {m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Phương thức xét tuyển</label>
                      <select className="p-2.5 border border-slate-300 rounded w-full bg-white" value={newWish.methodId} onChange={e => setNewWish({...newWish, methodId: Number(e.target.value)})}>
                        {METHODS.map(m => <option key={m.id} value={m.id}>PT {m.id} - {m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Tổ hợp môn / Điểm quy đổi</label>
                      <div className="flex gap-2">
                        <select className="p-2.5 border border-slate-300 rounded w-1/2 bg-white" value={newWish.combo} onChange={e => setNewWish({...newWish, combo: e.target.value})}>
                          {MAJORS.find(m => m.code === newWish.majorCode)?.combos.map(c => <option key={c} value={c}>Tổ hợp {c}</option>)}
                        </select>
                        <input type="number" placeholder="Nhập điểm..." className="p-2.5 border border-slate-300 rounded w-1/2 font-bold text-[#cc0000]" value={newWish.totalScore} onChange={e => setNewWish({...newWish, totalScore: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 border-t border-blue-200 pt-4 mt-2">
                    <button onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-600 text-sm font-bold rounded hover:bg-slate-50">Hủy</button>
                    <button onClick={handleAddWish} className="px-5 py-2.5 bg-[#003366] text-white text-sm font-bold rounded hover:bg-blue-900 shadow-sm flex items-center"><Check className="w-4 h-4 mr-2"/> Xác nhận lưu</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-slate-300 text-[#003366] py-5 font-bold hover:border-[#003366] hover:bg-blue-50 transition flex justify-center items-center rounded bg-slate-50/50">
                  <Plus className="w-5 h-5 mr-2" /> Thêm Nguyện vọng
                </button>
              )
            )}
          </div>
        )}

        {/* TAB 4: THANH TOÁN LỆ PHÍ */}
        {activeMenu === 'payment' && (
          <div className="bg-white rounded shadow-sm border border-slate-200 p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-[#003366] mb-6 border-b border-slate-200 pb-3">Thanh toán Lệ phí Xét tuyển</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-4">Chi tiết Biên lai</h4>
                <div className="space-y-3 text-sm mb-6 border-b border-slate-200 pb-6">
                  <div className="flex justify-between"><span>Số thẻ CCCD:</span><span className="font-bold">{user.cccd}</span></div>
                  <div className="flex justify-between"><span>Họ và tên:</span><span className="font-bold uppercase">{user.name}</span></div>
                  <div className="flex justify-between"><span>Số lượng NV đã ĐK:</span><span className="font-bold">{myWishes.length} nguyện vọng</span></div>
                  <div className="flex justify-between"><span>Đơn giá lệ phí:</span><span>50,000 VNĐ / 1 NV</span></div>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-slate-800">TỔNG TIỀN:</span>
                  <span className="font-black text-[#cc0000]">{(myWishes.length * 50000).toLocaleString()} VNĐ</span>
                </div>
                
                <div className="mt-8">
                  {user.isPaid ? (
                    <div className="bg-green-100 text-green-800 p-4 rounded border border-green-200 text-center font-bold flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2" /> Đã Hoàn Tất Thanh Toán
                    </div>
                  ) : (
                    <button onClick={handlePayment} disabled={myWishes.length===0} className="w-full bg-[#cc0000] text-white py-3 rounded font-bold shadow-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                      Xác nhận Đã Chuyển khoản
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 border-2 border-dashed border-blue-200 rounded bg-blue-50/30">
                <h4 className="font-bold text-[#003366] mb-4 text-center">Quét mã QR để Thanh toán</h4>
                <div className="w-48 h-48 bg-white mx-auto border border-slate-200 shadow-sm flex items-center justify-center mb-6">
                   <div className="text-center text-slate-400 text-xs">
                     [Hình ảnh Mã QR VNPAY]
                     <p className="mt-2 text-[10px]">Tự động điền số tiền và nội dung</p>
                   </div>
                </div>
                <div className="text-sm space-y-2 text-slate-700 text-center">
                  <p>Ngân hàng: <strong>BIDV</strong> (CN Hà Nội)</p>
                  <p>Số tài khoản: <strong>1234567890</strong></p>
                  <p>Chủ tài khoản: <strong>HOC VIEN KY THUAT VA CN AN NINH</strong></p>
                  <p>Nội dung: <strong className="text-[#cc0000]">{user.cccd} NOP LE PHI XT</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: KẾT QUẢ XÉT TUYỂN */}
        {activeMenu === 'results' && (
          <div className="bg-white rounded shadow-sm border border-slate-200 p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-[#003366] mb-6 border-b border-slate-200 pb-3">Kết quả Xét tuyển Đại học 2026</h3>
            
            {isSystemOpen ? (
              <div className="text-center p-12 bg-slate-50 rounded border border-slate-200">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="font-bold text-slate-700 text-lg">Hệ thống đang trong thời gian mở đăng ký</h4>
                <p className="text-sm text-slate-500 mt-2">Kết quả chính thức sẽ được công bố sau ngày 21/08/2026 theo quy chế của BGDĐT. Vui lòng quay lại sau.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-8 border rounded flex flex-col md:flex-row items-center justify-between gap-6 ${isAdmitted ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-200'}`}>
                  <div>
                    <h4 className={`font-black text-2xl mb-2 uppercase ${isAdmitted ? 'text-green-700' : 'text-red-700'}`}>
                      {isAdmitted ? 'CHÚC MỪNG BẠN ĐÃ TRÚNG TUYỂN!' : 'KẾT QUẢ: KHÔNG TRÚNG TUYỂN'}
                    </h4>
                    <p className="text-base text-slate-700">
                      {isAdmitted 
                        ? `Bạn đã xuất sắc trúng tuyển vào nguyện vọng số ${myWishes.find(w=>w.status==='ADMITTED')?.priority}.` 
                        : 'Điểm xét của bạn chưa đủ để trúng tuyển vào các nguyện vọng đã đăng ký trong đợt 1.'}
                    </p>
                  </div>
                </div>

                {isAdmitted && (
                  <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
                    <h4 className="font-bold text-[#003366] border-b pb-2 mb-4">Thông tin Trúng tuyển</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-8">
                      <div><span className="text-slate-500 w-32 inline-block">Họ và tên:</span> <strong>{user.name}</strong></div>
                      <div><span className="text-slate-500 w-32 inline-block">Số CCCD:</span> <strong>{user.cccd}</strong></div>
                      <div><span className="text-slate-500 w-32 inline-block">Ngành trúng tuyển:</span> <strong className="text-[#cc0000]">{MAJORS.find(m => m.code === myWishes.find(w=>w.status==='ADMITTED')?.majorCode)?.name}</strong></div>
                      <div><span className="text-slate-500 w-32 inline-block">Điểm chuẩn:</span> <strong>{myWishes.find(w=>w.status==='ADMITTED')?.totalScore}</strong></div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-800 mb-6">
                      <strong>Lưu ý quan trọng:</strong> Thí sinh bắt buộc phải nhấn "Xác nhận Nhập học" trên hệ thống trước 17h00 ngày 26/08/2026. Quá thời hạn này, kết quả sẽ bị hủy.
                    </div>

                    <div className="flex justify-center">
                      <button 
                        onClick={() => {setUser({...user, isConfirmed: true}); addToast("Xác nhận nhập học thành công!", "success");}} 
                        disabled={user.isConfirmed}
                        className={`text-white font-bold px-8 py-3.5 rounded shadow-md transition-all text-lg w-full md:w-auto uppercase
                          ${user.isConfirmed ? 'bg-green-800 cursor-not-allowed opacity-90' : 'bg-green-600 hover:bg-green-700 hover:scale-105'}`}
                      >
                        {user.isConfirmed ? <><CheckSquare className="w-5 h-5 inline mr-2 -mt-1"/> Đã Xác nhận Nhập học</> : 'Xác nhận Nhập học Trực tuyến'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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
    <div className="space-y-6 max-w-7xl mx-auto pt-6 px-4">
      <div className="bg-white p-6 border flex flex-col md:flex-row justify-between items-center shadow-sm rounded gap-4">
        <div>
          <h2 className="text-xl font-black text-[#003366] uppercase">Bảng điều khiển Quản trị viên</h2>
          <p className="text-sm text-green-600 font-bold flex items-center mt-1"><span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> DB Online (Supabase/Postgres)</p>
        </div>
        <button onClick={runAdmissionAlgorithm} disabled={isProcessing} className={`font-bold px-6 py-3 rounded text-white flex items-center w-full md:w-auto justify-center shadow ${isProcessing ? 'bg-slate-400' : 'bg-[#cc0000] hover:bg-red-800'}`}>
          {isProcessing ? 'Đang xử lý thuật toán...' : <><Settings className="w-5 h-5 mr-2" /> Chạy Xét tuyển Lọc ảo</>}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[ { l: 'Tổng Chỉ tiêu', v: 100 }, { l: 'Hồ sơ Thí sinh', v: candidates.length }, { l: 'Số NV đăng ký', v: wishes.length }, { l: 'Đã Trúng tuyển', v: wishes.filter(w=>w.status==='ADMITTED').length }].map((k, i) => (
          <div key={i} className="bg-white p-6 border text-center shadow-sm rounded">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{k.l}</p>
            <h4 className="text-3xl font-black text-[#003366] mt-2">{k.v}</h4>
          </div>
        ))}
      </div>

      <div className="bg-white border shadow-sm rounded overflow-hidden">
        <div className="p-4 border-b bg-slate-50 font-bold text-[#003366] uppercase text-sm flex items-center">
          <LayoutDashboard className="w-4 h-4 mr-2" /> Dữ liệu SQL Hệ thống (Postgres View)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#003366] text-white"><tr><th className="p-3">Thí sinh (ID)</th><th className="p-3">Ngành (NV)</th><th className="p-3">Điểm</th><th className="p-3">Trạng thái</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {wishes.map(w => (
                <tr key={w.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold">{w.candidateId}</td>
                  <td className="p-3 font-bold text-[#cc0000]">{w.majorCode} <span className="text-xs font-normal text-slate-500">(NV{w.priority})</span></td>
                  <td className="p-3 font-mono">{w.totalScore}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${w.status === 'ADMITTED' ? 'bg-green-100 text-green-700' : w.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{w.status}</span>
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