import React, { useState } from 'react';
import './portal.css';
import PatientApp from '../patient-app/App';
import DoctorApp from '../doctor-demo/App';
import MacbookMockup from './components/MacbookMockup';
import MobileMockup from './components/MobileMockup';
import TabHome from './TabHome';
import TabOverview from './TabOverview';
import TabOs from './TabOs';
import TabKnowledge from './TabKnowledge';

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState('tab-home');

  const tabs = [
    { id: 'tab-home', icon: '🏠', label: '首页' },
    { id: 'tab-overview', icon: '🌐', label: '1+N 智能体矩阵' },
    { id: 'tab-os', icon: '⚙️', label: 'Agent OS 底座' },
    { id: 'tab-knowledge', icon: '📚', label: '智能健康知识引擎' },
    { id: 'tab-c-end', icon: '👥', label: '面向大众端场景 - 自有平台' },
    { id: 'tab-b-end', icon: '⚕️', label: '面向医生端场景 - 专项定制' },
  ];

  return (
    <div className="portal-root">
      {/* 侧边栏导航 */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon"></div>
          木吾木同 Agent
        </div>
        <ul className="nav-menu">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <p>© 2026 Medtalent Inc.</p>
          <p>生活方式医学 AI 平台</p>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="main-content">
        {activeTab === 'tab-home' && <TabHome />}
        {activeTab === 'tab-overview' && <TabOverview />}
        {activeTab === 'tab-os' && <TabOs />}
        {activeTab === 'tab-knowledge' && <TabKnowledge />}

        {/* Tab 4: 大众端平台 */}
        {activeTab === 'tab-c-end' && (
          <div className="tab-content active" style={{ paddingBottom: '40px' }}>
            <div className="hero">
              <h1>智能体1+N开发计划 · 自有平台开发</h1>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                面向大众百姓｜MedlifeClaw——生活方式医学AI智能体平台
              </div>
              <div style={{ fontSize: '18px', opacity: 0.9 }}>
                生活方式跟随式AI · 主动健康管理 · 全民健康责任第一步
                <br />
                全场景覆盖个性化健康需求，深耕循证生活方式干预，做全民专属全周期健康伙伴
              </div>
            </div>

            <div className="demo-section" style={{ background: 'transparent', border: 'none', boxShadow: 'none', marginTop: 0, marginBottom: '30px', padding: 0, position: 'relative', zIndex: 100 }}>
              <MacbookMockup>
                <PatientApp />
              </MacbookMockup>
            </div>
            
            {/* 剩余的原静态文案可以补充在这里... 简单占位 */}
            <div className="section">
                <h2 className="section-title">核心信任数据</h2>
                <div className="grid-4">
                    <div className="data-showcase">
                        <div className="data-num">X万+</div>
                        <div className="data-label">注册用户</div>
                    </div>
                    <div className="data-showcase">
                        <div className="data-num">2351名</div>
                        <div className="data-label">主任级合作名医</div>
                    </div>
                    <div className="data-showcase">
                        <div className="data-num">24大</div>
                        <div className="data-label">垂直健康场景</div>
                    </div>
                    <div className="data-showcase">
                        <div className="data-num">X%</div>
                        <div className="data-label">用户满意度</div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* Tab 5: 医生端定制 */}
        {activeTab === 'tab-b-end' && (
          <div className="tab-content active" style={{ paddingBottom: '40px' }}>
            <div className="hero">
              <h1>Doctor Voice Agent</h1>
              <p>医声智能体 · 释放医生潜能，专注核心医疗</p>
            </div>

            <div className="demo-section" style={{ marginTop: 0, marginBottom: '30px', padding: '40px 0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
              <MobileMockup>
                <DoctorApp />
              </MobileMockup>
            </div>
            
            {/* 剩余的原静态文案 */}
            <div className="section">
                <h2 className="section-title">核心能力体系</h2>
                <div className="grid-3">
                    <div className="card">
                        <h3 style={{fontSize: '20px'}}>AI Agent引擎</h3>
                        <p className="text" style={{fontSize: '14px'}}>100+专业AI Agent智能编排，覆盖L1-L5五级体系。</p>
                    </div>
                    <div className="card">
                        <h3 style={{fontSize: '20px'}}>智能数据辅助</h3>
                        <p className="text" style={{fontSize: '14px'}}>基于医学知识库的智能数据建议，提升催工效率。</p>
                    </div>
                    <div className="card">
                        <h3 style={{fontSize: '20px'}}>医疗级风控</h3>
                        <p className="text" style={{fontSize: '14px'}}>双重安全审核机制，确保医疗内容合规安全。</p>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}