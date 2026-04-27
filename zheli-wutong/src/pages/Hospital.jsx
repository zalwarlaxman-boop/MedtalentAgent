import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Stethoscope, Scale, Activity, Droplets, Watch,
  AlertTriangle, Brain, Bell, ChevronDown, ChevronUp,
  ExternalLink, X, RefreshCw, Loader2, Shield, Wifi,
  CheckCircle2, CircleDot
} from 'lucide-react'

/* ─── 数据 ─── */
const hospitals = [
  { id: 1, name: '合作医院A', level: '三甲综合', departments: ['内分泌科', '心内科', '营养科'], feature: '代谢病综合管理', color: 'blue' },
  { id: 2, name: '合作医院B', level: '三甲综合', departments: ['全科', '体检中心', '康复科'], feature: '健康管理中心', color: 'blue' },
  { id: 3, name: '合作医院C', level: '三甲综合', departments: ['内分泌科', '运动医学科'], feature: '体重管理专科', color: 'blue' },
  { id: 4, name: '合作医院D', level: '三甲中医', departments: ['治未病中心', '中医内科'], feature: '中西医结合', color: 'amber' },
  { id: 5, name: '合作医院E', level: '三甲综合', departments: ['心理科', '睡眠医学中心'], feature: '睡眠障碍', color: 'blue' },
  { id: 6, name: '合作医院F', level: '三甲中医', departments: ['针灸科', '推拿科', '营养门诊'], feature: '传统养生', color: 'amber' },
]

const deviceList = [
  { key: 'scale', name: '智能体脂秤', Icon: Scale, metrics: ['体重', '体脂率', 'BMI'], syncInfo: '上次同步 2小时前', syncData: '体重 72.5kg / 体脂率 22.3%' },
  { key: 'bp', name: '电子血压计', Icon: Activity, metrics: ['收缩压', '舒张压', '心率'], syncInfo: '上次同步 5小时前', syncData: '125/78 mmHg / 心率 72bpm' },
  { key: 'glucose', name: '血糖仪', Icon: Droplets, metrics: ['空腹血糖', '餐后血糖'], syncInfo: '上次同步 1天前', syncData: '空腹 5.2 mmol/L' },
  { key: 'band', name: '智能手环', Icon: Watch, metrics: ['心率', '步数', '睡眠时长'], syncInfo: '实时同步中', syncData: '今日 8,523 步 / 心率 68bpm' },
]

const alertSteps = [
  { Icon: AlertTriangle, title: '设备检测异常', desc: '物联设备检测到异常健康数据（如血压突升）', color: 'text-orange-500', bg: 'bg-orange-50' },
  { Icon: Brain, title: '平台智能分析', desc: 'AI分析异常原因，评估风险等级，生成干预建议', color: 'text-blue-500', bg: 'bg-blue-50' },
  { Icon: Bell, title: '推送通知干预', desc: '即时推送预警通知，推荐就医方案，必要时连接互联网医院', color: 'text-wutong-primary', bg: 'bg-wutong-soft' },
]

/* ─── 动画 ─── */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }
const fadeLeft = { hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0, transition: { duration: 0.45 } } }

/* ─── Toast ─── */
function Toast({ message, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl bg-wutong-dark text-white shadow-xl flex items-center gap-2 text-sm font-medium"
    >
      <CheckCircle2 size={16} /> {message}
    </motion.div>
  )
}

