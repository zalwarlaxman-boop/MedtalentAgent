// DeepSeek API 服务
import Tesseract from 'tesseract.js'

// API 配置
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
// 开发环境用代理，生产环境直连
const BASE_URL = import.meta.env.DEV ? '/api/deepseek' : import.meta.env.VITE_DEEPSEEK_BASE_URL

/**
 * 发送聊天请求（非流式）
 * @param {Array} messages - 消息数组 [{ role: 'system'|'user'|'assistant', content: string }]
 * @param {Object} options - 可选参数 { temperature, max_tokens, model }
 * @returns {Promise<string>} AI 回复文本
 */
export async function chatCompletion(messages, options = {}) {
  const {
    temperature = 0.7,
    max_tokens = 1024,
    model = 'deepseek-chat'
  } = options

  const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      stream: false,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `API请求失败: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

/**
 * 发送聊天请求（流式）
 * @param {Array} messages - 消息数组
 * @param {Function} onChunk - 每收到一个token调用 (text: string) => void
 * @param {Object} options - 可选参数
 * @returns {Promise<string>} 完整回复文本
 */
export async function chatCompletionStream(messages, onChunk, options = {}) {
  const {
    temperature = 0.7,
    max_tokens = 1024,
    model = 'deepseek-chat'
  } = options

  const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `API请求失败: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data: ')) continue
      const data = trimmed.slice(6)
      if (data === '[DONE]') continue

      try {
        const parsed = JSON.parse(data)
        const content = parsed.choices?.[0]?.delta?.content
        if (content) {
          fullText += content
          onChunk(content)
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
  }

  return fullText
}



/**
 * 健康助手对话 — 预设系统提示词
 * @param {Array} chatHistory - 历史对话 [{ role, content }]
 * @param {string} userMessage - 用户新消息
 * @param {Object} profileData - 用户健康画像数据（可选，用于个性化）
 * @returns {Promise<string>} AI 回复
 */
export async function healthChat(chatHistory, userMessage, profileData = null) {
  let systemPrompt = `你是"浙里梧桐"健康管理平台的AI健康助手。你的角色是一个专业、温暖、耐心的健康顾问。

核心职责：
1. 回答用户的健康相关问题，提供科学、实用的健康建议
2. 涵盖领域：体重管理、饮食营养、运动处方、睡眠改善、慢病管理、心理减压、中医养生
3. 用通俗易懂的语言解释医学概念，避免过度专业术语
4. 在必要时提醒用户就医，不替代医生诊断

沟通风格：
- 亲切友好，像一个贴心的健康管家
- 回复简洁有条理，适当使用分点说明
- 给出可操作的具体建议，而非泛泛而谈
- 回复控制在200字以内，除非用户要求详细解释

注意事项：
- 不做诊断，遇到疑似疾病建议就医
- 不推荐具体药物
- 强调生活方式改善的重要性`

  if (profileData) {
    const { basicInfo, medicalReport, lifestyle, chronicDiseases } = profileData
    const profileSummary = []
    if (basicInfo?.age) profileSummary.push(`年龄${basicInfo.age}岁`)
    if (basicInfo?.gender) profileSummary.push(`性别${basicInfo.gender}`)
    if (basicInfo?.height && basicInfo?.weight) {
      const bmi = (basicInfo.weight / ((basicInfo.height / 100) ** 2)).toFixed(1)
      profileSummary.push(`BMI ${bmi}`)
    }
    if (medicalReport?.systolicBP && medicalReport?.diastolicBP) {
      profileSummary.push(`血压${medicalReport.systolicBP}/${medicalReport.diastolicBP}mmHg`)
    }
    if (chronicDiseases?.length > 0) {
      profileSummary.push(`慢病史：${chronicDiseases.join('、')}`)
    }
    if (profileSummary.length > 0) {
      systemPrompt += `\n\n当前用户的健康画像摘要：${profileSummary.join('，')}。请结合用户画像给出个性化建议。`
    }
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-10), // 保留最近10条历史
    { role: 'user', content: userMessage },
  ]

  return chatCompletion(messages)
}

/**
 * 健康助手流式对话
 */
