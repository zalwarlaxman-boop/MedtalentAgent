import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeTab } from './sections/HomeTab';
import { OverviewTab } from './sections/OverviewTab';
import { OsTab } from './sections/OsTab';
import { KnowledgeTab } from './sections/KnowledgeTab';
import { ConsumerTab } from './sections/ConsumerTab';
import { DoctorTab } from './sections/DoctorTab';

const NAV_ITEMS = [
  { id: 'home', label: '首页' },
  { id: 'overview', label: '1+N 智能体矩阵' },
  { id: 'os', label: 'Agent OS 底座' },
  { id: 'knowledge', label: '智能健康知识引擎' },
  { id: 'consumer', label: '大众端平台' },
  { id: 'doctor', label: '医生端定制' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-bg-color font-body text-text-main antialiased overflow-hidden">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 w-full h-[72px] glass-nav z-50 px-10 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/透明底公司logo.png" 
            alt="Medtalent" 
            className="h-9 object-contain filter brightness-0" 
          />
        </div>
        <ul className="flex gap-2 m-0 p-0 list-none">
          {NAV_ITEMS.map((item) => (
            <li 
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-full cursor-pointer text-[15px] font-medium transition-all duration-400 ${
                activeTab === item.id 
                  ? 'bg-text-main text-white shadow-sm' 
                  : 'text-text-secondary hover:bg-primary/5 hover:text-primary-dark hover:-translate-y-[1px]'
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-[72px] scroll-smooth">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full pb-20"
          >
            {activeTab === 'home' && <HomeTab onNavigate={setActiveTab} />}
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'os' && <OsTab />}
            {activeTab === 'knowledge' && <KnowledgeTab />}
            {activeTab === 'consumer' && <ConsumerTab />}
            {activeTab === 'doctor' && <DoctorTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}