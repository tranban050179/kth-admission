<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>Học viện KTH - Cổng Xét tuyển Trực tuyến 2026</title>
    <!-- Tailwind CSS + Font Awesome + Google Fonts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet">
    <style>
        * { font-family: 'Inter', sans-serif; }
        .animate-fade-in { animation: fadeIn 0.25s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .toast-slide { animation: slideInRight 0.2s ease-out; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        input:focus, button:focus { outline: none; ring: 2px solid #003366; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 8px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
    </style>
</head>
<body class="bg-[#f1f5f9] text-slate-800 antialiased">
    <div id="app-root"></div>

    <script>
        // ======================== DỮ LIỆU MÔ PHỎNG ========================
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
        const isSystemOpen = CURRENT_DATE >= DEADLINE_START && CURRENT_DATE <= DEADLINE_END;

        let candidates = [
            { id: 'C001', name: 'Nguyễn Văn A', cccd: '001099001111', password: 'password', region: 'KV1', target: 'UT1', isPaid: false, isConfirmed: false, phone: '0901234567', email: 'nguyenvana@gmail.com' },
            { id: 'C002', name: 'Trần Thị B', cccd: '001099002222', password: 'password', region: 'KV2', target: 'NONE', isPaid: true, isConfirmed: false, phone: '0987654321', email: 'tranthib@gmail.com' },
        ];

        let wishes = [
            { id: 'W1', candidateId: 'C001', majorCode: 'KTHDS01', methodId: 5, combo: 'A00', priority: 1, totalScore: 28.5, bonusScore: 2.5, status: 'PENDING' },
            { id: 'W2', candidateId: 'C001', majorCode: 'KTHDS02', methodId: 5, combo: 'A00', priority: 2, totalScore: 29.0, bonusScore: 2.5, status: 'PENDING' },
            { id: 'W3', candidateId: 'C002', majorCode: 'KTHDS01', methodId: 4, combo: 'D01', priority: 1, totalScore: 28.8, bonusScore: 0.25, status: 'PENDING' },
        ];

        let auditLogs = [];

        // State quản lý giao diện
        let currentUser = null;       // { id, name, role, ... }
        let activeTab = 'home';       // 'home', 'login', 'portal', 'admin'
        let toasts = [];

        // Helper thông báo
        function addToast(message, type = 'info') {
            const id = Date.now() + Math.random();
            toasts.push({ id, message, type });
            setTimeout(() => {
                toasts = toasts.filter(t => t.id !== id);
                renderApp();
            }, 3500);
            renderApp();
        }

        // Lưu lại dữ liệu vào biến toàn cục (tương tác)
        function updateCandidates(newCandidates) { candidates = newCandidates; renderApp(); }
        function updateWishes(newWishes) { wishes = newWishes; renderApp(); }
        function addAuditLog(action, detail) {
            auditLogs = [{ id: Date.now(), time: new Date().toISOString(), actor: currentUser?.id || 'system', action, detail }, ...auditLogs].slice(0, 50);
            renderApp();
        }

        // ======================== ĐĂNG NHẬP ========================
        function handleLogin(cccd, password, roleHint = 'CANDIDATE') {
            if (cccd === 'admin' && password === 'admin') {
                currentUser = { id: 'A001', name: 'Ban Tuyển sinh', role: 'ADMIN' };
                activeTab = 'admin';
                addToast('Đăng nhập Quản trị thành công!', 'success');
                addAuditLog('LOGIN_ADMIN', 'Admin đăng nhập');
                renderApp();
                return;
            }
            const user = candidates.find(c => c.cccd === cccd && c.password === password);
            if (user) {
                currentUser = { ...user, role: 'CANDIDATE' };
                activeTab = 'portal';
                addToast(`Xin chào ${user.name}, chào mừng đến cổng xét tuyển!`, 'success');
                addAuditLog('LOGIN_CANDIDATE', `${user.cccd} đăng nhập`);
                renderApp();
            } else {
                addToast('Sai CCCD hoặc mật khẩu!', 'error');
            }
        }

        function logout() {
            currentUser = null;
            activeTab = 'home';
            addToast('Đã đăng xuất', 'info');
            renderApp();
        }

        // ================ Hàm xử lý nghiệp vụ Nguyện vọng & Thanh toán ================
        function getMyWishes() {
            if (!currentUser) return [];
            return wishes.filter(w => w.candidateId === currentUser.id).sort((a,b) => a.priority - b.priority);
        }

        function addWish(majorCode, methodId, combo, totalScore) {
            if (!currentUser) return false;
            const myWishes = getMyWishes();
            if (!currentUser.isPaid && myWishes.length > 0) { addToast("Vui lòng thanh toán lệ phí trước khi thêm nguyện vọng.", "error"); return false; }
            if (myWishes.length >= 15) { addToast("Tối đa 15 nguyện vọng.", "error"); return false; }
            if (!totalScore || totalScore <= 0 || totalScore > 30) { addToast("Điểm không hợp lệ (0-30).", "error"); return false; }
            const newId = `W_${Date.now()}_${Math.random()}`;
            const newWish = {
                id: newId,
                candidateId: currentUser.id,
                majorCode,
                methodId: parseInt(methodId),
                combo,
                priority: myWishes.length + 1,
                totalScore: parseFloat(totalScore),
                bonusScore: 0,
                status: 'PENDING'
            };
            updateWishes([...wishes, newWish]);
            addAuditLog('ADD_WISH', `Thêm NV: ${majorCode} - ${combo} - ${totalScore}đ`);
            addToast("Thêm nguyện vọng thành công!", "success");
            return true;
        }

        function deleteWish(wishId) {
            if (!currentUser) return;
            const myWishes = getMyWishes();
            const targetWish = myWishes.find(w => w.id === wishId);
            if (!targetWish) return;
            if (!isSystemOpen) { addToast("Hệ thống đã đóng đăng ký!", "error"); return; }
            let newWishes = wishes.filter(w => w.id !== wishId);
            // sắp xếp lại priority
            const remaining = newWishes.filter(w => w.candidateId === currentUser.id).sort((a,b) => a.priority - b.priority);
            remaining.forEach((w, idx) => { w.priority = idx + 1; });
            newWishes = newWishes.map(w => {
                if (w.candidateId === currentUser.id) {
                    const upd = remaining.find(r => r.id === w.id);
                    if (upd) return upd;
                }
                return w;
            });
            updateWishes(newWishes);
            addAuditLog('DELETE_WISH', `Xóa NV ${targetWish.majorCode}`);
            addToast("Đã xóa nguyện vọng.", "info");
        }

        function movePriority(wishId, direction) {
            if (!currentUser || !isSystemOpen) return;
            let myWishes = getMyWishes();
            const idx = myWishes.findIndex(w => w.id === wishId);
            if (idx === -1) return;
            if (direction === 'UP' && idx > 0) {
                [myWishes[idx].priority, myWishes[idx-1].priority] = [myWishes[idx-1].priority, myWishes[idx].priority];
            } else if (direction === 'DOWN' && idx < myWishes.length-1) {
                [myWishes[idx].priority, myWishes[idx+1].priority] = [myWishes[idx+1].priority, myWishes[idx].priority];
            } else return;
            const updatedWishes = wishes.map(w => {
                if (w.candidateId === currentUser.id) {
                    const found = myWishes.find(mw => mw.id === w.id);
                    if (found) return found;
                }
                return w;
            });
            updateWishes(updatedWishes);
            addAuditLog('REORDER_WISH', `Thay đổi thứ tự ưu tiên`);
        }

        function handlePayment() {
            if (!currentUser) return;
            const updated = candidates.map(c => c.id === currentUser.id ? { ...c, isPaid: true } : c);
            updateCandidates(updated);
            currentUser = { ...currentUser, isPaid: true };
            addAuditLog('PAYMENT', `Thanh toán lệ phí cho ${getMyWishes().length} nguyện vọng.`);
            addToast("Thanh toán thành công! Bạn có thể thêm/xóa nguyện vọng.", "success");
        }

        // ================ ADMIN xét duyệt ================
        function adminUpdateWishStatus(wishId, newStatus) {
            const newWishes = wishes.map(w => w.id === wishId ? { ...w, status: newStatus } : w);
            updateWishes(newWishes);
            addAuditLog('ADMIN_UPDATE', `Cập nhật trạng thái NV ${wishId} thành ${newStatus}`);
            addToast(`Cập nhật trạng thái nguyện vọng`, 'success');
        }

        // ======================== RENDER CHÍNH ========================
        function renderApp() {
            const root = document.getElementById('app-root');
            if (!root) return;
            let html = `
                <div class="fixed top-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
                    ${toasts.map(t => `
                        <div class="pointer-events-auto bg-white rounded-lg shadow-lg border-l-4 ${t.type === 'success' ? 'border-green-500' : t.type === 'error' ? 'border-red-500' : 'border-blue-500'} p-3 flex items-center gap-3 text-sm font-medium animate-fade-in">
                            ${t.type === 'success' ? '<i class="fas fa-check-circle text-green-500 text-lg"></i>' : t.type === 'error' ? '<i class="fas fa-exclamation-triangle text-red-500"></i>' : '<i class="fas fa-bell text-blue-500"></i>'}
                            <span>${escapeHtml(t.message)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            if (activeTab === 'portal' && currentUser && currentUser.role === 'CANDIDATE') {
                html += renderCandidatePortal();
            } else if (activeTab === 'admin' && currentUser && currentUser.role === 'ADMIN') {
                html += renderAdminDashboard();
            } else {
                // public layout (home / login)
                html += renderPublicLayout();
            }
            root.innerHTML = html;
            attachGlobalEvents();
        }

        function renderPublicLayout() {
            if (activeTab === 'login') return renderLoginPage();
            return renderHomePage();
        }

        function renderHomePage() {
            return `
                <div class="min-h-screen flex flex-col">
                    <!-- topbar -->
                    <div class="bg-red-700 text-white text-xs py-2 hidden md:block">
                        <div class="max-w-7xl mx-auto px-4 flex justify-between">
                            <div class="flex gap-5"><i class="fas fa-phone-alt mr-1"></i> Hotline: ${ACADEMY_INFO.hotline} <i class="fas fa-globe ml-4 mr-1"></i> ${ACADEMY_INFO.website}</div>
                            <div class="flex gap-5 uppercase font-semibold"><a href="#">Tin tức</a><a href="#">Tài liệu</a><a href="#">Hỗ trợ</a></div>
                        </div>
                    </div>
                    <!-- header -->
                    <header class="bg-white shadow-md sticky top-0 z-40">
                        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                            <div class="flex items-center gap-3 cursor-pointer" onclick="window.dispatchEvent(new CustomEvent('navigate', {detail:{tab:'home'}}))">
                                <i class="fas fa-shield-alt text-4xl text-[#003366]"></i>
                                <div><h1 class="font-black text-lg md:text-xl text-[#003366] uppercase">Học viện Kỹ thuật và<br class="hidden md:block"/> Công nghệ An ninh</h1></div>
                            </div>
                            <button onclick="window.dispatchEvent(new CustomEvent('navigate', {detail:{tab:'login'}}))" class="hidden md:flex bg-white border border-[#003366] text-[#003366] font-bold px-5 py-2 rounded hover:bg-[#003366] hover:text-white transition"><i class="fas fa-sign-in-alt mr-2"></i> Đăng nhập / Đăng ký</button>
                        </div>
                    </header>
                    <main class="flex-1 max-w-7xl mx-auto px-4 py-8">${renderPublicHomeContent()}</main>
                    <footer class="bg-[#002244] text-slate-300 py-8 border-t-4 border-red-700 text-sm">
                        <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
                            <div><i class="fas fa-shield-alt text-red-600 text-2xl mb-2 block"></i><h4 class="font-bold text-white">${ACADEMY_INFO.name}</h4><p class="mt-2"><i class="fas fa-map-marker-alt mr-1"></i> Hòa Lạc, Hà Nội - Thuận Thành, Bắc Ninh</p></div>
                            <div><h4 class="font-bold text-white uppercase">Liên hệ</h4><p><i class="fas fa-phone-alt mr-2"></i>${ACADEMY_INFO.hotline}</p><p><i class="fas fa-envelope mr-2"></i> tuyensinh@hvktcnan.edu.vn</p></div>
                            <div><h4 class="font-bold text-white uppercase">Hỗ trợ</h4><a href="#" class="block hover:text-yellow-300">Đề án tuyển sinh 2026</a></div>
                        </div>
                    </footer>
                </div>
            `;
        }

        function renderPublicHomeContent() {
            return `
                <div class="grid lg:grid-cols-4 gap-8 animate-fade-in">
                    <div class="lg:col-span-3 bg-white p-6 rounded shadow">
                        <h1 class="text-2xl font-black text-[#003366] uppercase">Thông báo Tuyển sinh Đại học (Hệ dân sự) năm 2026</h1>
                        <div class="text-xs text-slate-500 my-3"><i class="far fa-calendar-alt mr-1"></i> 10/02/2026 &nbsp; <i class="far fa-eye"></i> 15.240 lượt xem</div>
                        <p class="mb-4">Học viện Kỹ thuật và Công nghệ an ninh (Mã trường: <strong>KTH</strong>) thông báo tuyển sinh 100 chỉ tiêu hệ đại học chính quy với 5 ngành mũi nhọn.</p>
                        <h3 class="font-bold text-[#003366] border-l-4 border-red-600 pl-3 my-4">Danh sách ngành & chỉ tiêu</h3>
                        <div class="overflow-x-auto"><table class="w-full text-sm border"><thead class="bg-[#003366] text-white"><tr><th class="p-2 border">Mã</th><th class="p-2 border">Ngành</th><th class="p-2 border">Chỉ tiêu</th><th class="p-2 border">Tổ hợp</th></tr></thead><tbody>
                            ${MAJORS.map(m => `<tr><td class="p-2 border font-bold text-red-700">${m.code}</td><td class="p-2 border">${m.name}</td><td class="p-2 border text-center">${m.quota}</td><td class="p-2 border">${m.combos.join(', ')}</td></tr>`).join('')}
                        </tbody></table></div>
                        <div class="mt-6 text-center"><button onclick="window.dispatchEvent(new CustomEvent('navigate', {detail:{tab:'login'}}))" class="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded shadow transition"><i class="fas fa-file-alt mr-2"></i> ĐĂNG KÝ XÉT TUYỂN NGAY</button></div>
                    </div>
                    <div class="bg-white p-4 rounded shadow border">
                        <div class="font-bold text-[#003366] border-b pb-2"><i class="far fa-clock"></i> Kế hoạch TS</div>
                        <ul class="mt-3 text-sm space-y-3"><li class="border-l-2 border-[#003366] pl-2">📌 02/07 - 14/07: Đăng ký NV</li><li class="border-l-2 border-red-600 pl-2">🎯 21/08: Công bố kết quả</li></ul>
                        <div class="mt-5"><i class="fas fa-download"></i> Tài liệu: <a href="#" class="text-red-600 block text-xs">Đề án tuyển sinh 2026 (PDF)</a></div>
                    </div>
                </div>
            `;
        }

        function renderLoginPage() {
            return `
                <div class="min-h-[80vh] flex items-center justify-center py-8">
                    <div class="max-w-4xl w-full bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                        <div class="md:w-5/12 bg-[#003366] text-white p-8">
                            <i class="fas fa-shield-alt text-5xl text-red-500 mb-4"></i>
                            <h2 class="text-2xl font-black uppercase">Cổng Xét tuyển 2026</h2>
                            <p class="text-sm mt-2">Đăng nhập bằng CCCD đã đăng ký</p>
                            <div class="mt-6 text-xs"><i class="fas fa-check-circle text-yellow-400"></i> Tối đa 15 NV<br/><i class="fas fa-credit-card mt-2"></i> Thanh toán trực tuyến</div>
                        </div>
                        <div class="md:w-7/12 p-8">
                            <h3 class="text-2xl font-bold text-[#003366]">Đăng nhập</h3>
                            <form id="loginForm" class="mt-6 space-y-4">
                                <div><label class="block text-xs font-bold uppercase">Số CCCD</label><div class="relative"><i class="fas fa-user absolute left-3 top-3 text-slate-400"></i><input type="text" id="cccd" class="w-full border p-2 pl-9 rounded" placeholder="001099001111" value="001099001111"></div></div>
                                <div><label class="block text-xs font-bold uppercase">Mật khẩu</label><div class="relative"><i class="fas fa-lock absolute left-3 top-3 text-slate-400"></i><input type="password" id="password" class="w-full border p-2 pl-9 rounded" placeholder="password" value="password"></div></div>
                                <button type="submit" class="w-full bg-red-700 text-white font-bold py-2 rounded hover:bg-red-800"><i class="fas fa-sign-in-alt mr-2"></i> Đăng nhập</button>
                            </form>
                            <div class="mt-5 text-xs bg-slate-100 p-3 rounded"><strong>Tài khoản demo:</strong><br/>📌 Thí sinh: CCCD 001099001111 / password<br/>👑 Admin: admin / admin</div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Candidate Portal
        function renderCandidatePortal() {
            const myWishes = getMyWishes();
            const isLocked = !isSystemOpen || myWishes.some(w => ['ADMITTED','REJECTED'].includes(w.status));
            const canModify = !isLocked;
            const paidStatus = currentUser.isPaid ? "Đã thanh toán" : "Chưa thanh toán";
            return `
                <div class="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto py-6 px-4">
                    <aside class="md:w-72 bg-white rounded shadow p-4 h-fit sticky top-24">
                        <div class="bg-[#003366] text-white -mx-4 -mt-4 p-4 rounded-t"><i class="fas fa-user-graduate mr-2"></i> ${escapeHtml(currentUser.name)}<div class="text-xs">Mã TS: ${currentUser.id}</div></div>
                        <nav class="mt-4 space-y-1">
                            <button data-nav="profile" class="nav-btn w-full text-left p-2 rounded hover:bg-slate-100 flex items-center gap-2"><i class="fas fa-user-circle w-5"></i> Thông tin</button>
                            <button data-nav="wishes" class="nav-btn w-full text-left p-2 rounded hover:bg-slate-100 flex items-center gap-2"><i class="fas fa-list-ul w-5"></i> Nguyện vọng</button>
                            <button data-nav="payment" class="nav-btn w-full text-left p-2 rounded hover:bg-slate-100 flex items-center gap-2"><i class="fas fa-credit-card w-5"></i> Thanh toán</button>
                            <button data-nav="results" class="nav-btn w-full text-left p-2 rounded hover:bg-slate-100 flex items-center gap-2"><i class="fas fa-chart-line w-5"></i> Kết quả</button>
                        </nav>
                    </aside>
                    <div class="flex-1" id="portalContent">
                        <!-- default hiển thị nguyện vọng -->
                    </div>
                </div>
            `;
        }

        function renderCandidateSubView(view) {
            const myWishes = getMyWishes();
            const isLocked = !isSystemOpen || myWishes.some(w => ['ADMITTED','REJECTED'].includes(w.status));
            const canModify = !isLocked;
            if (view === 'profile') {
                return `<div class="bg-white p-6 rounded shadow"><h3 class="text-xl font-bold text-[#003366]">Thông tin cá nhân</h3>
                <div class="grid md:grid-cols-2 gap-4 mt-4"><div><label class="text-xs font-bold">Họ tên</label><input value="${escapeHtml(currentUser.name)}" class="w-full border rounded p-2 bg-slate-50" disabled/></div>
                <div><label class="text-xs font-bold">CCCD</label><input value="${currentUser.cccd}" disabled class="w-full border rounded p-2 bg-slate-50"/></div>
                <div><label class="text-xs font-bold">Điện thoại</label><input id="phone" value="${currentUser.phone || ''}" class="w-full border rounded p-2"/></div>
                <div><label class="text-xs font-bold">Email</label><input id="email" value="${currentUser.email || ''}" class="w-full border rounded p-2"/></div>
                </div><div class="mt-4 flex justify-end"><button id="updateProfileBtn" class="bg-[#003366] text-white px-5 py-2 rounded">Cập nhật</button></div></div>`;
            }
            if (view === 'payment') {
                return `<div class="bg-white p-6 rounded shadow"><h3 class="text-xl font-bold text-[#003366]">Thanh toán lệ phí xét tuyển</h3>
                <p class="mt-2">Phí đăng ký: 30.000đ / nguyện vọng. Tổng số NV hiện tại: ${myWishes.length}</p>
                <p class="font-bold mt-2">Trạng thái: <span class="${currentUser.isPaid ? 'text-green-600' : 'text-red-500'}">${paidStatus}</span></p>
                ${!currentUser.isPaid ? `<button id="payNowBtn" class="mt-4 bg-green-700 text-white px-6 py-2 rounded shadow">Thanh toán ngay (demo)</button>` : '<div class="mt-4 bg-green-100 p-3 rounded">✅ Bạn đã hoàn tất thanh toán.</div>'}
                </div>`;
            }
            if (view === 'results') {
                const admittedWish = myWishes.find(w => w.status === 'ADMITTED');
                return `<div class="bg-white p-6 rounded shadow"><h3 class="text-xl font-bold">Kết quả xét tuyển</h3>
                ${myWishes.length === 0 ? '<p>Chưa có nguyện vọng nào.</p>' : `<ul class="mt-4 space-y-2">${myWishes.map(w => `<li class="border p-3 rounded flex justify-between"><span><b>${MAJORS.find(m=>m.code===w.majorCode)?.name || w.majorCode}</b> - NV${w.priority}</span><span class="font-bold ${w.status === 'ADMITTED' ? 'text-green-600' : w.status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'}">${w.status === 'PENDING' ? 'Đang xét' : w.status === 'ADMITTED' ? 'TRÚNG TUYỂN' : 'KHÔNG TRÚNG'}</span></li>`).join('')}</ul>`}
                ${admittedWish ? `<div class="mt-4 p-4 bg-green-100 border border-green-300 rounded"><i class="fas fa-check-circle text-green-600"></i> Chúc mừng! Bạn đã trúng tuyển nguyện vọng ${admittedWish.priority}. Vui lòng xác nhận nhập học.</div>` : ''}</div>`;
            }
            // wishes view (mặc định)
            return `<div class="bg-white p-6 rounded shadow">
                <div class="flex justify-between items-center"><h3 class="text-xl font-bold text-[#003366]">Danh sách nguyện vọng (${myWishes.length}/15)</h3>
                ${canModify && isSystemOpen ? `<button id="showAddWishBtn" class="bg-red-600 text-white px-4 py-2 rounded text-sm"><i class="fas fa-plus"></i> Thêm NV</button>` : ''}</div>
                ${myWishes.length === 0 ? '<div class="text-center p-6 text-slate-400">Chưa có nguyện vọng. Bấm thêm mới.</div>' : `
                <div class="overflow-x-auto mt-4"><table class="w-full text-sm border"><thead class="bg-slate-100"><tr><th>#</th><th>Ngành</th><th>PT xét tuyển</th><th>Tổ hợp</th><th>Điểm</th><th>Trạng thái</th><th class="w-24">Thao tác</th></tr></thead><tbody>
                ${myWishes.map(w => {
                    const major = MAJORS.find(m => m.code === w.majorCode);
                    const method = METHODS.find(m => m.id === w.methodId);
                    return `<tr><td class="p-2 border">${w.priority}</td>
                    <td class="p-2 border">${major?.name || w.majorCode}</td>
                    <td class="p-2 border">${method?.name.slice(0,20) || 'PT'+w.methodId}</td>
                    <td class="p-2 border">${w.combo}</td>
                    <td class="p-2 border">${w.totalScore}</td>
                    <td class="p-2 border"><span class="px-2 py-0.5 rounded text-xs ${w.status==='PENDING'?'bg-yellow-100 text-yellow-800':w.status==='ADMITTED'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}">${w.status === 'PENDING' ? 'Chờ duyệt' : w.status}</span></td>
                    <td class="p-2 border">${canModify && w.status === 'PENDING' ? `<button class="deleteWishBtn text-red-500 hover:text-red-700 mx-1" data-id="${w.id}"><i class="fas fa-trash-alt"></i></button>
                    <button class="moveUpBtn ${w.priority===1?'opacity-30 pointer-events-none':''}" data-id="${w.id}"><i class="fas fa-arrow-up"></i></button>
                    <button class="moveDownBtn ${w.priority===myWishes.length?'opacity-30 pointer-events-none':''}" data-id="${w.id}"><i class="fas fa-arrow-down"></i></button>` : '—'}</td></tr>`;
                }).join('')}
                </tbody></table></div>`}
                ${!canModify && !isSystemOpen ? '<p class="mt-4 text-red-500 text-sm"><i class="fas fa-lock"></i> Hệ thống đã khóa đăng ký.</p>' : ''}
                <div id="addWishForm" class="mt-6 hidden border-t pt-4"></div>
            </div>`;
        }

        // Admin Dashboard
        function renderAdminDashboard() {
            const allWishes = wishes;
            const allCandidates = candidates;
            return `
                <div class="max-w-7xl mx-auto px-4 py-6">
                    <div class="flex justify-between items-center"><h2 class="text-2xl font-black text-[#003366]"><i class="fas fa-gavel"></i> Bảng điều khiển quản trị</h2><button id="adminLogoutBtn" class="bg-red-600 text-white px-4 py-2 rounded"><i class="fas fa-sign-out-alt"></i> Thoát</button></div>
                    <div class="grid md:grid-cols-3 gap-4 mt-6">
                        <div class="bg-white p-4 rounded shadow"><i class="fas fa-users text-2xl"></i> <span class="font-bold text-xl">${allCandidates.length}</span> Thí sinh</div>
                        <div class="bg-white p-4 rounded shadow"><i class="fas fa-file-signature"></i> <span class="font-bold text-xl">${allWishes.length}</span> Nguyện vọng</div>
                        <div class="bg-white p-4 rounded shadow"><i class="fas fa-clock"></i> Trạng thái hệ thống: ${isSystemOpen ? 'Đang mở' : 'Đã đóng'}</div>
                    </div>
                    <div class="mt-8 bg-white p-4 rounded shadow">
                        <h3 class="font-bold text-lg">Quản lý nguyện vọng & phê duyệt</h3>
                        <div class="overflow-x-auto mt-3"><table class="w-full text-sm border"><thead class="bg-slate-100"><tr><th>Thí sinh</th><th>Ngành</th><th>PT</th><th>Điểm</th><th>Trạng thái</th><th>Cập nhật</th></tr></thead><tbody>
                        ${allWishes.map(w => {
                            const cand = candidates.find(c => c.id === w.candidateId);
                            return `<tr><td class="p-2 border">${cand?.name || w.candidateId}</td>
                            <td class="p-2 border">${MAJORS.find(m=>m.code===w.majorCode)?.name || w.majorCode}</td>
                            <td class="p-2 border">PT${w.methodId}</td>
                            <td class="p-2 border">${w.totalScore}</td>
                            <td class="p-2 border">${w.status}</td>
                            <td class="p-2 border"><select data-wish="${w.id}" class="statusSelect border rounded p-1"><option ${w.status==='PENDING'?'selected':''}>PENDING</option><option ${w.status==='ADMITTED'?'selected':''}>ADMITTED</option><option ${w.status==='REJECTED'?'selected':''}>REJECTED</option></select></td></tr>`;
                        }).join('')}
                        </tbody></table></div>
                    </div>
                    <div class="mt-6 bg-white p-4 rounded shadow"><h3 class="font-bold">Nhật ký hệ thống</h3><div class="text-xs h-40 overflow-y-auto">${auditLogs.map(log => `<div class="border-b py-1">[${new Date(log.time).toLocaleString()}] ${log.action}: ${log.detail}</div>`).join('')}</div></div>
                </div>
            `;
        }

        function attachGlobalEvents() {
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const nav = btn.getAttribute('data-nav');
                    if (nav && activeTab === 'portal') {
                        const container = document.getElementById('portalContent');
                        if (container) container.innerHTML = renderCandidateSubView(nav);
                        attachCandidateDynamicEvents();
                    }
                });
            });
            const portalContainer = document.getElementById('portalContent');
            if (portalContainer && activeTab === 'portal') {
                portalContainer.innerHTML = renderCandidateSubView('wishes');
                attachCandidateDynamicEvents();
            }
            const loginForm = document.getElementById('loginForm');
            if (loginForm) loginForm.addEventListener('submit', (e) => { e.preventDefault(); const cccd = document.getElementById('cccd').value; const pwd = document.getElementById('password').value; handleLogin(cccd, pwd); });
            const adminLogout = document.getElementById('adminLogoutBtn');
            if (adminLogout) adminLogout.addEventListener('click', logout);
            document.querySelectorAll('.statusSelect').forEach(sel => {
                sel.addEventListener('change', (e) => {
                    const wishId = sel.getAttribute('data-wish');
                    adminUpdateWishStatus(wishId, sel.value);
                });
            });
            const updateProfileBtn = document.getElementById('updateProfileBtn');
            if (updateProfileBtn) updateProfileBtn.addEventListener('click', () => {
                const newPhone = document.getElementById('phone')?.value || '';
                const newEmail = document.getElementById('email')?.value || '';
                const updated = candidates.map(c => c.id === currentUser.id ? { ...c, phone: newPhone, email: newEmail } : c);
                updateCandidates(updated);
                currentUser = { ...currentUser, phone: newPhone, email: newEmail };
                addToast("Cập nhật thông tin thành công", "success");
            });
            const payBtn = document.getElementById('payNowBtn');
            if (payBtn) payBtn.addEventListener('click', handlePayment);
            const showAddBtn = document.getElementById('showAddWishBtn');
            if (showAddBtn) showAddBtn.addEventListener('click', () => {
                const container = document.getElementById('addWishForm');
                if (container) {
                    container.innerHTML = `
                        <h4 class="font-bold">Thêm nguyện vọng mới</h4>
                        <div class="grid grid-cols-2 gap-3 mt-2"><select id="newMajor" class="border p-2 rounded">${MAJORS.map(m=>`<option value="${m.code}">${m.name}</option>`).join('')}</select>
                        <select id="newMethod" class="border p-2 rounded">${METHODS.map(m=>`<option value="${m.id}">${m.name}</option>`).join('')}</select>
                        <select id="newCombo" class="border p-2 rounded"><option>A00</option><option>A01</option><option>D01</option><option>X06</option></select>
                        <input id="newScore" type="number" step="0.1" placeholder="Điểm (0-30)" class="border p-2 rounded">
                        </div><button id="confirmAddWish" class="mt-3 bg-green-700 text-white px-4 py-1 rounded">Lưu nguyện vọng</button>`;
                    document.getElementById('confirmAddWish')?.addEventListener('click', () => {
                        const major = document.getElementById('newMajor').value;
                        const method = document.getElementById('newMethod').value;
                        const combo = document.getElementById('newCombo').value;
                        const score = parseFloat(document.getElementById('newScore').value);
                        if (addWish(major, method, combo, score)) {
                            document.getElementById('addWishForm').innerHTML = '';
                            document.getElementById('addWishForm').classList.add('hidden');
                            renderApp();
                        }
                    });
                    container.classList.remove('hidden');
                }
            });
            document.querySelectorAll('.deleteWishBtn').forEach(btn => btn.addEventListener('click', (e) => { const id = btn.getAttribute('data-id'); if(confirm('Xóa nguyện vọng?')) deleteWish(id); }));
            document.querySelectorAll('.moveUpBtn').forEach(btn => btn.addEventListener('click', (e) => { const id = btn.getAttribute('data-id'); movePriority(id, 'UP'); }));
            document.querySelectorAll('.moveDownBtn').forEach(btn => btn.addEventListener('click', (e) => { const id = btn.getAttribute('data-id'); movePriority(id, 'DOWN'); }));
        }

        function attachCandidateDynamicEvents() { setTimeout(attachGlobalEvents, 20); }
        function escapeHtml(str) { if(!str) return ''; return str.replace(/[&<>]/g, function(m){if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }

        window.addEventListener('navigate', (e) => { activeTab = e.detail.tab; renderApp(); });
        renderApp();
    </script>
</body>
</html>