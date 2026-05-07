"use client";

import React, { useState, useEffect, useRef } from "react";

// ============================================================
// DỮ LIỆU TUYỂN SINH (Được gộp từ src/data/config.ts)
// ============================================================

const TRUONG = {
  ten: "Học viện Kỹ thuật và Công nghệ an ninh",
  ten_viet_tat: "KTH",
  dia_chi: "Cơ sở 1: Hoà Lạc - TP.Hà Nội; Cơ sở 2: Thuận Thành - Bắc Ninh",
  dien_thoai: "0937285678",
  email_tuyen_sinh: "hvktcnan@gmail.com",
  website: "https://hvktcncan.boccongan.gov.vn",
  nam_tuyen_sinh: "2026",
  thong_tu: "06/2026/TT-BGDĐT",
};

const TO_HOP_MAP: Record<string, string> = {
  A00: "Toán, Lý, Hóa",
  A01: "Toán, Lý, Anh",
  A02: "Toán, Lý, Sinh",
  C01: "Toán, Văn, Lý",
  D01: "Toán, Văn, Anh",
  X06: "Toán, KHTN, Anh",
  X07: "Toán, KHTN, Hóa",
  X10: "Toán, KHTN, Lý",
  X26: "Toán, Lý, KHTN",
};

interface ChuongTrinh {
  ma: string;
  ten: string;
  maNganh: string;
  tenNganh: string;
  chiTieu: number;
  hocPhi: number;
  diemChuan2025: number;
  phuongThucs: string[];
  toHops: string[];
  moTa: string;
}

const CHUONG_TRINHS: ChuongTrinh[] = [
  {
    ma: "KTHDS01",
    ten: "Khoa học dữ liệu và Trí tuệ nhân tạo",
    maNganh: "7480201",
    tenNganh: "Công nghệ thông tin",
    chiTieu: 60,
    hocPhi: 22_000_000,
    diemChuan2025: 25.5,
    phuongThucs: ["PT1", "PT2", "PT3", "PT4", "PT5"],
    toHops: ["A00", "A01", "D01", "X06", "X10", "X26"],
    moTa: "Đào tạo chuyên gia về AI, Machine Learning, Data Science và Big Data.",
  },
  {
    ma: "KTHDS05",
    ten: "Công nghệ điện tử và vi mạch bán dẫn",
    maNganh: "7520207",
    tenNganh: "Kỹ thuật Điện tử viễn thông",
    chiTieu: 60,
    hocPhi: 21_000_000,
    diemChuan2025: 23.0,
    phuongThucs: ["PT1", "PT2", "PT3", "PT4", "PT5"],
    toHops: ["A00", "A01", "A02", "C01", "X07"],
    moTa: "Đào tạo kỹ sư thiết kế vi mạch, chip bán dẫn đáp ứng nhu cầu công nghiệp.",
  },
];

interface DieuKienNhom {
  nhom: string;
  items: string[];
}

interface PhuongThuc {
  id: string;
  stt: number;
  ten: string;
  icon: string;
  mau: string;
  moTa: string;
  dieuKien: DieuKienNhom[];
  ghuChu?: string[];
}

const PHUONG_THUCS: Record<string, PhuongThuc> = {
  PT1: {
    id: "PT1", stt: 1,
    ten: "Xét tuyển tài năng",
    icon: "🏆", mau: "#7c3aed",
    moTa: "Xét tuyển thẳng, ưu tiên xét tuyển và xét tuyển dựa vào hồ sơ năng lực (HSNL).",
    dieuKien: [
      {
        nhom: "(1) Xét tuyển thẳng / Ưu tiên xét tuyển",
        items: ["Đoạt giải Quốc gia, Quốc tế theo Quy chế tuyển sinh hiện hành của Bộ GD&ĐT."],
      },
      {
        nhom: "(2) Xét tuyển hồ sơ năng lực — một trong các điều kiện:",
        items: [
          "a) Tham dự kỳ thi chọn đội tuyển QG dự Olympic quốc tế (Toán, Lý, Hóa, Tin học) hoặc đội tuyển KHKT quốc tế; không quá 3 năm tính tới thời điểm xét tuyển.",
          "b) Đoạt giải Khuyến khích+ kỳ thi HS giỏi QG, hoặc giải Nhất/Nhì/Ba/KK cấp Tỉnh/TP TW (Toán, Lý, Hóa, Tin học) VÀ ĐTB lớp 10+11+12 ≥ 7.0, hạnh kiểm Khá trở lên.",
          "c) HS chuyên trường THPT chuyên toàn quốc (Toán, Lý, Hóa, Tin học) VÀ ĐTB lớp 10+11+12 ≥ 7.0, hạnh kiểm Khá trở lên.",
        ],
      },
    ],
  },
  PT2: {
    id: "PT2", stt: 2,
    ten: "Xét điểm ĐGNL / ĐGTD",
    icon: "🎯", mau: "#1d4ed8",
    moTa: "Xét tuyển dựa vào kết quả bài thi đánh giá năng lực hoặc đánh giá tư duy năm 2026.",
    dieuKien: [
      {
        nhom: "Một trong các điều kiện sau:",
        items: [
          "a) Điểm ĐGNL Đại học Quốc gia Hà Nội (HSA) năm 2026 ≥ 75/150 điểm.",
          "b) Điểm ĐGNL Đại học Quốc gia Tp. HCM (APT) năm 2026 ≥ 600/1200 điểm.",
          "c) Điểm ĐGTD Đại học Bách khoa Hà Nội (TSA) năm 2026 ≥ 50/100 điểm.",
          "d) Điểm ĐGNL Trường Đại học Sư phạm Hà Nội (SPT) năm 2026 ≥ 15/30 điểm.",
        ],
      },
    ],
    ghuChu: [
      "Bài thi HSA: Chọn Phần 3 - Khoa học; bắt buộc chọn tổ hợp có 2 chủ đề là Vật lý và Hóa học.",
      "Bài thi SPT: Phải đăng ký thi các môn thuộc tổ hợp xét tuyển của Học viện.",
    ],
  },
  PT3: {
    id: "PT3", stt: 3,
    ten: "Xét chứng chỉ SAT / ACT",
    icon: "🌏", mau: "#0891b2",
    moTa: "Xét tuyển dựa vào chứng chỉ đánh giá năng lực quốc tế SAT hoặc ACT (hiệu lực 02 năm).",
    dieuKien: [
      {
        nhom: "Một trong hai chứng chỉ (còn hiệu lực trong 02 năm tính đến ngày xét tuyển):",
        items: [
          "a) Chứng chỉ SAT ≥ 800/1600 điểm.",
          "b) Chứng chỉ ACT ≥ 18/36 điểm.",
        ],
      },
    ],
  },
  PT4: {
    id: "PT4", stt: 4,
    ten: "Xét chứng chỉ tiếng Anh quốc tế",
    icon: "🇬🇧", mau: "#059669",
    moTa: "Xét kết hợp chứng chỉ IELTS/TOEFL/TOEIC với kết quả học bạ THPT.",
    dieuKien: [
      {
        nhom: "Chứng chỉ còn hiệu lực 02 năm VÀ ĐTB lớp 10+11+12 ≥ 7.0, hạnh kiểm Khá trở lên:",
        items: [
          "a) IELTS ≥ 4.0.",
          "b) TOEFL iBT ≥ 25 điểm.",
          "c) TOEIC: Listen & Reading ≥ 450 & 529 ĐỒNG THỜI Speaking & Writing ≥ 187 & 211.",
        ],
      },
    ],
    ghuChu: ["Chứng chỉ theo hình thức Home Edition KHÔNG được chấp nhận."],
  },
  PT5: {
    id: "PT5", stt: 5,
    ten: "Xét điểm thi TN THPT 2026",
    icon: "📝", mau: "#dc2626",
    moTa: "Xét tuyển dựa vào kết quả kỳ thi Tốt nghiệp THPT năm 2026.",
    dieuKien: [
      {
        nhom: "Yêu cầu:",
        items: [
          "Tham dự kỳ thi Tốt nghiệp THPT năm 2026 với các bài thi/môn thi theo đúng tổ hợp xét tuyển tương ứng của ngành/chương trình đăng ký tại Học viện.",
        ],
      },
    ],
  },
};

