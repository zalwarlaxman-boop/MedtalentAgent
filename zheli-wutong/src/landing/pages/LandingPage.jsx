import { useState } from 'react';
import { Building2, MessageSquareText, FileText, Smartphone, Stethoscope, Settings } from 'lucide-react';
import WutongApp from '../../apps/wutong/App';
import DoctorDemoApp from '../../apps/doctor-demo/App';
import DesktopMockup from '../components/DesktopMockup';
import MobileMockup from '../components/MobileMockup';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('tab4');

  const navItems = [
    { id: 'tab1', icon: Building2, label: '公司介绍', desc: '了解我们' },
    { id: 'tab2', icon: MessageSquareText, label: '业务展示', desc: '核心能力' },
    { id: 'tab3', icon: FileText, label: '媒体报道', desc: '新闻资讯' },
    { id: 'tab4', icon: Smartphone, label: '大众端平台', desc: '浙里梧桐' },
    { id: 'tab5', icon: Stethoscope, label: '医生端定制', desc: '健康助手' },
    { id: 'tab6', icon: Settings, label: '后台管理', desc: '企业控制台' },
  ];

  return (
    <div className="flex h-screen bg-[#F5F5F7] overflow-hidden antialiased font-sans">
      {/* 左侧导航 */}
      <nav className="w-64 bg-white shadow-[2px_0_12px_rgba(0,0,0,0.05)] z-10 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
            SOLO AI
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-blue-50/80 text-blue-600 shadow-sm' 
                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                  }`}
              >
                <div className={`p-2 rounded-lg mr-3 transition-colors duration-300
                  ${isActive ? 'bg-blue-100/50' : 'bg-gray-100 group-hover:bg-white'}
                `}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <div className="text-left">
                  <div className={`font-semibold text-[15px] ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
                    {item.label}
                  </div>
                  <div className="text-[12px] text-gray-400 mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-6 border-t border-gray-100">
          <div className="text-xs text-center text-gray-400">
            © 2024 SOLO AI. All rights reserved.
          </div>
        </div>
      </nav>

      {/* 右侧内容区 */}
      <main className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-[#F5F5F7] to-[#F5F5F7]">
        {activeTab === 'tab1' && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 animate-in fade-in zoom-in duration-500">
            <Building2 size={64} className="mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">公司介绍</h2>
            <p>内容建设中...</p>
          </div>
        )}
        
        {activeTab === 'tab2' && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 animate-in fade-in zoom-in duration-500">
            <MessageSquareText size={64} className="mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">业务展示</h2>
            <p>内容建设中...</p>
          </div>
        )}

        {activeTab === 'tab3' && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 animate-in fade-in zoom-in duration-500">
            <FileText size={64} className="mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">媒体报道</h2>
            <p>内容建设中...</p>
          </div>
        )}

        {/* Tab 4: 大众端平台 - 嵌入电脑壳 */}
        {activeTab === 'tab4' && (
          <div className="h-full w-full flex items-center justify-center p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <DesktopMockup>
               <WutongApp />
             </DesktopMockup>
          </div>
        )}

        {/* Tab 5: 医生端定制 - 嵌入手机壳 */}
        {activeTab === 'tab5' && (
          <div className="h-full w-full flex items-center justify-center p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <MobileMockup>
               <DoctorDemoApp />
             </MobileMockup>
          </div>
        )}

        {activeTab === 'tab6' && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 animate-in fade-in zoom-in duration-500">
            <Settings size={64} className="mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">后台管理</h2>
            <p>内容建设中...</p>
          </div>
        )}
      </main>
    </div>
  );
}