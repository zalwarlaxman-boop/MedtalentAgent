import { useState } from 'react';
import { Card, Button } from "../components/UI";
import { motion, AnimatePresence } from "framer-motion";

export function OverviewTab() {
  const [chatLog, setChatLog] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const runRoutingDemo = async () => {
    setIsRunning(true);
    setChatLog([
      { type: 'ai', content: <div className="flex gap-1 items-center h-5"><span className="w-1.5 h-1.5 bg-text-light rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-text-light rounded-full animate-bounce delay-150"></span><span className="w-1.5 h-1.5 bg-text-light rounded-full animate-bounce delay-300"></span></div> }
    ]);

    await new Promise(r => setTimeout(r, 1000));
    setChatLog([
      { type: 'ai', content: <div>🔍 <strong>通用基座解析意图：</strong><br/>识别到关键标签 [失眠] [头晕] [作息紊乱]</div>, border: true }
    ]);

    await new Promise(r => setTimeout(r, 800));
    setChatLog(prev => [...prev, { type: 'ai', content: <div className="flex gap-1 items-center h-5"><span className="w-1.5 h-1.5 bg-text-light rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-text-light rounded-full animate-bounce delay-150"></span><span className="w-1.5 h-1.5 bg-text-light rounded-full animate-bounce delay-300"></span></div> }]);

    await new Promise(r => setTimeout(r, 1200));
    setChatLog(prev => {
      const newLog = [...prev];
      newLog.pop();
      return [...newLog, {
        type: 'ai',
        bg: 'bg-primary-light',
        content: <div>
          ✅ <strong>动态路由成功：</strong>已转接至<strong>【安睡阁智能体】</strong><br/>
          <span className="text-[13px] text-text-secondary block mt-1.5">正在为您调取《睡眠节律调整干预模型》及相关减压方案...</span>
        </div>
      }];
    });

    setIsRunning(false);
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden text-center pt-24 pb-20 px-10 border-b border-black/5 mb-5 bg-gradient-to-b from-bg-secondary to-bg-color">
        <h2 className="text-[24px] font-semibold text-primary mb-4">AI 智能体矩阵</h2>
        <h1 className="font-title text-[56px] font-bold leading-[1.1] tracking-[-1px] mb-6 bg-gradient-to-br from-[#1A1D20] to-[#4A5568] bg-clip-text text-transparent">
          1+N 智能开发计划
        </h1>
        <p className="text-[20px] text-text-secondary max-w-[700px] mx-auto mb-8 leading-relaxed">
          聚焦“AI+生活医学”核心赛道 · 技术赋能与商业变现双闭环
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-10 py-10">
        {/* Demo */}
        <div className="bg-bg-secondary rounded-[24px] p-10 my-16 relative overflow-hidden">
          <div className="absolute top-6 left-6 bg-primary/10 text-primary-dark px-4 py-1.5 rounded-full text-[13px] font-semibold">Interactive Demo</div>
          <h3 className="font-title text-[28px] font-bold text-text-main mb-6 mt-10 flex items-center gap-3">🎯 1+N 智能路由中枢</h3>
          <p className="text-[16px] text-text-secondary mb-10">模拟通用基座接收用户自然语言，精准路由至对应垂直智能体的过程。</p>

          <div className="bg-white rounded-[24px] border-none shadow-md overflow-hidden flex flex-col h-auto">
            <div className="p-5 border-b border-black/5 flex gap-2">
              <input
                type="text"
                value="我最近每天晚上翻来覆去睡不着，白天头特别晕，该怎么办？"
                readOnly
                className="flex-1 bg-bg-secondary border-none text-[16px] px-6 py-3.5 rounded-[20px] outline-none"
              />
              <Button onClick={runRoutingDemo} disabled={isRunning}>
                {isRunning ? '处理中...' : (chatLog.length > 0 ? '重新发起' : '发起咨询 🚀')}
              </Button>
            </div>

            <AnimatePresence>
              {chatLog.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-6 flex flex-col gap-4 min-h-[150px] bg-transparent"
                >
                  {chatLog.map((msg, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className={`p-4 text-[14px] leading-relaxed rounded-2xl w-full shadow-[0_4px_12px_rgba(0,0,0,0.03)] ${
                        msg.bg || 'bg-white text-text-main'
                      } ${msg.border ? 'border-l-[3px] border-primary' : ''}`}
                    >
                      {msg.content}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sections Added Back */}
        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-8 tracking-[-0.5px] text-text-main">平台定位</h2>
          <p className="text-[17px] text-text-secondary leading-[1.8] mb-10 text-center max-w-[900px] mx-auto">
            聚焦“AI+生活医学”核心赛道，以自研Medtalent Agent底座为核心，推出“1+N”计划。打造“1个通用基座+N个垂直智能体+N个专家智能体”。通过人工智能技术与权威医学知识的联动，覆盖服务C端大众、B端医生（包括医疗机构），实现“技术赋能+商业变现”双闭环，打造不可复制的行业竞争力。
          </p>
          <h2 className="text-center text-[30px] text-primary mb-6 mt-10 font-bold">木吾木同</h2>
          <p className="text-[17px] text-text-secondary leading-[1.8] text-center max-w-[900px] mx-auto">
            全新一代生活方式医学AI-AGENT底座开发<br/>
            助力医学科普产业化｜助力医生建设医生智能体｜助力百姓触手可及健康管理｜重塑健康未来
          </p>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-8 tracking-[-0.5px] text-text-main">智能体Agent集群底座</h2>
          <ul className="text-[17px] text-text-secondary leading-[1.8] list-disc list-inside max-w-[900px] mx-auto space-y-4">
            <li>融合100+基于权威医学知识库的专业智能体，以循证数据为基础，驱动“数据支持+运营管理”双效合一，构建智慧健康管理新模式。</li>
            <li>联结2351多名主任级医生专家知识底座</li>
            <li>自有开发Medtalent agent方法论，融合ocr、rag、孪生、大模型等技术，打造覆盖L1-L5五级进化体系的智能引擎，可实现私有化部署，支持多租户SaaS模式</li>
          </ul>
        </div>

        <div className="mb-20 bg-gradient-to-br from-[#f0f7ff] to-white rounded-3xl p-12 text-center border border-black/5 shadow-sm">
          <h2 className="text-[28px] text-primary mb-8 font-bold">浙里健康</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-5 py-2.5 bg-white border border-black/5 rounded-full text-[16px] text-text-main font-medium shadow-sm">24个科普分库</span>
            <span className="px-5 py-2.5 bg-white border border-black/5 rounded-full text-[16px] text-text-main font-medium shadow-sm">2351+主任级专家</span>
            <span className="px-5 py-2.5 bg-white border border-black/5 rounded-full text-[16px] text-text-main font-medium shadow-sm">专家知识的力量</span>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-6 tracking-[-0.5px] text-text-main">核心场景：大众、医生全闭环AI赋能</h2>
          <p className="text-[17px] text-text-secondary text-center mb-10">大众患者、管理机构，木吾木同Medtalent Agent 都能提供专属价值。</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <h3 className="text-[22px] font-semibold text-text-main mb-4">为大众百姓</h3>
              <p className="mb-4 text-[16px] text-text-main font-bold">MED-Life Style Claw——生活方式医学智能体空间</p>
              <ul className="text-[15px] text-text-secondary leading-relaxed list-disc list-inside space-y-2">
                <li>自然语言对话互动，高效获取健康资讯</li>
                <li>构建使用者健康画像，动态孪生，智能体自动匹配</li>
                <li>匹配推送健康信息</li>
                <li>构建动态打卡跟踪管理生态</li>
                <li>推送非医类专业健康用品</li>
                <li>联结医生矩阵相关科普知识</li>
                <li>打通专业医生、医院智能体</li>
              </ul>
            </Card>
            <Card className="p-8">
              <h3 className="text-[22px] font-semibold text-text-main mb-4">为医生</h3>
              <p className="mb-4 text-[16px] text-text-main font-bold">DOCTOR VOICE AGENT-医声智能体空间</p>
              <ul className="text-[15px] text-text-secondary leading-relaxed list-disc list-inside space-y-2">
                <li>释放医生潜能，专注核心医疗</li>
                <li>自动生成结构化电子病历，减少书写时间</li>
                <li>AI辅助鉴别诊断，降低漏诊误诊风险</li>
                <li>智能检索医学文献，实时获取最新指南</li>
                <li>自动随访管理，提高患者依从性</li>
                <li>健康画像跟踪提醒，建立患者健康管理习惯</li>
                <li>精准推送资讯套餐，助力患者提高健康认知</li>
                <li>对应匹配健康套餐、产品，助力知识智慧阳光变现</li>
              </ul>
            </Card>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-8 tracking-[-0.5px] text-text-main">核心能力</h2>
          <ol className="text-[17px] text-text-secondary leading-[1.8] list-decimal list-inside max-w-[900px] mx-auto space-y-4">
            <li><strong>AI Agent引擎：</strong>100+专业AI Agent智能编排，覆盖L1-L5五级体系。</li>
            <li><strong>智能数据辅助：</strong>基于医学知识库的智能数据建议，提升催工效率。</li>
            <li><strong>医疗级风控：</strong>双重安全审核机制，确保医疗内容合规安全。</li>
            <li><strong>多租户SaaS：</strong>支持超级管理员、机构管理员、医生、患者多级角色。</li>
            <li><strong>全周期管理：</strong>从预防到康复的全生命周期健康管理。</li>
            <li><strong>患者记忆系统：</strong>向患者数据库存储患者历史，提供个性化服务。</li>
          </ol>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-6 tracking-[-0.5px] text-text-main">企业级技术架构</h2>
          <p className="text-[17px] text-text-secondary text-center mb-10">安全、稳定、可扩展的云原生微服务架构</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">用户接入层</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">• Web / Mobile / IoT / API</p>
              <p className="text-[15px] text-text-secondary leading-relaxed">负载均衡 | 身份认证 | 流量控制 | 安全审计</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">业务能力层</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">• 业务中台：用户中心 | 机构管理 | 问诊系统 | 病历中心 | 知识库管理 | 消息通知</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">AI Agent引擎</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">• Orchestrator：任务编排与场景</p>
              <p className="text-[15px] text-text-secondary leading-relaxed">• LLM Core：多模态 Core（GPT / Claude / llama）</p>
              <p className="text-[15px] text-text-secondary leading-relaxed">• Memory：长期记忆与上下文管理</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">数据存储层</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">• MySQL | Redis | MongoDB | Vector DB | Object Storage</p>
            </Card>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-8 tracking-[-0.5px] text-text-main">常见问题解答</h2>
          <div className="max-w-[900px] mx-auto space-y-4">
            <div className="text-[16px] text-text-main border-b border-black/5 pb-4">• 了解多久上线木吾木同Agent OS的知识</div>
            <div className="text-[16px] text-text-main border-b border-black/5 pb-4">• 木吾木同Agent OS的知识安全如何保障</div>
            <div className="text-[16px] text-text-main border-b border-black/5 pb-4">• 木吾木同Agent OS的制度安全性如何</div>
            <div className="text-[16px] text-text-main border-b border-black/5 pb-4">• AI诊断建议的准确性如何？</div>
            <div className="text-[16px] text-text-main border-b border-black/5 pb-4">• 运营管理需要多长时间？</div>
          </div>
        </div>

        <div className="bg-[#f9fbff] rounded-3xl p-12 text-center border border-black/5 shadow-sm">
          <h2 className="font-title text-[32px] font-bold mb-4 tracking-[-0.5px] text-text-main">联系我们</h2>
          <p className="text-[17px] text-text-secondary">立即加入木吾木同Agent OS，体验AI为医疗带来的无限可能。</p>
        </div>

      </div>
    </div>
  );
}
