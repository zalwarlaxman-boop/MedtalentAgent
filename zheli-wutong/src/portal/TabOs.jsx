import React from 'react';

export default function TabOs() {
  return (
    <div className="tab-content active">
      <div className="hero">
        <h1>木吾木同Medtalent agent 底座</h1>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>基于 Multi-Agent 协作架构</div>
        <div style={{ fontSize: '20px', opacity: 0.9 }}>列阵· 专业医疗Agent · 协同工作的智能操作系统</div>
      </div>

      <div className="section">
        <p className="text">
          木吾木同Medtalent agent os并非基础的对话工具，而是汇聚10余个垂直领域专精AI Agent的智能生态集群。其运作模式对标医院专家团队，通过精准分工、交叉校验，为医疗场景输出专业、严谨、可靠的决策支撑。
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">L1-L5 智能进化体系</h2>
        <p className="text">从基础数据感知到元认知监控，构建完整的医疗AI能力层级。</p>
        <div className="level-item">
          <h3>L1 基础感知层</h3>
          <p className="text" style={{ marginBottom: '8px' }}>承担多模态医疗数据的采集与标准化处理，覆盖电子病历、影像资料、生命体征等全维度信息。</p>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
            <li>OCR识别Agent</li>
            <li>ASR语音转写Agent</li>
            <li>数据清洗Agent</li>
            <li>结构化提取Agent</li>
          </ul>
        </div>
        <div className="level-item">
          <h3>L2 知识检索层</h3>
          <p className="text" style={{ marginBottom: '8px' }}>依托RAG技术，从海量医学指南、学术文献及专业知识库中精准提取有效信息。</p>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
            <li>指南检索Agent</li>
            <li>药物相互作用Agent</li>
            <li>循证医学Agent</li>
            <li>术语标准化Agent</li>
          </ul>
        </div>
        <div className="level-item">
          <h3>L3 逻辑推理层</h3>
          <p className="text" style={{ marginBottom: '8px' }}>模拟临床医生思维逻辑，完成病情分析、鉴别诊断与风险评估，输出初步诊疗建议。</p>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
            <li>辅助诊断Agent</li>
            <li>风险评估Agent</li>
            <li>临床路径匹配Agent</li>
            <li>检查推荐Agent</li>
          </ul>
        </div>
        <div className="level-item">
          <h3>L4 决策执行层</h3>
          <p className="text" style={{ marginBottom: '8px' }}>生成可落地的医疗文书、处方方案与随访计划，实现与HIS系统的无缝对接。</p>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
            <li>病历生成Agent</li>
            <li>处方审核Agent</li>
            <li>随访计划Agent</li>
            <li>转诊决策Agent</li>
          </ul>
        </div>
        <div className="level-item">
          <h3>L5 元认知监控层</h3>
          <p className="text" style={{ marginBottom: '8px' }}>对AI输出结果开展自我复盘、合规性审查与伦理风险管控。</p>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
            <li>医疗合规Agent</li>
            <li>伦理审查Agent</li>
            <li>质量控制Agent</li>
            <li>偏见纠正Agent</li>
          </ul>
        </div>
      </div>
    </div>
  );
}