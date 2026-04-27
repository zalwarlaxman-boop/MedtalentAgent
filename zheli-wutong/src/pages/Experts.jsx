import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink, Sparkles, Star, Brain, MessageCircle,
  Send, X, Calendar, Clock, FileText, Activity,
  Target, Stethoscope, BookOpen, Heart
} from 'lucide-react'

const experts = [
  {
    id: 1, name: '王医生A', pinyin: 'wangyishengA', title: '主任医师',
    hospital: '合作医院A', dept: '内分泌科',
    tags: ['三高/代谢病养护', '胰岛素管理'],
    rating: 4.9, served: '2,358', isDigital: true,
    welcome: '您好，我是王医生A的数字分身。您可以向我咨询关于三高、代谢病养护及胰岛素管理方面的健康问题。',
    replies: [
      '根据您描述的情况，血糖波动可能与饮食结构和用药时间有关。建议您在餐前30分钟测量血糖，并记录每餐碳水化合物摄入量，这样我们能更精准地调整方案。',
      '对于三高患者，我建议采用"地中海饮食+间歇性运动"的组合方案。每天步行30分钟，配合低GI饮食，通常4-6周就能看到明显改善。',
      '胰岛素注射部位轮换非常重要，建议腹部、大腿、上臂交替注射，避免脂肪增生导致吸收不稳定。'
    ]
  },
  {
    id: 2, name: '李医生B', pinyin: 'liyishengB', title: '教授',
    hospital: '合作医院B', dept: '心血管内科',
    tags: ['心脏康复', '运动处方', '高血压管理'],
    rating: 4.8, served: '1,892', isDigital: true,
    welcome: '您好，我是李医生B的数字分身。您可以向我咨询关于心脏康复、运动处方和高血压管理方面的健康问题。',
    replies: [
      '高血压患者的运动处方需要个性化制定。一般建议中等强度有氧运动，如快走、游泳，每周150分钟，运动时心率控制在最大心率的60-70%。',
      '心脏康复是一个系统工程，包括运动训练、营养指导、心理疏导和危险因素管理。建议您先完成心肺功能评估，我们再制定详细方案。',
    ]
  },
  {
    id: 3, name: '张医生C', pinyin: 'zhangyishengC', title: '副主任医师',
    hospital: '合作医院C', dept: '睡眠医学中心',
    tags: ['失眠治疗', '生物节律管理'],
    rating: 4.9, served: '1,456', isDigital: true,
    welcome: '您好，我是张医生C的数字分身。您可以向我咨询关于失眠治疗和生物节律管理方面的健康问题。',
    replies: [
      '改善睡眠质量首先要建立规律的作息时间。建议您每天固定时间上床和起床，睡前1小时避免使用电子设备，可以尝试478呼吸法帮助放松。',
      '生物节律紊乱是现代人常见问题。建议早晨接受15-30分钟自然光照，晚上减少蓝光暴露，配合褪黑素的合理使用，逐步调整生物钟。',
      '如果持续失眠超过3个月，建议进行多导睡眠监测评估，排除睡眠呼吸暂停等器质性原因。'
    ]
  },
  {
    id: 4, name: '陈医生D', pinyin: 'chenyishengD', title: '主任医师',
    hospital: '合作医院D', dept: '营养门诊',
    tags: ['体重管理', '饮食干预', '营养处方'],
    rating: 4.7, served: '3,120', isDigital: true,
    welcome: '您好，我是陈医生D的数字分身。您可以向我咨询关于体重管理、饮食干预和营养处方方面的健康问题。',
    replies: [
      '科学减重不建议极端节食，推荐每日减少300-500千卡热量摄入，配合每周3-4次运动。蛋白质摄入保持在每公斤体重1.2-1.5克，有助于维持肌肉量。',
      '营养处方需要根据您的身体成分分析来制定。建议先做一次人体成分检测，了解体脂率、肌肉量和基础代谢率，这样才能给出精准的饮食建议。',
    ]
  },
  {
    id: 5, name: '刘医生E', pinyin: 'liuyishengE', title: '副教授',
    hospital: '合作医院E', dept: '心理科',
    tags: ['焦虑抑郁', '压力管理', '认知行为治疗'],
    rating: 4.8, served: '987', isDigital: true,
    welcome: '您好，我是刘医生E的数字分身。您可以向我咨询关于焦虑抑郁、压力管理和认知行为治疗方面的健康问题。',
    replies: [
      '焦虑情绪本身是正常的保护机制，关键是学会与它相处。我推荐您尝试"正念呼吸"练习：每天10分钟，专注于呼吸，不评判任何出现的想法。',
      '认知行为治疗的核心是识别和改变不合理的思维模式。当您感到焦虑时，试着写下触发事件、自动想法和情绪反应，我们一起分析其中的认知偏差。',
      '工作压力管理建议采用"番茄工作法"配合定时放松，每工作25分钟休息5分钟，午间进行10分钟冥想，长期坚持效果显著。'
    ]
  },
  {
    id: 6, name: '赵医生F', pinyin: 'zhaoyishengF', title: '主任中医师',
    hospital: '合作医院F', dept: '治未病中心',
    tags: ['中医养生', '慢病调理', '体质辨识'],
    rating: 4.9, served: '2,567', isDigital: true,
    welcome: '您好，我是赵医生F的数字分身。您可以向我咨询关于中医养生、慢病调理和体质辨识方面的健康问题。',
    replies: [
      '中医讲究"治未病"，根据您的体质类型制定调理方案。气虚体质建议多食山药、黄芪，配合八段锦等柔和运动，循序渐进地增强正气。',
      '慢病调理需要辨证论治，不同体质的调理方向完全不同。建议您先完成中医体质评估，我根据结果为您制定个性化的食疗和功法方案。',
    ]
  },
]

