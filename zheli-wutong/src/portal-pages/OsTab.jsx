import { useState, useRef } from 'react';

export default function OsTab() {
  const [btnText, setBtnText] = useState('▶️ 模拟处理体检报告');
  const [disabled, setDisabled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [logText, setLogText] = useState("[System] 等待指令...\n");
  const logRef = useRef(null);

  const delay = ms => new Promise(r => setTimeout(r, ms));

  const runOsDemo = async () => {
    setDisabled(true);
    setActiveStep(0);
    setLogText("[System] 接收到一份门诊脱敏病历，初始化 L1-L5 处理管线...\n");
    
    const msgs = [
        { id: 1, txt: "> [L1 基础感知层] 启动 OCR... 提取完成：患者血压 155/98 mmHg，体重超标 (BMI 28)。" },
        { id: 2, txt: "> [L2 知识检索层] 触发 RAG 检索... 命中《2025版高血压基层诊疗指南》与《代谢综合征管理共识》。" },
        { id: 3, txt: "> [L3 逻辑推理层] 推理引擎分析中... 判定：1级高血压伴肥胖风险。建议优先采用强化生活方式干预。" },
        { id: 4, txt: "> [L4 决策执行层] 生成执行方案... 自动创建：1. DASH低钠饮食处方；2. 每周4次中强度有氧打卡任务。" },
        { id: 5, txt: "> [L5 元认知监控层] 伦理与合规审查... 结果：干预方案安全，无药物冲突风险，允许下发给患者端。" }
    ];
    
    for(let step of msgs) {
        await delay(1200);
        setActiveStep(step.id);
        setLogText(prev => prev + step.txt + "\n");
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }
    
    await delay(500);
    setLogText(prev => prev + "\n[System] ✅ 处理管线执行完毕，结果已分发至医患双端。");
    setDisabled(false);
    setBtnText('▶️ 重新模拟');
  };

  return (
    <div className="tab-content active" style={{ display: 'block' }}>
      <div className="hero">
          <h1>木吾木同Medtalent agent 底座</h1>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>基于 Multi-Agent 协作架构</div>
          <div style={{ fontSize: '20px', opacity: 0.9 }}>列阵· 专业医疗Agent · 协同工作的智能操作系统</div>
      </div>

      <div className="demo-section" style={{ marginTop: 0, marginBottom: '30px' }}>
          <div className="demo-badge">互动演示</div>
          <h3 className="demo-title">⚙️ L1-L5 全链路处理引擎演示</h3>
          <p className="text" style={{ fontSize: '14px' }}>模拟多 Agent 协作系统处理一份真实体检报告的全过程。</p>
          <button className="btn-demo" disabled={disabled} onClick={runOsDemo}>{btnText}</button>
          
          <div className="workflow-demo">
              <div className="wf-step-container">
                  <div className={`wf-step ${activeStep >= 1 ? 'active' : ''}`}>L1</div>
                  <div className="wf-label">基础感知层<br/>(OCR提取)</div>
              </div>
              <div className="wf-step-container">
                  <div className={`wf-step ${activeStep >= 2 ? 'active' : ''}`}>L2</div>
                  <div className="wf-label">知识检索层<br/>(RAG检索)</div>
              </div>
              <div className="wf-step-container">
                  <div className={`wf-step ${activeStep >= 3 ? 'active' : ''}`}>L3</div>
                  <div className="wf-label">逻辑推理层<br/>(辅助诊断)</div>
              </div>
              <div className="wf-step-container">
                  <div className={`wf-step ${activeStep >= 4 ? 'active' : ''}`}>L4</div>
                  <div className="wf-label">决策执行层<br/>(方案生成)</div>
              </div>
              <div className="wf-step-container">
                  <div className={`wf-step ${activeStep >= 5 ? 'active' : ''}`}>L5</div>
                  <div className="wf-label">元认知监控层<br/>(合规审查)</div>
              </div>
          </div>
          
          <div className="wf-log" ref={logRef} style={{ whiteSpace: 'pre-wrap' }}>
              {logText}
          </div>
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
          </div>
          <div className="level-item">
              <h3>L2 知识检索层</h3>
              <p className="text" style={{ marginBottom: '8px' }}>依托RAG技术，从海量医学指南、学术文献及专业知识库中精准提取有效信息。</p>
          </div>
          <div className="level-item">
              <h3>L3 逻辑推理层</h3>
              <p className="text" style={{ marginBottom: '8px' }}>模拟临床医生思维逻辑，完成病情分析、鉴别诊断与风险评估，输出初步诊疗建议。</p>
          </div>
          <div className="level-item">
              <h3>L4 决策执行层</h3>
              <p className="text" style={{ marginBottom: '8px' }}>生成可落地的医疗文书、处方方案与随访计划，实现与HIS系统的无缝对接。</p>
          </div>
          <div className="level-item">
              <h3>L5 元认知监控层</h3>
              <p className="text" style={{ marginBottom: '8px' }}>对AI输出结果开展自我复盘、合规性审查与伦理风险管控。</p>
          </div>
      </div>
    </div>
  );
}