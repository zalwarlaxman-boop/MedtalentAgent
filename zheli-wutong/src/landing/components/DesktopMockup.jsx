export default function DesktopMockup({ children }) {
  return (
    <div className="relative w-full max-w-[1200px] h-[80vh] min-h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
      {/* 浏览器顶部栏 */}
      <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4 shrink-0">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="mx-auto flex-1 max-w-xl bg-white h-7 rounded-md shadow-sm border border-gray-200 flex items-center justify-center text-xs text-gray-400">
          <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
          wutong.health.solo.ai
        </div>
      </div>
      {/* 浏览器内容区 */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {children}
      </div>
    </div>
  );
}