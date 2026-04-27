import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Sparkles, Heart, Activity, Dumbbell,
  X, Upload, Check, Lock, Bluetooth, Watch, ChevronRight, Scale,
  Droplets, AlertCircle, RotateCcw
} from 'lucide-react'
import { useHealthData } from '../context/HealthDataContext'
import { calculateHealthScore, calculateBMI } from '../utils/healthCalc'
import { ocrMedicalReport } from '../utils/deepseek'

// ─── Constants ─────────────────────────────────────────
const TABS = ['基础信息', '体检报告', '生活方式', '慢病史', '设备数据']

const BLOOD_TYPES = ['A', 'B', 'AB', 'O', '未知']

const EXERCISE_OPTIONS = [
  { label: '几乎不运动', value: '0' },
  { label: '偶尔', value: '1' },
  { label: '每周1-2次', value: '2' },
  { label: '每周3-5次', value: '4' },
  { label: '每天', value: '7' },
]

const DIET_OPTIONS = [
  { label: '不规律', value: '不规律' },
  { label: '基本规律', value: '基本规律' },
  { label: '非常规律', value: '非常规律' },
]

const CHRONIC_OPTIONS = ['高血压', '糖尿病', '高血脂', '冠心病', '脂肪肝', '痛风', '甲状腺疾病', '骨质疏松']

const DEVICE_LIST = [
  { name: '体脂秤', icon: Scale },
  { name: '血压计', icon: Activity },
  { name: '血糖仪', icon: Droplets },
  { name: '智能手环', icon: Watch },
]

// ─── Helpers ───────────────────────────────────────────
function scoreColor(s) {
  if (s >= 80) return '#2d6a4f'
  if (s >= 60) return '#ca8a04'
  return '#dc2626'
}

function bpStatus(sys, dia) {
  const s = Number(sys), d = Number(dia)
  if (!s || !d) return '未录入'
  if (s >= 90 && s <= 140 && d >= 60 && d <= 90) return '正常'
  return '偏高'
}

function bsStatus(v) {
  const n = Number(v)
  if (!n) return '未录入'
  if (n >= 3.9 && n <= 6.1) return '正常'
  return '异常'
}

function exerciseScore(freq) {
  const n = Number(freq)
  if (!freq && freq !== 0) return 0
  if (n >= 5) return 95
  if (n >= 3) return 75
  if (n >= 1) return 50
  return 20
}

function isOutOfRange(field, value) {
  const v = Number(value)
  if (!value || isNaN(v)) return false
  const ranges = {
    systolicBP: [90, 140],
    diastolicBP: [60, 90],
    bloodSugar: [3.9, 6.1],
    cholesterol: [0, 5.2],
    triglycerides: [0, 1.7],
    uricAcid: [155, 428],
  }
  const r = ranges[field]
  if (!r) return false
  return v < r[0] || v > r[1]
}

// ─── Toast Component ──────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="fixed top-6 right-6 z-[100] flex items-center gap-2 bg-wutong-primary text-white px-5 py-3 rounded-2xl shadow-lg"
    >
      <Check size={18} /> <span className="text-sm font-semibold">{message}</span>
    </motion.div>
  )
}

// ─── Score Ring ───────────────────────────────────────
function ScoreRing({ score }) {
  const r = 70, c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  const color = scoreColor(score)
  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <motion.circle
          cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={score}
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold font-serif" style={{ color }}
        >{score}</motion.span>
        <span className="text-xs text-gray-500 mt-1">健康评分</span>
      </div>
    </div>
  )
}

// ─── OCR Field Config ─────────────────────────────────
const OCR_FIELDS = [
  { key: 'systolicBP', label: '收缩压', unit: 'mmHg' },
  { key: 'diastolicBP', label: '舒张压', unit: 'mmHg' },
  { key: 'bloodSugar', label: '血糖', unit: 'mmol/L' },
  { key: 'cholesterol', label: '胆固醇', unit: 'mmol/L' },
  { key: 'triglycerides', label: '甘油三酯', unit: 'mmol/L' },
  { key: 'uricAcid', label: '尿酸', unit: 'μmol/L' },
]

