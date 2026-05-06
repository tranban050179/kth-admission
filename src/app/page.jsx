"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, BookOpen, Users, Settings, MessageCircle, CheckCircle, 
  Plus, Trash2, Edit2, LogIn, LogOut, FileText, LayoutDashboard, 
  ShieldCheck, ArrowUp, ArrowDown, Search, X, Bell, Clock, 
  AlertTriangle, Check, UploadCloud, CreditCard, Send, MapPin, Globe, Phone, FileDigit, Download
} from 'lucide-react';

// ==========================================
// 1. MOCK DATA & CONSTANTS (SUPABASE SIMULATION)
// ==========================================
const ACADEMY_INFO = {
  name: "Học viện Kỹ thuật và Công nghệ an ninh",
  code: "KTH",
  locations: ["Hoà Lạc, Hà Nội", "Thuận Thành, Bắc Ninh"],
  website: "hvktcnan.bocongan.gov.vn",
  hotline: "0989953286",
};

const MAJORS = [
  { code: 'KTHDS01', name: 'Khoa học dữ liệu và Trí tuệ nhân tạo (AI)', quota: 20, combos: ['A00', 'A01', 'D01', 'X06', 'X10', 'X26'] },
  { code: 'KTHDS02', name: 'Công nghệ phần mềm', quota: 20, combos: ['A00', 'A01', 'D01', 'X06', 'X10', 'X26'] },
  { code: 'KTHDS03', name: 'An toàn hệ thống thông tin', quota: 20, combos: ['A00', 'A01', 'D01', 'X06', 'X10', 'X26'] },
  { code: 'KTHDS04', name: 'Công nghệ điện tử viễn thông', quota: 20, combos: ['A00', 'A01', 'C01', 'X06', 'X26'] },
  { code: 'KTHDS05', name: 'Công nghệ điện tử và vi mạch bán dẫn', quota: 20, combos: ['A00', 'A01', 'A02', 'C01', 'X07'] },
];

const METHODS = [
  { id: 1, name: 'Học bạ (Xét tuyển tài năng)' },
  { id: 2, name: 'HSA/APT/TSA/SPT (Đánh giá năng lực)' },
  { id: 3, name: 'SAT/ACT (Chứng chỉ quốc tế)' },
  { id: 4, name: 'IELTS/TOEFL + Học bạ' },
  { id: 5, name: 'Điểm thi THPT 2026' },
];

const CURRENT_DATE = new Date('2026-07-10T10:00:00'); // Mô phỏng ngày hiện tại trong khoảng mở portal
const DEADLINE_START = new Date('2026-07-02T00:00:00');
const DEADLINE_END = new Date('2026-08-21T17:00:00');

// Initial Mock DB
const INITIAL_CANDIDATES = [
  { id: 'C001', name: 'Nguyễn Văn A', cccd: '001099001111', region: 'KV1', target: 'UT1', isPaid: false, isConfirmed: false },
  { id: 'C002', name: 'Trần Thị B', cccd: '001099002222', region: 'KV2', target: 'NONE', isPaid: true, isConfirmed: false },
  { id: 'C003', name: 'Lê Văn C', cccd: '001099003333', region: 'KV3', target: 'NONE', isPaid: true, isConfirmed: false },
];

const INITIAL_WISHES = [
  // Nguyễn Văn A
  { id: 'W1', candidateId: 'C001', majorCode: 'KTHDS01', methodId: 5, combo: 'A00', priority: 1, totalScore: 28.5, bonusScore: 2.5, status: 'PENDING' },
  { id: 'W2', candidateId: 'C001', majorCode: 'KTHDS02', methodId: 5, combo: 'A00', priority: 2, totalScore: 29.0, bonusScore: 2.5, status: 'PENDING' },
  // Trần Thị B
  { id: 'W3', candidateId: 'C002', majorCode: 'KTHDS01', methodId: 4, combo: 'D01', priority: 1, totalScore: 28.8, bonusScore: 0.25, status: 'PENDING' },
];

