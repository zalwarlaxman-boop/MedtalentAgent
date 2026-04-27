/**
 * 计算BMI
 * @param {number} weight - 体重(kg)
 * @param {number} heightCm - 身高(cm)
 * @returns {{ value: number, category: string }}
 */
export function calculateBMI(weight, heightCm) {
  if (!weight || !heightCm || heightCm <= 0) {
    return { value: 0, category: '未知' }
  }
  const heightM = heightCm / 100
  const value = +(weight / (heightM * heightM)).toFixed(1)

  let category = '正常'
  if (value < 18.5) category = '偏瘦'
  else if (value < 24) category = '正常'
  else if (value < 28) category = '超重'
  else category = '肥胖'

  return { value, category }
}

/**
 * 基于健康画像数据计算综合健康分(0-100)
 * 算法：基础信息完整度(10) + BMI正常(20) + 血压正常(15) + 血糖正常(15) + 运动习惯(15) + 睡眠质量(15) + 无慢病(10)
 */
export function calculateHealthScore(profileData) {
  if (!profileData) return 0
  let score = 0
  const { basicInfo = {}, medicalReport = {}, lifestyle = {}, chronicDiseases = [] } = profileData

  // 基础信息完整度 (10分)
  const basicFields = ['name', 'gender', 'age', 'height', 'weight', 'bloodType']
  const filledCount = basicFields.filter((f) => basicInfo[f] && String(basicInfo[f]).trim() !== '').length
  score += Math.round((filledCount / basicFields.length) * 10)

  // BMI正常 (20分)
  if (basicInfo.weight && basicInfo.height) {
    const bmi = calculateBMI(Number(basicInfo.weight), Number(basicInfo.height))
    if (bmi.category === '正常') score += 20
    else if (bmi.category === '偏瘦' || bmi.category === '超重') score += 10
    else score += 5
  }

  // 血压正常 (15分)
  const sys = Number(medicalReport.systolicBP)
  const dia = Number(medicalReport.diastolicBP)
  if (sys && dia) {
    if (sys >= 90 && sys <= 140 && dia >= 60 && dia <= 90) score += 15
    else if (sys >= 80 && sys <= 160 && dia >= 50 && dia <= 100) score += 8
    else score += 3
  }

  // 血糖正常 (15分)
  const bs = Number(medicalReport.bloodSugar)
  if (bs) {
    if (bs >= 3.9 && bs <= 6.1) score += 15
    else if (bs >= 3.0 && bs <= 7.8) score += 8
    else score += 3
  }

  // 运动习惯 (15分)
  const exerciseFreq = lifestyle.exerciseFreq
  if (exerciseFreq) {
    const freq = Number(exerciseFreq)
    if (freq >= 5) score += 15
    else if (freq >= 3) score += 12
    else if (freq >= 1) score += 8
    else score += 3
  }

  // 睡眠质量 (15分)
  const sleepHours = Number(lifestyle.sleepHours)
  if (sleepHours) {
    if (sleepHours >= 7 && sleepHours <= 9) score += 15
    else if (sleepHours >= 6 && sleepHours <= 10) score += 10
    else score += 5
  }

  // 无慢病 (10分)
  if (chronicDiseases.length === 0) score += 10
  else if (chronicDiseases.length <= 2) score += 5
  else score += 2

  return Math.min(100, Math.max(0, score))
}

/**
 * 分析最近N天体重趋势
 * @param {Array<{id, date, weight, note}>} records
 * @param {number} days
 * @returns {{ trend: 'up'|'down'|'stable', avgChange: number, weeklyChange: number, prediction: number }}
 */
export function analyzeWeightTrend(records, days = 30) {
  if (!records || records.length < 2) {
    return { trend: 'stable', avgChange: 0, weeklyChange: 0, prediction: 0 }
  }

  const sorted = [...records]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .filter((r) => {
      const d = new Date(r.date)
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days)
      return d >= cutoff
    })

  if (sorted.length < 2) {
    return { trend: 'stable', avgChange: 0, weeklyChange: 0, prediction: 0 }
  }

  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const totalChange = last.weight - first.weight
  const daySpan = Math.max(1, (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24))
  const avgChange = +(totalChange / daySpan).toFixed(3)
  const weeklyChange = +(avgChange * 7).toFixed(2)

  let trend = 'stable'
  if (weeklyChange > 0.2) trend = 'up'
  else if (weeklyChange < -0.2) trend = 'down'

  // 预测7天后体重
  const prediction = +(last.weight + avgChange * 7).toFixed(1)

  return { trend, avgChange, weeklyChange, prediction }
}

/**
 * 基于趋势和BMI生成干预建议
 * @returns {Array<{type: string, title: string, description: string, priority: number}>}
 */
