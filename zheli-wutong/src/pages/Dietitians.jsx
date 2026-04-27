import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Apple, Upload, FileText, BarChart3, Bell, ChevronDown,
  X, Sunrise, Sun, Moon, MessageCircle, CalendarCheck,
  Award, Star, CheckCircle2
} from 'lucide-react'
import { useHealthData } from '../context/HealthDataContext'

const dietitians = [
  {
    name: '林营养师A', seed: 'linyingyangshiA', title: '临床营养师', org: '合作医院A营养科',
    certs: ['注册营养师(RD)', '中国营养学会会员'],
    skills: ['体重管理', '低GI饮食', '代谢综合征营养干预'],
    cases: 1856, rating: 98.2,
  },
  {
    name: '周营养师B', seed: 'zhouyingyangshiB', title: '运动营养师', org: '合作医院B运动中心',
    certs: ['国家运动营养师', 'NSCA-CPT认证'],
    skills: ['增肌减脂', '运动表现优化', '赛前营养规划'],
    cases: 1234, rating: 97.8,
  },
  {
    name: '许营养师C', seed: 'xuyingyangshiC', title: '妇幼营养师', org: '合作医院C妇幼中心',
    certs: ['注册营养师(RD)', '围产期营养专家'],
    skills: ['孕期营养', '产后恢复', '婴幼儿喂养指导'],
    cases: 2145, rating: 99.1,
  },
  {
    name: '宋营养师D', seed: 'songyingyangshiD', title: '慢病营养师', org: '合作医院D',
    certs: ['临床营养医师', '糖尿病教育管理师'],
    skills: ['三高饮食管理', '脂肪肝营养干预', '肾病饮食'],
    cases: 1678, rating: 97.5,
  },
  {
    name: '陈营养师E', seed: 'chenyingyangshiE', title: '功能营养师', org: '合作医院E',
    certs: ['注册营养师(RD)', '功能医学认证'],
    skills: ['肠道调理', '免疫营养', '抗炎饮食方案'],
    cases: 987, rating: 98.6,
  },
  {
    name: '黄营养师F', seed: 'huangyingyangshiF', title: '老年营养师', org: '合作医院F',
    certs: ['老年医学营养专家', '公共营养师'],
    skills: ['老年营养支持', '肌少症预防', '骨质疏松饮食'],
    cases: 1432, rating: 97.9,
  },
]

const flowSteps = [
  { icon: Upload, label: '上传健康画像', detail: '上传您的健康画像数据，营养师将基于此制定个性化方案' },
  { icon: FileText, label: '生成定制食谱', detail: '营养师结合您的体质、目标和偏好，生成每日三餐食谱' },
  { icon: BarChart3, label: '定期复盘调整', detail: '每周回顾饮食数据和身体变化，动态调整营养方案' },
  { icon: Bell, label: '联动智能提醒', detail: '智能体自动提醒用餐时间、营养补充和食材采购' },
]

const meals = [
  {
    label: '早餐', icon: Sunrise, bg: 'bg-amber-50', border: 'border-amber-200/60',
    items: ['全麦吐司 2片 + 水煮蛋 1个 + 牛油果半个', '低脂牛奶 250ml'],
    kcal: 420,
  },
  {
    label: '午餐', icon: Sun, bg: 'bg-green-50', border: 'border-green-200/60',
    items: ['糙米饭 150g + 清蒸鱼 150g + 西兰花 200g', '紫菜蛋花汤'],
    kcal: 550,
  },
  {
    label: '晚餐', icon: Moon, bg: 'bg-blue-50', border: 'border-blue-200/60',
    items: ['荞麦面 100g + 鸡胸肉沙拉 200g', '坚果一小把（15g）'],
    kcal: 480,
  },
]

const consultTypes = ['饮食方案', '体重管理', '慢病营养', '运动营养', '其他']
const serviceTypes = [
  { label: '一次性咨询', price: '¥99' },
  { label: '周计划定制', price: '¥299' },
  { label: '月度跟踪', price: '¥699' },
  { label: '季度套餐', price: '¥1599' },
]

/* ── 弹窗组件 ── */
function Overlay({ children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card p-6 w-full max-w-md relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  )
}

