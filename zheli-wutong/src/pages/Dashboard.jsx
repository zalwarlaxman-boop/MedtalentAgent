import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  Leaf,
  Heart,
  Mic,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Apple,
  Droplets,
  Moon,
  Coffee,
  Brain,
  Sparkles,
  Scale,
  Send,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useHealthData } from '../context/HealthDataContext'

/* ─── 智能体集群数据 ─── */
const agents = [
  { id: 'weight', name: '体重管理', icon: Activity, color: 'bg-emerald-100 text-emerald-600', open: true },
  { id: 'longevity', name: '长寿屋', icon: HeartPulse, color: 'bg-rose-100 text-rose-600', open: false },
  { id: 'male', name: '男士活力', icon: Activity, color: 'bg-blue-100 text-blue-600', open: false },
  { id: 'sleep', name: '安睡阁', icon: Moon, color: 'bg-indigo-100 text-indigo-600', open: false },
  { id: 'stress', name: '减压馆', icon: Coffee, color: 'bg-amber-100 text-amber-600', open: false },
  { id: 'chronic', name: '慢病养护', icon: ShieldCheck, color: 'bg-cyan-100 text-cyan-600', open: false },
  { id: 'pregnancy', name: '孕养轩', icon: Heart, color: 'bg-pink-100 text-pink-600', open: false },
  { id: 'immune', name: '免疫提升', icon: Sparkles, color: 'bg-yellow-100 text-yellow-600', open: false },
  { id: 'gut', name: '肠道健康', icon: Droplets, color: 'bg-teal-100 text-teal-600', open: false },
  { id: 'beauty', name: '美颜内调', icon: Leaf, color: 'bg-fuchsia-100 text-fuchsia-600', open: false },
]

/* ─── 快速入口数据 ─── */
const quickEntries = [
  { key: 'goods', title: '好物严选', desc: '医院营养科联合推荐好物', icon: ShoppingBag, iconBg: 'bg-orange-100', iconColor: 'text-orange-500', path: '/goods' },
  { key: 'hospital', title: '物联网医院', desc: '三甲医院在线问诊直通', icon: Stethoscope, iconBg: 'bg-blue-100', iconColor: 'text-blue-500', path: '/hospital' },
  { key: 'experts', title: '专家联盟', desc: '多学科专家一对一咨询', icon: Brain, iconBg: 'bg-purple-100', iconColor: 'text-purple-500', path: '/experts' },
  { key: 'dietitians', title: '营养师联盟', desc: '500+认证营养师定制食谱', icon: Apple, iconBg: 'bg-green-100', iconColor: 'text-green-500', path: '/dietitians' },
]

