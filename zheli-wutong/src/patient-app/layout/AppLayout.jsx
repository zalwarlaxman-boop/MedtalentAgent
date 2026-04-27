import { useState, useCallback } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Leaf, LayoutGrid, MessageCircle, ScanFace, Scale,
  Sparkles, ShoppingBag, Stethoscope, Brain, Apple, Menu, X
} from 'lucide-react'
import { cn } from '../lib/cn'

const nav = [
  { to: '/patient', label: '总览', icon: LayoutGrid },
  { to: '/patient/interaction', label: '互动', icon: MessageCircle },
  { to: '/patient/profile', label: '画像', icon: ScanFace },
  { to: '/patient/weight', label: '体重管理', icon: Scale },
  { to: '/patient/cluster', label: '智能体集群', icon: Sparkles },
  { to: '/patient/goods', label: '好物', icon: ShoppingBag },
  { to: '/patient/hospital', label: '医院', icon: Stethoscope },
  { to: '/patient/experts', label: '专家联盟', icon: Brain },
  { to: '/patient/dietitians', label: '营养师', icon: Apple },
]

const SIDEBAR_COLLAPSED = 64  // w-16
const SIDEBAR_EXPANDED = 224  // w-56

/* Tooltip wrapper for collapsed icon */
function IconTooltip({ label, children, show }) {
  return (
    <div className="relative group">
      {children}
      {show && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-lg bg-wutong-dark text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-[60] shadow-lg">
          {label}
        </div>
      )}
    </div>
  )
}

export default function AppLayout() {
  const [expanded, setExpanded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const openSidebar = useCallback(() => setExpanded(true), [])
  const closeSidebar = useCallback(() => setExpanded(false), [])
  const toggleMobile = useCallback(() => setMobileOpen(prev => !prev), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  const isNavActive = (to) => {
    if (to === '/patient') return location.pathname === '/patient' || location.pathname === '/patient/'
    return location.pathname.startsWith(to)
  }

  return (
    <div className="h-full w-full relative bg-gray-50 overflow-hidden">
      {/* ===== Desktop Sidebar ===== */}
      <div
        className="hidden md:block absolute left-0 top-0 h-full z-50"
        onMouseEnter={openSidebar}
        onMouseLeave={closeSidebar}
      >
        <div
          className="h-full flex flex-col py-6 gap-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden"
          style={{
            width: expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED,
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255,255,255,0.8)',
            boxShadow: expanded ? '4px 0 24px rgba(45,106,79,0.10)' : '2px 0 8px rgba(45,106,79,0.06)',
          }}
        >
          {/* Brand */}
          <div className={cn('flex items-center gap-3 mb-4 shrink-0', expanded ? 'px-4' : 'px-0 justify-center')}>
            <div className="w-10 h-10 rounded-full bg-wutong-primary flex items-center justify-center text-white shadow-md shrink-0">
              <Leaf size={22} />
            </div>
            <div className={cn('overflow-hidden whitespace-nowrap transition-all duration-300', expanded ? 'w-auto opacity-100' : 'w-0 opacity-0')}>
              <h1 className="text-lg font-serif font-bold text-wutong-dark leading-tight">浙里梧桐</h1>
              <p className="text-[11px] text-wutong-light font-medium">AI智能体空间</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className={cn('flex-1 flex flex-col gap-1 overflow-y-auto scrollbar-hide', expanded ? 'px-4' : 'px-2')}>
            {nav.map((item) => {
              const Icon = item.icon
              const active = isNavActive(item.to)
              return (
                <IconTooltip key={item.to} label={item.label} show={!expanded}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/patient'}
                    className={() =>
                      cn(
                        'flex items-center gap-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 select-none whitespace-nowrap',
                        expanded ? 'px-3' : 'px-0 justify-center',
                        active
                          ? 'bg-wutong-primary text-white shadow-sm'
                          : 'text-wutong-dark hover:bg-wutong-soft/60'
                      )
                    }
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className={cn('transition-all duration-300 overflow-hidden', expanded ? 'w-auto opacity-100' : 'w-0 opacity-0')}>
                      {item.label}
                    </span>
                  </NavLink>
                </IconTooltip>
              )
            })}
          </nav>

          {/* Bottom user area */}
          <div className={cn('flex items-center gap-2 pt-3 border-t border-wutong-soft/60 shrink-0', expanded ? 'px-4' : 'px-0 justify-center')}>
            <div className="w-8 h-8 rounded-full bg-wutong-soft border-2 border-white shadow-sm overflow-hidden shrink-0">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="avatar" />
            </div>
            <div className={cn('overflow-hidden whitespace-nowrap transition-all duration-300', expanded ? 'w-auto opacity-100' : 'w-0 opacity-0')}>
              <p className="text-xs font-bold text-wutong-dark truncate">User_001</p>
              <p className="text-[10px] text-wutong-light truncate">VIP Member</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Mobile: hamburger button ===== */}
      <button
        onClick={toggleMobile}
        className="md:hidden fixed left-4 bottom-4 z-50 w-12 h-12 rounded-full bg-wutong-primary text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* ===== Mobile: overlay + sidebar ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMobile}
            />
            {/* Mobile sidebar */}
            <motion.aside
              className="md:hidden fixed left-0 top-0 h-screen z-50 flex flex-col py-6 px-4 gap-2"
              style={{
                width: SIDEBAR_EXPANDED,
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '4px 0 24px rgba(45,106,79,0.12)',
              }}
              initial={{ x: -SIDEBAR_EXPANDED }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_EXPANDED }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Brand */}
              <div className="flex items-center gap-3 px-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-wutong-primary flex items-center justify-center text-white shadow-md shrink-0">
                  <Leaf size={22} />
                </div>
                <div>
                  <h1 className="text-lg font-serif font-bold text-wutong-dark leading-tight">浙里梧桐</h1>
                  <p className="text-[11px] text-wutong-light font-medium">AI智能体空间</p>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
                {nav.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/patient'}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 select-none whitespace-nowrap',
                          isActive
                            ? 'bg-wutong-primary text-white shadow-sm'
                            : 'text-wutong-dark hover:bg-wutong-soft/60'
                        )
                      }
                    >
                      <Icon size={18} className="shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </nav>

              {/* Bottom user */}
              <div className="flex items-center gap-2 px-2 pt-3 border-t border-wutong-soft/60">
                <div className="w-8 h-8 rounded-full bg-wutong-soft border-2 border-white shadow-sm overflow-hidden shrink-0">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="avatar" />
                </div>
                <div>
                  <p className="text-xs font-bold text-wutong-dark">User_001</p>
                  <p className="text-[10px] text-wutong-light">VIP Member</p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== Main Content ===== */}
      <main className="h-full p-4 md:p-8 md:ml-16 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
