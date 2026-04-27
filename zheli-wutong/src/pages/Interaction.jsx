import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Mic, Send, Sparkles, User, Trash2, MessageSquare, Image, MicOff, X, RefreshCw } from 'lucide-react'
import { useHealthData } from '../context/HealthDataContext'
import { healthChatStream } from '../utils/deepseek'
import Tesseract from 'tesseract.js'
import ReactMarkdown from 'react-markdown'

const markdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-bold mb-1.5 mt-2">{children}</h3>,
  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, inline }) =>
    inline ? (
      <code className="bg-black/10 rounded px-1 py-0.5 text-xs font-mono">{children}</code>
    ) : (
      <pre className="bg-black/10 rounded-lg p-3 my-2 overflow-x-auto">
        <code className="text-xs font-mono">{children}</code>
      </pre>
    ),
  hr: () => <hr className="my-3 border-white/20" />,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-wutong-accent underline hover:text-wutong-light">
      {children}
    </a>
  ),
}

const QUICK_SUGGESTIONS = [
  '我的体重最近波动大怎么办？',
  '帮我分析一下饮食方案',
  '如何改善睡眠质量？',
  '推荐适合我的运动方式',
]

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function isToday(ts) {
  if (!ts) return false
  const d = new Date(ts)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

// ============ 消息气泡组件 ============
function MessageBubble({ message, index }) {
  const isUser = message.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* 头像 */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
          isUser
            ? 'bg-wutong-primary text-white'
            : 'bg-gradient-to-br from-wutong-accent to-wutong-light text-white'
        }`}
      >
        {isUser ? <User size={16} /> : <Sparkles size={16} />}
      </div>

      {/* 气泡 */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-wutong-primary text-white rounded-br-md'
              : 'bg-white/80 border border-white text-wutong-dark rounded-bl-md shadow-sm'
          }`}
        >
          {message.type === 'image' ? (
            <img src={message.content} alt="用户上传" className="max-w-[240px] rounded-xl" />
          ) : isUser ? (
            <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
          ) : (
            <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
          )}
        </div>
        <div className={`text-[11px] text-gray-400 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </motion.div>
  )
}

// ============ 打字指示器 ============
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex gap-3"
    >
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-wutong-accent to-wutong-light text-white flex items-center justify-center shrink-0">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
          <Sparkles size={16} />
        </motion.div>
      </div>
      <div className="px-4 py-3 rounded-2xl bg-white/80 border border-white rounded-bl-md shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-wutong-accent"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
            />
          ))}
          <span className="text-xs text-gray-400 ml-2">{window.__ocrStatus || '正在思考...'}</span>
        </div>
      </div>
    </motion.div>
  )
}

// ============ 流式消息气泡 ============
function StreamingBubble({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="flex gap-3 flex-row"
    >
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-wutong-accent to-wutong-light text-white flex items-center justify-center shrink-0">
        <Sparkles size={16} />
      </div>
      <div className="max-w-[75%] items-start">
        <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed bg-white/80 border border-white text-wutong-dark rounded-bl-md shadow-sm">
          <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
          <motion.span
            className="inline-block w-0.5 h-4 bg-wutong-accent ml-0.5 align-middle"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ============ 错误消息气泡 ============
function ErrorBubble({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="flex gap-3 flex-row"
    >
      <div className="w-9 h-9 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
        <X size={16} />
      </div>
      <div className="max-w-[75%] items-start">
        <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed bg-red-50 border border-red-100 text-red-600 rounded-bl-md shadow-sm">
          <span>{message}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="ml-3 inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors"
            >
              <RefreshCw size={12} />
              重试
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ============ 欢迎界面 ============
function WelcomeView() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-wutong-accent to-wutong-primary flex items-center justify-center mb-5 shadow-lg shadow-wutong-accent/20">
        <Sparkles size={28} className="text-white" />
      </div>
      <h3 className="font-serif text-xl font-bold text-wutong-dark mb-2">你好，我是你的健康助手</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
        支持文字、语音、图片多模态交流。
        <br />
        随时向我咨询健康相关问题。
      </p>
    </div>
  )
}

// ============ 确认弹窗 ============
function ConfirmDialog({ open, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-[90%]"
          >
            <h4 className="font-serif font-bold text-lg text-wutong-dark mb-2">清空对话</h4>
            <p className="text-sm text-gray-500 mb-5">确定要清空所有对话记录吗？此操作不可恢复。</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors">
                取消
              </button>
              <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm bg-red-500 text-white hover:bg-red-600 transition-colors">
                确认清空
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============ 主组件 ============
export default function Interaction() {
  const { state, dispatch } = useHealthData()
  const location = useLocation()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [lastFailedMessage, setLastFailedMessage] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)
  const streamingTextRef = useRef('')

  const { chatMessages } = state

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, isTyping, streamingText, scrollToBottom])

  // textarea 自适应高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  // 调用 AI 获取回复
  const callAI = useCallback(
    async (userText) => {
      setIsLoading(true)
      setIsTyping(true)
      setErrorMessage('')
      setLastFailedMessage(null)
      streamingTextRef.current = ''
      setStreamingText('')

      try {
        // 构建 chatHistory：从全局状息中取最近对话，过滤图片消息
        const chatHistory = state.chatMessages
          .filter((m) => m.type !== 'image')
          .map((m) => ({ role: m.role, content: m.content }))

        // 开始流式接收前，先切换到流式显示（隐藏 typing indicator）
        setIsTyping(false)

        const fullReply = await healthChatStream(
          chatHistory,
          userText,
          (chunk) => {
            streamingTextRef.current += chunk
            setStreamingText(streamingTextRef.current)
          },
          state.profile,
        )

        // 流式完成，保存完整回复到全局状态
        setStreamingText('')
        streamingTextRef.current = ''
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'assistant', content: fullReply, type: 'text' } })
      } catch (err) {
        console.error('AI 回复失败:', err)
        setStreamingText('')
        streamingTextRef.current = ''
        setErrorMessage('抱歉，网络连接出现问题，请稍后再试。')
        setLastFailedMessage(userText)
      } finally {
        setIsTyping(false)
        setIsLoading(false)
      }
    },
    [state.chatMessages, state.profile, dispatch],
  )

  // 发送消息
  const sendMessage = useCallback(
    (content, type = 'text') => {
      if (isLoading) return
      if (!content.trim() && type === 'text') return

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'user', content, type } })
      setInput('')
      setErrorMessage('')

      // 确定发给 AI 的文本
      const userText = type === 'image' ? '用户发送了一张图片，请根据健康管理的角度给出建议。' : content
      callAI(userText)
    },
    [dispatch, callAI, isLoading],
  )

  // 重试
  const handleRetry = useCallback(() => {
    if (!lastFailedMessage) return
    setErrorMessage('')
    callAI(lastFailedMessage)
  }, [lastFailedMessage, callAI])

  // 键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // 语音录制模拟
  const handleVoice = () => {
    if (isRecording || isLoading) return
    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
      sendMessage('我最近体重有点上升，该怎么办？')
    }, 3000)
  }

  // 图片上传 — OCR 识别后发送文字给 AI
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || isLoading) return
    e.target.value = ''

    const reader = new FileReader()
    reader.onload = async (ev) => {
      const imageBase64 = ev.target.result

      // 1. 先将图片消息添加到聊天列表（保持图片预览显示）
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'user', content: imageBase64, type: 'image' } })
      setInput('')
      setErrorMessage('')

      // 2. 进入 loading 状态，显示 OCR 识别进度
      setIsLoading(true)
      setIsTyping(true)
      setLastFailedMessage(null)
      streamingTextRef.current = ''
      setStreamingText('')
      window.__ocrStatus = '正在识别图片内容...'

      try {
        // 3. 调用 Tesseract OCR 识别（v7 显式指定中文语言包路径）
        const worker = await Tesseract.createWorker('chi_sim+eng', 1, {
          langPath: 'https://tessdata.projectnaptha.com/4.0.0',
          logger: (info) => {
            if (info.status === 'recognizing text' && typeof info.progress === 'number') {
              window.__ocrStatus = `图片识别中 ${Math.round(info.progress * 100)}%...`
              // 触发重渲染
              setIsTyping(true)
            }
          },
        })

        let ocrText = ''
        try {
          const { data: { text } } = await worker.recognize(imageBase64)
          ocrText = (text || '').trim()
        } finally {
          await worker.terminate()
        }

        if (!ocrText) {
          // 4a. 未识别到文字 — fallback 提示，不调用 API
          window.__ocrStatus = ''
          setIsTyping(false)
          setIsLoading(false)
          dispatch({
            type: 'ADD_CHAT_MESSAGE',
            payload: {
              role: 'assistant',
              content:
                '我已尝试识别您上传的图片，但未能识别到有效文字内容。如果这是体检报告，建议您前往【健康画像】页面使用专业的 OCR 识别功能。如果是其他类型的图片，请用文字描述您的问题，我会尽力帮助您。',
              type: 'text',
            },
          })
          return
        }

        // 4b. 识别到文字 — 构造提示词发给 DeepSeek
        window.__ocrStatus = 'AI 分析中...'
        setIsTyping(false) // 关闭 typing indicator，开始流式输出

        const userText = `用户上传了一张图片，以下是图片中识别到的文字内容：\n${ocrText}\n\n请根据图片中的内容，为用户提供健康相关的分析和建议。`

        const chatHistory = state.chatMessages
          .filter((m) => m.type !== 'image')
          .map((m) => ({ role: m.role, content: m.content }))

        const fullReply = await healthChatStream(
          chatHistory,
          userText,
          (chunk) => {
            streamingTextRef.current += chunk
            setStreamingText(streamingTextRef.current)
          },
          state.profile,
        )

        setStreamingText('')
        streamingTextRef.current = ''
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'assistant', content: fullReply, type: 'text' } })
      } catch (err) {
        console.error('图片处理失败:', err)
        setStreamingText('')
        streamingTextRef.current = ''
        if (err?.message?.toLowerCase().includes('tesseract') || err?.name === 'TesseractError') {
          setErrorMessage('图片识别失败，请尝试上传更清晰的图片，或用文字描述您的问题。')
        } else {
          setErrorMessage('抱歉，网络连接出现问题，请稍后再试。')
          setLastFailedMessage(null)
        }
      } finally {
        window.__ocrStatus = ''
        setIsTyping(false)
        setIsLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  // 清空对话
  const handleClearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' })
    setShowClearConfirm(false)
    setErrorMessage('')
    setLastFailedMessage(null)
    setStreamingText('')
    streamingTextRef.current = ''
  }

  // 从 Dashboard 跳转时自动发送携带的消息（useRef 防止 StrictMode 双重执行）
  const initialSentRef = useRef(false)
  useEffect(() => {
    const msg = location.state?.initialMessage
    if (msg && !initialSentRef.current) {
      initialSentRef.current = true
      // 清除 location state 防止刷新后重复发送
      window.history.replaceState({}, '')
      // 自动发送消息
      sendMessage(msg)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 统计
  const totalMessages = chatMessages.length
  const todayMessages = chatMessages.filter((m) => isToday(m.timestamp)).length

  return (
    <>
      <ConfirmDialog open={showClearConfirm} onConfirm={handleClearChat} onCancel={() => setShowClearConfirm(false)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ====== 左侧聊天区 ====== */}
        <div className="lg:col-span-8 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card flex flex-col"
            style={{ height: 'calc(100vh - 160px)', minHeight: '520px' }}
          >
            {/* 标题栏 */}
            <div className="px-6 pt-5 pb-3 border-b border-white/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wutong-accent to-wutong-primary flex items-center justify-center shadow-md">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-wutong-dark">互动空间</h2>
                  <p className="text-xs text-gray-400">支持文字 · 语音 · 图片多模态对话</p>
                </div>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
              {chatMessages.length === 0 && !streamingText && !errorMessage ? (
                <WelcomeView />
              ) : (
                chatMessages.map((msg, i) => <MessageBubble key={msg.id} message={msg} index={i} />)
              )}
              <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
              {streamingText && <StreamingBubble text={streamingText} />}
              {errorMessage && <ErrorBubble message={errorMessage} onRetry={lastFailedMessage ? handleRetry : null} />}
              <div ref={messagesEndRef} />
            </div>

            {/* 快速建议 */}
            {chatMessages.length === 0 && (
              <div className="px-6 pb-2 shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage(s)}
                      className="text-xs px-4 py-2 rounded-full bg-wutong-soft/60 border border-wutong-primary/10 text-wutong-primary whitespace-nowrap hover:bg-wutong-soft transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 输入区域 */}
            <div className="px-6 pb-5 pt-3 border-t border-white/40 shrink-0">
              {/* 录音状态 */}
              <AnimatePresence>
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-center gap-2 pb-3"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-3 h-3 rounded-full bg-red-500"
                    />
                    <span className="text-sm text-red-500 font-medium">正在聆听...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isLoading ? 'AI 正在回复中...' : '输入健康问题，Shift+Enter 换行...'}
                    rows={1}
                    disabled={isLoading}
                    className={`w-full bg-white/60 border border-white rounded-2xl py-3 pl-4 pr-4 text-sm text-wutong-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-wutong-accent/30 focus:bg-white/80 backdrop-blur-sm transition-all resize-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ maxHeight: '120px' }}
                  />
                </div>

                {/* 图片按钮 */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 rounded-full bg-white/60 border border-white hover:bg-wutong-soft/50 flex items-center justify-center transition-colors text-gray-500 hover:text-wutong-primary shrink-0"
                  title="上传图片"
                >
                  <Camera size={18} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* 语音按钮 */}
                <button
                  type="button"
                  onClick={handleVoice}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                    isRecording
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-white/60 border border-white hover:bg-wutong-soft/50 text-gray-500 hover:text-wutong-primary'
                  }`}
                  title={isRecording ? '录音中' : '语音输入'}
                >
                  {isRecording ? (
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                      <MicOff size={18} />
                    </motion.div>
                  ) : (
                    <Mic size={18} />
                  )}
                </button>

                {/* 发送按钮 */}
                <button
                  type="button"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    input.trim() && !isLoading
                      ? 'bg-wutong-primary text-white shadow-lg shadow-wutong-primary/30 hover:bg-wutong-light'
                      : 'bg-white/40 text-gray-300 border border-white/60 cursor-not-allowed'
                  }`}
                  title="发送"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ====== 右侧功能面板 ====== */}
        <div className="lg:col-span-4 space-y-6">
          {/* 能力说明 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-6">
            <h3 className="font-serif font-bold text-lg text-wutong-dark mb-4">交互方式</h3>
            <div className="space-y-3">
              {[
                { icon: MessageSquare, title: '文字对话', desc: '直接输入问题，获取个性化健康建议。', color: 'bg-wutong-primary' },
                { icon: Mic, title: '语音输入', desc: '点击麦克风按钮，语音转文字智能对话。', color: 'bg-wutong-accent' },
                { icon: Image, title: '图片识别', desc: '上传食物/体检报告照片，AI智能解读。', color: 'bg-wutong-light' },
              ].map((it) => (
                <div key={it.title} className="flex items-start gap-3 bg-white/50 p-4 rounded-2xl border border-white">
                  <div className={`w-9 h-9 rounded-xl ${it.color} text-white flex items-center justify-center shrink-0`}>
                    <it.icon size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-wutong-dark">{it.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{it.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 对话统计 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-6">
            <h3 className="font-serif font-bold text-lg text-wutong-dark mb-4">对话统计</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-wutong-soft/40 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-wutong-primary">{totalMessages}</div>
                <div className="text-xs text-gray-500 mt-1">总消息数</div>
              </div>
              <div className="bg-wutong-soft/40 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-wutong-accent">{todayMessages}</div>
                <div className="text-xs text-gray-500 mt-1">今日消息</div>
              </div>
            </div>
          </motion.div>

          {/* 清空对话 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="glass-card p-6">
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              disabled={chatMessages.length === 0}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors ${
                chatMessages.length > 0
                  ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100'
                  : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
              }`}
            >
              <Trash2 size={16} />
              清空对话记录
            </button>
          </motion.div>
        </div>
      </div>
    </>
  )
}
