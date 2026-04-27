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

        {/* Content */}
        <h2 className="font-title text-[32px] font-bold text-center mb-10 tracking-[-0.5px]">智能体Agent集群底座</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <Card className="p-8">
            <h3 className="text-[20px] font-semibold text-text-main mb-3">权威知识驱动</h3>
            <p className="text-[15px] text-text-secondary leading-relaxed">融合100+基于权威医学知识库的专业智能体，以循证数据为基础，构建智慧健康管理新模式。</p>
          </Card>
          <Card className="p-8">
            <h3 className="text-[20px] font-semibold text-text-main mb-3">专家资源链接</h3>
            <p className="text-[15px] text-text-secondary leading-relaxed">联结2351多名主任级医生专家知识底座，将顶级医疗经验数字化。</p>
          </Card>
          <Card className="p-8">
            <h3 className="text-[20px] font-semibold text-text-main mb-3">核心自研技术</h3>
            <p className="text-[15px] text-text-secondary leading-relaxed">融合OCR、RAG、孪生、大模型等技术，打造覆盖L1-L5五级进化体系的智能引擎。</p>
          </Card>
        </div>
      </div>
    </div>
  );
}