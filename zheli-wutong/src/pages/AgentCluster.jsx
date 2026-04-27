import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, HeartPulse, Moon, Coffee, ShieldCheck,
  Heart, Sparkles, Droplets, Leaf, Search
} from 'lucide-react'

const categories = ['全部', '代谢管理', '身心健康', '专项养护']

const agents = [
  {
    id: 'weight',
    name: '体重管理智能体',
    icon: Activity,
    color: '#10b981',
    tone: 'from-emerald-400 to-green-600',
    category: '代谢管理',
    open: true,
    desc: '基于您的健康画像，实时追踪体重变化，智能匹配饮食、运动、代谢优化方案，全程陪伴式管理',
    crowd: ['减重人群', '体重控制', '代谢调节'],
    abilities: ['体重趋势分析', '智能干预建议', '主动提醒', '数据可视化'],
  },
  {
    id: 'longevity',
    name: '长寿屋智能体',
    icon: HeartPulse,
    color: '#f43f5e',
    tone: 'from-rose-400 to-rose-600',
    category: '专项养护',
    open: false,
    desc: '全方位长寿健康管理，关注抗衰老与生命质量提升',
    crowd: ['中老年人群', '养生爱好者', '健康意识强者'],
    abilities: ['衰老评估', '营养方案', '运动处方', '定期体检提醒'],
  },
  {
    id: 'male',
    name: '男性活力智能体',
    icon: Activity,
    color: '#3b82f6',
    tone: 'from-blue-400 to-blue-600',
    category: '专项养护',
    open: false,
    desc: '专注男性健康管理，提升体能与活力状态',
    crowd: ['男性用户', '运动爱好者', '亚健康人群'],
    abilities: ['体能评估', '激素平衡', '运动规划', '营养补充'],
  },
  {
    id: 'sleep',
    name: '安睡阁智能体',
    icon: Moon,
    color: '#6366f1',
    tone: 'from-indigo-400 to-indigo-600',
    category: '身心健康',
    open: false,
    desc: '智能睡眠管理，改善睡眠质量与节律',
    crowd: ['失眠患者', '作息不规律者', '睡眠质量差'],
    abilities: ['睡眠监测', '节律调整', '助眠方案', '环境优化'],
  },
  {
    id: 'stress',
    name: '减压馆智能体',
    icon: Coffee,
    color: '#f59e0b',
    tone: 'from-amber-400 to-amber-600',
    category: '身心健康',
    open: false,
    desc: '压力管理与情绪调节，守护心理健康',
    crowd: ['职场人群', '学生群体', '压力大者'],
    abilities: ['压力评估', '放松训练', '正念冥想', '情绪记录'],
  },
  {
    id: 'chronic',
    name: '慢病管理智能体',
    icon: ShieldCheck,
    color: '#06b6d4',
    tone: 'from-cyan-400 to-cyan-600',
    category: '代谢管理',
    open: false,
    desc: '三高/代谢病养护，科学管理慢性疾病',
    crowd: ['三高患者', '代谢综合征', '慢病人群'],
    abilities: ['指标监测', '用药提醒', '饮食管控', '风险预警'],
  },
  {
    id: 'pregnancy',
    name: '孕养轩智能体',
    icon: Heart,
    color: '#ec4899',
    tone: 'from-pink-400 to-pink-600',
    category: '专项养护',
    open: false,
    desc: '孕期与产后全程营养与健康管理',
    crowd: ['备孕女性', '孕期妈妈', '产后恢复'],
    abilities: ['营养方案', '体重管理', '产检提醒', '运动指导'],
  },
  {
    id: 'immune',
    name: '免疫提升智能体',
    icon: Sparkles,
    color: '#eab308',
    tone: 'from-yellow-400 to-yellow-600',
    category: '专项养护',
    open: false,
    desc: '增强免疫力，提升身体抵抗力',
    crowd: ['易感冒人群', '免疫力低下', '术后恢复'],
    abilities: ['免疫评估', '营养强化', '运动处方', '生活调整'],
  },
  {
    id: 'gut',
    name: '肠道健康智能体',
    icon: Droplets,
    color: '#0891b2',
    tone: 'from-teal-400 to-cyan-600',
    category: '代谢管理',
    open: false,
    desc: '肠道菌群平衡管理，改善消化与吸收',
    crowd: ['消化不良者', '便秘人群', '肠道敏感者'],
    abilities: ['菌群评估', '饮食调理', '益生菌方案', '症状追踪'],
  },
  {
    id: 'beauty',
    name: '美颜内调智能体',
    icon: Leaf,
    color: '#a855f7',
    tone: 'from-purple-400 to-fuchsia-600',
    category: '身心健康',
    open: false,
    desc: '肌肤/好气色管理，由内而外焕发光彩',
    crowd: ['爱美人士', '肌肤问题者', '气色不佳者'],
    abilities: ['肤质评估', '内调方案', '饮食美容', '作息优化'],
  },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function AgentCluster() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(false), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const filtered = agents.filter((a) => {
    const matchCategory = activeCategory === '全部' || a.category === activeCategory
    if (!search.trim()) return matchCategory
    const q = search.trim().toLowerCase()
    const matchSearch = a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)
    return matchCategory && matchSearch
  })

  // 体重管理始终置顶（在筛选结果中的话）
  const weightAgent = filtered.find((a) => a.id === 'weight')
  const otherAgents = filtered.filter((a) => a.id !== 'weight')

  return (
    <div className="space-y-6">
      {/* 页面标题区 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8"
      >
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-wutong-dark">
          专项智能体集群
        </h2>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-2xl">
          基于健康画像，为您匹配个性化动态跟踪管理方案
        </p>

        {/* 搜索 + 分类筛选 */}
        <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索智能体..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/60 border border-white/80 text-sm text-wutong-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wutong-primary/30 transition"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-wutong-primary text-white shadow-md shadow-wutong-primary/25'
                    : 'bg-white/60 text-gray-600 hover:bg-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 体重管理智能体 — 置顶大卡片 */}
      {weightAgent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card-dark p-6 md:p-8 relative overflow-hidden"
        >
          {/* 背景装饰 */}
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-green-400/10 blur-2xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            {/* 图标 */}
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Activity size={36} />
              </div>
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-wutong-dark">{weightAgent.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                  推荐
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  已开放
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{weightAgent.desc}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {weightAgent.crowd.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-medium">
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {weightAgent.abilities.map((ab) => (
                  <span key={ab} className="px-2 py-0.5 rounded-full text-[10px] bg-white/60 text-gray-600 font-medium border border-white/80">
                    {ab}
                  </span>
                ))}
              </div>
            </div>

            {/* 按钮 */}
            <div className="flex flex-row md:flex-col gap-3 flex-shrink-0">
              <button
                onClick={() => navigate('/tracking/weight')}
                className="px-5 py-2.5 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors text-sm shadow-md shadow-wutong-primary/20"
              >
                立即开始
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-5 py-2.5 rounded-xl bg-white/60 hover:bg-white text-wutong-dark font-semibold border border-white/80 transition-colors text-sm"
              >
                查看我的画像
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 其他智能体网格 */}
      {otherAgents.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {otherAgents.map((a) => {
            const Icon = a.icon
            return (
              <motion.div
                key={a.id}
                variants={itemVariants}
                className="glass-card p-5 group flex flex-col"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`h-14 w-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${a.tone} text-white flex items-center justify-center shadow-lg shadow-black/10`}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-wutong-dark truncate">{a.name}</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 text-gray-500 whitespace-nowrap">
                        即将开放
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                      {a.desc}
                    </p>
                  </div>
                </div>

                {/* 标签 */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {a.crowd.map((c) => (
                    <span
                      key={c}
                      className="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ backgroundColor: `${a.color}15`, color: a.color }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {a.abilities.map((ab) => (
                    <span key={ab} className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/60 text-gray-500 font-medium border border-white/80">
                      {ab}
                    </span>
                  ))}
                </div>

                {/* 按钮 */}
                <div className="mt-auto pt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setToast(true)}
                    className="text-center py-2 rounded-xl bg-gray-100 text-gray-400 font-semibold text-sm cursor-not-allowed"
                    disabled
                  >
                    开始
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="text-center py-2 rounded-xl bg-white/60 hover:bg-white text-wutong-dark font-semibold border border-white/80 transition-colors text-sm"
                  >
                    查看画像
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <p className="text-gray-400 text-sm">未找到匹配的智能体</p>
        </motion.div>
      )}

      {/* Toast 提示 */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-gray-900/90 text-white text-sm font-medium shadow-xl backdrop-blur-sm"
          >
            该智能体即将开放，敬请期待
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
