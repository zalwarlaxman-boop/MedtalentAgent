import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { BrainCircuit, MessageSquare, BookOpen, Activity, HelpCircle, User, ChevronLeft, Stethoscope } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: <BrainCircuit size={20} />, label: '医生智能体', path: '/doctor' },
  { icon: <MessageSquare size={20} />, label: '医患互动', path: '/doctor/interact' },
  { icon: <BookOpen size={20} />, label: '医学科普', path: '/doctor/popsci' },
  { icon: <Activity size={20} />, label: '健康服务', path: '/doctor/service' },
  { icon: <HelpCircle size={20} />, label: '百问百答', path: '/doctor/faq' },
  { icon: <User size={20} />, label: '我的主页', path: '/doctor/me' },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="relative h-full w-full bg-[#f8f9fa] overflow-hidden font-sans antialiased text-[#1d1d1f] flex flex-col md:flex-row">
      
      {/* 桌面端：左侧边栏 */}
      <aside className="hidden md:flex flex-col w-20 bg-white border-r border-[#e8e6dc] h-full py-4 items-center shrink-0 z-10 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6b8c5a] to-[#4a5e42] flex items-center justify-center text-white shadow-md mb-8 cursor-pointer hover:scale-105 transition-transform duration-300">
          <Stethoscope size={22} strokeWidth={2.5} />
        </div>

        <nav className="flex-1 w-full flex flex-col items-center gap-3 px-2">
          {navItems.map((item) => {
            const isActive = item.path === "/doctor" ? location.pathname === "/doctor" : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-[#4a5e42] scale-110"
                    : "text-[#8a9286] hover:text-[#4a5e42] hover:bg-[#f0f2ea]"
                )}
              >
                {item.icon}
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 flex flex-col items-center gap-4 w-full">
          <button className="w-10 h-10 rounded-full bg-[#f0f2ea] text-[#4a5e42] flex items-center justify-center hover:bg-[#e4e7db] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#6b8c5a]">
            <User size={20} strokeWidth={2} />
          </button>
        </div>
      </aside>

      {/* 主体内容区（限制宽度并在中央展示，移动端占满） */}
      <main className="flex-1 h-full w-full max-w-full overflow-hidden bg-[#f8f9fa] shadow-2xl md:rounded-l-[2.5rem] relative z-0 flex flex-col border-l border-[#e8e6dc]/50">
        {/* Header - Top bar for Mobile */}
        <header className="md:hidden flex items-center justify-between px-5 h-16 bg-white/80 backdrop-blur-md border-b border-[#e8e6dc] shrink-0 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            {location.pathname !== '/doctor' && (
              <button 
                onClick={() => navigate(-1)}
                className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full hover:bg-black/5 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft size={24} className="text-[#1d1d1f]" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6b8c5a] to-[#4a5e42] flex items-center justify-center text-white shadow-sm">
              <Stethoscope size={18} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#1d1d1f] font-heading">MedTalent</span>
          </div>
          <button className="w-9 h-9 rounded-full bg-[#f0f2ea] text-[#4a5e42] flex items-center justify-center">
            <User size={18} strokeWidth={2.5} />
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide relative pb-safe">
          <Outlet />
        </div>

        {/* 移动端：底部导航栏 */}
        <nav className="md:hidden bg-white border-t border-[#e8e6dc] flex items-center justify-around h-[68px] px-2 shrink-0 pb-safe">
          {navItems.map((item) => {
            const isActive = item.path === "/doctor" ? location.pathname === "/doctor" : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-[#4a5e42] scale-110"
                    : "text-[#8a9286] hover:text-[#4a5e42] hover:bg-[#f0f2ea]"
                )}
              >
                {item.icon}
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </main>

    </div>
  );
}
