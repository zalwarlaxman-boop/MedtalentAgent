import { useState } from 'react';

export default function KnowledgeTab() {
  const [disabled, setDisabled] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [content, setContent] = useState(null);

  const runSearchDemo = async () => {
    setDisabled(true);
    setShowResult(false);
    
    // reset
    setTimeout(() => {
        setContent(<div className="typing"><span></span><span></span><span></span></div>);
        setShowResult(true);
    }, 50);
    
    setTimeout(() => {
        setContent(
            <>
                <div style={{ marginBottom: '12px' }}>
                    <span className="source-tag">UpToDate 循证数据库</span>
                    <span className="source-tag">2025版糖尿病用药指南</span>
                    <span className="source-tag">知识图谱关联度: 98%</span>
                </div>
                <p style={{ fontSize: '16px', color: 'var(--portal-text-main)', marginBottom: '10px' }}><strong>【二甲双胍】的主要禁忌症结构化提取如下：</strong></p>
                <ul style={{ paddingLeft: '20px', color: 'var(--portal-text-secondary)', lineHeight: 1.8 }}>
                    <li><strong>严重肾功能不全：</strong>eGFR &lt; 30 mL/min/1.73m² 绝对禁用。</li>
                    <li><strong>组织缺氧相关疾病：</strong>如失代偿期心力衰竭、呼吸衰竭、近期急性心肌梗死。</li>
                    <li><strong>急性代谢性疾病：</strong>如糖尿病酮症酸中毒（DKA）。</li>
                    <li><strong>造影剂冲突：</strong>静脉注射碘造影剂前或当时应停用。</li>
                </ul>
                <div style={{ marginTop: '15px', padding: '12px', background: '#fff5f5', borderLeft: '4px solid #F53F3F', borderRadius: '4px', fontSize: '14px', color: '#4E5969' }}>
                    <strong style={{ color: '#F53F3F' }}>⚠️ AI 合规提示：</strong>以上信息仅供专业医疗人员决策参考，不可直接替代临床面诊。
                </div>
            </>
        );
        setDisabled(false);
    }, 1500);
  };

  return (
    <div className="tab-content active" style={{ display: 'block' }}>
      <div className="hero">
          <h1>木吾木同Medtalent agent os</h1>
          <p>基于 Multi-Agent 协作架构</p>
      </div>

      <div className="demo-section" style={{ marginTop: 0, marginBottom: '30px' }}>
          <div className="demo-badge">互动演示</div>
          <h3 className="demo-title">📚 RAG 循证医学知识检索</h3>
          <p className="text" style={{ fontSize: '14px' }}>模拟在海量知识库中进行大模型语义检索，提供可溯源的权威医学结论。</p>
          
          <div className="search-demo-bar">
              <input type="text" defaultValue="二甲双胍的主要禁忌症有哪些？" readOnly />
              <button className="btn-demo" disabled={disabled} onClick={runSearchDemo}>🔍 智能检索</button>
          </div>
          
          <div className={`knowledge-result ${showResult ? 'show' : ''}`}>
              <div>{content}</div>
          </div>
      </div>

      <div className="section">
          <h2 className="section-title">智能健康知识引擎</h2>
          <p className="text">
              收录超 5000 万条权威医学数据，基于大模型与知识图谱技术，为健康专业人士提供精准、权威、实时的专业知识检索与辅助决策支持。
          </p>
          <p className="text"><strong>浙江省健康科普专家库分库</strong> 2351名主任级专家知识底座</p>
      </div>

      <div className="section">
          <h2 className="section-title">核心知识模块</h2>
          <div className="grid-2">
              <div className="card">
                  <h3>临床指南</h3>
                  <p className="text" style={{ fontSize: '14px' }}>• 覆盖 2500+ 权威机构发布的最新临床诊疗指南与专家共识</p>
              </div>
              <div className="card">
                  <h3>药品百科</h3>
                  <p className="text" style={{ fontSize: '14px' }}>• 涵盖 15000+ 处方药、OTC 及中成药的详细说明书与相互作用说明</p>
              </div>
              <div className="card">
                  <h3>医学知识图谱</h3>
                  <p className="text" style={{ fontSize: '14px' }}>• 包含 8000+ 基于知识图谱构建的疾病关联分析与病理机制内容</p>
              </div>
              <div className="card">
                  <h3>健康检测</h3>
                  <p className="text" style={{ fontSize: '14px' }}>• 覆盖 3000+ 各类医学检验项目解读、正常值范围及临床意义</p>
              </div>
          </div>
      </div>
    </div>
  );
}