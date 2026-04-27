import { useState } from 'react';

export default function OverviewTab() {
  const [log, setLog] = useState([]);
  const [btnText, setBtnText] = useState('发起咨询 🚀');
  const [disabled, setDisabled] = useState(false);

  const runDemo = () => {
    setDisabled(true);
    setBtnText('处理中...');
    setLog([<div key="1" className="msg ai"><div className="typing"><span></span><span></span><span></span></div></div>]);
    
    setTimeout(() => {
      setLog([<div key="2" className="msg ai" style={{ borderLeft: '3px solid var(--portal-primary)' }}>🔍 <strong>通用基座解析意图：</strong><br/>识别到关键标签 [失眠] [头晕] [作息紊乱]</div>]);
      
      setTimeout(() => {
        setLog(prev => [...prev, <div key="3" className="msg ai"><div className="typing"><span></span><span></span><span></span></div></div>]);
        
        setTimeout(() => {
          setLog(prev => {
            const newLog = [...prev];
            newLog.pop();
            return [...newLog, <div key="4" className="msg ai" style={{ background: 'var(--portal-primary-light)', borderColor: 'var(--portal-primary)' }}>
              ✅ <strong>动态路由成功：</strong>已转接至<strong>【安睡阁智能体】</strong><br/>
              <span style={{ fontSize: '13px', color: 'var(--portal-text-secondary)', display: 'block', marginTop: '5px' }}>正在为您调取《睡眠节律调整干预模型》及相关减压方案...</span>
            </div>];
          });
          setBtnText('重新发起');
          setDisabled(false);
        }, 1200);
      }, 800);
    }, 1000);
  };

  return (
    <div className="tab-content active" style={{ display: 'block' }}>
      <div className="hero">
          <h1>Medtalent Agent - 1+N-PLAN</h1>
          <h2 style={{ fontSize: '26px', fontWeight: 'normal', opacity: 0.95, marginBottom: '10px' }}>AI智能体矩阵</h2>
          <p>聚焦“AI+生活医学”核心赛道 · 技术赋能 + 商业变现双闭环</p>
      </div>
      
      <div className="demo-section" style={{ marginTop: 0, marginBottom: '40px' }}>
          <div className="demo-badge">互动演示</div>
          <h3 className="demo-title">🎯 1+N 智能路由中枢演示</h3>
          <p className="text" style={{ fontSize: '14px' }}>模拟通用基座接收用户自然语言，精准路由至对应垂直智能体的过程。</p>
          
          <div className="chat-ui" style={{ height: 'auto' }}>
              <div className="chat-input-area">
                  <input type="text" defaultValue="我最近每天晚上翻来覆去睡不着，白天头特别晕，该怎么办？" readOnly />
                  <button className="btn-demo" disabled={disabled} onClick={runDemo}>{btnText}</button>
              </div>
              <div className="chat-body" style={{ minHeight: '150px', display: log.length ? 'flex' : 'none' }}>
                  {log}
              </div>
          </div>
      </div>

      <div className="section">
          <h2 className="section-title">平台定位</h2>
          <p className="text">
              聚焦“AI+生活医学”核心赛道，以自研Medtalent Agent底座为核心，推出“1+N”计划。打造“1个通用基座+N个垂直智能体+N个专家智能体”。通过人工智能技术与权威医学知识的联动，覆盖服务C端大众、B端医生（包括医疗机构），实现“技术赋能+商业变现”双闭环，打造不可复制的行业竞争力。
          </p>

          <h2 style={{ textAlign: 'center', fontSize: '30px', color: 'var(--portal-primary)', margin: '40px 0' }}>木吾木同</h2>
          <p className="text" style={{ textAlign: 'center' }}>
              全新一代生活方式医学AI-AGENT底座开发<br/>
              助力医学科普产业化｜助力医生建设医生智能体｜助力百姓触手可及健康管理｜重塑健康未来
          </p>
      </div>

      <div className="section">
          <h2 className="section-title">智能体Agent集群底座</h2>
          <ul className="text" style={{ paddingLeft: '30px' }}>
              <li>融合100+基于权威医学知识库的专业智能体，以循证数据为基础，驱动“数据支持+运营管理”双效合一，构建智慧健康管理新模式。</li>
              <li>联结2351多名主任级医生专家知识底座</li>
              <li>自有开发Medtalent agent方法论，融合ocr、rag、孪生、大模型等技术，打造覆盖L1-L5五级进化体系的智能引擎，可实现私有化部署，支持多租户SaaS模式</li>
          </ul>
      </div>

      <div className="section" style={{ textAlign: 'center', background: 'linear-gradient(135deg,#f0f7ff,#fff)' }}>
          <h2 style={{ fontSize: '28px', color: 'var(--portal-primary)', marginBottom: '20px' }}>浙里健康</h2>
          <div className="tags" style={{ justifyContent: 'center' }}>
              <span className="tag" style={{ fontSize: '16px', padding: '10px 20px' }}>24个科普分库</span>
              <span className="tag" style={{ fontSize: '16px', padding: '10px 20px' }}>2351+主任级专家</span>
              <span className="tag" style={{ fontSize: '16px', padding: '10px 20px' }}>专家知识的力量</span>
          </div>
      </div>
    </div>
  );
}