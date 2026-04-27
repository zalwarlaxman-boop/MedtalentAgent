import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-wutong-dark">页面未找到</h2>
          <p className="text-sm text-gray-500 mt-2">该链接不存在或已被迁移。</p>
        </div>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wutong-primary text-white font-semibold hover:bg-wutong-light transition-colors">
          <ArrowLeft size={16} />
          返回总览
        </Link>
      </div>
    </div>
  )
}