/* ─── 跳转确认弹窗 ─── */
function RedirectModal({ hospital, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card p-8 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Stethoscope size={22} className="text-white" />
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <h3 className="font-serif text-lg font-bold text-wutong-dark mb-2">即将离开浙里梧桐</h3>
        <p className="text-sm text-gray-600 mb-4">您即将前往 <span className="font-semibold text-wutong-dark">{hospital.name}</span> 互联网医院</p>
        <div className="flex items-center gap-2 text-xs text-wutong-primary bg-wutong-soft/60 rounded-xl px-3 py-2 mb-6">
          <Shield size={14} /> 该医院已通过平台合作认证
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">取消</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-wutong-primary text-white text-sm font-semibold hover:bg-wutong-light transition-colors flex items-center justify-center gap-1.5">
            <ExternalLink size={14} /> 继续前往
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── 断开确认弹窗 ─── */
function DisconnectModal({ device, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card p-7 max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="font-serif text-lg font-bold text-wutong-dark mb-2">断开设备</h3>
        <p className="text-sm text-gray-600 mb-5">确定要断开 <span className="font-semibold text-wutong-dark">{device.name}</span> 吗？断开后将停止数据同步。</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">取消</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">确认断开</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── 医院卡片 ─── */
function HospitalCard({ hospital, index, onRedirect }) {
  const [expanded, setExpanded] = useState(false)
  const levelBadge = hospital.color === 'amber'
    ? 'bg-amber-100 text-amber-700 border-amber-200'
    : 'bg-blue-100 text-blue-700 border-blue-200'

  return (
    <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }} className="glass-card p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
          <Stethoscope size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-serif font-bold text-wutong-dark text-base">{hospital.name}</h4>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${levelBadge}`}>{hospital.level}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {hospital.departments.map(d => (
              <span key={d} className="text-[11px] px-2 py-0.5 rounded-full bg-wutong-soft/70 text-wutong-primary font-medium">{d}</span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">特色：{hospital.feature}</p>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-3 rounded-xl bg-wutong-soft/30 text-xs text-gray-600 leading-relaxed space-y-1">
                  <p>📍 地址：杭州市（模拟地址）</p>
                  <p>🕐 互联网医院服务时间：8:00 - 21:00</p>
                  <p>📋 支持在线复诊、处方开具、药品配送</p>
                  <p>🔗 已与浙里梧桐健康画像数据互通</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onRedirect(hospital)}
              className="px-3.5 py-1.5 rounded-xl bg-wutong-primary text-white text-xs font-semibold hover:bg-wutong-light transition-colors flex items-center gap-1"
            >
              <ExternalLink size={12} /> 进入互联网医院
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-3.5 py-1.5 rounded-xl bg-white/70 border border-white text-xs font-semibold text-wutong-dark hover:bg-white transition-colors flex items-center gap-1"
            >
              {expanded ? <><ChevronUp size={12} /> 收起</> : <><ChevronDown size={12} /> 查看详情</>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── 设备卡片 ─── */
function DeviceCard({ device, connected, connecting, onToggle }) {
  const { Icon, name, metrics, syncInfo, syncData } = device
  return (
    <motion.div variants={fadeUp} className="bg-white/50 border border-white/80 p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${connected ? 'bg-wutong-soft text-wutong-primary' : 'bg-gray-100 text-gray-400'} transition-colors`}>
            <Icon size={16} />
          </div>
          <div>
            <div className="text-sm font-bold text-wutong-dark">{name}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <CircleDot size={8} className={connected ? 'text-green-500' : 'text-gray-300'} />
              <span className={`text-[10px] ${connected ? 'text-green-600' : 'text-gray-400'}`}>{connected ? '已连接' : '未连接'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onToggle}
          disabled={connecting}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            connecting
              ? 'bg-gray-100 text-gray-400 cursor-wait'
              : connected
                ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100'
                : 'bg-wutong-primary text-white hover:bg-wutong-light'
          }`}
        >
          {connecting ? <Loader2 size={14} className="animate-spin" /> : connected ? '断开' : '连接'}
        </button>
      </div>
      <div className="flex flex-wrap gap-1 mb-1">
        {metrics.map(m => (
          <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-500">{m}</span>
        ))}
      </div>
      <AnimatePresence>
        {connected && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-2 pt-2 border-t border-dashed border-gray-200 text-[11px] text-gray-500 space-y-0.5">
              <p>{syncInfo}</p>
              <p className="font-medium text-wutong-dark">{syncData}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── 主组件 ─── */
export default function Hospital() {
  // 设备状态
  const [devices, setDevices] = useState({ scale: true, bp: true, glucose: false, band: true })
  const [connecting, setConnecting] = useState({})
  const [disconnectTarget, setDisconnectTarget] = useState(null)

  // 弹窗 & toast
  const [redirectHospital, setRedirectHospital] = useState(null)
  const [toast, setToast] = useState(null)
  const [syncing, setSyncing] = useState(false)

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }, [])

  const connectedCount = Object.values(devices).filter(Boolean).length

  // 设备连接
  const handleConnect = (key) => {
    setConnecting(p => ({ ...p, [key]: true }))
    setTimeout(() => {
      setDevices(p => ({ ...p, [key]: true }))
      setConnecting(p => ({ ...p, [key]: false }))
      showToast('设备连接成功')
    }, 1000)
  }

  const handleDisconnect = (key) => {
    setDevices(p => ({ ...p, [key]: false }))
    setDisconnectTarget(null)
    showToast('设备已断开')
  }

  const toggleDevice = (key) => {
    if (devices[key]) {
      setDisconnectTarget(deviceList.find(d => d.key === key))
    } else {
      handleConnect(key)
    }
  }

  // 全量同步
  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => { setSyncing(false); showToast('同步完成') }, 2000)
  }

  // 医院跳转
  const confirmRedirect = () => {
    setRedirectHospital(null)
    showToast('正在跳转至互联网医院...')
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── 左侧主区域 ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* 页面标题 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border-t-4 border-t-blue-400">
            <h2 className="font-serif text-2xl font-bold text-wutong-dark flex items-center gap-2">
              <Stethoscope className="text-blue-500" size={22} /> 物联网医院入口
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              链接合作互联网医院，体征数据异常自动预警并直通在线问诊，为健康管理提供临床保障。
            </p>
          </motion.div>

          {/* 医院列表 */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
            {hospitals.map((h, i) => (
              <HospitalCard key={h.id} hospital={h} index={i} onRedirect={setRedirectHospital} />
            ))}
          </motion.div>

          {/* 异常预警流程 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h3 className="font-serif font-bold text-lg text-wutong-dark mb-5 flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" /> 智能预警流程
            </h3>
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-0">
              {alertSteps.map((step, i) => (
                <motion.div key={step.title} variants={fadeLeft}>
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full ${step.bg} ${step.color} flex items-center justify-center shrink-0`}>
                        <step.Icon size={18} />
                      </div>
                      {i < alertSteps.length - 1 && <div className="w-0.5 h-8 bg-gray-200 my-1" />}
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-bold text-wutong-dark">{step.title}</div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* 模拟预警 */}
            <div className="mt-4 p-4 rounded-2xl border-2 border-orange-300 bg-orange-50/60">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-sm mb-1">
                <AlertTriangle size={14} /> 模拟预警
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                检测到血压 <span className="font-bold text-red-600">155/95mmHg</span>，高于正常范围。建议：休息15分钟后复测，如持续偏高请就医。
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── 右侧面板 ── */}
        <div className="lg:col-span-4 space-y-6">
          {/* 物联设备管理 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wifi size={18} className="text-wutong-primary" />
              <h3 className="font-serif font-bold text-base text-wutong-dark">物联设备管理</h3>
            </div>
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
              {deviceList.map(d => (
                <DeviceCard
                  key={d.key}
                  device={d}
                  connected={devices[d.key]}
                  connecting={connecting[d.key]}
                  onToggle={() => toggleDevice(d.key)}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* 数据同步状态 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="font-serif font-bold text-base text-wutong-dark mb-3 flex items-center gap-2">
              <RefreshCw size={16} className="text-wutong-primary" /> 数据同步状态
            </h3>
            <div className="bg-wutong-soft/40 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">已连接设备</span>
                <span className="text-lg font-bold text-wutong-primary">{connectedCount} 台</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">上次全量同步</span>
                <span className="text-xs text-gray-500">今日 09:30</span>
              </div>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full py-2.5 rounded-xl bg-wutong-primary text-white text-sm font-semibold hover:bg-wutong-light transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {syncing ? <><Loader2 size={14} className="animate-spin" /> 同步中...</> : <><RefreshCw size={14} /> 立即同步</>}
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── 弹窗 & Toast ── */}
      <AnimatePresence>
        {redirectHospital && (
          <RedirectModal hospital={redirectHospital} onConfirm={confirmRedirect} onCancel={() => setRedirectHospital(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {disconnectTarget && (
          <DisconnectModal device={disconnectTarget} onConfirm={() => handleDisconnect(disconnectTarget.key)} onCancel={() => setDisconnectTarget(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && <Toast message={toast} />}
      </AnimatePresence>
    </>
  )
}
