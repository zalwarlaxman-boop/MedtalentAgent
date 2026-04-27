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

        <div className="mb-20 text-center">
          <p className="text-[17px] text-text-secondary leading-[1.8] max-w-[900px] mx-auto">
            木吾木同Medtalent agent os并非基础的对话工具，而是汇聚10余个垂直领域专精AI Agent的智能生态集群。其运作模式对标医院专家团队，通过精准分工、交叉校验，为医疗场景输出专业、严谨、可靠的决策支撑。
          </p>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-6 tracking-[-0.5px] text-text-main">L1-L5 智能进化体系</h2>
          <p className="text-[17px] text-text-secondary text-center mb-10 max-w-[900px] mx-auto">从基础数据感知到元认知监控，构建完整的医疗AI能力层级。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">L1 基础感知层</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed mb-4">承担多模态医疗数据的采集与标准化处理，覆盖电子病历、影像资料、生命体征等全维度信息。</p>
              <ul className="text-[14px] text-text-secondary list-disc list-inside space-y-1">
                <li>OCR识别Agent</li>
                <li>ASR语音转写Agent</li>
                <li>数据清洗Agent</li>
                <li>结构化提取Agent</li>
              </ul>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">L2 知识检索层</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed mb-4">依托RAG技术，从海量医学指南、学术文献及专业知识库中精准提取有效信息。</p>
              <ul className="text-[14px] text-text-secondary list-disc list-inside space-y-1">
                <li>指南检索Agent</li>
                <li>药物相互作用Agent</li>
                <li>循证医学Agent</li>
                <li>术语标准化Agent</li>
              </ul>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">L3 逻辑推理层</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed mb-4">模拟临床医生思维逻辑，完成病情分析、鉴别诊断与风险评估，输出初步诊疗建议。</p>
              <ul className="text-[14px] text-text-secondary list-disc list-inside space-y-1">
                <li>辅助诊断Agent</li>
                <li>风险评估Agent</li>
                <li>临床路径匹配Agent</li>
                <li>检查推荐Agent</li>
              </ul>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">L4 决策执行层</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed mb-4">生成可落地的医疗文书、处方方案与随访计划，实现与HIS系统的无缝对接。</p>
              <ul className="text-[14px] text-text-secondary list-disc list-inside space-y-1">
                <li>病历生成Agent</li>
                <li>处方审核Agent</li>
                <li>随访计划Agent</li>
                <li>转诊决策Agent</li>
              </ul>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">L5 元认知监控层</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed mb-4">对AI输出结果开展自我复盘、合规性审查与伦理风险管控。</p>
              <ul className="text-[14px] text-text-secondary list-disc list-inside space-y-1">
                <li>医疗合规Agent</li>
                <li>伦理审查Agent</li>
                <li>质量控制Agent</li>
                <li>偏见纠正Agent</li>
              </ul>
            </Card>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-6 tracking-[-0.5px] text-text-main">全科室覆盖的专业Agent</h2>
          <p className="text-[17px] text-text-secondary text-center mb-10">覆盖四大核心领域，100+细分场景，打造医疗全流程智能闭环。</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-2">医学辅助类</h3>
              <p className="text-[14px] text-text-light mb-4">含5大核心Agent</p>
              <ul className="text-[14px] text-text-secondary list-disc list-inside space-y-1">
                <li>全科分诊Agent</li>
                <li>影像阅片Agent</li>
                <li>心电图分析Agent</li>
                <li>病理分析Agent</li>
                <li>肿瘤MDT Agent</li>
              </ul>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-2">药学服务类</h3>
              <p className="text-[14px] text-text-light mb-4">含5大核心Agent</p>
              <ul className="text-[14px] text-text-secondary list-disc list-inside space-y-1">
                <li>合理用药Agent</li>
                <li>药物相互作用Agent</li>
                <li>药代动力学Agent</li>
                <li>剂量计算Agent</li>
                <li>Adverse事件Agent</li>
              </ul>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-2">健康管理类</h3>
              <p className="text-[14px] text-text-light mb-4">含5大核心Agent</p>
              <ul className="text-[14px] text-text-secondary list-disc list-inside space-y-1">
                <li>慢病随访Agent</li>
                <li>营养膳食Agent</li>
                <li>运动康复Agent</li>
                <li>心理评估Agent</li>
                <li>健康风险评估Agent</li>
              </ul>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-2">科研辅助类</h3>
              <p className="text-[14px] text-text-light mb-4">含5大核心Agent</p>
              <ul className="text-[14px] text-text-secondary list-disc list-inside space-y-1">
                <li>文献综述Agent</li>
                <li>数据统计Agent</li>
                <li>科研课题Agent</li>
                <li>论文润色Agent</li>
                <li>实验推演Agent</li>
              </ul>
            </Card>
          </div>
        </div>

        <div className="bg-[#f9fbff] rounded-3xl p-12 text-center border border-black/5 shadow-sm">
          <h2 className="font-title text-[32px] font-bold mb-4 tracking-[-0.5px] text-text-main">专属定制服务</h2>
          <p className="text-[17px] text-text-secondary mb-8">
            木吾木同Medtalent agent os为医疗机构提供定制化解决方案<br/>
            支持快速接入私有知识库，训练专属医疗智能体系
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary">申请演示 100+ Agent</Button>
            <Button variant="secondary">申请演示</Button>
          </div>
        </div>

      </div>
    </div>
  );
}
