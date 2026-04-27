import { Routes, Route } from 'react-router-dom';
import DoctorAppLayout from '../doctor-app/components/Layout';
import Home from '../doctor-app/pages/Home';
import Interact from '../doctor-app/pages/Interact';
import PopSci from '../doctor-app/pages/PopSci';
import PopSciDetail from '../doctor-app/pages/PopSciDetail';
import ContentDetail from '../doctor-app/pages/ContentDetail';
import Service from '../doctor-app/pages/Service';
import ServiceDetail from '../doctor-app/pages/ServiceDetail';
import Faq from '../doctor-app/pages/Faq';
import Me from '../doctor-app/pages/Me';

export default function DoctorTab() {
  return (
    <div className="tab-content active" style={{ display: 'block' }}>
      <div className="hero">
          <h1>Doctor Voice Agent</h1>
          <p>医声智能体 · 释放医生潜能，专注核心医疗</p>
      </div>

      <div className="demo-section" style={{ background: 'transparent', border: 'none', boxShadow: 'none', marginTop: 0, marginBottom: '30px', padding: 0 }}>
          <h3 className="demo-title" style={{ justifyContent: 'center' }}>⚕️ 面向医生端场景演示</h3>
          
          {/* 用一个模拟的手机外壳来展示 doctor-app */}
          <div className="mobile-mockup" style={{ 
              width: '380px', 
              height: '720px', 
              border: '12px solid #1a1a1a', 
              borderRadius: '40px', 
              margin: '0 auto', 
              position: 'relative', 
              overflow: 'hidden', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              backgroundColor: '#fff'
          }}>
              {/* React 内部路由挂载点 */}
              <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                  <Routes>
                    <Route element={<DoctorAppLayout />}>
                      <Route index element={<Home />} />
                      <Route path="interact" element={<Interact />} />
                      <Route path="popsci" element={<PopSci />} />
                      <Route path="popsci/:id" element={<PopSciDetail />} />
                      <Route path="content/:id" element={<ContentDetail />} />
                      <Route path="service" element={<Service />} />
                      <Route path="service/:id" element={<ServiceDetail />} />
                      <Route path="faq" element={<Faq />} />
                      <Route path="me" element={<Me />} />
                    </Route>
                  </Routes>
              </div>
          </div>
      </div>

      <div className="section">
          <h2 className="section-title">核心能力体系</h2>
          <div className="grid-3">
              <div className="card">
                  <h3 style={{ fontSize: '20px' }}>AI Agent引擎</h3>
                  <p className="text" style={{ fontSize: '14px' }}>100+专业AI Agent智能编排，覆盖L1-L5五级体系。</p>
              </div>
              <div className="card">
                  <h3 style={{ fontSize: '20px' }}>智能数据辅助</h3>
                  <p className="text" style={{ fontSize: '14px' }}>基于医学知识库的智能数据建议，提升催工效率。</p>
              </div>
              <div className="card">
                  <h3 style={{ fontSize: '20px' }}>医疗级风控</h3>
                  <p className="text" style={{ fontSize: '14px' }}>双重安全审核机制，确保医疗内容合规安全。</p>
              </div>
              <div className="card">
                  <h3 style={{ fontSize: '20px' }}>多租户层级</h3>
                  <p className="text" style={{ fontSize: '14px' }}>支持超级管理员、机构管理员、医生、患者多级角色。</p>
              </div>
              <div className="card">
                  <h3 style={{ fontSize: '20px' }}>全周期管理</h3>
                  <p className="text" style={{ fontSize: '14px' }}>从预防到康复的全生命周期健康管理。</p>
              </div>
              <div className="card">
                  <h3 style={{ fontSize: '20px' }}>患者记忆系统</h3>
                  <p className="text" style={{ fontSize: '14px' }}>向患者数据库存储患者历史，提供个性化服务。</p>
              </div>
          </div>
      </div>
    </div>
  );
}