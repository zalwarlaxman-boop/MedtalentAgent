import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, ShoppingCart, Package, ExternalLink, Store,
  Heart, Brain, Activity, Scale, Watch, Pill, Moon, Salad,
  BedDouble, Dumbbell, Droplets, X, Check, ChevronRight
} from 'lucide-react'

/* ──────────────────────── 数据 ──────────────────────── */

const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'hospital', label: '医院店铺' },
  { key: 'enterprise', label: '企业店铺' },
  { key: 'featured', label: '专区精选' },
]

const GOODS = [
  // 医院店铺
  { id: 1, name: '破壁灵芝孢子粉', source: '合作医院A营养科推荐', price: 268, tag: '免疫力', category: 'hospital', icon: Pill },
  { id: 2, name: '医用级鱼油胶囊', source: '合作医院B合作', price: 198, tag: '心脑血管', category: 'hospital', icon: Heart },
  { id: 3, name: '低GI代餐粉', source: '合作医院C体重管理中心', price: 158, tag: '体重管理', category: 'hospital', icon: Scale },
  { id: 4, name: '医用弹力袜', source: '合作医院D血管外科推荐', price: 128, tag: '血管健康', category: 'hospital', icon: Activity },
  // 企业店铺
  { id: 5, name: '智能体脂秤Pro', source: '合作品牌A健康生态', price: 299, tag: '智能设备', category: 'enterprise', icon: Watch },
  { id: 6, name: '便携血压计', source: '合作品牌B官方店', price: 359, tag: '健康监测', category: 'enterprise', icon: Activity },
  { id: 7, name: '益生菌冻干粉', source: '合作品牌C健康研究所', price: 188, tag: '肠道健康', category: 'enterprise', icon: Pill },
  { id: 8, name: '褪黑素软糖', source: '合作品牌D旗舰店', price: 89, tag: '助眠', category: 'enterprise', icon: Moon },
  // 专区精选
  { id: 9, name: '有机藜麦混合谷物', source: '浙里严选', price: 68, tag: '健康饮食', category: 'featured', icon: Salad },
  { id: 10, name: '天然乳胶枕', source: '浙里严选', price: 239, tag: '睡眠改善', category: 'featured', icon: BedDouble },
  { id: 11, name: '瑜伽垫套装', source: '浙里严选', price: 129, tag: '运动装备', category: 'featured', icon: Dumbbell },
  { id: 12, name: '冷压初榨橄榄油', source: '浙里严选', price: 158, tag: '健康用油', category: 'featured', icon: Droplets },
]

const SHOPS = [
  { id: 1, name: '合作医院A健康管理店', type: 'hospital', typeLabel: '医院店', count: 15 },
  { id: 2, name: '合作医院B营养专区', type: 'hospital', typeLabel: '医院店', count: 12 },
  { id: 3, name: '合作医院C体重管理中心', type: 'hospital', typeLabel: '医院店', count: 8 },
  { id: 4, name: '合作品牌A健康生态馆', type: 'enterprise', typeLabel: '企业店', count: 25 },
  { id: 5, name: '合作品牌D官方旗舰', type: 'enterprise', typeLabel: '企业店', count: 30 },
  { id: 6, name: '浙里严选健康专区', type: 'featured', typeLabel: '专区店', count: 20 },
]

