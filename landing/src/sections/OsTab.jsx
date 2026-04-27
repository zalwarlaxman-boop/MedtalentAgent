import { useState } from 'react';
import { Card, Button } from "../components/UI";
import { motion, AnimatePresence } from "framer-motion";

export function OsTab() {
  const [logs, setLogs] = useState(["[System] 等待指令..."]);
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const runOsDemo = async () => {
    setIsRunning(true);
    setLogs(["[System] 接收到一份门诊脱敏病历，初始化 L1-L5 处理管线..."]);
    setActiveStep(0);

    const msgs = [
      { id: 1, txt: "> [L1 基础感知层] 启动 OCR... 提取完成：患者血压 155/98 mmHg，体重超标 (BMI 28)。" },
      { id: 2, txt: "> [L2 知识检索层] 触发 RAG 检索... 命中《2025版高血压基层诊疗指南》与《代谢综合征管理共识》。" },
      { id: 3, txt: "> [L3 逻辑推理层] 推理引擎分析中... 判定：1级高血压伴肥胖风险。建议优先采用强化生活方式干预。" },
      { id: 4, txt: "> [L4 决策执行层] 生成执行方案... 自动创建：1. DASH低钠饮食处方；2. 每周4次中强度有氧打卡任务。" },
      { id: 5, txt: "> [L5 元认知监控层] 伦理与合规审查... 结果：干预方案安全，无药物冲突风险，允许下发给患者端。" }
    ];

    for (let step of msgs) {
      await new Promise(r => setTimeout(r, 1200));
      setActiveStep(step.id);
      setLogs(prev => [...prev, step.txt]);
    }

    await new Promise(r => setTimeout(r, 500));
    setLogs(prev => [...prev, "", "[System] ✅ 处理管线执行完毕，结果已分发至医患双端。"]);
    setIsRunning(false);
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden text-center pt-24 pb-20 px-10 border-b border-black/5 mb-5 bg-gradient-to-b from-bg-secondary to-bg-color">
        <h2 className="text-[24px] font-semibold text-primary mb-4">Agent OS</h2>
        <h1 className="font-title text-[56px] font-bold leading-[1.1] tracking-[-1px] mb-6 bg-gradient-to-br from-[#1A1D20] to-[#4A5568] bg-clip-text text-transparent">
          智能操作系统底座
        </h1>
        <p className="text-[20px] text-text-secondary max-w-[700px] mx-auto mb-8 leading-relaxed">
          基于 Multi-Agent 协作架构 · 列阵协同的医疗级处理中枢
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-10 py-10">
        <div className="bg-bg-secondary rounded-[24px] p-10 my-16 relative overflow-hidden">
          <div className="absolute top-6 left-6 bg-primary/10 text-primary-dark px-4 py-1.5 rounded-full text-[13px] font-semibold">Workflow Demo</div>
          <h3 className="font-title text-[28px] font-bold text-text-main mb-6 mt-10 flex items-center gap-3">⚙️ L1-L5 全链路处理引擎</h3>
          <p className="text-[16px] text-text-secondary mb-10">模拟多 Agent 协作系统处理一份真实体检报告的全过程。</p>
          <Button onClick={runOsDemo} disabled={isRunning} className="mb-14">
            {isRunning ? '处理中...' : (logs.length > 1 ? '▶️ 重新模拟' : '▶️ 模拟处理体检报告')}
          </Button>

          <div className="relative flex justify-between items-center px-8 mt-10">
            <div className="absolute top-[30px] left-[60px] right-[60px] h-1 bg-black/5 z-0"></div>
            {[1, 2, 3, 4, 5].map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center z-10">
                <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center font-bold text-[18px] transition-all duration-500 border-[3px] bg-white ${
                  activeStep >= step ? 'border-primary bg-primary text-white shadow-[0_0_20px_rgba(0,198,255,0.4)] scale-110' : 'border-black/5 text-text-light'
                }`}>
                  L{step}
                </div>
                <div className="mt-4 text-center text-[14px] font-bold text-text-secondary">
                  {['感知层', '检索层', '推理层', '决策层', '监控层'][idx]}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#1A1D20] text-[#00E676] font-mono p-6 rounded-[24px] h-[180px] overflow-y-auto text-[14px] leading-[1.6] shadow-inner text-left">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>

        <h2 className="font-title text-[32px] font-bold text-center mb-10 tracking-[-0.5px]">L1-L5 智能进化体系</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {[
            { title: "L1 基础感知层", desc: "承担多模态医疗数据的采集与标准化处理，覆盖电子病历、影像资料、生命体征等全维度信息。" },
            { title: "L2 知识检索层", desc: "依托RAG技术，从海量医学指南、学术文献及专业知识库中精准提取有效信息。" },
            { title: "L3 逻辑推理层", desc: "模拟临床医生思维逻辑，完成病情分析、鉴别诊断与风险评估，输出初步诊疗建议。" },
            { title: "L4 决策执行层", desc: "生成可落地的医疗文书、处方方案与随访计划，实现与HIS系统的无缝对接。" },
            { title: "L5 元认知监控层", desc: "对AI输出结果开展自我复盘、合规性审查与伦理风险管控。" }
          ].map((item, i) => (
            <Card key={i} className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">{item.title}</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}