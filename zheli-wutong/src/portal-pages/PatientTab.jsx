import { Routes, Route } from 'react-router-dom';
import { HealthDataProvider } from '../patient-app/context/HealthDataContext';
import PatientAppLayout from '../patient-app/layout/AppLayout';
import Dashboard from '../patient-app/pages/Dashboard';
import Interaction from '../patient-app/pages/Interaction';
import HealthProfile from '../patient-app/pages/HealthProfile';
import WeightTracking from '../patient-app/pages/WeightTracking';
import Dietitians from '../patient-app/pages/Dietitians';
import Experts from '../patient-app/pages/Experts';
import Goods from '../patient-app/pages/Goods';
import Hospital from '../patient-app/pages/Hospital';
import AgentCluster from '../patient-app/pages/AgentCluster';

export default function PatientTab() {
  return (
    <div className="tab-content active" style={{ display: 'block' }}>
      <div className="hero">
          <h1>智能体1+N开发计划 · 自有平台开发</h1>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>面向大众百姓｜MedlifeClaw——生活方式医学AI智能体平台</div>
          <div style={{ fontSize: '18px', opacity: 0.9 }}>生活方式跟随式AI · 主动健康管理 · 全民健康责任第一步<br/>全场景覆盖个性化健康需求，深耕循证生活方式干预，做全民专属全周期健康伙伴</div>
      </div>

      <div className="demo-section" style={{ background: 'transparent', border: 'none', boxShadow: 'none', marginTop: 0, marginBottom: '30px', padding: 0 }}>
          {/* 大众端平台 - 用一个模拟的 PC 浏览器框来展示 */}
          <div style={{ 
              width: '100%', 
              height: '700px', 
              borderRadius: '12px', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)', 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid #ddd',
              backgroundColor: '#fff'
          }}>
              {/* 模拟浏览器顶部 */}
              <div style={{ 
                  height: '40px', 
                  backgroundColor: '#f1f3f4', 
                  borderBottom: '1px solid #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 15px',
                  gap: '8px'
              }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }}></div>
                  <div style={{ 
                      flex: 1, 
                      backgroundColor: '#fff', 
                      height: '24px', 
                      borderRadius: '4px', 
                      marginLeft: '15px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '0 10px',
                      color: '#9aa0a6',
                      fontSize: '12px'
                  }}>
                      medtalent.ai / patient-platform
                  </div>
              </div>
              
              {/* React 内部路由挂载点 */}
              <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <HealthDataProvider>
                  <Routes>
                    <Route element={<PatientAppLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="interaction" element={<Interaction />} />
                      <Route path="profile" element={<HealthProfile />} />
                      <Route path="weight" element={<WeightTracking />} />
                      <Route path="dietitians" element={<Dietitians />} />
                      <Route path="experts" element={<Experts />} />
                      <Route path="goods" element={<Goods />} />
                      <Route path="hospital" element={<Hospital />} />
                      <Route path="cluster" element={<AgentCluster />} />
                    </Route>
                  </Routes>
                </HealthDataProvider>
              </div>
          </div>
      </div>

      {/* 原页面的静态文字部分... */}
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
          <p className="text" style={{ fontWeight: 'bold', marginTop: '20px' }}>官方专家库硬核背书 + 顶级名医资源壁垒 + 全维度专业分库，构筑业内不可复制的核心竞争力</p>
          <p className="text">平台彻底摒弃普通健康类平台内容非专业、无权威背书的行业通病，深度联动官方健康体系与国内一线顶级医疗资源，独家搭建业内标杆级权威专业底座。全平台智能体服务、健康科普、干预方案均严格基于循证医学体系与主任级名医临床实践经验，全方位保障内容专业性、合规性与临床指导性，筑牢行业竞争护城河，拉开与同类产品的核心差距。</p>
          
          <div className="card" style={{ marginBottom: '15px' }}>
              <h3 style={{ color: '#00C853' }}>✅ 官方权威资质：浙江省健康科普专家库分库</h3>
              <p className="text" style={{ marginBottom: 0 }}>依托官方健康科普体系独家授权，成为拥有官方专家库资质的生活方式医学专业平台，所有内容输出全程贴合国家健康科普规范，合规性拉满，自带官方公信力背书，品牌可信度与行业地位远超同类竞品。</p>
          </div>
          <div className="card" style={{ marginBottom: '15px' }}>
              <h3 style={{ color: '#00C853' }}>✅ 顶级名医壁垒：2351位主任级名医知识底座，未来打通2351个医生智能体</h3>
              <p className="text" style={{ marginBottom: 0 }}>已完成与浙江省2351名主任级名医的科普知识、临床经验授权合作，全面打通顶级医疗资源与AI智能技术，将名医的生活方式干预理念、慢病调理方案、日常健康养护经验数字化、智能化，让普通百姓无需排队、不限地域、低成本获取名医级健康指导，真正实现优质医疗资源全民普惠。</p>
          </div>
          <div className="card">
              <h3 style={{ color: '#00C853' }}>✅ 全场景专业覆盖：24个科普专业分库，打造24个专项智能体矩阵</h3>
              <p className="text" style={{ marginBottom: 0 }}>围绕生活方式医学全场景大众需求，依托循证医学知识与名医独家资源，搭建24个垂直领域专业分库，覆盖慢病管理、抗衰延寿、体重管控、睡眠改善、孕产养护、肠道健康、免疫提升等全品类健康场景，对应落地24个垂直专项智能体，相较于行业基础10大场景，实现健康需求全覆盖、人群痛点全响应，服务颗粒度更精细、用户适配性更强。</p>
          </div>
      </div>

      <div className="section">
          <h2 className="section-title">顶层开发逻辑 · 功能架构</h2>
          <p className="text">平台以生活方式医学智能体为核心中枢，向下延伸构建标准化功能版块，同时辐射N个垂直细分专项智能体，全矩阵共享统一底层共用基座，实现“底层同源、前端分场、全域获客、统一留存变现”的闭环开发逻辑。</p>
          <h3 style={{ color: 'var(--portal-primary)', marginBottom: '15px' }}>一、功能逻辑：核心功能架构</h3>
          <p className="text">作为全域流量承接、用户沉淀、精准导流的核心枢纽，承载六大核心功能版块，打通服务与商业全链路：</p>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
              <li>功能版块1：自然对话交互（用户核心入口层）：支持大众自然语言多模态互动，零门槛获取健康信息，摒弃专业壁垒，适配全民使用习惯；</li>
              <li>功能版块2：健康画像识别（数据核心支撑层）：自动录入、归类用户健康数据，构建专属动态健康画像，精准识别用户需求与健康痛点；</li>
              <li>功能版块3：动态跟踪管理（服务核心交付层）：基于健康画像实时跟踪、智能匹配方案，全程陪伴式管理，主动推送提醒与干预建议；</li>
              <li>功能版块4：定制健康套餐（标准化服务层）：针对不同人群需求，输出个性化、可落地的生活方式健康套餐，兼顾专业性与实用性；</li>
              <li>功能版块5：严选健康好物（商业变现核心层）：依托合规供应链，推送适配的健康产品与服务，打造合规变现通道；</li>
              <li>功能版块6：名医专家科普（专业价值赋能层）：链接2351名主任级名医，提供权威科普内容与专业指导，强化平台专业价值</li>
          </ul>
      </div>

      <div className="section">
          <h2 className="section-title">全智能体共享：AI底层共用基座</h2>
          <p className="text">统一权威技术底座，保障全矩阵智能体专业合规、高效运行，六大核心支撑：</p>
          <div className="grid-3">
              <div className="card">
                  <h3>权威循证知识库</h3>
                  <p className="text" style={{ fontSize: '14px', marginBottom: 0 }}>循证医学+名医知识双支撑，内容专业可追溯</p>
              </div>
              <div className="card">
                  <h3>自研AI智能引擎</h3>
                  <p className="text" style={{ fontSize: '14px', marginBottom: 0 }}>自有人工智能技术驱动，实现自然交互、智能匹配、动态推理</p>
              </div>
              <div className="card">
                  <h3>动态健康画像系统</h3>
                  <p className="text" style={{ fontSize: '14px', marginBottom: 0 }}>向量数据库支撑，数据互通，无需重复建档</p>
              </div>
              <div className="card">
                  <h3>通用能力池</h3>
                  <p className="text" style={{ fontSize: '14px', marginBottom: 0 }}>对话、打卡、提醒、数据导入等通用能力全矩阵共享</p>
              </div>
              <div className="card">
                  <h3>供应链+支付闭环</h3>
                  <p className="text" style={{ fontSize: '14px', marginBottom: 0 }}>自有+医院合作供应链+商业保险支付，打通商业闭环</p>
              </div>
              <div className="card">
                  <h3>全链路安全合规</h3>
                  <p className="text" style={{ fontSize: '14px', marginBottom: 0 }}>数据脱敏、加密传输，符合健康数据监管要求</p>
              </div>
          </div>
      </div>
    </div>
  );
}