const tagColors = [
  'bg-emerald-100 text-emerald-700', 'bg-blue-100 text-blue-700',
  'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700',
  'bg-purple-100 text-purple-700', 'bg-cyan-100 text-cyan-700',
]

const scenarios = [
  { icon: FileText, title: '体检报告解读', desc: '上传报告，专家AI智能解读' },
  { icon: Activity, title: '慢病日常管理', desc: '用药、饮食、运动指导' },
  { icon: Target, title: '健康方案定制', desc: '基于画像的个性化方案' },
]

/* ── 外部跳转确认弹窗 ── */
function ExternalLinkModal({ open, onClose }) {
  if (!open) return null
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
          className="glass-card bg-white/90 p-8 mx-4 max-w-md w-full" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-wutong-soft text-wutong-primary flex items-center justify-center">
              <ExternalLink size={20} />
            </div>
            <h3 className="font-serif font-bold text-lg text-wutong-dark">外部链接提示</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">即将前往<strong>浙里健教平台</strong>（外部网站），该平台由浙江省卫生健康委员会主办。</p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors">取消</button>
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-wutong-primary hover:bg-wutong-light text-white font-semibold text-sm transition-colors">继续前往</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── 预约问诊弹窗 ── */
function AppointmentModal({ expert, open, onClose }) {
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [desc, setDesc] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const handleSubmit = () => {
    if (!date) { setError('请选择预约日期'); return }
    if (!timeSlot) { setError('请选择预约时段'); return }
    if (!desc.trim()) { setError('请填写问题描述'); return }
    setError('')
    setSuccess(true)
    setTimeout(() => { onClose(); setSuccess(false); setDate(''); setTimeSlot(''); setDesc('') }, 3000)
  }

  const handleClose = () => {
    onClose(); setSuccess(false); setDate(''); setTimeSlot(''); setDesc(''); setError('')
  }

  if (!open || !expert) return null

  const slotLabels = { morning: '上午 9:00-11:00', afternoon: '下午 14:00-16:00', evening: '晚上 19:00-21:00' }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={handleClose}>
        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
          className="glass-card bg-white/90 p-8 mx-4 max-w-lg w-full" onClick={e => e.stopPropagation()}>

          {success ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <Calendar size={28} />
              </div>
              <h3 className="font-serif font-bold text-lg text-wutong-dark mb-2">预约成功！</h3>
              <p className="text-sm text-gray-600">{expert.name} 医生将于 <strong>{date}</strong> <strong>{slotLabels[timeSlot]}</strong> 与您线上问诊</p>
              <p className="text-xs text-gray-400 mt-3">3秒后自动关闭…</p>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif font-bold text-lg text-wutong-dark">预约 {expert.name} 医生问诊</h3>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">预约日期</label>
                  <input type="date" min={minDate} value={date} onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-wutong-accent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">预约时段</label>
                  <select value={timeSlot} onChange={e => setTimeSlot(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-wutong-accent">
                    <option value="">请选择时段</option>
                    <option value="morning">上午 9:00-11:00</option>
                    <option value="afternoon">下午 14:00-16:00</option>
                    <option value="evening">晚上 19:00-21:00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">问题描述</label>
                  <textarea maxLength={100} value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="请简要描述您的问题（100字以内）"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-wutong-accent resize-none" />
                  <p className="text-xs text-gray-400 text-right mt-1">{desc.length}/100</p>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button onClick={handleClose} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors">取消</button>
                <button onClick={handleSubmit} className="px-5 py-2.5 rounded-xl bg-wutong-primary hover:bg-wutong-light text-white font-semibold text-sm transition-colors">确认预约</button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── 专家智能体空间弹窗 ── */
function AgentSpaceModal({ expert, open, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const replyIdx = useRef(0)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open && expert) {
      setMessages([{ role: 'ai', text: expert.welcome }])
      replyIdx.current = 0
    }
  }, [open, expert])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const handleSend = () => {
    if (!input.trim() || typing) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setTyping(true)
    setTimeout(() => {
      const reply = expert.replies[replyIdx.current % expert.replies.length]
      replyIdx.current++
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
      setTyping(false)
    }, 1500)
  }

  const handleClose = () => { onClose(); setMessages([]); setInput(''); setTyping(false) }

  if (!open || !expert) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={handleClose}>
        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
          className="glass-card bg-white/95 w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center gap-4 p-6 border-b border-gray-100">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${expert.pinyin}`}
              className="w-12 h-12 rounded-2xl bg-wutong-soft border border-white" alt={expert.name} />
            <div className="flex-1">
              <h3 className="font-serif font-bold text-lg text-wutong-dark">{expert.name} · 数字专家空间</h3>
              <p className="text-xs text-gray-500">{expert.hospital} {expert.dept} · {expert.title}</p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-wutong-primary text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}>{msg.text}</div>
              </motion.div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 px-4 py-3 rounded-2xl rounded-bl-md text-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="输入您的健康问题…" disabled={typing}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-wutong-accent disabled:opacity-50" />
              <button onClick={handleSend} disabled={typing || !input.trim()}
                className="px-5 py-3 rounded-xl bg-wutong-primary hover:bg-wutong-light text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                <Send size={16} /> 发送
              </button>
            </div>
            <div className="mt-3 text-center">
              <button onClick={handleClose} className="text-sm text-gray-500 hover:text-red-500 transition-colors">结束咨询</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── 主页面 ── */
export default function Experts() {
  const [extLinkOpen, setExtLinkOpen] = useState(false)
  const [spaceExpert, setSpaceExpert] = useState(null)
  const [appointExpert, setAppointExpert] = useState(null)

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

  return (
    <div className="space-y-6">
      {/* ── 浙里健教平台横幅 ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card-dark p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <ExternalLink size={22} className="text-white" />
            </div>
            <div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-white flex items-center gap-2">浙里健教平台</h2>
              <p className="text-sm text-white/70 mt-1 leading-relaxed">浙江省健康教育综合平台，汇聚权威健康知识</p>
            </div>
          </div>
          <button onClick={() => setExtLinkOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-colors backdrop-blur-sm border border-white/20 shrink-0">
            前往平台
          </button>
        </div>
      </motion.div>

      {/* ── 两列布局 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：专家列表 */}
        <div className="lg:col-span-8">
          <motion.div variants={stagger} initial="hidden" animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experts.map((expert) => (
              <motion.div key={expert.id} variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card p-5 flex flex-col">
                <div className="flex items-start gap-4">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${expert.pinyin}`}
                    className="w-14 h-14 rounded-2xl bg-wutong-soft border border-white shrink-0" alt={expert.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-wutong-dark">{expert.name}</span>
                      <span className="text-xs text-gray-500">{expert.title}</span>
                      {expert.isDigital && (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          <Sparkles size={10} /> 数字专家
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{expert.hospital} · {expert.dept}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {expert.tags.map((tag, i) => (
                    <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[i % tagColors.length]}`}>{tag}</span>
                  ))}
                </div>

                {/* Rating & served */}
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" /> {expert.rating}
                  </span>
                  <span>已服务 {expert.served} 人</span>
                </div>

                {/* Actions */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button onClick={() => setSpaceExpert(expert)}
                    className="py-2 rounded-xl bg-wutong-primary hover:bg-wutong-light text-white font-semibold text-sm transition-colors">
                    进入空间
                  </button>
                  <button onClick={() => setAppointExpert(expert)}
                    className="py-2 rounded-xl bg-white/60 hover:bg-white border border-gray-200 font-semibold text-sm text-wutong-dark transition-colors">
                    预约问诊
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 右侧面板 */}
        <div className="lg:col-span-4 space-y-6">
          {/* 数字专家空间说明 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-wutong-soft text-wutong-primary flex items-center justify-center">
                <Brain size={18} />
              </div>
              <h3 className="font-serif font-bold text-wutong-dark">数字专家空间</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              每位专家拥有独立的智能体空间，您可以随时进入与数字专家交流，获取专业健康建议。
            </p>
            <div className="space-y-3">
              {[
                { icon: MessageCircle, label: 'AI问诊', desc: '智能对话获取初步建议' },
                { icon: Stethoscope, label: '专业建议', desc: '基于专家经验的精准指导' },
                { icon: Heart, label: '持续跟踪', desc: '健康数据长期追踪管理' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/50">
                  <div className="w-8 h-8 rounded-lg bg-wutong-soft text-wutong-primary flex items-center justify-center shrink-0">
                    <item.icon size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-wutong-dark">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 场景示例 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-wutong-primary text-white flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <h3 className="font-serif font-bold text-wutong-dark">使用场景</h3>
            </div>
            <div className="space-y-3">
              {scenarios.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/50">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <s.icon size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-wutong-dark">{s.title}</div>
                    <div className="text-xs text-gray-500">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Modals ── */}
      <ExternalLinkModal open={extLinkOpen} onClose={() => setExtLinkOpen(false)} />
      <AgentSpaceModal expert={spaceExpert} open={!!spaceExpert} onClose={() => setSpaceExpert(null)} />
      <AppointmentModal expert={appointExpert} open={!!appointExpert} onClose={() => setAppointExpert(null)} />
    </div>
  )
}