const HOC_BONGS = [
  { ten: "Học bổng Tài năng",     giaTri: "100% học phí/năm", soLuong: 10, dieuKien: "Điểm xét tuyển ≥ 28.0 hoặc top 5% ngành" },
  { ten: "Học bổng Khuyến học",   giaTri: "50% học phí/năm",  soLuong: 30, dieuKien: "Điểm xét tuyển ≥ 25.0" },
  { ten: "Học bổng Vượt khó",     giaTri: "30% học phí/năm",  soLuong: 50, dieuKien: "Hoàn cảnh khó khăn, điểm xét tuyển ≥ 20.0" },
  { ten: "Học bổng Doanh nghiệp", giaTri: "15–20 triệu/năm",  soLuong: 20, dieuKien: "Theo chương trình đối tác doanh nghiệp" },
];

const LICH = [
  { gd: "Đăng ký nguyện vọng online",       tu: "01/07/2026", den: "20/07/2026", trangThai: "open"   },
  { gd: "Chỉnh sửa nguyện vọng",            tu: "01/07/2026", den: "20/07/2026", trangThai: "open"   },
  { gd: "Công bố kết quả Đợt 1",            tu: "25/07/2026", den: "25/07/2026", trangThai: "soon"   },
  { gd: "Xác nhận nhập học trực tuyến",     tu: "26/07/2026", den: "05/08/2026", trangThai: "closed" },
  { gd: "Tuyển sinh bổ sung Đợt 2",         tu: "10/08/2026", den: "20/08/2026", trangThai: "closed" },
  { gd: "Nhập học chính thức",              tu: "01/09/2026", den: "05/09/2026", trangThai: "closed" },
];

const THOI_HAN = {
  batDau:   new Date("2026-07-01T00:00:00"),
  ketThuc:  new Date("2026-07-20T23:59:59"),
  congBo:   new Date("2026-07-25"),
  hanXacNhan: new Date("2026-08-05T23:59:59"),
};

const DIEM_UU_TIEN_KHU_VUC: Record<string, number> = {
  KV1: 0.75, KV2: 0.5, "KV2-NT": 0.25, KV3: 0,
};

const DIEM_UU_TIEN_DOI_TUONG: Record<string, number> = {
  "01": 2.0, "02": 1.0, "": 0,
};

