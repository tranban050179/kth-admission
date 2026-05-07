"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, BookOpen, Users, Settings, MessageCircle, CheckCircle, 
  Plus, Trash2, LogIn, LogOut, FileText, LayoutDashboard, 
  ShieldCheck, ArrowUp, ArrowDown, Search, X, Bell, Clock, 
  AlertTriangle, Check, UploadCloud, CreditCard, Send, MapPin, 
  Globe, Phone, FileDigit, Download, ChevronRight, Calendar, Eye, 
  Menu, Lock, User, KeyRound, CheckSquare, FileCheck, Edit, Save, Trash
} from 'lucide-react';

// ==========================================
// 1. HẰNG SỐ & CONFIG CỐ ĐỊNH
// ==========================================
const ACADEMY_INFO = {
  name: "Học viện Kỹ thuật và Công nghệ an ninh",
  code: "KTH",
  locations: ["Hoà Lạc, Hà Nội", "Thuận Thành, Bắc Ninh"],
  website: "hvktcnan.bocongan.gov.vn",
  hotline: "098.995.3286",
};

const MAJORS = [
  { code: 'KTHDS01', name: 'Khoa học dữ liệu và Trí tuệ nhân tạo', quota: 2, combos: ['A00', 'A01', 'D01', 'X06', 'X10', 'X26'] }, // Quota thấp để dễ test lọc ảo
  { code: 'KTHDS02', name: 'Công nghệ phần mềm', quota: 2, combos: ['A00', 'A01', 'D01', 'X06', 'X10', 'X26'] },
  { code: 'KTHDS03', name: 'An toàn hệ thống thông tin', quota: 2, combos: ['A00', 'A01', 'D01', 'X06', 'X10', 'X26'] },
  { code: 'KTHDS04', name: 'Công nghệ điện tử viễn thông', quota: 2, combos: ['A00', 'A01', 'C01', 'X06', 'X26'] },
  { code: 'KTHDS05', name: 'Công nghệ điện tử và vi mạch bán dẫn', quota: 2, combos: ['A00', 'A01', 'A02', 'C01', 'X07'] },
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

// ==========================================
// 2. DATABASE MÔ PHỎNG (LOCAL STORAGE)
// ==========================================
const initDatabase = () => {
  if (typeof window === 'undefined') return { users: [], wishes: [], logs: [] };
  
  const savedDb = localStorage.getItem('kth_database');
  if (savedDb) return JSON.parse(savedDb);

  // Dữ liệu mẫu (Seed Data)
  const defaultDb = {
    users: [
      { id: 'A001', role: 'SUPER_ADMIN', username: 'admin', password: '123', name: 'Trưởng Ban Tuyển sinh' },
      { id: 'A002', role: 'EDITOR', username: 'editor', password: '123', name: 'Chuyên viên Xử lý' },
      { id: 'A003', role: 'VIEWER', username: 'viewer', password: '123', name: 'Giám thị / Thanh tra' },
      { id: 'C001', role: 'CANDIDATE', username: '001099001111', password: '123', name: 'Nguyễn Văn A', cccd: '001099001111', region: 'KV1', target: 'UT1', isPaid: true, isConfirmed: false, phone: '0901234567', email: 'a@gmail.com' },
      { id: 'C002', role: 'CANDIDATE', username: '001099002222', password: '123', name: 'Trần Thị B', cccd: '001099002222', region: 'KV2', target: 'NONE', isPaid: true, isConfirmed: false, phone: '0987654321', email: 'b@gmail.com' },
    ],
    wishes: [
      { id: 'W1', candidateId: 'C001', majorCode: 'KTHDS01', methodId: 5, combo: 'A00', priority: 1, totalScore: 28.5, bonusScore: 2.5, status: 'PENDING' },
      { id: 'W2', candidateId: 'C001', majorCode: 'KTHDS02', methodId: 5, combo: 'A00', priority: 2, totalScore: 29.0, bonusScore: 2.5, status: 'PENDING' },
      { id: 'W3', candidateId: 'C002', majorCode: 'KTHDS01', methodId: 4, combo: 'D01', priority: 1, totalScore: 28.8, bonusScore: 0.25, status: 'PENDING' },
    ],
    logs: [
      { id: Date.now(), time: new Date().toISOString(), actor: 'SYSTEM', action: 'INIT', detail: 'Hệ thống KTH khởi tạo Database thành công.' }
    ]
  };
  localStorage.setItem('kth_database', JSON.stringify(defaultDb));
  return defaultDb;
};

// ==========================================
// 3. COMPONENT CHÍNH (APP LÕI)
// ==========================================
export default function App() {
  const [db, setDb] = useState({ users: [], wishes: [], logs: [] });
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setDb(initDatabase());
    const session = sessionStorage.getItem('kth_session');
    if(session) {
      const u = JSON.parse(session);
      setCurrentUser(u);
      setActiveTab(u.role === 'CANDIDATE' ? 'portal' : 'admin');
    }
  }, []);

  const updateDb = (newDb) => {
    setDb(newDb);
    localStorage.setItem('kth_database', JSON.stringify(newDb));
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const writeLog = (actorId, action, detail) => {
    const newLogs = [{ id: Date.now(), time: new Date().toISOString(), actor: actorId, action, detail }, ...db.logs];
    updateDb({ ...db, logs: newLogs });
  };

  const handleAuth = (username, password, type, extraData = null) => {
    if (type === 'LOGIN') {
      const user = db.users.find(u => u.username === username && u.password === password);
      if (user) {
        setCurrentUser(user);
        sessionStorage.setItem('kth_session', JSON.stringify(user));
        setActiveTab(user.role === 'CANDIDATE' ? 'portal' : 'admin');
        addToast(`Đăng nhập thành công! Xin chào ${user.name}`, 'success');
        writeLog(user.id, 'LOGIN', 'Truy cập hệ thống');
      } else {
        addToast('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
      }
    } else if (type === 'REGISTER') {
      const exists = db.users.find(u => u.username === username);
      if (exists) {
        addToast('CCCD này đã được đăng ký trong hệ thống!', 'error');
        return;
      }
      const newUser = {
        id: `C_${Date.now()}`, role: 'CANDIDATE', username: username, password: password,
        name: extraData.name, cccd: username, region: 'KV3', target: 'NONE', 
        isPaid: false, isConfirmed: false, phone: '', email: ''
      };
      updateDb({ ...db, users: [...db.users, newUser] });
      addToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
      writeLog(newUser.id, 'REGISTER', 'Tạo tài khoản mới');
      return true; 
    }
  };

  const logout = () => {
    writeLog(currentUser.id, 'LOGOUT', 'Rời khỏi hệ thống');
    setCurrentUser(null);
    sessionStorage.removeItem('kth_session');
    setActiveTab('home');
    setMobileMenuOpen(false);
  };

  const isSystemOpen = CURRENT_DATE >= DEADLINE_START && CURRENT_DATE <= DEADLINE_END;

  // Render Layout Dashboard (Dành cho người đã đăng nhập)
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
             {isSystemOpen && <div className="hidden md:flex items-center text-xs font-bold bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full"><Clock className="w-4 h-4 mr-1"/> Hệ thống đang mở</div>}
             <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full py-1 pr-4 pl-1 shadow-inner">
               <div className="w-8 h-8 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold">{currentUser?.name.charAt(0)}</div>
               <div className="flex flex-col text-xs">
                 <span className="font-bold text-[#003366] leading-none">{currentUser?.name}</span>
                 <span className="text-slate-500 mt-0.5">{currentUser?.role !== 'CANDIDATE' ? `Quyền: ${currentUser?.role}` : `TS: ${currentUser?.cccd}`}</span>
               </div>
             </div>
             <button onClick={logout} className="text-slate-400 hover:text-red-500 transition bg-slate-100 p-2 rounded-full border border-slate-200" title="Đăng xuất"><LogOut className="w-4 h-4"/></button>
          </div>
        </header>

        {activeTab === 'portal' && <CandidatePortal db={db} updateDb={updateDb} user={currentUser} setUser={(u) => {setCurrentUser(u); sessionStorage.setItem('kth_session', JSON.stringify(u));}} addToast={addToast} writeLog={writeLog} isSystemOpen={isSystemOpen} />}
        {activeTab === 'admin' && <AdminDashboard db={db} updateDb={updateDb} adminUser={currentUser} addToast={addToast} writeLog={writeLog} />}
      </div>
    );
  }

  // Render Layout Trang chủ (Chưa đăng nhập)
  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-800 flex flex-col">
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
              <LogIn className="w-4 h-4 mr-2" /> Đăng nhập Hệ thống
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
            <button onClick={() => {setActiveTab('login'); setMobileMenuOpen(false);}} className="w-full text-center text-sm font-bold text-[#003366] border border-[#003366] py-3 rounded">Đăng nhập Hệ thống</button>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && <PublicHome onApplyClick={() => setActiveTab('login')} />}
        {activeTab === 'login' && <LoginPage onAuth={handleAuth} onCancel={() => setActiveTab('home')} />}
      </main>

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
// COMPONENT ĐĂNG NHẬP / ĐĂNG KÝ
// ==========================================
function LoginPage({ onAuth, onCancel }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isLogin) {
      onAuth(username, password, 'LOGIN');
    } else {
      const success = onAuth(username, password, 'REGISTER', { name });
      if(success) setIsLogin(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row animate-fade-in mt-4">
      <div className="md:w-5/12 bg-[#003366] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <ShieldCheck className="w-16 h-16 text-[#cc0000] mb-8 bg-white rounded-xl p-2 shadow-lg" />
          <h2 className="text-3xl font-black uppercase mb-6 leading-tight border-l-4 border-[#cc0000] pl-4">Cổng Xét tuyển<br/>Trực tuyến 2026</h2>
          <p className="text-blue-100 text-sm mb-8 leading-relaxed">
            Hệ thống Quản lý Dữ liệu thực tế. Mọi thao tác Thêm/Sửa/Xóa của Thí sinh và Quản trị viên đều được lưu trữ trực tiếp vào CSDL LocalStorage.
          </p>
          <div className="space-y-4">
            <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-800">
              <h4 className="font-bold text-yellow-400 mb-1 flex items-center"><User className="w-4 h-4 mr-2"/>Tài khoản Thí sinh (Demo)</h4>
              <p className="text-xs text-blue-200">CCCD: <code className="bg-blue-950 px-1 py-0.5 rounded text-white">001099001111</code> | Mật khẩu: <code className="bg-blue-950 px-1 py-0.5 rounded text-white">123</code></p>
              <p className="text-xs text-blue-200 mt-1">Hoặc tự <strong className="text-white underline cursor-pointer" onClick={()=>setIsLogin(false)}>Đăng ký tài khoản mới</strong>.</p>
            </div>
            <div className="bg-red-900/30 p-4 rounded-lg border border-red-800/50">
              <h4 className="font-bold text-red-300 mb-1 flex items-center"><Settings className="w-4 h-4 mr-2"/>Tài khoản Quản trị (3 Cấp độ)</h4>
              <p className="text-xs text-blue-200">Trưởng ban: <code className="text-white">admin</code> / <code className="text-white">123</code> (Toàn quyền)</p>
              <p className="text-xs text-blue-200">Chuyên viên: <code className="text-white">editor</code> / <code className="text-white">123</code> (Sửa/Xóa)</p>
              <p className="text-xs text-blue-200">Thanh tra: <code className="text-white">viewer</code> / <code className="text-white">123</code> (Chỉ xem)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:w-7/12 p-8 md:p-14 relative bg-slate-50">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-white p-2 rounded-full shadow-sm"><X className="w-5 h-5"/></button>
        
        <div className="flex border-b border-slate-300 mb-8">
          <button onClick={() => setIsLogin(true)} className={`pb-3 text-lg font-black uppercase px-4 transition-all ${isLogin ? 'text-[#003366] border-b-4 border-[#cc0000]' : 'text-slate-400 hover:text-slate-600'}`}>Đăng nhập</button>
          <button onClick={() => setIsLogin(false)} className={`pb-3 text-lg font-black uppercase px-4 transition-all ${!isLogin ? 'text-[#003366] border-b-4 border-[#cc0000]' : 'text-slate-400 hover:text-slate-600'}`}>Đăng ký</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Họ và tên thí sinh</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-400" /></div>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Nguyễn Văn A" className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition shadow-inner" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Tên đăng nhập / Số CCCD</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-400" /></div>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Nhập CCCD hoặc ID quản trị" className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-[#003366] focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition shadow-inner" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Nhập mật khẩu" className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-[#003366] focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition shadow-inner" />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#cc0000] text-white font-black py-4 rounded-lg shadow-lg hover:bg-red-700 transition uppercase tracking-widest mt-6 hover:shadow-xl hover:-translate-y-0.5 transform">
            {isLogin ? 'Đăng nhập Hệ thống' : 'Khởi tạo Tài khoản'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT TRANG CHỦ (PUBLIC)
// ==========================================
function PublicHome({ onApplyClick }) {
  const [activeMethodTab, setActiveMethodTab] = useState(METHODS[0].id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in">
      <div className="lg:col-span-3 space-y-6">
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
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-black text-[#003366] border-l-4 border-[#cc0000] pl-3 uppercase mt-10">
              2. Các phương thức tuyển sinh
            </h3>

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
                        <li>Bản chụp CCCD hợp lệ.</li>
                        <li>Bản chụp Học bạ THPT.</li>
                        <li>Các minh chứng liên quan.</li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-lg font-black text-[#003366] border-l-4 border-[#cc0000] pl-3 uppercase mt-10">
              3. Đăng ký & Nhập học trực tuyến
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-200">
              <button onClick={onApplyClick} className="bg-[#cc0000] hover:bg-red-700 text-white font-bold py-4 px-8 rounded shadow-md transition flex justify-center items-center gap-2 group uppercase">
                <FileDigit className="w-5 h-5 group-hover:scale-110 transition-transform" /> Đăng nhập & Đăng ký XT
              </button>
            </div>
          </div>
        </article>
      </div>

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
              <div className="text-xs text-slate-600 mt-1">Công bố kết quả.</div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT THÍ SINH (PORTAL)
// ==========================================
function CandidatePortal({ db, updateDb, user, setUser, addToast, writeLog, isSystemOpen }) {
  const [activeMenu, setActiveMenu] = useState('wishes'); 
  const [showForm, setShowForm] = useState(false);
  const [newWish, setNewWish] = useState({ majorCode: MAJORS[0].code, methodId: 5, combo: MAJORS[0].combos[0], totalScore: '' });
  
  const myWishes = useMemo(() => {
    return db.wishes.filter(w => w.candidateId === user.id).sort((a, b) => a.priority - b.priority);
  }, [db.wishes, user.id]);

  const isSystemLocked = !isSystemOpen || myWishes.some(w => ['ADMITTED', 'REJECTED', 'CANCELED'].includes(w.status));
  const isAdmitted = myWishes.some(w => w.status === 'ADMITTED');

  const updateUserInDb = (updatedUser) => {
    setUser(updatedUser);
    const newUsers = db.users.map(u => u.id === updatedUser.id ? updatedUser : u);
    updateDb({ ...db, users: newUsers });
  };

  const handlePayment = () => {
    updateUserInDb({ ...user, isPaid: true });
    writeLog(user.id, 'PAYMENT', `Thanh toán lệ phí cho ${myWishes.length} nguyện vọng.`);
    addToast("Thanh toán thành công. Đã cập nhật vào cơ sở dữ liệu!", "success");
  };

  const handleAddWish = () => {
    if (!user.isPaid && myWishes.length > 0) { addToast("Vui lòng thanh toán lệ phí trước khi thêm.", "error"); return; }
    if (myWishes.length >= 15) { addToast("Tối đa 15 nguyện vọng.", "error"); return; }
    if (!newWish.totalScore || newWish.totalScore <= 0 || newWish.totalScore > 30) { addToast("Điểm không hợp lệ.", "error"); return; }

    const wishEntry = {
      id: `W_${Date.now()}`, candidateId: user.id, majorCode: newWish.majorCode, methodId: newWish.methodId, combo: newWish.combo,
      priority: myWishes.length + 1, totalScore: parseFloat(newWish.totalScore), bonusScore: 0, status: 'PENDING'
    };
    
    updateDb({ ...db, wishes: [...db.wishes, wishEntry] });
    writeLog(user.id, 'ADD_WISH', `Thêm NV: ${wishEntry.majorCode}`);
    addToast("Lưu nguyện vọng vào CSDL thành công!", "success");
    setShowForm(false);
  };

  const deleteWish = (wishId) => {
    if (isSystemLocked) return;
    const wishToDelete = myWishes.find(w => w.id === wishId);
    let updatedWishes = db.wishes.filter(w => w.id !== wishId).map(w => {
      if (w.candidateId === user.id && w.priority > wishToDelete.priority) return { ...w, priority: w.priority - 1 };
      return w;
    });
    updateDb({ ...db, wishes: updatedWishes });
    writeLog(user.id, 'DELETE_WISH', `Xóa NV ${wishToDelete.majorCode}`);
    addToast("Đã xóa nguyện vọng khỏi CSDL.", "info");
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
    const newGlobalWishes = db.wishes.map(w => updatedIds.includes(w.id) ? currentWishes.find(cw => cw.id === w.id) : w);
    
    updateDb({ ...db, wishes: newGlobalWishes });
    writeLog(user.id, 'REORDER_WISH', `Đổi thứ tự ưu tiên.`);
  };

  const MENU_ITEMS = [
    { id: 'profile', icon: User, label: 'Thông tin cá nhân' },
    { id: 'wishes', icon: FileCheck, label: 'Đăng ký Nguyện vọng' },
    { id: 'payment', icon: CreditCard, label: 'Thanh toán lệ phí' },
    { id: 'results', icon: CheckSquare, label: 'Kết quả xét tuyển' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full pt-6">
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden sticky top-24">
          <div className="p-4 bg-[#003366] text-white">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Cổng Thí sinh</h3>
            <p className="text-xs text-blue-200">CCCD: {user.cccd}</p>
          </div>
          <nav className="flex flex-col py-2">
            {MENU_ITEMS.map(item => (
              <button key={item.id} onClick={() => setActiveMenu(item.id)}
                className={`flex items-center px-5 py-3 text-sm font-medium transition-colors text-left border-l-4
                  ${activeMenu === item.id ? 'border-[#cc0000] bg-red-50 text-[#cc0000] font-bold' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#003366]'}`}>
                <item.icon className={`w-5 h-5 mr-3 ${activeMenu === item.id ? 'text-[#cc0000]' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 min-w-0 pb-12">
        {activeMenu === 'profile' && (
          <div className="bg-white rounded shadow-sm border border-slate-200 p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-[#003366] mb-6 border-b border-slate-200 pb-3">Thông tin Lý lịch & Liên hệ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Họ và tên</label><input type="text" disabled value={user.name} className="w-full p-2.5 border rounded bg-slate-50 text-slate-700 font-bold" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Số Thẻ CCCD</label><input type="text" disabled value={user.cccd} className="w-full p-2.5 border rounded bg-slate-50 text-slate-700 font-bold" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Số điện thoại</label><input type="text" defaultValue={user.phone} onChange={e=>updateUserInDb({...user, phone: e.target.value})} className="w-full p-2.5 border rounded focus:border-[#003366] outline-none" /></div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button onClick={()=>addToast('Đã lưu thông tin','success')} className="bg-[#003366] text-white font-bold px-6 py-2.5 rounded shadow-sm hover:bg-blue-900 transition flex items-center"><Save className="w-4 h-4 mr-2"/> Cập nhật CSDL</button>
            </div>
          </div>
        )}

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
                      <select className="p-2.5 border border-slate-300 rounded w-full bg-white font-medium" value={newWish.majorCode} onChange={e => {const m = MAJORS.find(x => x.code === e.target.value); setNewWish({...newWish, majorCode: m.code, combo: m.combos[0]})}}>
                        {MAJORS.map(m => <option key={m.code} value={m.code}>{m.code} - {m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <select className="p-2.5 border border-slate-300 rounded w-full bg-white" value={newWish.methodId} onChange={e => setNewWish({...newWish, methodId: Number(e.target.value)})}>
                        {METHODS.map(m => <option key={m.id} value={m.id}>PT {m.id} - {m.name}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Nhập điểm..." className="p-2.5 border border-slate-300 rounded w-full font-bold text-[#cc0000]" value={newWish.totalScore} onChange={e => setNewWish({...newWish, totalScore: e.target.value})} />
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

        {activeMenu === 'payment' && (
          <div className="bg-white rounded shadow-sm border border-slate-200 p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-[#003366] mb-6 border-b border-slate-200 pb-3">Thanh toán Lệ phí Xét tuyển</h3>
            <div className="bg-slate-50 p-6 rounded border border-slate-200">
              <div className="flex justify-between items-center text-lg mb-6">
                <span className="font-bold text-slate-800">TỔNG TIỀN ({myWishes.length} NV):</span>
                <span className="font-black text-[#cc0000]">{(myWishes.length * 50000).toLocaleString()} VNĐ</span>
              </div>
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
        )}

        {activeMenu === 'results' && (
          <div className="bg-white rounded shadow-sm border border-slate-200 p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-[#003366] mb-6 border-b border-slate-200 pb-3">Kết quả Xét tuyển</h3>
            {isSystemOpen ? (
              <div className="text-center p-12 bg-slate-50 rounded border border-slate-200">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="font-bold text-slate-700 text-lg">Hệ thống đang mở đăng ký</h4>
                <p className="text-sm text-slate-500 mt-2">Kết quả chính thức sẽ được công bố sau ngày 21/08/2026. Vui lòng quay lại sau.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-8 border rounded flex flex-col md:flex-row items-center justify-between gap-6 ${isAdmitted ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-200'}`}>
                  <div>
                    <h4 className={`font-black text-2xl mb-2 uppercase ${isAdmitted ? 'text-green-700' : 'text-red-700'}`}>
                      {isAdmitted ? 'CHÚC MỪNG BẠN ĐÃ TRÚNG TUYỂN!' : 'KẾT QUẢ: KHÔNG TRÚNG TUYỂN'}
                    </h4>
                    <p className="text-base text-slate-700">
                      {isAdmitted ? `Bạn đã xuất sắc trúng tuyển vào nguyện vọng số ${myWishes.find(w=>w.status==='ADMITTED')?.priority}.` : 'Điểm xét của bạn chưa đủ để trúng tuyển.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 6. QUẢN TRỊ VIÊN (ADMIN DASHBOARD WITH RBAC)
// ==========================================
function AdminDashboard({ db, updateDb, adminUser, addToast, writeLog }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const candidates = db.users.filter(u => u.role === 'CANDIDATE');

  // RBAC LOGIC
  const canEdit = adminUser.role === 'SUPER_ADMIN' || adminUser.role === 'EDITOR';
  const canRunAlgorithm = adminUser.role === 'SUPER_ADMIN';

  const runAdmissionAlgorithm = () => {
    if (!canRunAlgorithm) {
      addToast("Bạn không có quyền chạy chức năng này!", "error"); return;
    }
    setIsProcessing(true);
    addToast("Bắt đầu xử lý thuật toán xét tuyển (Ghi vào CSDL)...", "info");
    
    setTimeout(() => {
      let newWishes = JSON.parse(JSON.stringify(db.wishes));
      newWishes.forEach(w => w.status = 'PENDING');

      MAJORS.forEach(major => {
        let majorWishes = newWishes.filter(w => w.majorCode === major.code && w.status === 'PENDING');
        majorWishes.sort((a, b) => b.totalScore - a.totalScore || a.bonusScore - b.bonusScore || a.priority - b.priority);
        const admittedWishes = majorWishes.slice(0, major.quota); 
        admittedWishes.forEach(aw => {
          newWishes.find(w => w.id === aw.id).status = 'ADMITTED';
          newWishes.forEach(w => { 
            if (w.candidateId === aw.candidateId && w.priority > aw.priority && w.status === 'PENDING') w.status = 'CANCELED';
          });
        });
      });

      newWishes.forEach(w => { if (w.status === 'PENDING') w.status = 'REJECTED'; });
      
      updateDb({ ...db, wishes: newWishes });
      writeLog(adminUser.id, 'RUN_ALGORITHM', 'Hệ thống đã chốt điểm và xét tuyển thành công.');
      setIsProcessing(false);
      addToast("Chốt kết quả Xét tuyển thành công!", "success");
    }, 2000);
  };

  const handleAdminDeleteWish = (wishId) => {
    if (!canEdit) { addToast("Quyền của bạn chỉ được xem!", "error"); return; }
    if(window.confirm("Xóa dữ liệu này khỏi hệ thống?")) {
      const newWishes = db.wishes.filter(w => w.id !== wishId);
      updateDb({ ...db, wishes: newWishes });
      writeLog(adminUser.id, 'ADMIN_DELETE_WISH', `Xóa NV ID: ${wishId}`);
      addToast("Xóa dữ liệu thành công!", "success");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pt-6 px-4 pb-12">
      <div className="bg-white p-6 border border-slate-200 flex flex-col md:flex-row justify-between items-center shadow-sm rounded gap-4">
        <div>
          <h2 className="text-xl font-black text-[#003366] uppercase">Phần mềm Quản lý Tuyển sinh</h2>
          <p className="text-sm text-slate-500 font-medium flex items-center mt-1">
            Vai trò hiện tại: <strong className={`ml-1 ${adminUser.role==='SUPER_ADMIN'?'text-[#cc0000]':adminUser.role==='EDITOR'?'text-blue-600':'text-slate-600'}`}>{adminUser.role}</strong>
          </p>
        </div>
        <button onClick={runAdmissionAlgorithm} disabled={isProcessing || !canRunAlgorithm} 
          className={`font-bold px-6 py-3 rounded text-white flex items-center shadow transition-colors
            ${isProcessing || !canRunAlgorithm ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#cc0000] hover:bg-red-800'}`}>
          {isProcessing ? 'Đang ghi vào CSDL...' : <><Settings className="w-5 h-5 mr-2" /> Chạy Xét tuyển tự động</>}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[ { l: 'Tổng Chỉ tiêu', v: 10 }, { l: 'TS Đăng ký', v: candidates.length }, { l: 'Tổng NV', v: db.wishes.length }, { l: 'Trúng tuyển', v: db.wishes.filter(w=>w.status==='ADMITTED').length }].map((k, i) => (
          <div key={i} className="bg-white p-6 border text-center shadow-sm rounded">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{k.l}</p>
            <h4 className="text-3xl font-black text-[#003366] mt-2">{k.v}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border shadow-sm rounded overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b bg-slate-50 font-bold text-[#003366] uppercase text-sm flex items-center justify-between">
            <span className="flex items-center"><LayoutDashboard className="w-4 h-4 mr-2" /> Database Nguyện vọng (Realtime)</span>
          </div>
          <div className="overflow-auto flex-1 p-2">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 border-b border-slate-200">
                <tr><th className="p-3">Thí sinh</th><th className="p-3">Mã Ngành</th><th className="p-3">Điểm</th><th className="p-3">Trạng thái</th><th className="p-3 text-center">Thao tác</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {db.wishes.sort((a,b) => b.totalScore - a.totalScore).map(w => {
                  const c = candidates.find(can => can.id === w.candidateId);
                  return (
                    <tr key={w.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-700">{c?.name} <span className="block text-xs font-normal text-slate-400">{c?.cccd}</span></td>
                      <td className="p-3 font-bold text-[#cc0000]">{w.majorCode} <span className="text-xs font-normal text-slate-500">(NV{w.priority})</span></td>
                      <td className="p-3 font-mono font-bold">{w.totalScore}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${w.status === 'ADMITTED' ? 'bg-green-100 text-green-700' : w.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{w.status}</span>
                      </td>
                      <td className="p-3 text-center">
                        {canEdit ? (
                          <div className="flex justify-center gap-2 text-slate-400">
                            <button onClick={()=>handleAdminDeleteWish(w.id)} className="hover:text-red-600" title="Xóa"><Trash className="w-4 h-4"/></button>
                          </div>
                        ) : <span className="text-xs text-slate-300">Read-only</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 bg-slate-900 rounded shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center text-white">
            <h3 className="font-bold flex items-center text-sm uppercase text-slate-300">System Audit Logs</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-4 space-y-4 font-mono text-[11px] leading-relaxed">
            {db.logs.map(log => (
              <div key={log.id} className="border-l border-blue-500/50 pl-3 relative">
                <div className="absolute w-2 h-2 rounded-full bg-blue-500 -left-[4.5px] top-1"></div>
                <div className="text-slate-400 mb-1">{new Date(log.time).toLocaleTimeString('vi-VN')} <span className="text-slate-600">|</span> <span className="text-yellow-400 font-bold">{log.actor}</span></div>
                <div className="text-green-400 font-bold mb-1">[{log.action}]</div>
                <div className="text-slate-300">{log.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}