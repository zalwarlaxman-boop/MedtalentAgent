import { Outlet, Link, useLocation } from "react-router-dom";
import { BrainCircuit, MessageSquare, BookOpen, Activity, HelpCircle, User } from "lucide-react";
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

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto bg-[#faf9f5] overflow-hidden shadow-2xl relative">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bg-white border-t border-[#e8e6dc] flex items-center justify-around h-[68px] px-2 shrink-0 pb-safe">
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
    </div>
  );
}