export async function healthChatStream(chatHistory, userMessage, onChunk, profileData = null) {
  let systemPrompt = `你是"浙里梧桐"健康管理平台的AI健康助手。你的角色是一个专业、温暖、耐心的健康顾问。

核心职责：
1. 回答用户的健康相关问题，提供科学、实用的健康建议
2. 涵盖领域：体重管理、饮食营养、运动处方、睡眠改善、慢病管理、心理减压、中医养生
3. 用通俗易懂的语言解释医学概念，避免过度专业术语
4. 在必要时提醒用户就医，不替代医生诊断

沟通风格：
- 亲切友好，像一个贴心的健康管家
- 回复简洁有条理，适当使用分点说明
- 给出可操作的具体建议，而非泛泛而谈
- 回复控制在200字以内，除非用户要求详细解释

注意事项：
- 不做诊断，遇到疑似疾病建议就医
- 不推荐具体药物
- 强调生活方式改善的重要性`

  if (profileData) {
    const { basicInfo, medicalReport, lifestyle, chronicDiseases } = profileData
    const profileSummary = []
    if (basicInfo?.age) profileSummary.push(`年龄${basicInfo.age}岁`)
    if (basicInfo?.gender) profileSummary.push(`性别${basicInfo.gender}`)
    if (basicInfo?.height && basicInfo?.weight) {
      const bmi = (basicInfo.weight / ((basicInfo.height / 100) ** 2)).toFixed(1)
      profileSummary.push(`BMI ${bmi}`)
    }
    if (medicalReport?.systolicBP && medicalReport?.diastolicBP) {
      profileSummary.push(`血压${medicalReport.systolicBP}/${medicalReport.diastolicBP}mmHg`)
    }
    if (chronicDiseases?.length > 0) {
      profileSummary.push(`慢病史：${chronicDiseases.join('、')}`)
    }
    if (profileSummary.length > 0) {
      systemPrompt += `\n\n当前用户的健康画像摘要：${profileSummary.join('，')}。请结合用户画像给出个性化建议。`
    }
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-10),
    { role: 'user', content: userMessage },
  ]

  return chatCompletionStream(messages, onChunk)
}

/**
 * OCR 识别体检报告 — 两步流程
 * 第一步：Tesseract.js 图片→文字
 * 第二步：DeepSeek 文字→结构化数据
 * @param {string} imageBase64 - base64 图片
 * @param {Function} onProgress - 可选回调，用于显示进度
 * @returns {Promise<Object>} 识别结果对象 { systolicBP, diastolicBP, bloodSugar, cholesterol, triglycerides, uricAcid }
 */
export async function ocrMedicalReport(imageBase64, onProgress) {
  // 第一步：用 Tesseract.js 进行 OCR 文字识别（v7 显式指定中文语言包路径）
  const worker = await Tesseract.createWorker('chi_sim+eng', 1, {
    langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    logger: (m) => {
      if (onProgress && m.status === 'recognizing text') {
        onProgress(Math.round(m.progress * 100))
      }
    }
  })

  let ocrText = ''
  try {
    const { data: { text } } = await worker.recognize(imageBase64)
    ocrText = text
  } finally {
    await worker.terminate()
  }

  if (!ocrText || ocrText.trim().length < 5) {
    throw new Error('图片文字识别失败，请确保图片清晰且包含体检数据')
  }

  // 第二步：用 DeepSeek 从 OCR 文字中提取结构化数据
  const extractPrompt = `以下是通过OCR从一张体检报告图片中识别出的文字内容。请从中提取健康指标数据。

OCR识别文字：
"""
${ocrText}
"""

请严格按照以下JSON格式返回结果，只返回JSON，不要其他文字：
{
  "systolicBP": "收缩压数值（纯数字，单位mmHg），未找到填空字符串",
  "diastolicBP": "舒张压数值（纯数字，单位mmHg），未找到填空字符串",
  "bloodSugar": "空腹血糖数值（纯数字，单位mmol/L），未找到填空字符串",
  "cholesterol": "总胆固醇数值（纯数字，单位mmol/L），未找到填空字符串",
  "triglycerides": "甘油三酯数值（纯数字，单位mmol/L），未找到填空字符串",
  "uricAcid": "尿酸数值（纯数字，单位μmol/L），未找到填空字符串"
}

注意：
- 只提取数值部分，不要带单位
- 血压可能写作"120/80mmHg"这样的格式，分别提取收缩压和舒张压
- 如果OCR文字中没有相关数据，对应字段填空字符串
- 如果无法确定是体检报告内容，所有字段填空字符串`

  const response = await chatCompletion([
    { role: 'user', content: extractPrompt }
  ], { temperature: 0.1, max_tokens: 512 })

  // 解析 JSON 结果
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return JSON.parse(response)
  } catch (e) {
    console.error('结构化数据解析失败:', response)
    return {
      systolicBP: '', diastolicBP: '', bloodSugar: '',
      cholesterol: '', triglycerides: '', uricAcid: ''
    }
  }
}