// ─── OCR Modal ────────────────────────────────────────
function OcrModal({ onClose, onConfirm }) {
  const [preview, setPreview] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)
  const [ocrResult, setOcrResult] = useState(null)
  const inputRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result
      setPreview(base64)
      setImageBase64(base64)
    }
    reader.readAsDataURL(f)
    setDone(false)
    setError(null)
    setOcrResult(null)
  }

  const startScan = async () => {
    setScanning(true)
    setError(null)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000)
      const result = await ocrMedicalReport(imageBase64)
      clearTimeout(timeout)
      setOcrResult(result)
      setDone(true)
    } catch (err) {
      setError(err.message || '识别失败，请重试或手动录入')
    } finally {
      setScanning(false)
    }
  }

  const updateField = (key, value) => {
    setOcrResult((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <X size={20} />
        </button>
        <h3 className="font-serif text-lg font-bold text-wutong-dark mb-4">OCR 识别录入</h3>

        {!preview ? (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
            className="border-2 border-dashed border-wutong-primary/30 rounded-2xl p-10 text-center cursor-pointer hover:border-wutong-primary/60 transition-colors"
          >
            <Upload className="mx-auto text-wutong-primary/50 mb-3" size={36} />
            <p className="text-sm text-gray-600">点击或拖拽上传体检报告图片</p>
            <p className="text-xs text-gray-400 mt-1">支持 JPG / PNG</p>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-white/80">
              <img src={preview} alt="preview" className="w-full max-h-52 object-cover" />
              {scanning && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute left-0 right-0 h-1 bg-wutong-primary/80 shadow-[0_0_12px_rgba(45,106,79,0.6)] animate-[scanline_2.5s_linear_infinite]" />
                </div>
              )}
            </div>

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertCircle size={16} />
                  <span className="text-sm font-semibold">识别失败</span>
                </div>
                <p className="text-xs text-red-500 mb-3">{error}</p>
                <button onClick={startScan}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-100 text-red-600 text-sm font-semibold hover:bg-red-200 transition-colors">
                  <RotateCcw size={14} /> 重试
                </button>
              </div>
            )}

            {/* Result state */}
            {done && ocrResult ? (
              <>
                <div className="bg-wutong-soft/40 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-wutong-dark mb-1">识别结果：</p>
                  {OCR_FIELDS.map((f) => {
                    const val = ocrResult[f.key]
                    const recognized = val !== '' && val != null
                    return (
                      <div key={f.key} className="flex items-center gap-2">
                        {recognized ? (
                          <Check size={14} className="text-green-600 shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0" />
                        )}
                        <span className="text-sm text-gray-700 w-16 shrink-0">{f.label}</span>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={val || ''}
                            onChange={(e) => updateField(f.key, e.target.value)}
                            placeholder="未识别到，可手动填写"
                            className={`w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none transition-colors bg-white/80 ${
                              recognized ? 'border-green-300 focus:border-green-500' : 'border-gray-200 focus:border-wutong-primary'
                            }`}
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">{f.unit}</span>
                        </div>
                        {!recognized && (
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">未识别到</span>
                        )}
                      </div>
                    )
                  })}
                </div>
                <button onClick={() => onConfirm(ocrResult)}
                  className="w-full py-2.5 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors">
                  确认录入
                </button>
              </>
            ) : !error && (
              <button onClick={startScan} disabled={scanning}
                className="w-full py-2.5 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors disabled:opacity-60">
                {scanning ? '识别中…' : '开始识别'}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── Main Component ──────────────────────────────────
// ═══════════════════════════════════════════════════════
export default function HealthProfile() {
  const { state, dispatch, healthScore, bmi } = useHealthData()
  const profile = state.profile

  const [activeTab, setActiveTab] = useState(0)
  const [showOcr, setShowOcr] = useState(false)
  const [toast, setToast] = useState(null)

  // Local form state, synced from global
  const [basicInfo, setBasicInfo] = useState(profile.basicInfo)
  const [medical, setMedical] = useState(profile.medicalReport)
  const [lifestyle, setLifestyle] = useState(profile.lifestyle)
  const [diseases, setDiseases] = useState(profile.chronicDiseases)
  const [otherDisease, setOtherDisease] = useState('')

  // Sync when global state changes (e.g. from storage load)
  useEffect(() => { setBasicInfo(profile.basicInfo) }, [profile.basicInfo])
  useEffect(() => { setMedical(profile.medicalReport) }, [profile.medicalReport])
  useEffect(() => { setLifestyle(profile.lifestyle) }, [profile.lifestyle])
  useEffect(() => { setDiseases(profile.chronicDiseases) }, [profile.chronicDiseases])

  const showToast = useCallback((msg) => setToast(msg), [])

  const saveSection = useCallback((section, data) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: { section, data } })
    showToast('保存成功')
  }, [dispatch, showToast])

  const handleOcrConfirm = useCallback((data) => {
    setMedical(data)
    dispatch({ type: 'UPDATE_PROFILE', payload: { section: 'medicalReport', data } })
    setShowOcr(false)
    showToast('OCR 识别数据已录入')
  }, [dispatch, showToast])

  // Data completeness
  const completeness = useMemo(() => {
    const fields = [
      basicInfo.name, basicInfo.gender, basicInfo.age, basicInfo.height, basicInfo.weight, basicInfo.bloodType,
      medical.systolicBP, medical.diastolicBP, medical.bloodSugar, medical.cholesterol, medical.triglycerides, medical.uricAcid,
      lifestyle.exerciseFreq, lifestyle.sleepHours, lifestyle.dietHabit,
    ]
    const filled = fields.filter((v) => v !== '' && v !== undefined && v !== null).length
    return Math.round((filled / fields.length) * 100)
  }, [basicInfo, medical, lifestyle])

  // ── Render helpers ──
  const inputCls = (field, val) =>
    `w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors bg-white/60 ${isOutOfRange(field, val) ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-wutong-primary'}`

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

  // ═════════════════════════════════════════════════════
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ── Toast ── */}
      <AnimatePresence>{toast && <Toast message={toast} onClose={() => setToast(null)} />}</AnimatePresence>

      {/* ── OCR Modal ── */}
      <AnimatePresence>{showOcr && <OcrModal onClose={() => setShowOcr(false)} onConfirm={handleOcrConfirm} />}</AnimatePresence>

      {/* ═══════ LEFT COLUMN ═══════ */}
      <div className="lg:col-span-8 space-y-6">

        {/* ── Score Section ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreRing score={healthScore} />
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              {[
                { label: 'BMI', value: bmi.value || '--', sub: bmi.category || '未知', icon: Heart, color: 'text-rose-500' },
                { label: '血压', value: bpStatus(medical.systolicBP, medical.diastolicBP), sub: medical.systolicBP ? `${medical.systolicBP}/${medical.diastolicBP}` : '--', icon: Activity, color: 'text-blue-500' },
                { label: '血糖', value: bsStatus(medical.bloodSugar), sub: medical.bloodSugar ? `${medical.bloodSugar} mmol/L` : '--', icon: Droplets, color: 'text-amber-500' },
                { label: '运动', value: `${exerciseScore(lifestyle.exerciseFreq)}分`, sub: EXERCISE_OPTIONS.find(o => o.value === lifestyle.exerciseFreq)?.label || '未录入', icon: Dumbbell, color: 'text-emerald-500' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                  className="bg-white/50 rounded-2xl p-3 text-center border border-white/80">
                  <c.icon size={18} className={`mx-auto mb-1 ${c.color}`} />
                  <div className="text-xs text-gray-500">{c.label}</div>
                  <div className="font-bold text-sm text-wutong-dark">{c.value}</div>
                  <div className="text-[11px] text-gray-400 truncate">{c.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Tab Header ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h2 className="font-serif text-xl font-bold text-wutong-dark">健康数据录入</h2>
            <button onClick={() => setShowOcr(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-wutong-primary bg-wutong-soft/60 hover:bg-wutong-soft px-4 py-2 rounded-xl transition-colors">
              <Camera size={16} /> OCR识别录入
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1 mb-5">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setActiveTab(i)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === i ? 'bg-wutong-primary text-white' : 'text-gray-600 hover:bg-wutong-soft/50'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* ── Tab 0: 基础信息 ── */}
          {activeTab === 0 && (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
              <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-gray-600">姓名</span>
                  <input className={inputCls()} value={basicInfo.name} onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })} placeholder="请输入姓名" />
                </label>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-600">性别</span>
                  <div className="flex gap-3 mt-1">
                    {['男', '女'].map((g) => (
                      <button key={g} onClick={() => setBasicInfo({ ...basicInfo, gender: g })}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${basicInfo.gender === g ? 'bg-wutong-primary text-white' : 'bg-white/60 border border-gray-200 text-gray-600 hover:border-wutong-primary'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-gray-600">年龄</span>
                  <div className="relative">
                    <input type="number" min="1" max="150" className={inputCls()} value={basicInfo.age} onChange={(e) => setBasicInfo({ ...basicInfo, age: e.target.value })} placeholder="1-150" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">岁</span>
                  </div>
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-gray-600">身高</span>
                  <div className="relative">
                    <input type="number" min="50" max="250" className={inputCls()} value={basicInfo.height} onChange={(e) => setBasicInfo({ ...basicInfo, height: e.target.value })} placeholder="50-250" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span>
                  </div>
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-gray-600">体重</span>
                  <div className="relative">
                    <input type="number" min="20" max="500" className={inputCls()} value={basicInfo.weight} onChange={(e) => setBasicInfo({ ...basicInfo, weight: e.target.value })} placeholder="20-500" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
                  </div>
                </label>
              </motion.div>
              <motion.div variants={fadeUp}>
                <label className="space-y-1 inline-block">
                  <span className="text-xs font-semibold text-gray-600">血型</span>
                  <select className={inputCls() + ' pr-8'} value={basicInfo.bloodType} onChange={(e) => setBasicInfo({ ...basicInfo, bloodType: e.target.value })}>
                    <option value="">请选择</option>
                    {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b}型</option>)}
                  </select>
                </label>
              </motion.div>
              <motion.div variants={fadeUp} className="pt-2">
                <button onClick={() => saveSection('basicInfo', basicInfo)}
                  className="px-8 py-2.5 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors">
                  保存
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ── Tab 1: 体检报告 ── */}
          {activeTab === 1 && (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
              {[
                { key: 'systolicBP', label: '收缩压', unit: 'mmHg', hint: '正常 90-140' },
                { key: 'diastolicBP', label: '舒张压', unit: 'mmHg', hint: '正常 60-90' },
                { key: 'bloodSugar', label: '空腹血糖', unit: 'mmol/L', hint: '正常 3.9-6.1' },
                { key: 'cholesterol', label: '总胆固醇', unit: 'mmol/L', hint: '正常 <5.2' },
                { key: 'triglycerides', label: '甘油三酯', unit: 'mmol/L', hint: '正常 <1.7' },
                { key: 'uricAcid', label: '尿酸', unit: 'μmol/L', hint: '男 208-428，女 155-357' },
              ].map((f) => (
                <motion.div key={f.key} variants={fadeUp} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600">{f.label}</span>
                    <span className="text-[11px] text-gray-400">{f.hint}</span>
                  </div>
                  <div className="relative">
                    <input type="number" className={inputCls(f.key, medical[f.key])}
                      value={medical[f.key]} onChange={(e) => setMedical({ ...medical, [f.key]: e.target.value })} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{f.unit}</span>
                  </div>
                  {isOutOfRange(f.key, medical[f.key]) && (
                    <p className="text-xs text-red-500 flex items-center gap-1">⚠ 该指标超出正常范围，请关注</p>
                  )}
                </motion.div>
              ))}
              <motion.div variants={fadeUp} className="pt-2">
                <button onClick={() => saveSection('medicalReport', medical)}
                  className="px-8 py-2.5 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors">
                  保存
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ── Tab 2: 生活方式 ── */}
          {activeTab === 2 && (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
              <motion.div variants={fadeUp} className="space-y-2">
                <span className="text-xs font-semibold text-gray-600">运动频率</span>
                <div className="flex flex-wrap gap-2">
                  {EXERCISE_OPTIONS.map((o) => (
                    <button key={o.value} onClick={() => setLifestyle({ ...lifestyle, exerciseFreq: o.value })}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${lifestyle.exerciseFreq === o.value ? 'bg-wutong-primary text-white' : 'bg-white/60 border border-gray-200 text-gray-600 hover:border-wutong-primary'}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="space-y-2">
                <span className="text-xs font-semibold text-gray-600">平均睡眠时长</span>
                <div className="flex items-center gap-3">
                  <input type="range" min="4" max="12" step="0.5" value={lifestyle.sleepHours || 7}
                    onChange={(e) => setLifestyle({ ...lifestyle, sleepHours: e.target.value })}
                    className="flex-1 accent-wutong-primary" />
                  <span className="text-sm font-bold text-wutong-dark w-16 text-center">{lifestyle.sleepHours || 7} 小时</span>
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="space-y-2">
                <span className="text-xs font-semibold text-gray-600">饮食习惯</span>
                <div className="flex flex-wrap gap-2">
                  {DIET_OPTIONS.map((o) => (
                    <button key={o.value} onClick={() => setLifestyle({ ...lifestyle, dietHabit: o.value })}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${lifestyle.dietHabit === o.value ? 'bg-wutong-primary text-white' : 'bg-white/60 border border-gray-200 text-gray-600 hover:border-wutong-primary'}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="flex gap-6">
                {[
                  { key: 'smoking', label: '吸烟' },
                  { key: 'drinking', label: '饮酒' },
                ].map((s) => (
                  <div key={s.key} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-600">{s.label}</span>
                    <button onClick={() => setLifestyle({ ...lifestyle, [s.key]: !lifestyle[s.key] })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${lifestyle[s.key] ? 'bg-wutong-primary' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${lifestyle[s.key] ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                    <span className="text-xs text-gray-500">{lifestyle[s.key] ? '是' : '否'}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} className="pt-2">
                <button onClick={() => saveSection('lifestyle', lifestyle)}
                  className="px-8 py-2.5 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors">
                  保存
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ── Tab 3: 慢病史 ── */}
          {activeTab === 3 && (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                {CHRONIC_OPTIONS.map((d) => {
                  const selected = diseases.includes(d)
                  return (
                    <button key={d} onClick={() => setDiseases(selected ? diseases.filter((x) => x !== d) : [...diseases, d])}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${selected ? 'bg-wutong-primary text-white' : 'bg-white/60 border border-gray-200 text-gray-600 hover:border-wutong-primary'}`}>
                      {d}
                    </button>
                  )
                })}
              </motion.div>
              <motion.div variants={fadeUp} className="space-y-1">
                <span className="text-xs font-semibold text-gray-600">其他（可自行补充）</span>
                <div className="flex gap-2">
                  <input className={inputCls()} value={otherDisease} onChange={(e) => setOtherDisease(e.target.value)} placeholder="输入其他疾病名称" />
                  <button onClick={() => {
                    if (otherDisease.trim() && !diseases.includes(otherDisease.trim())) {
                      setDiseases([...diseases, otherDisease.trim()])
                      setOtherDisease('')
                    }
                  }} className="px-4 py-2 rounded-xl bg-wutong-soft text-wutong-primary font-semibold text-sm hover:bg-wutong-soft/80 transition-colors whitespace-nowrap">
                    添加
                  </button>
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="pt-2">
                <button onClick={() => saveSection('chronicDiseases', diseases)}
                  className="px-8 py-2.5 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors">
                  保存
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ── Tab 4: 设备数据 ── */}
          {activeTab === 4 && (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
              <motion.div variants={fadeUp} className="text-center py-6">
                <Bluetooth size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 font-semibold">暂未连接可穿戴设备</p>
                <p className="text-xs text-gray-400 mt-1">连接设备后数据将自动同步</p>
              </motion.div>
              <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DEVICE_LIST.map((d) => (
                  <div key={d.name} className="bg-white/50 rounded-2xl p-4 text-center border border-white/80">
                    <d.icon size={24} className="mx-auto text-wutong-primary/50 mb-2" />
                    <p className="text-xs font-semibold text-gray-600">{d.name}</p>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} className="text-center">
                <Link to="/hospital"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors">
                  去连接 <ChevronRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ═══════ RIGHT COLUMN ═══════ */}
      <div className="lg:col-span-4 space-y-6">
        {/* Data Security */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-wutong-primary text-white flex items-center justify-center shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-wutong-dark">数据安全与隐私</div>
              <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">所有健康数据均加密存储在本地浏览器中，不上传至任何服务器，您拥有完全的数据控制权。</div>
            </div>
          </div>
        </motion.div>

        {/* AI Driver */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-wutong-soft text-wutong-primary flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-wutong-dark">画像驱动智能体</div>
              <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">健康画像越完整，智能体推荐越精准。每一次更新都会影响方案匹配与提醒策略。</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link to="/interaction" className="text-center py-2 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors text-sm">
              去提问
            </Link>
            <Link to="/tracking/agents" className="text-center py-2 rounded-xl bg-white/60 hover:bg-white text-wutong-dark font-semibold border border-white transition-colors text-sm">
              看集群
            </Link>
          </div>
        </motion.div>

        {/* Data Completeness */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="glass-card p-6">
          <div className="text-sm font-bold text-wutong-dark mb-3">数据完整度</div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-wutong-primary"
              initial={{ width: 0 }} animate={{ width: `${completeness}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">已填写字段</span>
            <span className="text-sm font-bold text-wutong-primary">{completeness}%</span>
          </div>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            完善更多健康数据，可获得更精准的健康评估和个性化建议。
          </p>
        </motion.div>
      </div>

      {/* Scanline animation */}
      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  )
}
