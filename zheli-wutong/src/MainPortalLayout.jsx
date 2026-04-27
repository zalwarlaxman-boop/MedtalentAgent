import { Outlet, NavLink } from 'react-router-dom';
import './portal.css';

export default function MainPortalLayout() {
  return (
    <div className="portal-wrapper">
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon"></div>木吾木同 Agent
        </div>
        <ul className="nav-menu">
          <li><NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} end>🏠 首页</NavLink></li>
          <li><NavLink to="/overview" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>🌐 1+N 智能体矩阵</NavLink></li>
          <li><NavLink to="/os" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>⚙️ Agent OS 底座</NavLink></li>
          <li><NavLink to="/knowledge" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>📚 智能健康知识引擎</NavLink></li>
          <li><NavLink to="/patient" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>👥 面向大众端场景 - 自有平台</NavLink></li>
          <li><NavLink to="/doctor" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>⚕️ 面向医生端场景 - 专项定制</NavLink></li>
        </ul>
        <div className="sidebar-footer">
            <p>© 2026 Medtalent Inc.</p>
            <p>生活方式医学 AI 平台</p>
        </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