export function generateInterventions(trend, bmi, profileData) {
  const interventions = []
  const bmiVal = bmi?.value || 0
  const bmiCat = bmi?.category || '未知'
  const lifestyle = profileData?.lifestyle || {}

  // 基于BMI的建议
  if (bmiCat === '肥胖') {
    interventions.push({
      type: 'diet',
      title: '控制热量摄入',
      description: '建议每日减少300-500大卡热量摄入，增加蔬果比例，减少高油高糖食物。',
      priority: 1,
    })
    interventions.push({
      type: 'exercise',
      title: '增加有氧运动',
      description: '建议每周至少5次、每次30分钟以上的中等强度有氧运动。',
      priority: 1,
    })
  } else if (bmiCat === '超重') {
    interventions.push({
      type: 'diet',
      title: '优化饮食结构',
      description: '建议控制碳水摄入，增加优质蛋白和膳食纤维。',
      priority: 2,
    })
    interventions.push({
      type: 'exercise',
      title: '规律运动',
      description: '建议每周3-5次、每次30分钟的运动，如快走、游泳等。',
      priority: 2,
    })
  } else if (bmiCat === '偏瘦') {
    interventions.push({
      type: 'diet',
      title: '增加营养摄入',
      description: '建议适当增加每餐份量，注重优质蛋白质和碳水化合物的摄入。',
      priority: 2,
    })
  }

  // 基于趋势的建议
  if (trend === 'up' && (bmiCat === '超重' || bmiCat === '肥胖')) {
    interventions.push({
      type: 'metabolism',
      title: '体重持续上升预警',
      description: '您的体重呈上升趋势，建议关注代谢健康，考虑咨询营养师制定个性化方案。',
      priority: 1,
    })
  }

  if (trend === 'down' && bmiCat === '偏瘦') {
    interventions.push({
      type: 'metabolism',
      title: '体重持续下降预警',
      description: '您的体重偏低且仍在下降，建议及时就医检查，排除健康隐患。',
      priority: 1,
    })
  }

  // 生活方式建议
  if (Number(lifestyle.sleepHours) < 7) {
    interventions.push({
      type: 'metabolism',
      title: '改善睡眠质量',
      description: '睡眠不足会影响代谢和体重管理，建议保证7-9小时优质睡眠。',
      priority: 3,
    })
  }

  return interventions.sort((a, b) => a.priority - b.priority)
}

/**
 * 计算体重统计数据
 */
export function calculateWeightStats(records, goal) {
  if (!records || records.length === 0) {
    return {
      current: 0,
      initial: 0,
      lowest: 0,
      highest: 0,
      totalChange: 0,
      weeklyAvgChange: 0,
      daysTracked: 0,
      progressPercent: 0,
    }
  }

  const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date))
  const weights = sorted.map((r) => r.weight)
  const current = weights[weights.length - 1]
  const initial = weights[0]
  const lowest = Math.min(...weights)
  const highest = Math.max(...weights)
  const totalChange = +(current - initial).toFixed(1)

  const firstDate = new Date(sorted[0].date)
  const lastDate = new Date(sorted[sorted.length - 1].date)
  const daysTracked = Math.max(1, Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24)))
  const weeks = Math.max(1, daysTracked / 7)
  const weeklyAvgChange = +(totalChange / weeks).toFixed(2)

  let progressPercent = 0
  if (goal?.targetWeight && goal?.startWeight) {
    const targetChange = Number(goal.targetWeight) - Number(goal.startWeight)
    if (targetChange !== 0) {
      const actualChange = current - Number(goal.startWeight)
      progressPercent = Math.min(100, Math.max(0, Math.round((actualChange / targetChange) * 100)))
    }
  }

  return { current, initial, lowest, highest, totalChange, weeklyAvgChange, daysTracked, progressPercent }
}

/**
 * 检查是否有提醒/预警
 * @returns {Array<{type: string, message: string, severity: string}>}
 */
export function getWeightAlerts(records, goal) {
  const alerts = []
  if (!records || records.length === 0) return alerts

  const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date))
  const current = sorted[sorted.length - 1].weight
  const lastDate = new Date(sorted[sorted.length - 1].date)
  const now = new Date()

  // 提醒：超过3天未记录
  const daysSinceLastRecord = Math.round((now - lastDate) / (1000 * 60 * 60 * 24))
  if (daysSinceLastRecord >= 3) {
    alerts.push({
      type: 'reminder',
      message: `您已经${daysSinceLastRecord}天没有记录体重了，记得保持记录习惯哦！`,
      severity: 'info',
    })
  }

  // 里程碑检测
  if (goal?.targetWeight && goal?.startWeight) {
    const targetW = Number(goal.targetWeight)
    const startW = Number(goal.startWeight)
    const totalTarget = targetW - startW
    const actualChange = current - startW

    if (totalTarget !== 0) {
      const percent = (actualChange / totalTarget) * 100
      if (percent >= 100) {
        alerts.push({ type: 'milestone', message: '恭喜您已达成体重目标！🎉', severity: 'success' })
      } else if (percent >= 75) {
        alerts.push({ type: 'milestone', message: '太棒了！您已完成目标的75%！', severity: 'success' })
      } else if (percent >= 50) {
        alerts.push({ type: 'milestone', message: '继续加油！您已完成目标的一半！', severity: 'info' })
      }
    }
  }

  // 预警：体重剧烈波动
  if (sorted.length >= 3) {
    const recent3 = sorted.slice(-3).map((r) => r.weight)
    const maxDiff = Math.max(...recent3) - Math.min(...recent3)
    if (maxDiff > 3) {
      alerts.push({
        type: 'warning',
        message: '近期体重波动较大，请注意饮食和作息规律。',
        severity: 'warning',
      })
    }
  }

  return alerts
}
