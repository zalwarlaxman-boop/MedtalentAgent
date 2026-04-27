import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine,
} from 'recharts'
import {
  Scale, Sparkles, Utensils, Dumbbell, Flame, Plus, X, Trash2,
  Bell, AlertTriangle, Trophy, Info, ChevronDown, ChevronUp, Check,
} from 'lucide-react'
import { useHealthData } from '../context/HealthDataContext'
import { generateInterventions } from '../utils/healthCalc'

// ─── helpers ────────────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0, 10)
const fmt = (d) => { const p = d.split('-'); return `${p[1]}/${p[2]}` }
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5)

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

// ─── component ──────────────────────────────────────────────────
export default function WeightTracking() {
  const { state, dispatch, bmi, weightTrend, weightStats, weightAlerts } = useHealthData()

  // local ui state
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ weight: '', date: today(), note: '' })
  const [formErr, setFormErr] = useState('')
  const [range, setRange] = useState(30) // 7 | 30 | 90
  const [toast, setToast] = useState('')
  const [checkedActions, setCheckedActions] = useState({})
  const [showAllRecords, setShowAllRecords] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalForm, setGoalForm] = useState({ targetWeight: '', targetDate: '' })

  // ── chart data ──
  const chartData = useMemo(() => {
    if (!state.weightRecords.length) return []
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - range)
    return [...state.weightRecords]
      .filter((r) => new Date(r.date) >= cutoff)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((r) => ({ date: r.date, label: fmt(r.date), weight: r.weight, note: r.note }))
  }, [state.weightRecords, range])

  const yDomain = useMemo(() => {
    if (!chartData.length) return [60, 80]
    const ws = chartData.map((d) => d.weight)
    return [Math.floor(Math.min(...ws) - 2), Math.ceil(Math.max(...ws) + 2)]
  }, [chartData])

  // ── interventions ──
  const interventions = useMemo(
    () => generateInterventions(weightTrend, bmi, state.profile),
    [weightTrend, bmi, state.profile],
  )

  const dietTips = interventions.filter((i) => i.type === 'diet')
  const exerciseTips = interventions.filter((i) => i.type === 'exercise')
  const metaTips = interventions.filter((i) => i.type === 'metabolism')

  // ── action checklist derived from interventions ──
  const actionItems = useMemo(() => {
    if (!interventions.length) return []
    const items = []
    dietTips.forEach((t) => items.push({ id: `d-${t.title}`, text: t.description.slice(0, 30) + '...' }))
    exerciseTips.forEach((t) => items.push({ id: `e-${t.title}`, text: t.description.slice(0, 30) + '...' }))
    metaTips.forEach((t) => items.push({ id: `m-${t.title}`, text: t.description.slice(0, 30) + '...' }))
    // add some generic daily actions
    if (items.length === 0) {
      items.push(
        { id: 'g1', text: '早餐控制主食量在150g以内' },
        { id: 'g2', text: '午休后步行20分钟' },
        { id: 'g3', text: '晚上10:30前入睡' },
      )
    }
    return items
  }, [interventions, dietTips, exerciseTips, metaTips])

  // ── sorted records for history list ──
  const sortedRecords = useMemo(
    () => [...state.weightRecords].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [state.weightRecords],
  )
  const visibleRecords = showAllRecords ? sortedRecords : sortedRecords.slice(0, 5)

  // ── goal helpers ──
  const hasGoal = !!(state.weightGoal.targetWeight && state.weightGoal.targetDate)
  const predictionDays = useMemo(() => {
    if (!hasGoal || !weightTrend.avgChange) return null
    const remaining = Number(state.weightGoal.targetWeight) - (weightStats.current || 0)
    if (weightTrend.avgChange === 0) return null
    const days = Math.round(remaining / weightTrend.avgChange)
    return days > 0 ? days : null
  }, [hasGoal, weightTrend, weightStats, state.weightGoal])

  // ── handlers ──
  const handleAddRecord = () => {
    const w = Number(form.weight)
    if (!form.weight || isNaN(w) || w < 30 || w > 300) {
      setFormErr('请输入有效体重（30-300 kg）')
      return
    }
    if (!form.date) { setFormErr('请选择日期'); return }
    dispatch({ type: 'ADD_WEIGHT_RECORD', payload: { date: form.date, weight: w, note: form.note } })
    setShowModal(false)
    setForm({ weight: '', date: today(), note: '' })
    setFormErr('')
    setToast('体重记录成功！')
    setTimeout(() => setToast(''), 2500)
  }

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_WEIGHT_RECORD', payload: { id } })
    setDeleteConfirm(null)
  }

  const handleSetGoal = () => {
    const tw = Number(goalForm.targetWeight)
    if (!tw || tw < 30 || tw > 300 || !goalForm.targetDate) return
    dispatch({
      type: 'SET_WEIGHT_GOAL',
      payload: {
        targetWeight: tw,
        targetDate: goalForm.targetDate,
        startWeight: weightStats.current || tw,
        startDate: today(),
      },
    })
    setEditingGoal(false)
  }

  const toggleAction = (id) => setCheckedActions((p) => ({ ...p, [id]: !p[id] }))

  // ── custom tooltip ──
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="bg-white/90 backdrop-blur rounded-xl px-4 py-3 shadow-lg border border-white/60 text-sm">
        <p className="font-bold text-wutong-dark">{d.date}</p>
        <p className="text-wutong-primary font-semibold">{d.weight} kg</p>
        {d.note && <p className="text-gray-500 text-xs mt-1">{d.note}</p>}
      </div>
    )
  }

  // ═══════════════════════════════════════════════ RENDER ═══
  return (
    <>
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* ==================== LEFT COL ==================== */}
        <div className="lg:col-span-8 space-y-6">

          {/* ── Header + Chart ── */}
          <motion.div variants={fadeUp} className="glass-card p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-serif text-2xl font-bold text-wutong-dark flex items-center gap-2">
                  <Scale className="text-wutong-primary" size={24} /> 体重动态跟踪
                </h2>
                <p className="text-sm text-gray-600 mt-1">实时跟踪体重变化，智能分析趋势并推送干预建议</p>
              </div>
              {weightStats.current > 0 && (
                <div className="text-right">
                  <div className="text-3xl font-bold text-wutong-dark">
                    {weightStats.current}<span className="text-base text-gray-500 font-normal ml-1">kg</span>
                  </div>
                  <div className={`text-sm font-semibold ${weightStats.totalChange <= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    累计 {weightStats.totalChange > 0 ? '+' : ''}{weightStats.totalChange} kg
                  </div>
                </div>
              )}
            </div>

            {/* time range buttons */}
            <div className="flex gap-2 mt-5">
              {[{ v: 7, l: '近7天' }, { v: 30, l: '近30天' }, { v: 90, l: '近3个月' }].map((b) => (
                <button key={b.v} onClick={() => setRange(b.v)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${range === b.v
                    ? 'bg-wutong-primary text-white shadow' : 'bg-white/60 text-gray-600 hover:bg-white border border-white/80'}`}>
                  {b.l}
                </button>
              ))}
            </div>

            {/* chart */}
            <div className="mt-5 h-72 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#52b788" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#d8f3dc" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={8} />
                    <YAxis domain={yDomain} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip content={<CustomTooltip />} />
                    {hasGoal && (
                      <ReferenceLine y={Number(state.weightGoal.targetWeight)} stroke="#f59e0b" strokeDasharray="6 4" label={{ value: '目标', fill: '#f59e0b', fontSize: 12 }} />
                    )}
                    <Area type="monotone" dataKey="weight" stroke="#52b788" strokeWidth={3} fill="url(#wGrad)" dot={{ r: 4, fill: '#52b788', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Scale size={48} className="mb-3 opacity-40" />
                  <p className="text-sm">还没有体重记录，点击右下角 <span className="text-wutong-primary font-bold">+</span> 开始记录吧</p>
                </div>
              )}
            </div>

            {/* recent records table */}
            {sortedRecords.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-wutong-dark">最近记录</h4>
                  {sortedRecords.length > 5 && (
                    <button onClick={() => setShowAllRecords(!showAllRecords)}
                      className="text-xs text-wutong-primary font-semibold flex items-center gap-1 hover:underline">
                      {showAllRecords ? '收起' : '查看全部'}
                      {showAllRecords ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs border-b border-gray-200/60">
                        <th className="text-left py-2 font-medium">日期</th>
                        <th className="text-right py-2 font-medium">体重</th>
                        <th className="text-right py-2 font-medium">变化</th>
                        <th className="text-left py-2 pl-4 font-medium">备注</th>
                        <th className="py-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRecords.map((r, idx) => {
                        const prevIdx = sortedRecords.indexOf(r)
                        const prev = sortedRecords[prevIdx + 1]
                        const diff = prev ? +(r.weight - prev.weight).toFixed(1) : null
                        return (
                          <tr key={r.id} className="border-b border-gray-100/60 last:border-0">
                            <td className="py-2 text-wutong-dark">{r.date}</td>
                            <td className="py-2 text-right font-semibold text-wutong-dark">{r.weight} kg</td>
                            <td className={`py-2 text-right font-medium ${diff === null ? 'text-gray-400' : diff > 0 ? 'text-red-500' : diff < 0 ? 'text-green-600' : 'text-gray-400'}`}>
                              {diff === null ? '-' : `${diff > 0 ? '+' : ''}${diff}`}
                            </td>
                            <td className="py-2 pl-4 text-gray-500 truncate max-w-[120px]">{r.note || '-'}</td>
                            <td className="py-2 text-center">
                              {deleteConfirm === r.id ? (
                                <div className="flex gap-1 justify-center">
                                  <button onClick={() => handleDelete(r.id)} className="text-red-500 text-xs font-bold hover:underline">确认</button>
                                  <button onClick={() => setDeleteConfirm(null)} className="text-gray-400 text-xs hover:underline">取消</button>
                                </div>
                              ) : (
                                <button onClick={() => setDeleteConfirm(r.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>

          {/* ── Interventions ── */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h3 className="font-serif font-bold text-lg text-wutong-dark flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-wutong-primary" /> 智能干预建议
            </h3>
            {interventions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* diet */}
                <div className="bg-green-50/60 p-5 rounded-2xl border border-green-100">
                  <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
                    <Utensils size={18} />
                  </div>
                  <div className="mt-3 text-sm font-bold text-wutong-dark">饮食建议</div>
                  {dietTips.length ? dietTips.map((t) => (
                    <div key={t.title} className="mt-2">
                      <div className="text-xs font-semibold text-green-700">{t.title}</div>
                      <div className="text-xs text-gray-600 leading-relaxed mt-0.5">{t.description}</div>
                    </div>
                  )) : <p className="text-xs text-gray-400 mt-2">当前饮食状态良好</p>}
                </div>
                {/* exercise */}
                <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Dumbbell size={18} />
                  </div>
                  <div className="mt-3 text-sm font-bold text-wutong-dark">运动建议</div>
                  {exerciseTips.length ? exerciseTips.map((t) => (
                    <div key={t.title} className="mt-2">
                      <div className="text-xs font-semibold text-blue-700">{t.title}</div>
                      <div className="text-xs text-gray-600 leading-relaxed mt-0.5">{t.description}</div>
                    </div>
                  )) : <p className="text-xs text-gray-400 mt-2">当前运动频率适宜</p>}
                </div>
                {/* metabolism */}
                <div className="bg-orange-50/60 p-5 rounded-2xl border border-orange-100">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Flame size={18} />
                  </div>
                  <div className="mt-3 text-sm font-bold text-wutong-dark">代谢优化</div>
                  {metaTips.length ? metaTips.map((t) => (
                    <div key={t.title} className="mt-2">
                      <div className="text-xs font-semibold text-orange-700">{t.title}</div>
                      <div className="text-xs text-gray-600 leading-relaxed mt-0.5">{t.description}</div>
                    </div>
                  )) : <p className="text-xs text-gray-400 mt-2">代谢状态正常</p>}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">录入体重数据后将生成个性化建议</p>
            )}
          </motion.div>

          {/* ── Action Checklist ── */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h3 className="font-serif font-bold text-lg text-wutong-dark mb-4">今日行动计划</h3>
            {actionItems.length > 0 ? (
              <div className="space-y-3">
                {actionItems.map((a) => (
                  <button key={a.id} onClick={() => toggleAction(a.id)}
                    className={`w-full flex items-center gap-3 text-left p-3 rounded-xl transition-colors ${checkedActions[a.id] ? 'bg-green-50/60 border border-green-200' : 'bg-white/50 border border-white hover:bg-white/80'}`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${checkedActions[a.id] ? 'bg-wutong-primary text-white' : 'border-2 border-gray-300'}`}>
                      {checkedActions[a.id] && <Check size={14} />}
                    </div>
                    <span className={`text-sm ${checkedActions[a.id] ? 'line-through text-gray-400' : 'text-wutong-dark'}`}>{a.text}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">录入体重后生成今日行动计划</p>
            )}
          </motion.div>
        </div>

        {/* ==================== RIGHT COL ==================== */}
        <div className="lg:col-span-4 space-y-6">

          {/* ── Stats ── */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h3 className="font-serif font-bold text-lg text-wutong-dark mb-4">数据统计</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/50 rounded-2xl p-4 border border-white text-center">
                <div className="text-2xl font-bold text-wutong-dark">{weightStats.current || '-'}</div>
                <div className="text-xs text-gray-500 mt-1">当前体重(kg)</div>
              </div>
              <div className="bg-white/50 rounded-2xl p-4 border border-white text-center">
                <div className="text-2xl font-bold text-wutong-dark">{bmi.value || '-'}</div>
                <div className="text-xs text-gray-500 mt-1">BMI
                  {bmi.category && bmi.category !== '未知' && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${bmi.category === '正常' ? 'bg-green-100 text-green-700' : bmi.category === '偏瘦' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {bmi.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-white/50 rounded-2xl p-4 border border-white text-center">
                <div className={`text-2xl font-bold ${weightStats.totalChange > 0 ? 'text-red-500' : weightStats.totalChange < 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {weightStats.totalChange ? `${weightStats.totalChange > 0 ? '+' : ''}${weightStats.totalChange}` : '-'}
                </div>
                <div className="text-xs text-gray-500 mt-1">累计变化(kg)</div>
              </div>
              <div className="bg-white/50 rounded-2xl p-4 border border-white text-center">
                <div className="text-2xl font-bold text-wutong-dark">{weightStats.daysTracked || '-'}</div>
                <div className="text-xs text-gray-500 mt-1">跟踪天数</div>
              </div>
            </div>
            {weightStats.weeklyAvgChange !== 0 && (
              <div className="mt-3 text-center text-xs text-gray-500">
                周均变化 <span className={`font-semibold ${weightStats.weeklyAvgChange > 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {weightStats.weeklyAvgChange > 0 ? '+' : ''}{weightStats.weeklyAvgChange} kg/周
                </span>
              </div>
            )}
          </motion.div>

          {/* ── Goal ── */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h3 className="font-serif font-bold text-lg text-wutong-dark mb-4">我的目标</h3>
            {hasGoal && !editingGoal ? (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">目标体重</span>
                  <span className="font-bold text-wutong-dark">{state.weightGoal.targetWeight} kg</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-600">目标日期</span>
                  <span className="font-bold text-wutong-dark">{state.weightGoal.targetDate}</span>
                </div>
                {/* progress bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>进度</span><span>{weightStats.progressPercent}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-200/60 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${weightStats.progressPercent}%` }}
                      transition={{ duration: 0.8 }} className="h-full bg-wutong-primary rounded-full" />
                  </div>
                </div>
                {predictionDays && (
                  <p className="text-xs text-gray-500 mt-2">按当前趋势，预计 <span className="font-semibold text-wutong-primary">{predictionDays}</span> 天后达标</p>
                )}
                <button onClick={() => { setEditingGoal(true); setGoalForm({ targetWeight: state.weightGoal.targetWeight, targetDate: state.weightGoal.targetDate }) }}
                  className="mt-3 w-full py-2 rounded-xl bg-white/60 hover:bg-white border border-white text-sm font-semibold text-wutong-dark transition-colors">
                  修改目标
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">目标体重 (kg)</label>
                  <input type="number" min="30" max="300" step="0.1" value={goalForm.targetWeight}
                    onChange={(e) => setGoalForm((p) => ({ ...p, targetWeight: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-wutong-primary/30" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">目标日期</label>
                  <input type="date" value={goalForm.targetDate}
                    onChange={(e) => setGoalForm((p) => ({ ...p, targetDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-wutong-primary/30" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSetGoal}
                    className="flex-1 py-2 rounded-xl bg-wutong-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    {hasGoal ? '保存' : '设定目标'}
                  </button>
                  {hasGoal && (
                    <button onClick={() => setEditingGoal(false)}
                      className="px-4 py-2 rounded-xl bg-white/60 border border-white text-sm text-gray-600 hover:bg-white transition-colors">
                      取消
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* ── Alerts ── */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h3 className="font-serif font-bold text-lg text-wutong-dark mb-4">提醒与预警</h3>
            <div className="space-y-3">
              {/* fixed daily reminder */}
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                <Bell size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-blue-700">每日称重提醒</div>
                  <div className="text-xs text-gray-600 mt-0.5">建议每天同一时间称重，数据更准确</div>
                </div>
              </div>
              {weightAlerts.length > 0 ? weightAlerts.map((a, i) => {
                const cfg = a.type === 'milestone'
                  ? { bg: 'bg-amber-50/60', border: 'border-amber-100', icon: <Trophy size={18} className="text-amber-500" />, titleColor: 'text-amber-700' }
                  : a.type === 'warning'
                    ? { bg: 'bg-red-50/60', border: 'border-red-100', icon: <AlertTriangle size={18} className="text-red-500" />, titleColor: 'text-red-700' }
                    : { bg: 'bg-blue-50/60', border: 'border-blue-100', icon: <Info size={18} className="text-blue-500" />, titleColor: 'text-blue-700' }
                return (
                  <div key={i} className={`${cfg.bg} p-4 rounded-2xl border ${cfg.border} flex items-start gap-3`}>
                    <span className="mt-0.5 flex-shrink-0">{cfg.icon}</span>
                    <div className={`text-sm ${cfg.titleColor}`}>{a.message}</div>
                  </div>
                )
              }) : (
                <p className="text-xs text-gray-400 text-center py-2">坚持每天记录体重，获得更精准的管理建议</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ==================== FAB ==================== */}
      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-wutong-primary text-white shadow-lg shadow-wutong-primary/30 flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <Plus size={28} />
      </motion.button>

      {/* ==================== MODAL ==================== */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif font-bold text-lg text-wutong-dark flex items-center gap-2">
                  <Scale size={20} className="text-wutong-primary" /> 记录体重
                </h3>
                <button onClick={() => { setShowModal(false); setFormErr('') }} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">体重</label>
                  <div className="relative">
                    <input type="number" min="30" max="300" step="0.1" placeholder="请输入体重"
                      value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
                      className="w-full px-4 py-2.5 pr-12 rounded-xl bg-white/60 border border-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-wutong-primary/30" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">kg</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">日期</label>
                  <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-wutong-primary/30" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">备注（可选）</label>
                  <input type="text" placeholder="如：运动后测量" value={form.note}
                    onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-wutong-primary/30" />
                </div>
                {formErr && <p className="text-xs text-red-500">{formErr}</p>}
                <button onClick={handleAddRecord}
                  className="w-full py-2.5 rounded-xl bg-wutong-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity">
                  记录
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== TOAST ==================== */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 right-8 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2">
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