/* ─── 动画配置 ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { state, healthScore, bmi, weightTrend, weightStats } = useHealthData()
  const [chatInput, setChatInput] = useState('')

  const { basicInfo, medicalReport, lifestyle } = state.profile
  const hasProfile = healthScore > 0
  const userName = basicInfo?.name

  /* 体重图表数据：最近 7 条 */
  const recentRecords = (state.weightRecords || []).slice(-7)
  const chartData = recentRecords.map((r) => ({
    day: r.date?.slice(5) || '',
    weight: r.weight,
  }))
  const hasWeightData = chartData.length > 0

  /* 发送消息 → 跳转互动页（携带输入内容） */
  const handleSend = () => {
    if (chatInput.trim()) {
      navigate('/interaction', { state: { initialMessage: chatInput.trim() } })
      setChatInput('')
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  /* 格式化血压 */
  const formatBP = () => {
    const s = medicalReport?.systolicBP
    const d = medicalReport?.diastolicBP
    if (s && d) return `${s}/${d}`
    return '--'
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      {/* ═══ 第一区：AI 智能体欢迎区（全宽） ═══ */}
      <motion.div variants={itemVariants} className="glass-card-dark p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4" />

        <h2 className="font-serif text-2xl font-bold">
          {userName ? `你好，${userName}` : '早安，您的陪伴式智能体在线'}
        </h2>
        <p className="text-wutong-soft text-sm mt-1.5 max-w-lg">
          基于您的最新画像，为您提供个性化健康管理建议。
        </p>

        <div className="relative mt-5">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="直接对我说话，或输入您的健康需求..."
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-3.5 pl-5 pr-28 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 backdrop-blur-sm transition-all text-sm"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button onClick={() => navigate('/interaction')} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" type="button">
              <Mic size={16} />
            </button>
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-full bg-wutong-accent text-white flex items-center justify-center hover:bg-wutong-light transition-colors shadow-lg shadow-wutong-accent/30"
              type="button"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {['"生成今日减脂餐单"', '"帮我解读体检报告"', '"昨晚没睡好怎么办"'].map((s, i) => (
            <button
              key={i}
              onClick={() => navigate('/interaction', { state: { initialMessage: s.replace(/^"|"$/g, '') } })}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 whitespace-nowrap cursor-pointer hover:bg-white/20 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ═══ 第二区：核心数据双列 ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 健康画像摘要 */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-lg text-wutong-dark">专属健康画像</h3>
            {hasProfile && <span className="text-xs bg-wutong-accent/20 text-wutong-primary px-2 py-0.5 rounded-full font-bold">已更新</span>}
          </div>

          <div className="flex items-center gap-4">
            {/* 圆形进度 */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-16 h-16 transform -rotate-90">
                <path
                  className="text-wutong-soft"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" strokeWidth="3.5"
                />
                <path
                  className="text-wutong-primary"
                  strokeDasharray={`${healthScore}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" strokeWidth="3.5"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-wutong-dark">{healthScore || 0}</span>
                <span className="text-[9px] text-wutong-light">综合分</span>
              </div>
            </div>

            {/* 指标 */}
            {hasProfile ? (
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-xs text-gray-400">BMI</p>
                  <p className="text-sm font-bold text-wutong-dark mt-0.5">{bmi?.value ?? '--'}</p>
                  {bmi?.category && <p className="text-[10px] text-gray-400">{bmi.category}</p>}
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">血压</p>
                  <p className="text-sm font-bold text-wutong-dark mt-0.5">{formatBP()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">睡眠</p>
                  <p className="text-sm font-bold text-wutong-dark mt-0.5">{lifestyle?.sleepHours ? `${lifestyle.sleepHours}h` : '--'}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-2">完善画像解锁健康评分</p>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="mt-4 w-full py-2 rounded-xl bg-wutong-soft hover:bg-wutong-accent/20 text-wutong-primary text-sm font-semibold transition-colors"
          >
            {hasProfile ? '查看画像' : '完善画像'}
          </button>
        </motion.div>

        {/* 体重管理 */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif font-bold text-lg text-wutong-dark flex items-center gap-2">
              <Scale size={20} className="text-wutong-primary" /> 体重管理
            </h3>
            {hasWeightData && (
              <div className="text-right">
                <span className="text-2xl font-bold text-wutong-dark">{weightStats?.current ?? '--'}</span>
                <span className="text-sm text-gray-400 ml-1">kg</span>
                {weightTrend?.weeklyChange != null && (
                  <p className={`text-xs font-medium ${weightTrend.weeklyChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {weightTrend.weeklyChange > 0 ? '↑' : '↓'} {Math.abs(weightTrend.weeklyChange).toFixed(1)}kg/周
                  </p>
                )}
              </div>
            )}
          </div>

          {hasWeightData ? (
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-wutong-primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-wutong-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={5} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="weight" stroke="var(--color-wutong-primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWeight)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Scale size={36} className="text-gray-300 mb-2" />
              <p className="text-gray-400 text-sm">开始记录体重，追踪变化趋势</p>
            </div>
          )}

          <button
            onClick={() => navigate('/tracking/weight')}
            className="mt-3 text-xs font-semibold text-wutong-primary hover:underline block ml-auto"
          >
            查看详情 →
          </button>
        </motion.div>
      </div>

      {/* ═══ 第三区：智能体集群（全宽水平滚动） ═══ */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-lg text-wutong-dark">专项智能体集群</h3>
          <button onClick={() => navigate('/tracking/agents')} className="text-xs font-semibold text-wutong-primary hover:underline">
            查看全部
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {agents.map((agent) => {
            const Icon = agent.icon
            return (
              <button
                key={agent.id}
                onClick={() => navigate(agent.open ? '/tracking/weight' : '/tracking/agents')}
                className="snap-start shrink-0 flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${agent.color}`}>
                    <Icon size={20} />
                  </div>
                  {agent.open && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <span className="text-xs font-medium text-gray-500 group-hover:text-wutong-primary">{agent.name}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* ═══ 第四区：快速入口网格 ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickEntries.map((entry) => {
          const Icon = entry.icon
          return (
            <motion.button
              key={entry.key}
              variants={itemVariants}
              onClick={() => navigate(entry.path)}
              className="glass-card p-5 flex items-start gap-3 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 text-left group"
            >
              <div className={`w-10 h-10 rounded-full ${entry.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={entry.iconColor} />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-wutong-dark group-hover:text-wutong-primary transition-colors">{entry.title}</h4>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{entry.desc}</p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