// ============================================================
// GLOBAL STYLES (Được gộp từ src/app/globals.css)
// ============================================================
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --primary: #1d4ed8;
      --primary-light: #dbeafe;
      --success: #065f46;
      --success-bg: #d1fae5;
      --warn: #92400e;
      --warn-bg: #fef3c7;
      --danger: #991b1b;
      --danger-bg: #fee2e2;
      --gray-border: #e5e7eb;
      --gray-bg: #f9fafb;
      --gray-bg-2: #f3f4f6;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f1f5f9;
      color: #111827;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    a { color: var(--primary); text-decoration: none; }
    a:hover { text-decoration: underline; }
    button { font-family: inherit; }
    input, select, textarea { font-family: inherit; outline: none; }
    input:focus, select:focus, textarea:focus {
      border-color: var(--primary) !important;
      box-shadow: 0 0 0 3px rgba(29,78,216,.12);
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    .container { max-width: 760px; margin: 0 auto; padding: 0 16px; }
    .text-primary  { color: var(--primary); }
    .text-muted    { color: #6b7280; }
    .font-medium   { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  `}} />
);

/* ─── ATOMS & DESIGN SYSTEM ──────────────────────────────── */
const C = {
  primary:"#1d4ed8", pLight:"#dbeafe",
  success:"#065f46", sBg:"#d1fae5", sBorder:"#6ee7b7",
  warn:"#92400e",    wBg:"#fef3c7",
  danger:"#991b1b",  dBg:"#fee2e2",
  bd:"#e5e7eb",      bg:"#ffffff",   bgS:"#f9fafb",
  text:"#111827",    muted:"#6b7280",
};

const fmt = (n: number) => new Intl.NumberFormat("vi-VN").format(n);

type BadgeColor = "blue"|"green"|"yellow"|"red"|"gray"|"purple"|"teal";
const Badge = ({ color="blue", children, style={} }: { color?: BadgeColor; children: React.ReactNode; style?: React.CSSProperties }) => {
  const m: Record<BadgeColor,[string,string]> = {
    blue:[C.pLight,C.primary], green:[C.sBg,C.success], yellow:[C.wBg,C.warn],
    red:[C.dBg,C.danger], gray:["#f3f4f6","#6b7280"],
    purple:["#ede9fe","#6d28d9"], teal:["#ccfbf1","#0f766e"],
  };
  const [bg,fg] = m[color];
  return <span style={{background:bg,color:fg,fontSize:10,fontWeight:500,padding:"2px 9px",borderRadius:10,...style}}>{children}</span>;
};

const Card = ({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties}) => (
  <div style={{background:C.bg,border:`0.5px solid ${C.bd}`,borderRadius:10,padding:"14px 16px",...style}}>{children}</div>
);

const Btn = ({children,variant="primary",size="md",onClick,disabled,full,style={}}:{
  children:React.ReactNode;variant?:string;size?:string;
  onClick?:(e:any)=>void;disabled?:boolean;full?:boolean;style?:React.CSSProperties;
}) => {
  const sz: Record<string,React.CSSProperties> = {
    sm:{padding:"5px 12px",fontSize:11}, md:{padding:"9px 16px",fontSize:13}, lg:{padding:"12px 22px",fontSize:14}
  };
  const va: Record<string,React.CSSProperties> = {
    primary:{background:C.primary,color:"#fff",border:"none"},
    outline:{background:"transparent",color:C.text,border:`0.5px solid ${C.bd}`},
    success:{background:"#059669",color:"#fff",border:"none"},
    danger:{background:"#dc2626",color:"#fff",border:"none"},
    ghost:{background:"transparent",color:C.muted,border:"none"},
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...sz[size],...(va[variant]||va.primary),
      borderRadius:7,cursor:disabled?"not-allowed":"pointer",
      fontWeight:500,opacity:disabled?.6:1,
      width:full?"100%":undefined,...style
    }}>{children}</button>
  );
};

const Field = ({label,help,...p}:{label?:string;help?:string;[k:string]:unknown}) => (
  <div style={{marginBottom:10}}>
    {label && <div style={{fontSize:11,color:C.muted,marginBottom:4,fontWeight:500}}>{label}</div>}
    <input style={{width:"100%",padding:"8px 12px",borderRadius:7,border:`0.5px solid ${C.bd}`,fontSize:13,background:C.bg,color:C.text,boxSizing:"border-box"}} {...(p as React.InputHTMLAttributes<HTMLInputElement>)}/>
    {help && <div style={{fontSize:10,color:C.muted,marginTop:3}}>{help}</div>}
  </div>
);

const Sel = ({label,options,help,...p}:{label?:string;options:{value:string;label:string}[];help?:string;[k:string]:unknown}) => (
  <div style={{marginBottom:10}}>
    {label && <div style={{fontSize:11,color:C.muted,marginBottom:4,fontWeight:500}}>{label}</div>}
    <select style={{width:"100%",padding:"8px 12px",borderRadius:7,border:`0.5px solid ${C.bd}`,fontSize:13,background:C.bg,color:C.text,boxSizing:"border-box"}} {...(p as React.SelectHTMLAttributes<HTMLSelectElement>)}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {help && <div style={{fontSize:10,color:C.muted,marginTop:3}}>{help}</div>}
  </div>
);

const Div = () => <div style={{height:"0.5px",background:C.bd,margin:"12px 0"}}/>;

const Toast = ({msg,type="success"}:{msg:string;type?:string}) => msg ? (
  <div style={{background:type==="success"?C.sBg:C.dBg,color:type==="success"?C.success:C.danger,border:`0.5px solid ${type==="success"?C.sBorder:"#fca5a5"}`,borderRadius:8,padding:"9px 14px",fontSize:12,marginBottom:12}}>
    {type==="success"?"✓ ":"⚠ "}{msg}
  </div>
) : null;

const InfoBox = ({children,type="info",style={}}:{children:React.ReactNode;type?:string;style?:React.CSSProperties}) => {
  const styles:{[k:string]:[string,string]} = {
    info:["#eff6ff","#1e40af"], warn:[C.wBg,C.warn], ok:[C.sBg,C.success]
  };
  const [bg,fg] = styles[type]||styles.info;
  return <div style={{background:bg,border:`0.5px solid ${fg}44`,borderRadius:8,padding:"9px 12px",fontSize:12,color:fg,lineHeight:1.7,margin:"8px 0",...style}}>{children}</div>;
};

/* ─── VIRTUAL DATABASE (MÔ PHỎNG SUPABASE) ──────────────── */
const initDatabase = () => {
  if (typeof window === "undefined") return { users: [], wishes: [], posts: [], logs: [], programs: CHUONG_TRINHS };
  const saved = localStorage.getItem("ptit_real_db");
  if (saved) return JSON.parse(saved);

  const defaultDb = {
    users: [
      { id: "admin", role: "SUPER_ADMIN", username: "admin", password: "123", name: "Trưởng Ban Tuyển sinh" },
      { id: "editor", role: "EDITOR", username: "editor", password: "123", name: "Chuyên viên Xử lý" },
      { id: "viewer", role: "VIEWER", username: "viewer", password: "123", name: "Thanh tra" },
    ],
    wishes: [],
    posts: [
      { id: Date.now(), title: `Thông báo tuyển sinh Đại học chính quy ${TRUONG.nam_tuyen_sinh}`, content: `Học viện Công nghệ Bưu chính Viễn thông thông báo xét tuyển chính thức...`, date: new Date().toISOString() }
    ],
    logs: [{ id: Date.now(), time: new Date().toISOString(), actor: "SYSTEM", action: "INIT", detail: "Khởi tạo CSDL thành công" }],
    programs: CHUONG_TRINHS // Lưu vào DB để Admin có thể sửa chỉ tiêu/học phí
  };
  localStorage.setItem("ptit_real_db", JSON.stringify(defaultDb));
  return defaultDb;
};

/* ─── MAIN APP ──────────────────────────────────────────── */
const PAGES = [
  {id:"home",label:"Trang chủ",icon:"🏠", role: "ALL"},
  {id:"ct",label:"Chương trình",icon:"📖", role: "ALL"},
  {id:"pt",label:"Phương thức",icon:"📋", role: "ALL"},
  {id:"dknv",label:"Đăng ký NV",icon:"✏️", role: "CANDIDATE"},
  {id:"kq",label:"Kết quả",icon:"🎉", role: "ALL"},
  {id:"admin",label:"Quản trị",icon:"⚙️", role: "ADMIN"},
];

export default function Home() {
  const [db, setDb] = useState<any>({ users: [], wishes: [], posts: [], logs: [], programs: [] });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [page, setPage] = useState("home");
  const [globalToast, setGlobalToast] = useState({ msg: "", type: "success" });

  useEffect(() => {
    setDb(initDatabase());
    const session = sessionStorage.getItem("ptit_session");
    if (session) setCurrentUser(JSON.parse(session));
  }, []);

  const updateDb = (newDb: any) => {
    setDb(newDb);
    localStorage.setItem("ptit_real_db", JSON.stringify(newDb));
  };

  const writeLog = (actor: string, action: string, detail: string) => {
    const newLogs = [{ id: Date.now(), time: new Date().toISOString(), actor, action, detail }, ...db.logs];
    updateDb({ ...db, logs: newLogs });
  };

  const handleToast = (msg: string, type = "success") => {
    setGlobalToast({ msg, type });
    setTimeout(() => setGlobalToast({ msg: "", type: "success" }), 3500);
  };

  const handleLogout = () => {
    writeLog(currentUser.name, "LOGOUT", "Đăng xuất khỏi hệ thống");
    setCurrentUser(null);
    sessionStorage.removeItem("ptit_session");
    setPage("home");
    handleToast("Đã đăng xuất thành công!");
  };

  const filteredPages = PAGES.filter(p => {
    if (p.role === "ALL") return true;
    if (p.role === "ADMIN" && currentUser?.role && currentUser.role !== 'CANDIDATE') return true;
    if (p.role === "CANDIDATE" && (!currentUser || currentUser.role === 'CANDIDATE')) return true;
    return false;
  });

  return (
    <div style={{fontFamily:"inherit",background:"#f1f5f9",minHeight:"100vh", display: "flex", flexDirection: "column"}}>
      <GlobalStyles />
      {/* Thông báo toàn cục */}
      {globalToast.msg && (
        <div style={{position: "fixed", top: 80, right: 20, zIndex: 999}}>
          <Toast msg={globalToast.msg} type={globalToast.type} />
        </div>
      )}

      {/* Header */}
      <div style={{background:C.primary,color:"#fff",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 8px rgba(0,0,0,.15)"}}>
        <div style={{padding:"10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{display: "flex", alignItems: "center", cursor: "pointer"}} onClick={() => setPage("home")}>
            {/* TÍCH HỢP LOGO THEO YÊU CẦU */}
            <img 
               src="/LOGO.png" 
               alt="Logo PTIT" 
               style={{ height: 42, width: 42, objectFit: 'contain', marginRight: 12, backgroundColor: '#fff', borderRadius: '50%', padding: 2 }} 
               onError={(e) => e.currentTarget.style.display = 'none'} 
            />
            <div>
              <div style={{fontSize:14,fontWeight:600}}>{TRUONG.ten.toUpperCase()}</div>
              <div style={{fontSize:11,opacity:.85}}>Hệ thống Xét tuyển Trực tuyến {TRUONG.nam_tuyen_sinh}</div>
            </div>
          </div>
          
          <div>
            {!currentUser ? (
              <Btn size="sm" variant="outline" style={{borderColor: "rgba(255,255,255,0.5)", color: "#fff"}} onClick={() => setPage("login")}>Đăng nhập</Btn>
            ) : (
              <div style={{display: "flex", alignItems: "center", gap: 10}}>
                <div style={{fontSize: 12, textAlign: "right", display: "none", "@media(minWidth: 600px)": {display: "block"}} as any}>
                  <div style={{fontWeight: 600}}>{currentUser.name}</div>
                  <div style={{opacity: 0.8, fontSize: 10}}>{currentUser.role === 'CANDIDATE' ? `TS: ${currentUser.cccd}` : currentUser.role}</div>
                </div>
                <div style={{width: 32, height: 32, borderRadius: "50%", background: "#fff", color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold"}}>{currentUser.name.charAt(0)}</div>
                <button onClick={handleLogout} style={{background:"transparent", border:"none", color:"#fff", cursor:"pointer", fontSize: 18}} title="Đăng xuất">🚪</button>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div style={{display:"flex",overflowX:"auto",borderTop:"1px solid rgba(255,255,255,.15)",scrollbarWidth:"none"}}>
          {filteredPages.map(p=>(
            <button key={p.id} onClick={()=>setPage(p.id)} style={{
              background:page===p.id?"rgba(255,255,255,.2)":"transparent",
              color:"#fff",border:"none",padding:"10px 14px",fontSize:12,cursor:"pointer",
              whiteSpace:"nowrap",fontWeight:page===p.id?600:400,
              borderBottom:page===p.id?"2px solid #fff":"2px solid transparent",
              transition: "all 0.2s"
            }}>{p.icon} {p.label}</button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"16px 12px 50px", width: "100%", flex: 1}}>
        {page==="home"  && <PageHome setPage={setPage} db={db}/>}
        {page==="login" && <PageLogin db={db} setCurrentUser={(u:any) => {setCurrentUser(u); sessionStorage.setItem('ptit_session', JSON.stringify(u));}} setPage={setPage} addToast={handleToast} writeLog={writeLog} updateDb={updateDb} />}
        {page==="ct"    && <PageChuongTrinh db={db}/>}
        {page==="pt"    && <PagePhuongThuc/>}
        {page==="dknv"  && <PageDangKy db={db} updateDb={updateDb} user={currentUser} addToast={handleToast} writeLog={writeLog} setPage={setPage} />}
        {page==="kq"    && <PageKetQua db={db} user={currentUser} addToast={handleToast} />}
        {page==="admin" && <PageAdmin db={db} updateDb={updateDb} user={currentUser} addToast={handleToast} writeLog={writeLog} />}
      </div>
    </div>
  );
}

/* ─── CÁC TRANG (PAGES) ─────────────────────────────────── */

function PageLogin({ db, setCurrentUser, setPage, addToast, writeLog, updateDb }: any) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const u = db.users.find((x:any) => x.username === username && x.password === password);
      if (u) {
        setCurrentUser(u);
        addToast(`Chào mừng ${u.name}!`, "success");
        writeLog(u.name, "LOGIN", "Đăng nhập hệ thống");
        setPage(u.role === 'CANDIDATE' ? 'dknv' : 'admin');
      } else {
        addToast("Sai CCCD hoặc mật khẩu!", "error");
      }
    } else {
      if (db.users.find((x:any) => x.username === username)) {
        addToast("CCCD này đã được đăng ký!", "error"); return;
      }
      const newUser = { id: `C_${Date.now()}`, role: "CANDIDATE", username, password, name, cccd: username, files: [], region: "KV3", target: "" };
      updateDb({ ...db, users: [...db.users, newUser] });
      addToast("Đăng ký thành công! Hãy đăng nhập.", "success");
      writeLog(name, "REGISTER", `Đăng ký tài khoản: ${username}`);
      setIsLogin(true);
    }
  };

  return (
    <Card style={{maxWidth: 400, margin: "20px auto"}} className="animate-fade-in">
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:32}}>🔐</div>
        <div style={{fontSize:16,fontWeight:600,marginTop:6}}>{isLogin ? "Đăng nhập Hệ thống" : "Đăng ký Tài khoản"}</div>
      </div>
      <form onSubmit={submit}>
        {!isLogin && <Field label="Họ và tên" required value={name} onChange={(e:any)=>setName(e.target.value)} />}
        <Field label="Số CCCD / Tài khoản Quản trị" required value={username} onChange={(e:any)=>setUsername(e.target.value)} />
        <Field label="Mật khẩu" type="password" required value={password} onChange={(e:any)=>setPassword(e.target.value)} />
        <Btn full type="submit" style={{marginTop: 10}}>{isLogin ? "Đăng nhập" : "Đăng ký"}</Btn>
      </form>
      <div style={{fontSize:12, textAlign:"center", marginTop: 16}}>
        {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
        <span style={{color: C.primary, fontWeight: 600, cursor: "pointer"}} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
        </span>
      </div>
      <InfoBox type="warn" style={{marginTop: 20}}>
        <strong>Demo Admin:</strong> ID <code>admin</code> / Pass <code>123</code> (Toàn quyền)<br/>
        <strong>Demo Chuyên viên:</strong> ID <code>editor</code> / Pass <code>123</code>
      </InfoBox>
    </Card>
  );
}

function PageHome({ setPage, db }: { setPage: (p: string) => void, db: any }) {
  return (
    <div className="animate-fade-in">
      <div style={{background:`linear-gradient(135deg,${C.primary},#1e3a8a)`,borderRadius:12,padding:"22px 18px",color:"#fff",marginBottom:14}}>
        <Badge color="yellow" style={{marginBottom:8,display:"inline-block"}}>🔴 Đang mở đăng ký · Hết hạn 20/07/2026</Badge>
        <h1 style={{margin:"8px 0 4px",fontSize:20,fontWeight:600}}>TUYỂN SINH ĐẠI HỌC {TRUONG.nam_tuyen_sinh}</h1>
        <p style={{margin:"0 0 16px",fontSize:13,opacity:.9,lineHeight:1.7}}>
          {db.programs.length} chương trình · 5 phương thức xét tuyển · Tối đa 15 nguyện vọng
        </p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn onClick={()=>setPage("dknv")} style={{background:"#fff",color:C.primary}}>✏️ Đăng ký ngay</Btn>
        </div>
      </div>

      {/* Bảng tin tức */}
      <div style={{marginBottom: 16}}>
        <div style={{fontSize:16,fontWeight:600,marginBottom:10}}>📰 Bảng tin Tuyển sinh</div>
        {db.posts.length === 0 ? <p style={{fontSize: 13, color: C.muted}}>Chưa có thông báo nào.</p> : db.posts.map((p:any) => (
          <Card key={p.id} style={{marginBottom: 10, borderLeft: `3px solid ${C.primary}`}}>
            <h3 style={{fontSize: 15, fontWeight: 600, color: C.primary, marginBottom: 4}}>{p.title}</h3>
            <div style={{fontSize: 11, color: C.muted, marginBottom: 8}}>Đăng ngày: {new Date(p.date).toLocaleDateString("vi-VN")}</div>
            <p style={{fontSize: 13, color: C.text, lineHeight: 1.6, whiteSpace: "pre-wrap"}}>{p.content}</p>
          </Card>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
        {[[String(db.programs.reduce((s:any,c:any)=>s+c.chiTieu,0)),"Chỉ tiêu"],[String(db.programs.length),"Chương trình"],["5","Phương thức"],["15","NV tối đa"]].map(([v,l])=>(
          <div key={l as string} style={{background:C.bg,border:`0.5px solid ${C.bd}`,borderRadius:9,padding:"10px 4px",textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:600,color:C.primary}}>{v}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>

      <Card style={{marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>📅 Lịch tuyển sinh {TRUONG.nam_tuyen_sinh}</div>
        {LICH.map((l,i)=>(
          <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"7px 0",borderBottom:i<LICH.length-1?`0.5px solid ${C.bd}`:"none"}}>
            <div style={{width:9,height:9,borderRadius:"50%",background:l.trangThai==="open"?"#059669":l.trangThai==="soon"?"#d97706":"#9ca3af",flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:500}}>{l.gd}</div>
              <div style={{fontSize:11,color:C.muted}}>{l.tu}{l.tu!==l.den?` – ${l.den}`:""}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function PageChuongTrinh({ db }: { db: any }) {
  const [sel,setSel] = useState<string|null>(null);
  const ct = db.programs.find((c:any)=>c.ma===sel);
  
  if(ct) return (
    <div className="animate-fade-in">
      <button onClick={()=>setSel(null)} style={{background:"transparent",border:"none",color:C.primary,fontSize:13,cursor:"pointer",padding:0,marginBottom:12}}>← Quay lại</button>
      <Card>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}><Badge color="blue">{ct.ma}</Badge><Badge color="gray">{ct.maNganh}</Badge></div>
        <h2 style={{margin:"6px 0 2px",fontSize:18,fontWeight:600, color: C.primary}}>{ct.ten}</h2>
        <div style={{fontSize:13,color:C.muted,marginBottom:12}}>Ngành: {ct.tenNganh}</div>
        <p style={{fontSize:13,color:C.text,lineHeight:1.7,marginBottom:14}}>{ct.moTa}</p>
        {[["Chỉ tiêu năm nay",`${ct.chiTieu} sinh viên`],["Học phí",`${fmt(ct.hocPhi)} đ/năm`],["Điểm chuẩn 2025",String(ct.diemChuan2025)]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`0.5px solid ${C.bd}`,fontSize:13}}>
            <span style={{color:C.muted}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
          </div>
        ))}
        <Div/>
        <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Tổ hợp xét tuyển</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {ct.toHops.map((t:string)=>(
            <div key={t} style={{background:C.pLight,borderRadius:7,padding:"6px 10px",fontSize:11}}>
              <span style={{fontWeight:600,color:C.primary}}>{t}</span>
              <span style={{color:C.muted,marginLeft:4}}>{TO_HOP_MAP[t]||t}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{fontSize:16,fontWeight:600,marginBottom:12}}>Danh mục Chương trình đào tạo</div>
      {db.programs.map((ct:any)=>(
        <Card key={ct.ma} style={{marginBottom:10,cursor:"pointer"}} onClick={()=>setSel(ct.ma)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1,marginRight:10}}>
              <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}><Badge color="blue">{ct.ma}</Badge></div>
              <div style={{fontSize:15,fontWeight:600,marginBottom:4, color: C.text}}>{ct.ten}</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:6, lineHeight: 1.5}}>{ct.moTa}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:20,fontWeight:600,color:C.primary}}>{ct.chiTieu}</div>
              <div style={{fontSize:10,color:C.muted}}>chỉ tiêu</div>
              <div style={{fontSize:12,color:C.success,fontWeight:600,marginTop:4}}>{fmt(ct.hocPhi/1e6)}tr/năm</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PagePhuongThuc() {
  const pts = Object.values(PHUONG_THUCS);
  return (
    <div className="animate-fade-in">
      <div style={{fontSize:16,fontWeight:600,marginBottom:12}}>Phương thức xét tuyển {TRUONG.nam_tuyen_sinh}</div>
      {pts.map(pt=>(
        <Card key={pt.id} style={{marginBottom:10,borderLeft:`4px solid ${pt.mau}`}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:42,height:42,borderRadius:10,background:pt.mau+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{pt.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                <span style={{background:pt.mau,color:"#fff",fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:8}}>PT{pt.stt}</span>
                <span style={{fontSize:14,fontWeight:600}}>{pt.ten}</span>
              </div>
              <div style={{fontSize:12,color:C.text,lineHeight:1.6,marginBottom:6}}>{pt.moTa}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PageDangKy({ db, updateDb, user, addToast, writeLog, setPage }: any) {
  if (!user) {
    return (
      <Card style={{textAlign: "center", padding: "40px 20px"}} className="animate-fade-in">
        <div style={{fontSize: 40, marginBottom: 10}}>🔒</div>
        <div style={{fontSize: 16, fontWeight: 600, marginBottom: 10}}>Vui lòng đăng nhập</div>
        <div style={{fontSize: 13, color: C.muted, marginBottom: 20}}>Bạn cần đăng nhập tài khoản thí sinh để đăng ký nguyện vọng.</div>
        <Btn onClick={() => setPage('login')}>Đi đến trang Đăng nhập</Btn>
      </Card>
    );
  }

  const [step,setStep] = useState(0);
  const STEPS = ["Hồ sơ cá nhân", "Minh chứng", "Đăng ký NV", "Hoàn tất"];
  
  const [info, setInfo] = useState({ hoTen: user.name, cccd: user.cccd, sdt: user.phone||"", email: user.email||"", khuVuc: user.region||"KV3" });
  const [formNV, setFormNV] = useState({ ctMa: "", ptId: "", toHop: "", diem: "" });
  const [showAdd, setShowAdd] = useState(false);

  const nvList = db.wishes.filter((w:any) => w.candidateId === user.id).sort((a:any, b:any) => a.priority - b.priority);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFile = { name: file.name, date: new Date().toISOString() };
      const updatedUser = { ...user, files: [...(user.files||[]), newFile] };
      
      const newUsers = db.users.map((u:any) => u.id === user.id ? updatedUser : u);
      updateDb({ ...db, users: newUsers });
      writeLog(user.name, "UPLOAD_FILE", `Tải lên minh chứng: ${file.name}`);
      addToast(`Đã tải lên tệp: ${file.name}`);
    }
  };

  const handleSaveInfo = () => {
    const updatedUser = { ...user, name: info.hoTen, phone: info.sdt, email: info.email, region: info.khuVuc };
    const newUsers = db.users.map((u:any) => u.id === user.id ? updatedUser : u);
    updateDb({ ...db, users: newUsers });
    writeLog(user.name, "UPDATE_PROFILE", "Cập nhật hồ sơ");
    addToast("Đã lưu thông tin cá nhân");
    setStep(1);
  };

  const addNV = () => {
    if(!formNV.ctMa||!formNV.ptId||!formNV.toHop||!formNV.diem){ addToast("Vui lòng điền đủ thông tin","error"); return; }
    if(nvList.length>=15){ addToast("Tối đa 15 nguyện vọng","error"); return; }
    
    const newWish = {
      id: `W_${Date.now()}`, candidateId: user.id, majorCode: formNV.ctMa, methodId: formNV.ptId,
      combo: formNV.toHop, priority: nvList.length + 1, totalScore: parseFloat(formNV.diem), status: 'PENDING'
    };
    
    updateDb({ ...db, wishes: [...db.wishes, newWish] });
    writeLog(user.name, "ADD_WISH", `Thêm NV: ${formNV.ctMa}`);
    setFormNV({ctMa:"",ptId:"",toHop:"", diem:""});
    setShowAdd(false);
    addToast(`Đã thêm NV số ${nvList.length+1}`);
  };

  const removeNV = (id: string) => {
    const remaining = db.wishes.filter((w:any) => w.id !== id);
    const myRemaining = remaining.filter((w:any) => w.candidateId === user.id).sort((a:any,b:any) => a.priority - b.priority);
    myRemaining.forEach((w:any, i:number) => w.priority = i + 1);
    const globalRemaining = remaining.filter((w:any) => w.candidateId !== user.id).concat(myRemaining);
    updateDb({ ...db, wishes: globalRemaining });
    writeLog(user.name, "DEL_WISH", `Xóa NV ${id}`);
  };

  return (
    <div className="animate-fade-in">
      <div style={{fontSize:18,fontWeight:600,marginBottom:16}}>Đăng ký Nguyện vọng xét tuyển</div>
      
      {/* Stepper */}
      <div style={{display:"flex",marginBottom:20}}>
        {STEPS.map((s,i)=>(
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4, cursor: "pointer"}} onClick={() => setStep(i)}>
            <div style={{width:28,height:28,borderRadius:"50%",background:i<=step?C.primary:C.bgS,color:i<=step?"#fff":C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600, border: i<=step ? 'none' : `1px solid ${C.bd}`}}>
              {i<step?"✓":i+1}
            </div>
            <div style={{fontSize:10,color:i<=step?C.primary:C.muted,textAlign:"center",fontWeight:i===step?600:400}}>{s}</div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <Card className="animate-fade-in">
          <div style={{fontSize:15,fontWeight:600,marginBottom:12}}>1. Xác nhận Thông tin cá nhân</div>
          <Field label="Họ và tên" value={info.hoTen} onChange={(e:any)=>setInfo({...info,hoTen:e.target.value})} />
          <Field label="CCCD (Tên đăng nhập)" disabled value={info.cccd} style={{background: C.bgS}} />
          <Field label="Số điện thoại" value={info.sdt} onChange={(e:any)=>setInfo({...info,sdt:e.target.value})} />
          <Field label="Email liên hệ" type="email" value={info.email} onChange={(e:any)=>setInfo({...info,email:e.target.value})} />
          <Sel label="Khu vực ưu tiên" value={info.khuVuc} onChange={(e:any)=>setInfo({...info,khuVuc:e.target.value})} options={[{value:"KV1",label:"KV1 (+0.75)"},{value:"KV2",label:"KV2 (+0.50)"},{value:"KV3",label:"KV3 (+0)"}]} />
          <Btn onClick={handleSaveInfo} style={{marginTop: 10}}>Lưu và Tiếp tục</Btn>
        </Card>
      )}

      {step === 1 && (
        <Card className="animate-fade-in">
          <div style={{fontSize:15,fontWeight:600,marginBottom:12}}>2. Tải lên Hồ sơ minh chứng</div>
          <InfoBox>Vui lòng upload bản scan Học bạ, Giấy chứng nhận giải thưởng, điểm ĐGNL hoặc IELTS (File PDF hoặc Ảnh).</InfoBox>
          
          <div style={{border: `2px dashed ${C.bd}`, padding: 30, textAlign: "center", borderRadius: 10, position: "relative", cursor: "pointer", background: C.bgS, marginBottom: 16}}>
            <input type="file" onChange={handleFileUpload} style={{opacity: 0, position: "absolute", inset: 0, cursor: "pointer", width: "100%"}} />
            <div style={{fontSize: 30, marginBottom: 10}}>📂</div>
            <div style={{fontSize: 14, fontWeight: 600, color: C.primary}}>Bấm hoặc kéo thả file vào đây</div>
            <div style={{fontSize: 11, color: C.muted, marginTop: 4}}>Hỗ trợ định dạng PDF, JPG, PNG (Tối đa 5MB)</div>
          </div>

          <div style={{fontSize: 13, fontWeight: 600, marginBottom: 8}}>Danh sách file đã nộp:</div>
          {(!user.files || user.files.length === 0) && <div style={{fontSize: 12, color: C.muted}}>Chưa có file nào.</div>}
          {user.files?.map((f:any, i:number) => (
            <div key={i} style={{background: C.pLight, padding: "8px 12px", borderRadius: 6, fontSize: 12, display: "flex", justifyContent: "space-between", marginBottom: 6}}>
              <span style={{fontWeight: 600, color: C.primary}}>{f.name}</span>
              <span style={{color: C.muted}}>{new Date(f.date).toLocaleDateString("vi-VN")}</span>
            </div>
          ))}

          <div style={{display: "flex", gap: 10, marginTop: 20}}>
            <Btn variant="outline" onClick={() => setStep(0)}>Quay lại</Btn>
            <Btn onClick={() => setStep(2)}>Đã xong, Tiếp tục</Btn>
          </div>
        </Card>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:15,fontWeight:600}}>3. Danh sách Nguyện vọng ({nvList.length}/15)</div>
            {nvList.length<15 && <Btn size="sm" onClick={()=>setShowAdd(true)}>+ Thêm NV</Btn>}
          </div>

          {showAdd && <Card style={{marginBottom:16, border: `1px solid ${C.primary}`}}>
            <div style={{fontSize:13,fontWeight:600,color:C.primary,marginBottom:10}}>Thêm nguyện vọng NV{nvList.length+1}</div>
            <Sel label="Ngành học" value={formNV.ctMa} onChange={(e:any)=>setFormNV({...formNV, ctMa: e.target.value, toHop: ""})} options={[{value:"",label:"-- Chọn ngành --"}, ...db.programs.map((c:any)=>({value:c.ma, label:`${c.ma} - ${c.ten}`}))]} />
            <Sel label="Phương thức" value={formNV.ptId} onChange={(e:any)=>setFormNV({...formNV, ptId: e.target.value})} options={[{value:"",label:"-- Chọn phương thức --"}, ...Object.values(PHUONG_THUCS).map((p:any)=>({value:p.id, label:`PT${p.stt} - ${p.ten}`}))]} />
            <div style={{display: "flex", gap: 10}}>
              <div style={{flex: 1}}>
                <Sel label="Tổ hợp xét" value={formNV.toHop} onChange={(e:any)=>setFormNV({...formNV, toHop: e.target.value})} options={[{value:"",label:"-- Chọn --"}, ...(db.programs.find((c:any)=>c.ma===formNV.ctMa)?.toHops || []).map((t:string)=>({value:t,label:t}))]} />
              </div>
              <div style={{flex: 1}}>
                <Field label="Điểm xét tuyển" type="number" placeholder="Ví dụ: 27.5" value={formNV.diem} onChange={(e:any)=>setFormNV({...formNV, diem: e.target.value})} />
              </div>
            </div>
            <div style={{display:"flex",gap:8, marginTop: 10}}>
              <Btn onClick={addNV} style={{flex: 1}}>✓ Lưu Nguyện Vọng</Btn>
              <Btn variant="outline" onClick={()=>setShowAdd(false)}>Hủy</Btn>
            </div>
          </Card>}

          {nvList.length===0 && <Card style={{textAlign:"center",padding:"30px 0",color:C.muted}}>Chưa có nguyện vọng nào. Hãy bấm Thêm NV.</Card>}
          
          {nvList.map((nv:any) => (
            <Card key={nv.id} style={{marginBottom:10, borderLeft: `4px solid ${C.primary}`}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:C.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#fff"}}>{nv.priority}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:600,color:C.text}}>{db.programs.find((p:any)=>p.ma===nv.majorCode)?.ten}</div>
                  <div style={{fontSize:12,color:C.muted, marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap"}}>
                    <Badge color="blue">{nv.majorCode}</Badge>
                    <Badge color="gray">{nv.methodId}</Badge>
                    <Badge color="gray">Tổ hợp {nv.combo}</Badge>
                    <Badge color="red">Điểm: {nv.totalScore}</Badge>
                  </div>
                </div>
                <button onClick={()=>removeNV(nv.id)} style={{background:"transparent",border:"none",color:C.danger,cursor:"pointer",padding:8, fontSize: 16}}>✕</button>
              </div>
            </Card>
          ))}

          <div style={{display: "flex", gap: 10, marginTop: 20}}>
            <Btn variant="outline" onClick={() => setStep(1)}>Quay lại</Btn>
            <Btn onClick={() => setStep(3)} disabled={nvList.length===0}>Xác nhận Nộp hồ sơ</Btn>
          </div>
        </div>
      )}

      {step === 3 && (
        <Card style={{textAlign: "center", padding: "40px 20px"}} className="animate-fade-in">
          <div style={{fontSize: 50, marginBottom: 16}}>🎉</div>
          <div style={{fontSize: 20, fontWeight: 600, color: C.success, marginBottom: 8}}>Hồ sơ đăng ký đã được ghi nhận!</div>
          <p style={{fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 20}}>
            Bạn đã đăng ký thành công {nvList.length} nguyện vọng.<br/>
            Hệ thống sẽ lưu trữ và cho phép chỉnh sửa đến hết ngày 20/07/2026.<br/>
            Lệ phí xét tuyển hiện tại: <strong>{fmt(nvList.length * 50000)} VNĐ</strong>
          </p>
          <InfoBox type="ok" style={{textAlign: "left", display: "inline-block"}}>Mã hồ sơ của bạn: <strong>HS2026-{user.id}</strong></InfoBox>
        </Card>
      )}
    </div>
  );
}

function PageKetQua({ db, user }: { db: any, user: any }) {
  if (!user) return <Card className="animate-fade-in">Vui lòng đăng nhập để xem kết quả.</Card>;

  const admitted = db.wishes.find((w:any) => w.candidateId === user.id && w.status === "ADMITTED");

  return (
    <div className="animate-fade-in">
      <div style={{fontSize:18,fontWeight:600,marginBottom:16}}>Kết quả Xét tuyển</div>
      
      {admitted ? (
        <Card style={{border: `2px solid ${C.success}`}}>
          <div style={{textAlign: "center", padding: "20px 0", borderBottom: `1px solid ${C.bd}`, marginBottom: 16}}>
            <div style={{fontSize: 40, marginBottom: 10}}>🎊</div>
            <div style={{fontSize: 22, fontWeight: 700, color: C.success, textTransform: "uppercase"}}>CHÚC MỪNG TRÚNG TUYỂN</div>
            <div style={{fontSize: 14, color: C.muted, marginTop: 8}}>{TRUONG.ten}</div>
          </div>
          
          <div style={{fontSize: 14, lineHeight: 2}}>
            <div style={{display: "flex", justifyContent: "space-between"}}><span>Họ và tên:</span> <strong>{user.name}</strong></div>
            <div style={{display: "flex", justifyContent: "space-between"}}><span>Số CCCD:</span> <strong>{user.cccd}</strong></div>
            <div style={{display: "flex", justifyContent: "space-between"}}><span>Trúng tuyển nguyện vọng:</span> <strong style={{color: C.primary}}>NV số {admitted.priority}</strong></div>
            <div style={{display: "flex", justifyContent: "space-between"}}><span>Ngành trúng tuyển:</span> <strong style={{color: C.primary}}>{db.programs.find((p:any)=>p.ma===admitted.majorCode)?.ten}</strong></div>
            <div style={{display: "flex", justifyContent: "space-between"}}><span>Điểm xét:</span> <strong>{admitted.totalScore}</strong></div>
          </div>
          
          <InfoBox type="warn" style={{marginTop: 20}}>
            Vui lòng chuẩn bị hồ sơ nhập học bản cứng và xác nhận nhập học trực tuyến trước 17h00 ngày 05/08/2026.
          </InfoBox>
          <Btn full variant="success" style={{marginTop: 10}}>Xác nhận Nhập học ngay</Btn>
        </Card>
      ) : (
        <Card style={{textAlign: "center", padding: "40px 20px"}}>
          <div style={{fontSize: 40, marginBottom: 10}}>⏳</div>
          <div style={{fontSize: 18, fontWeight: 600, color: C.text}}>Chưa có kết quả trúng tuyển</div>
          <p style={{fontSize: 13, color: C.muted, marginTop: 8, lineHeight: 1.6}}>
            Hệ thống đang trong quá trình mở đăng ký hoặc đang xử lý xét tuyển.<br/>Kết quả đợt 1 dự kiến sẽ được công bố vào 25/07/2026.
          </p>
        </Card>
      )}
    </div>
  );
}

/* ─── PHÂN HỆ QUẢN TRỊ (RBAC) ───────────────────────────── */
function PageAdmin({ db, updateDb, user, addToast, writeLog }: any) {
  const [tab, setTab] = useState("overview"); 

  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const canEdit = user.role === "SUPER_ADMIN" || user.role === "EDITOR";

  const runAlgorithm = () => {
    if (!isSuperAdmin) { addToast("Chỉ Trưởng Ban mới có quyền Chốt điểm!", "error"); return; }
    
    let newWishes = [...db.wishes];
    newWishes.forEach(w => w.status = "PENDING"); 
    
    db.programs.forEach((m:any) => {
      let mWs = newWishes.filter(w => w.majorCode === m.ma && w.status === "PENDING");
      mWs.sort((a, b) => b.totalScore - a.totalScore || a.priority - b.priority);
      
      let admitted = mWs.slice(0, m.chiTieu);
      admitted.forEach(aw => {
        newWishes.find(w => w.id === aw.id)!.status = "ADMITTED";
        newWishes.forEach(w => {
          if (w.candidateId === aw.candidateId && w.priority > aw.priority) w.status = "REJECTED";
        });
      });
    });

    newWishes.forEach(w => { if (w.status === "PENDING") w.status = "REJECTED"; });
    updateDb({ ...db, wishes: newWishes });
    writeLog(user.name, "ALGORITHM", "Thực thi chốt điểm và xét tuyển thành công.");
    addToast("Chốt điểm thành công! Dữ liệu đã được cập nhật.", "success");
  };

  const [postForm, setPostForm] = useState({ title: "", content: "" });
  const handlePost = () => {
    if (!canEdit) { addToast("Quyền của bạn chỉ được xem!", "error"); return; }
    if (!postForm.title) { addToast("Vui lòng nhập tiêu đề", "error"); return; }
    
    const newPost = { id: Date.now(), title: postForm.title, content: postForm.content, date: new Date().toISOString() };
    updateDb({ ...db, posts: [newPost, ...db.posts] });
    writeLog(user.name, "POST_NEWS", `Đăng bài: ${postForm.title}`);
    setPostForm({ title: "", content: "" });
    addToast("Đăng tin thành công!", "success");
  };

  const deletePost = (id: number) => {
    if (!canEdit) { addToast("Không có quyền xóa", "error"); return; }
    if (confirm("Xóa bài viết này?")) {
      updateDb({ ...db, posts: db.posts.filter((p:any) => p.id !== id) });
      writeLog(user.name, "DEL_POST", "Xóa bài viết");
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16, flexWrap: "wrap", gap: 10}}>
        <div>
          <div style={{fontSize:20,fontWeight:700, color: C.primary}}>Cổng Quản trị Tuyển sinh</div>
          <div style={{fontSize:12, color: C.muted, marginTop: 4}}>
            Quyền hạn: <Badge color={isSuperAdmin ? "red" : canEdit ? "blue" : "gray"}>{user.role}</Badge>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={runAlgorithm} disabled={!isSuperAdmin} variant={isSuperAdmin ? "danger" : "ghost"} style={{border: isSuperAdmin ? 'none' : `1px solid ${C.bd}`}}>⚙️ Chạy Xét tuyển Lọc ảo</Btn>
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:20,borderBottom:`1px solid ${C.bd}`,paddingBottom:10, overflowX: "auto"}}>
        {[
          { id: "overview", label: "📊 Thống kê Thí sinh" },
          { id: "programs", label: "📖 Cấu hình Chỉ tiêu" },
          { id: "news", label: "📰 Đăng thông báo" },
          { id: "logs", label: "🛡️ Audit Logs" }
        ].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap",
            background: tab === t.id ? C.primary : "transparent", color: tab === t.id ? "#fff" : C.muted
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="animate-fade-in">
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
            <Card style={{textAlign: "center", borderTop: `4px solid ${C.primary}`}}>
              <div style={{fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase"}}>Tổng Thí sinh</div>
              <div style={{fontSize: 32, fontWeight: 700, color: C.primary, marginTop: 8}}>{db.users.filter((u:any)=>u.role==="CANDIDATE").length}</div>
            </Card>
            <Card style={{textAlign: "center", borderTop: `4px solid #d97706`}}>
              <div style={{fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase"}}>Tổng Nguyện vọng</div>
              <div style={{fontSize: 32, fontWeight: 700, color: "#d97706", marginTop: 8}}>{db.wishes.length}</div>
            </Card>
            <Card style={{textAlign: "center", borderTop: `4px solid ${C.success}`}}>
              <div style={{fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase"}}>Đã Trúng tuyển</div>
              <div style={{fontSize: 32, fontWeight: 700, color: C.success, marginTop: 8}}>{db.wishes.filter((w:any)=>w.status==="ADMITTED").length}</div>
            </Card>
          </div>

          <Card style={{padding: 0, overflow: "hidden"}}>
            <div style={{padding: "16px", borderBottom: `1px solid ${C.bd}`, fontWeight: 600, backgroundColor: C.bgS}}>Dữ liệu Thí sinh & Nguyện vọng</div>
            <div style={{overflowX: "auto"}}>
              <table style={{width: "100%", borderCollapse: "collapse", fontSize: 13}}>
                <thead>
                  <tr style={{textAlign: "left", color: C.muted, borderBottom: `1px solid ${C.bd}`}}>
                    <th style={{padding: "12px 16px"}}>Thí sinh</th>
                    <th style={{padding: "12px 16px"}}>Ngành XT</th>
                    <th style={{padding: "12px 16px"}}>Điểm</th>
                    <th style={{padding: "12px 16px"}}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {db.wishes.sort((a:any,b:any) => b.totalScore - a.totalScore).map((w:any) => {
                    const c = db.users.find((u:any) => u.id === w.candidateId);
                    return (
                      <tr key={w.id} style={{borderBottom: `1px solid ${C.bd}`}}>
                        <td style={{padding: "12px 16px"}}>
                          <div style={{fontWeight: 600}}>{c?.name}</div>
                          <div style={{fontSize: 11, color: C.muted}}>CCCD: {c?.cccd}</div>
                          {c?.files?.length > 0 && <div style={{fontSize: 10, color: C.primary, marginTop: 4}}>📁 Có {c.files.length} minh chứng</div>}
                        </td>
                        <td style={{padding: "12px 16px"}}>
                          <div style={{fontWeight: 600, color: C.primary}}>{w.majorCode}</div>
                          <div style={{fontSize: 11, color: C.muted}}>NV số {w.priority}</div>
                        </td>
                        <td style={{padding: "12px 16px", fontWeight: 600, fontFamily: "monospace"}}>{w.totalScore}</td>
                        <td style={{padding: "12px 16px"}}>
                          <Badge color={w.status==='ADMITTED'?'green':w.status==='REJECTED'?'red':w.status==='CANCELED'?'gray':'yellow'}>{w.status}</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab === "news" && (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <div style={{fontSize: 14, fontWeight: 600, marginBottom: 12}}>Soạn bài mới</div>
              <Field placeholder="Nhập tiêu đề..." value={postForm.title} onChange={(e:any)=>setPostForm({...postForm, title: e.target.value})} disabled={!canEdit} />
              <textarea placeholder="Nhập nội dung thông báo..." value={postForm.content} onChange={(e:any)=>setPostForm({...postForm, content: e.target.value})} disabled={!canEdit} style={{width:"100%", height: 150, padding: 10, borderRadius: 8, border: `1px solid ${C.bd}`, fontSize: 13, outline: "none", marginBottom: 10, fontFamily: "inherit"}} />
              <Btn full onClick={handlePost} disabled={!canEdit}>Đăng thông báo lên Web</Btn>
              {!canEdit && <div style={{fontSize: 11, color: C.danger, marginTop: 8, textAlign: "center"}}>Tài khoản Viewer không được phép đăng bài.</div>}
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {db.posts.map((p:any) => (
              <Card key={p.id} style={{position: "relative"}}>
                <button onClick={() => deletePost(p.id)} disabled={!canEdit} style={{position: "absolute", top: 12, right: 12, background: "transparent", border: "none", color: C.danger, cursor: canEdit ? "pointer" : "not-allowed", fontSize: 16}}>✕</button>
                <div style={{fontSize: 16, fontWeight: 600, color: C.primary, marginBottom: 4, paddingRight: 24}}>{p.title}</div>
                <div style={{fontSize: 11, color: C.muted, marginBottom: 10}}>Ngày đăng: {new Date(p.date).toLocaleString()}</div>
                <div style={{fontSize: 13, lineHeight: 1.6, color: C.text, whiteSpace: "pre-wrap"}}>{p.content}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "programs" && (
        <div className="animate-fade-in">
           <InfoBox>Admin cấp 1 và 2 (Editor) có thể chỉnh sửa cấu hình ngành học trực tiếp trên hệ thống.</InfoBox>
           <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: 16}}>
             {db.programs.map((p:any, i:number) => (
               <Card key={p.ma}>
                 <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                   <div>
                     <div style={{display: "flex", gap: 8, alignItems: "center", marginBottom: 6}}>
                       <Badge color="blue">{p.ma}</Badge>
                       <span style={{fontWeight: 600, fontSize: 15}}>{p.ten}</span>
                     </div>
                     <div style={{fontSize: 12, color: C.muted}}>Chỉ tiêu hiện tại: <strong style={{color: C.primary}}>{p.chiTieu}</strong> | Học phí: {fmt(p.hocPhi)}</div>
                   </div>
                   <Btn size="sm" variant="outline" disabled={!canEdit} onClick={() => {
                     if(!canEdit) return;
                     const target = prompt(`Nhập chỉ tiêu mới cho ngành ${p.ma}:`, String(p.chiTieu));
                     if(target && !isNaN(Number(target))) {
                        const newPrograms = [...db.programs];
                        newPrograms[i].chiTieu = Number(target);
                        updateDb({...db, programs: newPrograms});
                        writeLog(user.name, "UPDATE_PROGRAM", `Đổi chỉ tiêu ngành ${p.ma} thành ${target}`);
                        addToast("Cập nhật thành công", "success");
                     }
                   }}>Sửa chỉ tiêu</Btn>
                 </div>
               </Card>
             ))}
           </div>
        </div>
      )}

      {tab === "logs" && (
        <Card className="animate-fade-in" style={{padding: 0, overflow: "hidden", background: "#0f172a"}}>
          <div style={{padding: "16px", borderBottom: `1px solid #1e293b`, fontWeight: 600, color: "#e2e8f0"}}>Lịch sử hệ thống (Không thể xóa)</div>
          <div style={{height: 400, overflowY: "auto", padding: "16px", fontFamily: "monospace", fontSize: 12}}>
            {db.logs.map((l:any) => (
              <div key={l.id} style={{display: "flex", gap: 12, marginBottom: 8, borderBottom: "1px solid #1e293b", paddingBottom: 8}}>
                <span style={{color: "#64748b", flexShrink: 0}}>{new Date(l.time).toLocaleTimeString()}</span>
                <span style={{color: "#fbbf24", width: 120, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>[{l.actor}]</span>
                <span style={{color: "#34d399", width: 100, flexShrink: 0}}>👉 {l.action}</span>
                <span style={{color: "#e2e8f0"}}>{l.detail}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
}