// ==========================================
// 2. MAIN APP
// ==========================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [wishes, setWishes] = useState(INITIAL_WISHES);
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [auditLogs, setAuditLogs] = useState([]);
  const [showAI, setShowAI] = useState(false);
  
  // Toasts
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const login = (role) => {
    if (role === 'CANDIDATE') setCurrentUser(candidates[0]);
    if (role === 'ADMIN') setCurrentUser({ id: 'A001', name: 'BQT Học viện', role: 'ADMIN' });
    setActiveTab(role === 'ADMIN' ? 'admin' : 'portal');
    addToast(`Đăng nhập thành công!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Tính số ngày còn lại của Timeline
  const daysLeft = Math.ceil((DEADLINE_END - CURRENT_DATE) / (1000 * 60 * 60 * 24));
  const isSystemOpen = CURRENT_DATE >= DEADLINE_START && CURRENT_DATE <= DEADLINE_END;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Notifications */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`flex items-center p-4 rounded-xl shadow-xl border text-sm font-medium transition-all animate-slide-in-right pointer-events-auto
            ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
              toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
              'bg-blue-50 border-blue-200 text-blue-800'}`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 mr-3 text-green-600" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 mr-3 text-red-600" />}
            {toast.type === 'info' && <Bell className="w-5 h-5 mr-3 text-blue-600" />}
            {toast.message}
          </div>
        ))}
      </div>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <ShieldCheck className="h-10 w-10 text-yellow-400" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold uppercase tracking-wide text-white">{ACADEMY_INFO.name}</h1>
              <p className="text-xs text-blue-200 font-medium flex items-center gap-2">
                <Globe className="w-3 h-3"/> {ACADEMY_INFO.website} <span className="text-slate-400">|</span> 
                <Phone className="w-3 h-3"/> {ACADEMY_INFO.hotline}
              </p>
            </div>
            <div className="md:hidden font-bold text-xl">{ACADEMY_INFO.code}</div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {!currentUser ? (
              <>
                <button onClick={() => login('CANDIDATE')} className="text-sm font-medium hover:text-yellow-400 flex items-center transition-colors">
                  <LogIn className="w-4 h-4 mr-1" /> Thí sinh
                </button>
                <button onClick={() => login('ADMIN')} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
                  Quản trị
                </button>
              </>
            ) : (
              <div className="flex items-center bg-white/10 rounded-xl p-1 pr-3 border border-white/10 backdrop-blur-sm">
                <div className="bg-yellow-500 text-slate-900 w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-3 shadow-inner">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-sm mr-4">
                  <div className="font-bold text-white">{currentUser.name}</div>
                  <div className="text-xs text-blue-200">{currentUser.role === 'ADMIN' ? 'Hệ thống Quản trị' : `TS: ${currentUser.cccd}`}</div>
                </div>
                <button onClick={() => setActiveTab(currentUser.role === 'ADMIN' ? 'admin' : 'portal')} className="text-blue-200 hover:text-white p-2 rounded-lg transition-colors" title="Dashboard">
                  <LayoutDashboard className="w-5 h-5" />
                </button>
                <button onClick={logout} className="text-red-300 hover:text-red-100 p-2 rounded-lg transition-colors" title="Đăng xuất">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* TIMELINE BAR */}
      {isSystemOpen && (
        <div className="bg-amber-100 border-b border-amber-200 text-amber-800 py-2 px-4 text-center text-sm font-medium flex justify-center items-center">
          <Clock className="w-4 h-4 mr-2 animate-pulse" />
          Hệ thống đang mở đăng ký. Hạn chót: 17h00 ngày 21/08/2026. Bạn còn {daysLeft} ngày!
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && <PublicHome />}
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

      {/* AI CHATBOT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {showAI && (
          <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 h-[400px] mb-4 flex flex-col border border-slate-200 overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">KTH AI Tư vấn</div>
                  <div className="text-[10px] text-blue-100 flex items-center"><span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse"></span> Trực tuyến</div>
                </div>
              </div>
              <button onClick={() => setShowAI(false)} className="text-white/70 hover:text-white bg-white/10 p-1.5 rounded-lg"><X className="w-4 h-4"/></button>
            </div>
            <div className="flex-1 p-4 bg-slate-50 overflow-y-auto text-sm space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-900 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] border border-blue-200">
                  Chào bạn! Mình là AI hỗ trợ tuyển sinh 2026 của KTH. Mình có thể giải đáp về 5 phương thức xét tuyển, điểm chuẩn hoặc cách nộp lệ phí nhé.
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input type="text" placeholder="Nhập câu hỏi..." className="flex-1 p-2.5 bg-slate-100 rounded-xl outline-none text-sm focus:ring-2 focus:ring-blue-500 transition-all border border-transparent focus:border-blue-300" />
              <button className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 shadow-sm transition-colors"><Send className="w-4 h-4"/></button>
            </div>
          </div>
        )}
        <button 
          onClick={() => setShowAI(!showAI)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 border-4 border-white"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 3. PUBLIC HOME PAGE
// ==========================================
function PublicHome() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center gap-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 z-0 opacity-70"></div>
        <div className="lg:w-1/2 z-10 relative">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> Hệ Dân sự - Tuyển sinh 2026
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
            Nền tảng đào tạo <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">An toàn Không gian mạng & Vi mạch</span>
          </h2>
          <p className="text-slate-600 leading-relaxed mb-8 text-lg">
            Khám phá 5 chuyên ngành mũi nhọn với 100 chỉ tiêu độc quyền. Đăng ký xét tuyển trực tuyến hoàn toàn qua hệ thống số của Học viện.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-slate-900 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center">
              <FileDigit className="w-5 h-5 mr-2" /> Xem Đề án Tuyển sinh
            </button>
            <button className="bg-white text-slate-700 border-2 border-slate-200 font-semibold px-6 py-3.5 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition">
              Hướng dẫn Xét tuyển
            </button>
          </div>
        </div>
        
        <div className="lg:w-1/2 z-10 w-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
              <BookOpen className="w-8 h-8 mb-4 text-blue-200" />
              <div className="text-3xl font-black mb-1">5</div>
              <div className="text-sm text-blue-100 font-medium">Ngành Đào tạo</div>
            </div>
            <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-lg transform rotate-2 hover:rotate-0 transition-transform mt-6">
              <Users className="w-8 h-8 mb-4 text-indigo-200" />
              <div className="text-3xl font-black mb-1">100</div>
              <div className="text-sm text-indigo-100 font-medium">Chỉ tiêu Tuyển sinh</div>
            </div>
            <div className="bg-yellow-500 text-slate-900 p-6 rounded-3xl shadow-lg transform rotate-1 hover:rotate-0 transition-transform col-span-2">
              <MapPin className="w-8 h-8 mb-3 text-yellow-800" />
              <div className="font-bold mb-1">Cơ sở Đào tạo:</div>
              <ul className="text-sm space-y-1 font-medium text-yellow-900/80">
                <li>• Cơ sở 1: Hòa Lạc, Thạch Thất, Hà Nội</li>
                <li>• Cơ sở 2: Thuận Thành, Bắc Ninh</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
           <Search className="w-6 h-6 mr-3 text-indigo-600" /> Danh mục 5 Ngành Đào tạo KTH (2026)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MAJORS.map(major => (
            <div key={major.code} className="border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-300 transition-all bg-white group flex flex-col">
              <div className="text-sm font-bold text-indigo-600 mb-3 bg-indigo-50 w-fit px-3 py-1 rounded-lg">{major.code}</div>
              <div className="font-extrabold text-xl text-slate-800 mb-4 flex-1">{major.name}</div>
              <div className="space-y-3 border-t border-slate-100 pt-4 mt-auto">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Chỉ tiêu:</span>
                  <span className="font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{major.quota} sinh viên</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Tổ hợp:</span>
                  <span className="font-medium text-slate-700" title={major.combos.join(', ')}>
                    {major.combos.slice(0,3).join(', ')}{major.combos.length > 3 ? ',...' : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. CANDIDATE PORTAL (THÍ SINH)
// ==========================================
function CandidatePortal({ user, setUser, wishes, setWishes, addToast, addAuditLog, isSystemOpen }) {
  const [showForm, setShowForm] = useState(false);
  const [newWish, setNewWish] = useState({ majorCode: MAJORS[0].code, methodId: 5, combo: MAJORS[0].combos[0], totalScore: '' });
  
  const myWishes = useMemo(() => {
    return wishes.filter(w => w.candidateId === user.id).sort((a, b) => a.priority - b.priority);
  }, [wishes, user.id]);

  const isSystemLocked = !isSystemOpen || myWishes.some(w => ['ADMITTED', 'REJECTED', 'CANCELED'].includes(w.status));
  const isAdmitted = myWishes.some(w => w.status === 'ADMITTED');

  // Logic Nộp lệ phí
  const handlePayment = () => {
    setUser({ ...user, isPaid: true });
    addAuditLog('PAYMENT', `Thanh toán thành công lệ phí cho ${myWishes.length} NV`);
    addToast("Thanh toán lệ phí thành công!", "success");
  };

  // Logic Upload PDF
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if(file.type !== 'application/pdf') {
        addToast("Chỉ chấp nhận file định dạng PDF", "error");
        return;
      }
      addAuditLog('UPLOAD_DOC', `Tải lên minh chứng: ${file.name}`);
      addToast(`Đã tải lên tệp: ${file.name}`, "success");
    }
  };

  // Logic Xác nhận nhập học
  const handleConfirmAdmission = () => {
    setUser({ ...user, isConfirmed: true });
    addAuditLog('CONFIRM_ADMISSION', `Xác nhận nhập học trực tuyến`);
    addToast("Xác nhận nhập học thành công. Mã định danh của bạn đã được lưu.", "success");
  }

  const handleAddWish = () => {
    if (!user.isPaid && myWishes.length > 0) {
      addToast("Vui lòng thanh toán lệ phí các nguyện vọng trước khi thêm mới.", "error"); return;
    }
    if (myWishes.length >= 15) {
      addToast("Hệ thống: Tối đa 15 nguyện vọng.", "error"); return;
    }
    if (!newWish.totalScore || isNaN(newWish.totalScore) || newWish.totalScore <= 0 || newWish.totalScore > 30) {
      addToast("Điểm không hợp lệ.", "error"); return;
    }

    const wishEntry = {
      id: `W_${Date.now()}`,
      candidateId: user.id,
      majorCode: newWish.majorCode,
      methodId: newWish.methodId,
      combo: newWish.combo,
      priority: myWishes.length + 1,
      totalScore: parseFloat(newWish.totalScore),
      bonusScore: 0, 
      status: 'PENDING'
    };

    setWishes([...wishes, wishEntry]);
    addAuditLog('ADD_WISH', `Thêm NV: ${wishEntry.majorCode} - PT${wishEntry.methodId}`);
    addToast("Thêm nguyện vọng thành công!", "success");
    setShowForm(false);
  };

  const movePriority = (wishId, direction) => {
    if (isSystemLocked) return;
    let currentWishes = [...myWishes];
    const idx = currentWishes.findIndex(w => w.id === wishId);
    if (idx < 0) return;

    if (direction === 'UP' && idx > 0) {
      let temp = currentWishes[idx].priority;
      currentWishes[idx].priority = currentWishes[idx-1].priority;
      currentWishes[idx-1].priority = temp;
    } else if (direction === 'DOWN' && idx < currentWishes.length - 1) {
      let temp = currentWishes[idx].priority;
      currentWishes[idx].priority = currentWishes[idx+1].priority;
      currentWishes[idx+1].priority = temp;
    } else return;

    const updatedIds = currentWishes.map(w => w.id);
    setWishes(prev => prev.map(w => updatedIds.includes(w.id) ? currentWishes.find(cw => cw.id === w.id) : w));
    addAuditLog('REORDER_WISH', `Đổi thứ tự ưu tiên NV`);
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
    addToast("Đã xóa nguyện vọng", "info");
  };

  const feeTotal = myWishes.length * 50000;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col items-center mb-6 border-b border-slate-100 pb-6">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-200">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-800">{user.name}</h3>
            <p className="text-sm text-slate-500 font-mono mt-1">{user.cccd}</p>
          </div>
          
          <div className="space-y-4 text-sm mb-6">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500">Khu vực ưu tiên:</span>
              <span className="font-bold text-slate-800">{user.region}</span>
            </div>
            
            <div className={`p-4 rounded-xl border ${user.isPaid ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={user.isPaid ? 'text-green-800 font-medium' : 'text-amber-800 font-medium'}>Lệ phí xét tuyển:</span>
                <span className={`font-extrabold ${user.isPaid ? 'text-green-600' : 'text-amber-600'}`}>{feeTotal.toLocaleString()}đ</span>
              </div>
              {!user.isPaid && myWishes.length > 0 && (
                <button onClick={handlePayment} className="w-full bg-amber-500 text-white font-bold py-2 rounded-lg hover:bg-amber-600 transition flex items-center justify-center">
                  <CreditCard className="w-4 h-4 mr-2"/> Thanh toán ngay
                </button>
              )}
              {user.isPaid && (
                <div className="text-xs text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Đã hoàn tất</div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <label className="block text-sm font-bold text-slate-700 mb-3">Tải lên Hồ sơ (PDF)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
              <input type="file" accept=".pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <span className="text-xs text-slate-500 font-medium">Bấm hoặc kéo thả file Minh chứng/IELTS vào đây</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Admission Notification */}
        {isSystemLocked && !isSystemOpen && (
          <div className={`rounded-3xl p-6 md:p-8 shadow-sm border flex flex-col md:flex-row items-start md:items-center justify-between ${isAdmitted ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start">
              {isAdmitted ? <CheckCircle className="w-10 h-10 text-green-500 mr-4 mt-1 flex-shrink-0" /> : <AlertTriangle className="w-10 h-10 text-red-500 mr-4 mt-1 flex-shrink-0" />}
              <div>
                <h4 className={`font-extrabold text-2xl mb-2 ${isAdmitted ? 'text-green-800' : 'text-red-800'}`}>
                  {isAdmitted ? 'CHÚC MỪNG TRÚNG TUYỂN!' : 'Rất tiếc, bạn chưa trúng tuyển.'}
                </h4>
                <p className={`text-base ${isAdmitted ? 'text-green-700' : 'text-red-700'}`}>
                  {isAdmitted 
                    ? `Bạn đã trúng tuyển NV${myWishes.find(w=>w.status==='ADMITTED')?.priority}. Theo quy chế, các NV dưới đã tự động hủy.`
                    : 'Điểm xét của bạn chưa đủ để trúng tuyển đợt 1. Vui lòng theo dõi thông báo xét tuyển bổ sung.'}
                </p>
              </div>
            </div>
            {isAdmitted && !user.isConfirmed && (
              <button onClick={handleConfirmAdmission} className="mt-6 md:mt-0 w-full md:w-auto bg-green-600 text-white font-bold px-6 py-4 rounded-xl hover:bg-green-700 shadow-md transition-transform transform hover:scale-105">
                Xác nhận Nhập học
              </button>
            )}
            {user.isConfirmed && (
              <div className="mt-6 md:mt-0 w-full md:w-auto bg-green-800 text-white font-bold px-6 py-4 rounded-xl shadow-inner text-center">
                <Check className="w-5 h-5 inline mr-2"/> ĐÃ XÁC NHẬN
              </div>
            )}
          </div>
        )}

        {/* Wishes List */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-extrabold text-slate-800">Hồ sơ Nguyện vọng</h3>
            <span className="text-sm bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold">
              Đã đăng ký: {myWishes.length}/15
            </span>
          </div>

          <div className="space-y-4 mb-8">
            {myWishes.length === 0 ? (
               <div className="text-center p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-medium">
                  Hồ sơ trống. Bấm nút Thêm nguyện vọng để bắt đầu.
               </div>
            ) : myWishes.map((wish, index) => {
              const majorInfo = MAJORS.find(m => m.code === wish.majorCode);
              const methodInfo = METHODS.find(m => m.id === wish.methodId);
              return (
                <div key={wish.id} className={`relative flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl transition-all border-2
                  ${wish.status === 'ADMITTED' ? 'border-green-400 bg-green-50/30' : 
                    wish.status === 'REJECTED' || wish.status === 'CANCELED' ? 'border-slate-200 bg-slate-50 opacity-60' : 
                    'border-slate-100 bg-white hover:border-blue-300 hover:shadow-md'}`}
                >
                  <div className="flex items-center space-x-5 mb-4 md:mb-0 w-full">
                    <div className={`w-12 h-12 rounded-xl flex flex-shrink-0 items-center justify-center font-black text-xl shadow-sm
                      ${wish.status === 'ADMITTED' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                      {wish.priority}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-extrabold text-lg leading-tight mb-1 ${wish.status === 'ADMITTED' ? 'text-green-800' : 'text-slate-800'}`}>
                        {majorInfo?.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-600">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-medium">{wish.majorCode}</span>
                        <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-medium">{methodInfo?.name}</span>
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-bold">Điểm: {wish.totalScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full md:w-auto pl-16 md:pl-0">
                    {wish.status === 'ADMITTED' && <span className="text-green-600 font-black uppercase text-sm mr-2 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Trúng tuyển</span>}
                    {wish.status === 'REJECTED' && <span className="text-red-500 font-black uppercase text-sm mr-2">Trượt</span>}
                    {wish.status === 'CANCELED' && <span className="text-slate-400 font-bold uppercase text-xs mr-2">Hủy (Đỗ NV trên)</span>}

                    {!isSystemLocked && (
                      <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-200">
                        <button disabled={index === 0} onClick={() => movePriority(wish.id, 'UP')} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg disabled:opacity-30 transition">
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button disabled={index === myWishes.length - 1} onClick={() => movePriority(wish.id, 'DOWN')} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg disabled:opacity-30 transition">
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <div className="w-px bg-slate-200 mx-1"></div>
                        <button onClick={() => deleteWish(wish.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {!isSystemLocked && (
            showForm ? (
              <div className="border border-slate-200 bg-slate-50 rounded-2xl p-6 md:p-8 animate-fade-in">
                <h4 className="font-extrabold text-slate-800 text-lg mb-6 flex items-center">
                  Đăng ký Nguyện vọng Xét tuyển
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Ngành đào tạo KTH</label>
                    <select 
                      className="w-full p-3 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 bg-white"
                      value={newWish.majorCode}
                      onChange={(e) => {
                        const major = MAJORS.find(m => m.code === e.target.value);
                        setNewWish({...newWish, majorCode: major.code, combo: major.combos[0]});
                      }}
                    >
                      {MAJORS.map(m => <option key={m.code} value={m.code}>{m.code} - {m.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Phương thức (PT)</label>
                    <select 
                      className="w-full p-3 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={newWish.methodId}
                      onChange={(e) => setNewWish({...newWish, methodId: Number(e.target.value)})}
                    >
                      {METHODS.map(m => <option key={m.id} value={m.id}>PT {m.id}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Tổ hợp / Điểm</label>
                    <div className="flex space-x-2">
                      <select 
                        className="w-1/2 p-3 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={newWish.combo}
                        onChange={(e) => setNewWish({...newWish, combo: e.target.value})}
                      >
                        {MAJORS.find(m => m.code === newWish.majorCode)?.combos.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input 
                        type="number" 
                        placeholder="Điểm..." 
                        className="w-1/2 p-3 text-sm font-bold border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-600"
                        value={newWish.totalScore}
                        onChange={(e) => setNewWish({...newWish, totalScore: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="bg-white border border-slate-300 text-slate-600 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition shadow-sm">
                    Hủy bỏ
                  </button>
                  <button onClick={handleAddWish} className="bg-slate-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-slate-800 transition shadow-lg">
                    Thêm Nguyện vọng
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowForm(true)} 
                className="w-full border-2 border-dashed border-slate-300 text-slate-500 font-bold py-6 rounded-2xl flex items-center justify-center hover:bg-slate-50 hover:text-slate-800 hover:border-slate-400 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" /> Thêm Nguyện vọng Mới
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. ADMIN DASHBOARD (QUẢN TRỊ)
// ==========================================
function AdminDashboard({ wishes, setWishes, candidates, auditLogs, setAuditLogs, addToast, adminUser }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const displayWishes = wishes.map(w => {
    const candidate = candidates.find(c => c.id === w.candidateId);
    return { ...w, candidateName: candidate?.name, cccd: candidate?.cccd };
  });

  // Mô phỏng Supabase Edge Function chạy thuật toán xét tuyển
  const runAdmissionAlgorithm = () => {
    setIsProcessing(true);
    addToast("Khởi tạo API Gọi Supabase Edge Function...", "info");
    
    setTimeout(() => {
      let newWishes = JSON.parse(JSON.stringify(wishes));
      newWishes.forEach(w => w.status = 'PENDING');

      MAJORS.forEach(major => {
        let majorWishes = newWishes.filter(w => w.majorCode === major.code && w.status === 'PENDING');

        // Sắp xếp theo: 1. Điểm tổng | 2. Điểm cộng (thấp hơn là ưu tiên) | 3. Thứ tự nguyện vọng
        majorWishes.sort((a, b) => {
          if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
          if (a.bonusScore !== b.bonusScore) return a.bonusScore - b.bonusScore;
          return a.priority - b.priority;
        });

        // Cắt theo chỉ tiêu
        const admittedWishes = majorWishes.slice(0, major.quota);

        admittedWishes.forEach(aw => {
          newWishes.find(w => w.id === aw.id).status = 'ADMITTED';
          // Rớt các NV thấp hơn
          newWishes.forEach(w => {
            if (w.candidateId === aw.candidateId && w.priority > aw.priority && w.status === 'PENDING') {
              w.status = 'CANCELED';
            }
          });
        });
      });

      // Từ chối các NV còn lại
      newWishes.forEach(w => { if (w.status === 'PENDING') w.status = 'REJECTED'; });

      setWishes(newWishes);
      setAuditLogs(prev => [{
        id: Date.now(), 
        time: new Date().toISOString(), 
        actor: adminUser.id, 
        action: 'BATCH_ADMISSION_RUN', 
        detail: 'Chạy thuật toán xét tuyển 2026. Data lưu tại PostgreSQL.'
      }, ...prev]);

      setIsProcessing(false);
      addToast("Chạy Lọc ảo & Cập nhật Database thành công!", "success");
    }, 1500);
  };

  const handleExport = () => {
    addToast("Đang kết nối Supabase Storage tải báo cáo (CSV)...", "info");
    addAuditLog('EXPORT_REPORT', 'Xuất dữ liệu báo cáo ra file Excel');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-6 md:mb-0">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Supabase Admin Console</h2>
          <p className="text-slate-500 font-medium flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> Hệ thống đang live trên Vercel
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={handleExport} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3 rounded-xl flex items-center transition flex-1 md:flex-none justify-center">
            <Download className="w-5 h-5 mr-2" /> Báo cáo
          </button>
          <button 
            onClick={runAdmissionAlgorithm}
            disabled={isProcessing}
            className={`font-bold px-6 py-3 rounded-xl shadow-lg flex items-center transition flex-1 md:flex-none justify-center
              ${isProcessing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
          >
            {isProcessing ? <><Clock className="w-5 h-5 mr-2 animate-spin" /> Xử lý...</> : <><Settings className="w-5 h-5 mr-2" /> Lọc ảo & Xét tuyển</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng Chỉ tiêu', val: MAJORS.reduce((acc, m) => acc + m.quota, 0), color: 'text-slate-900' },
          { label: 'Tổng Thí sinh', val: candidates.length, color: 'text-blue-600' },
          { label: 'Tổng NV', val: wishes.length, color: 'text-indigo-600' },
          { label: 'Trúng tuyển', val: wishes.filter(w=>w.status==='ADMITTED').length, color: 'text-green-600' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">{kpi.label}</p>
            <h4 className={`text-4xl font-black ${kpi.color}`}>{kpi.val}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg flex items-center">
               Dữ liệu Nguyện vọng (PostgreSQL View)
            </h3>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 font-bold border-b border-slate-100 sticky top-0 bg-white z-10">
                <tr>
                  <th className="p-4 uppercase text-xs tracking-wider">Thí sinh</th>
                  <th className="p-4 uppercase text-xs tracking-wider">Ngành / NV</th>
                  <th className="p-4 uppercase text-xs tracking-wider text-right">Điểm</th>
                  <th className="p-4 uppercase text-xs tracking-wider text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayWishes.sort((a,b) => a.majorCode.localeCompare(b.majorCode) || b.totalScore - a.totalScore).map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{w.candidateName}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{w.cccd}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-indigo-600">{w.majorCode}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Ưu tiên số: <b>{w.priority}</b></div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-700">
                      {w.totalScore}
                    </td>
                    <td className="p-4 text-center">
                      {w.status === 'PENDING' && <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide">Chờ xét</span>}
                      {w.status === 'ADMITTED' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide">Trúng tuyển</span>}
                      {w.status === 'REJECTED' && <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide">Trượt</span>}
                      {w.status === 'CANCELED' && <span className="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide">Đã Hủy</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="lg:col-span-1 bg-[#0f172a] rounded-3xl shadow-xl overflow-hidden flex flex-col h-[600px] border border-[#1e293b]">
          <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center text-white backdrop-blur-md">
            <h3 className="font-bold flex items-center text-sm uppercase tracking-wider text-slate-300">
               Audit Logs
            </h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <div className="overflow-y-auto flex-1 p-5 space-y-5 font-mono text-[11px] leading-relaxed">
            {auditLogs.length === 0 ? (
              <div className="text-slate-600 text-center mt-10">Waiting for events...</div>
            ) : auditLogs.map(log => (
              <div key={log.id} className="border-l border-blue-500/50 pl-4 relative">
                <div className="absolute w-2 h-2 rounded-full bg-blue-500 -left-[4.5px] top-1.5"></div>
                <div className="text-slate-400 mb-1">{new Date(log.time).toLocaleTimeString('vi-VN')} <span className="text-slate-500">|</span> <span className="text-indigo-400">{log.actor}</span></div>
                <div className="text-green-400 font-bold mb-1">[{log.action}]</div>
                <div className="text-slate-300 break-words">{log.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}