const BADGE_STYLES = {
  hospital:   { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  enterprise: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  featured:   { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
}

const BADGE_LABELS = { hospital: '医院店', enterprise: '企业店', featured: '专区店' }

/* ──────────────────────── 动画 ──────────────────────── */

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

/* ──────────────────────── Toast ──────────────────────── */

function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl bg-wutong-dark text-white text-sm font-semibold shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ──────────────────────── 外部跳转弹窗 ──────────────────────── */

function RedirectModal({ shop, onConfirm, onCancel }) {
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
        className="glass-card p-8 max-w-md w-full text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-wutong-soft flex items-center justify-center">
          <ExternalLink className="text-wutong-primary" size={28} />
        </div>
        <h3 className="font-serif text-xl font-bold text-wutong-dark mb-2">即将跳转到外部商城页面</h3>
        <p className="text-sm text-gray-600 mb-6">
          目标店铺：<span className="font-semibold text-wutong-dark">{shop}</span>
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white/60 text-sm font-semibold text-gray-600 hover:bg-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl bg-wutong-primary text-white text-sm font-semibold hover:bg-wutong-light transition-colors"
          >
            继续前往
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ──────────────────────── 商品卡片 ──────────────────────── */

function GoodCard({ item, onAddCart, onBuy }) {
  const [added, setAdded] = useState(false)
  const badge = BADGE_STYLES[item.category]
  const Icon = item.icon || Package

  const handleAdd = () => {
    if (added) return
    setAdded(true)
    onAddCart(item)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className="glass-card p-5 flex flex-col gap-3 hover:shadow-xl transition-shadow duration-300"
    >
      {/* 图标 */}
      <div className="w-12 h-12 rounded-2xl bg-wutong-soft flex items-center justify-center shrink-0">
        <Icon className="text-wutong-primary" size={24} />
      </div>

      {/* 名称 + 来源 */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-wutong-dark truncate">{item.name}</h4>
        <span className={`inline-block mt-1.5 text-[11px] px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border} font-medium`}>
          {item.source}
        </span>
      </div>

      {/* 价格 + 标签 */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-red-500">¥{item.price}</span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-wutong-soft text-wutong-primary font-medium">
          {item.tag}
        </span>
      </div>

      {/* 操作 */}
      <div className="flex gap-2 mt-auto">
        <motion.button
          whileTap={{ scale: 0.9 }}
          animate={added ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.3 }}
          onClick={handleAdd}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
            added
              ? 'bg-wutong-primary text-white'
              : 'bg-white/60 border border-white text-wutong-dark hover:bg-white'
          }`}
        >
          {added ? '已加入 ✓' : '加入购物车'}
        </motion.button>
        <button
          onClick={() => onBuy(item)}
          className="flex-1 py-2 rounded-xl bg-wutong-primary/10 text-wutong-primary text-xs font-semibold hover:bg-wutong-primary hover:text-white transition-colors flex items-center justify-center gap-1"
        >
          前往购买 <ExternalLink size={12} />
        </button>
      </div>
    </motion.div>
  )
}

/* ──────────────────────── 主组件 ──────────────────────── */

export default function Goods() {
  const [activeTab, setActiveTab] = useState('all')
  const [cartCount, setCartCount] = useState(0)
  const [redirectTarget, setRedirectTarget] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const goodsRef = useRef(null)

  const showToast = useCallback((msg) => {
    setToast({ visible: true, message: msg })
    setTimeout(() => setToast({ visible: false, message: '' }), 2500)
  }, [])

  const filtered = activeTab === 'all' ? GOODS : GOODS.filter(g => g.category === activeTab)

  const handleAddCart = () => setCartCount(c => c + 1)

  const handleBuy = (item) => setRedirectTarget(item.source)

  const handleRedirectConfirm = () => {
    setRedirectTarget(null)
    showToast('已跳转至外部页面')
  }

  const handleShopClick = (type) => {
    setActiveTab(type)
    goodsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ─── 左侧主区域 ─── */}
        <div className="lg:col-span-8 space-y-6" ref={goodsRef}>
          {/* 标题 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            <h2 className="font-serif text-2xl font-bold text-wutong-dark flex items-center gap-2">
              <ShoppingBag className="text-wutong-primary" size={22} /> 好物严选
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              精选医院营养科、知名企业及浙里严选专区好物，为您的健康生活保驾护航。
            </p>
          </motion.div>

          {/* 分类Tab */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="flex flex-wrap gap-2"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === cat.key
                    ? 'bg-wutong-primary text-white shadow-md shadow-wutong-primary/20'
                    : 'bg-white/60 text-wutong-dark hover:bg-white border border-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* 商品网格 */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={activeTab}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.map(item => (
              <GoodCard
                key={item.id}
                item={item}
                onAddCart={handleAddCart}
                onBuy={handleBuy}
              />
            ))}
          </motion.div>
        </div>

        {/* ─── 右侧面板 ─── */}
        <div className="lg:col-span-4 space-y-6">
          {/* 期间店铺 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="glass-card p-6"
          >
            <h3 className="font-serif font-bold text-lg text-wutong-dark mb-4 flex items-center gap-2">
              <Store size={18} className="text-wutong-primary" /> 期间店铺
            </h3>
            <div className="space-y-3">
              {SHOPS.map(shop => {
                const badge = BADGE_STYLES[shop.type]
                return (
                  <div key={shop.id} className="bg-white/50 border border-white p-4 rounded-2xl hover:bg-white/70 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-wutong-dark truncate">{shop.name}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} font-medium`}>
                            {shop.typeLabel}
                          </span>
                          <span className="text-[11px] text-gray-500">{shop.count} 件商品</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleShopClick(shop.type)}
                        className="shrink-0 flex items-center gap-0.5 text-xs font-semibold text-wutong-primary hover:text-wutong-dark transition-colors"
                      >
                        进入店铺 <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* 购物车摘要 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <ShoppingCart size={22} className="text-wutong-primary" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </div>
              <h3 className="font-serif font-bold text-lg text-wutong-dark">购物车</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {cartCount > 0 ? `已加入 ${cartCount} 件商品` : '购物车暂无商品'}
            </p>
            <button
              onClick={() => showToast('购物车功能即将上线')}
              className="w-full py-2.5 rounded-xl bg-wutong-primary text-white text-sm font-semibold hover:bg-wutong-light transition-colors"
            >
              去结算
            </button>
          </motion.div>
        </div>
      </div>

      {/* 弹窗 & Toast */}
      <AnimatePresence>
        {redirectTarget && (
          <RedirectModal
            shop={redirectTarget}
            onConfirm={handleRedirectConfirm}
            onCancel={() => setRedirectTarget(null)}
          />
        )}
      </AnimatePresence>
      <Toast message={toast.message} visible={toast.visible} />
    </>
  )
}