function ConsultModal({ dietitian, onClose }) {
  const { state } = useHealthData()
  const [form, setForm] = useState({ type: '', desc: '', linkProfile: false })
  const [success, setSuccess] = useState(false)

  const submit = () => {
    if (!form.type || !form.desc.trim()) return
    setSuccess(true)
    setTimeout(onClose, 3000)
  }

  if (success) {
    return (
      <Overlay onClose={onClose}>
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} />
          </div>
          <p className="font-serif font-bold text-lg text-wutong-dark">咨询已提交！</p>
          <p className="text-sm text-gray-600 mt-2">{dietitian.name} 营养师将在 24 小时内回复您</p>
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay onClose={onClose}>
      <h3 className="font-serif font-bold text-lg text-wutong-dark mb-5">咨询 {dietitian.name} 营养师</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">咨询类型</label>
          <select
            value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-wutong-primary"
          >
            <option value="">请选择</option>
            {consultTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">问题描述</label>
          <textarea
            maxLength={200} rows={4} value={form.desc}
            onChange={e => setForm({ ...form, desc: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-wutong-primary resize-none"
            placeholder="请详细描述您的问题（限200字）"
          />
          <p className="text-right text-xs text-gray-400">{form.desc.length}/200</p>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox" checked={form.linkProfile}
            onChange={e => setForm({ ...form, linkProfile: e.target.checked })}
            className="accent-wutong-primary w-4 h-4"
          />
          是否关联我的健康画像
        </label>
        {form.linkProfile && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            将同步您的健康数据
          </motion.p>
        )}
        <button onClick={submit}
          className="w-full py-2.5 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors text-sm">
          提交咨询
        </button>
      </div>
    </Overlay>
  )
}

function BookModal({ dietitian, onClose }) {
  const [form, setForm] = useState({ service: '', date: '', note: '' })
  const [success, setSuccess] = useState(false)

  const submit = () => {
    if (!form.service || !form.date) return
    setSuccess(true)
    setTimeout(onClose, 3000)
  }

  if (success) {
    return (
      <Overlay onClose={onClose}>
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} />
          </div>
          <p className="font-serif font-bold text-lg text-wutong-dark">预约成功！</p>
          <p className="text-sm text-gray-600 mt-2">服务将于 {form.date} 开始</p>
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay onClose={onClose}>
      <h3 className="font-serif font-bold text-lg text-wutong-dark mb-5">预约 {dietitian.name} 营养师服务</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">服务类型</label>
          <select
            value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-wutong-primary"
          >
            <option value="">请选择</option>
            {serviceTypes.map(s => <option key={s.label} value={s.label}>{s.label} {s.price}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">预约日期</label>
          <input type="date" value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-wutong-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">补充说明（可选）</label>
          <textarea rows={3} value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-wutong-primary resize-none"
            placeholder="如有特殊需求请说明"
          />
        </div>
        <button onClick={submit}
          className="w-full py-2.5 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors text-sm">
          确认预约
        </button>
      </div>
    </Overlay>
  )
}

/* ── 主页面 ── */
export default function Dietitians() {
  const [consultTarget, setConsultTarget] = useState(null)
  const [bookTarget, setBookTarget] = useState(null)
  const [expandedStep, setExpandedStep] = useState(null)

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── 左侧主区域 ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* 标题 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            <h2 className="font-serif text-2xl font-bold text-wutong-dark flex items-center gap-2">
              <Apple className="text-green-500" size={22} /> 营养师服务联盟
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              提供多机构营养师服务接入，支持定制食谱、随访与复盘。与体重管理、慢病养护等专项智能体联动，形成更完整的干预闭环。
            </p>
          </motion.div>

          {/* 营养师列表 2x3 */}
          <motion.div variants={stagger} initial="hidden" animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dietitians.map((d) => (
              <motion.div key={d.name} variants={fadeUp}
                whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="glass-card p-5 flex flex-col gap-3 cursor-default">
                {/* 头部 */}
                <div className="flex items-start gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${d.seed}`}
                    className="w-14 h-14 rounded-2xl bg-green-100 border border-white shrink-0" alt={d.name}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-wutong-dark">{d.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-wutong-soft text-wutong-primary font-medium">{d.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{d.org}</p>
                  </div>
                </div>

                {/* 资质标签 */}
                <div className="flex flex-wrap gap-1.5">
                  {d.certs.map((c, i) => (
                    <span key={c} className={`text-xs px-2 py-0.5 rounded-full font-medium ${i === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      <Award size={10} className="inline -mt-0.5 mr-0.5" />{c}
                    </span>
                  ))}
                </div>

                {/* 擅长 */}
                <div className="flex flex-wrap gap-1.5">
                  {d.skills.map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s}</span>
                  ))}
                </div>

                {/* 数据 */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>服务案例 <b className="text-wutong-dark">{d.cases.toLocaleString()}</b> 例</span>
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" /> 好评率 <b className="text-wutong-dark">{d.rating}%</b>
                  </span>
                </div>
                {/* 好评率进度条 */}
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${d.rating}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #40916c, #52b788)' }} />
                </div>

                {/* 按钮 */}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button onClick={() => setConsultTarget(d)}
                    className="flex items-center justify-center gap-1 py-2 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors text-sm">
                    <MessageCircle size={14} /> 在线咨询
                  </button>
                  <button onClick={() => setBookTarget(d)}
                    className="flex items-center justify-center gap-1 py-2 rounded-xl bg-white/60 hover:bg-white border border-white font-semibold text-sm text-wutong-dark transition-colors">
                    <CalendarCheck size={14} /> 预约服务
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 食谱定制展示 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-wutong-dark">示例定制食谱 — 体重管理方案</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {meals.map(m => {
                const Icon = m.icon
                return (
                  <motion.div key={m.label} whileHover={{ y: -3 }}
                    className={`${m.bg} ${m.border} border rounded-2xl p-5 flex flex-col gap-3`}>
                    <div className="flex items-center gap-2">
                      <Icon size={18} className="text-wutong-primary" />
                      <span className="font-bold text-wutong-dark text-sm">{m.label}</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1.5 flex-1">
                      {m.items.map(item => <li key={item}>• {item}</li>)}
                    </ul>
                    <p className="text-right">
                      <span className="text-xl font-bold text-wutong-primary">{m.kcal}</span>
                      <span className="text-xs text-gray-500 ml-1">kcal</span>
                    </p>
                  </motion.div>
                )
              })}
            </div>
            <p className="text-center text-sm font-semibold text-wutong-dark pt-2">
              总计约 <span className="text-wutong-primary text-lg">1,450</span> kcal / 日
            </p>
          </motion.div>
        </div>

        {/* ── 右侧面板 ── */}
        <div className="lg:col-span-4 space-y-6">
          {/* 服务流程 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-6">
            <h3 className="font-serif font-bold text-lg text-wutong-dark mb-5">服务流程</h3>
            <div className="relative pl-8">
              {/* 竖线 */}
              <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-wutong-soft" />
              <div className="space-y-2">
                {flowSteps.map((step, i) => {
                  const Icon = step.icon
                  const open = expandedStep === i
                  return (
                    <div key={i}>
                      <button onClick={() => setExpandedStep(open ? null : i)}
                        className="flex items-center gap-3 w-full text-left group relative">
                        <div className={`absolute -left-8 w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${open ? 'bg-wutong-primary text-white' : 'bg-wutong-soft text-wutong-primary'}`}>
                          <Icon size={14} />
                        </div>
                        <span className="text-sm font-semibold text-wutong-dark group-hover:text-wutong-primary transition-colors flex-1">
                          {i + 1}. {step.label}
                        </span>
                        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={14} className="text-gray-400" />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-gray-600 leading-relaxed py-2 pl-0">{step.detail}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* 服务预约快捷卡片 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-6 space-y-3">
            <h3 className="font-serif font-bold text-lg text-wutong-dark">服务套餐</h3>
            {serviceTypes.map(s => (
              <div key={s.label}
                className="flex items-center justify-between bg-white/50 border border-white px-4 py-3 rounded-2xl">
                <span className="text-sm text-gray-700">{s.label}</span>
                <span className="text-sm font-bold text-wutong-primary">{s.price}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 弹窗 */}
      <AnimatePresence>
        {consultTarget && <ConsultModal dietitian={consultTarget} onClose={() => setConsultTarget(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {bookTarget && <BookModal dietitian={bookTarget} onClose={() => setBookTarget(null)} />}
      </AnimatePresence>
    </>
  )
}
