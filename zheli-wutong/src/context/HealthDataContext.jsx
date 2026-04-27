import { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'
import {
  calculateBMI,
  calculateHealthScore,
  analyzeWeightTrend,
  calculateWeightStats,
  getWeightAlerts,
} from '../utils/healthCalc'

// ============ 初始状态 ============
const initialState = {
  profile: {
    basicInfo: { name: '', gender: '', age: '', height: '', weight: '', bloodType: '' },
    medicalReport: {
      systolicBP: '',
      diastolicBP: '',
      bloodSugar: '',
      cholesterol: '',
      triglycerides: '',
      uricAcid: '',
    },
    lifestyle: { exerciseFreq: '', sleepHours: '', dietHabit: '', smoking: false, drinking: false },
    chronicDiseases: [],
    deviceData: [],
  },
  weightRecords: [],
  weightGoal: { targetWeight: '', targetDate: '', startWeight: '', startDate: '' },
  chatMessages: [],
  healthScore: 0,
  notifications: [],
}

// ============ Reducer ============
function healthReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: {
          ...state.profile,
          [action.payload.section]: {
            ...(Array.isArray(state.profile[action.payload.section])
              ? action.payload.data
              : { ...state.profile[action.payload.section], ...action.payload.data }),
          },
        },
      }

    case 'ADD_WEIGHT_RECORD':
      return {
        ...state,
        weightRecords: [
          ...state.weightRecords,
          {
            id: Date.now(),
            date: action.payload.date,
            weight: Number(action.payload.weight),
            note: action.payload.note || '',
          },
        ],
      }

    case 'DELETE_WEIGHT_RECORD':
      return {
        ...state,
        weightRecords: state.weightRecords.filter((r) => r.id !== action.payload.id),
      }

    case 'SET_WEIGHT_GOAL':
      return {
        ...state,
        weightGoal: {
          ...state.weightGoal,
          targetWeight: action.payload.targetWeight,
          targetDate: action.payload.targetDate,
          startWeight:
            action.payload.startWeight || state.weightGoal.startWeight || action.payload.targetWeight,
          startDate: action.payload.startDate || state.weightGoal.startDate || new Date().toISOString().slice(0, 10),
        },
      }

    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [
          ...state.chatMessages,
          {
            id: Date.now(),
            role: action.payload.role,
            content: action.payload.content,
            timestamp: new Date().toISOString(),
            type: action.payload.type || 'text',
          },
        ],
      }

    case 'CLEAR_CHAT':
      return { ...state, chatMessages: [] }

    case 'SET_HEALTH_SCORE':
      return { ...state, healthScore: action.payload.score }

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            type: action.payload.type,
            message: action.payload.message,
            read: false,
            timestamp: new Date().toISOString(),
          },
        ],
      }

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload.id ? { ...n, read: true } : n,
        ),
      }

    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload }

    default:
      return state
  }
}

// ============ Context ============
const HealthDataContext = createContext(null)

// ============ Provider ============
export function HealthDataProvider({ children }) {
  const [state, dispatch] = useReducer(healthReducer, initialState)

  // 初始化：从 localStorage 加载
  useEffect(() => {
    const profile = getStorage(STORAGE_KEYS.HEALTH_PROFILE, initialState.profile)
    const weightRecords = getStorage(STORAGE_KEYS.WEIGHT_RECORDS, [])
    const chatMessages = getStorage(STORAGE_KEYS.CHAT_MESSAGES, [])
    const weightGoal = getStorage(STORAGE_KEYS.WEIGHT_GOAL, initialState.weightGoal)

    dispatch({
      type: 'LOAD_FROM_STORAGE',
      payload: { profile, weightRecords, chatMessages, weightGoal },
    })
  }, [])

  // 持久化：state 变化时写入 localStorage
  useEffect(() => {
    setStorage(STORAGE_KEYS.HEALTH_PROFILE, state.profile)
  }, [state.profile])

  useEffect(() => {
    setStorage(STORAGE_KEYS.WEIGHT_RECORDS, state.weightRecords)
  }, [state.weightRecords])

  useEffect(() => {
    setStorage(STORAGE_KEYS.CHAT_MESSAGES, state.chatMessages)
  }, [state.chatMessages])

  useEffect(() => {
    setStorage(STORAGE_KEYS.WEIGHT_GOAL, state.weightGoal)
  }, [state.weightGoal])

  // 计算属性
  const bmi = useMemo(() => {
    const { weight, height } = state.profile.basicInfo
    return calculateBMI(Number(weight), Number(height))
  }, [state.profile.basicInfo])

  const healthScore = useMemo(() => {
    return calculateHealthScore(state.profile)
  }, [state.profile])

  const weightTrend = useMemo(() => {
    return analyzeWeightTrend(state.weightRecords, 30)
  }, [state.weightRecords])

  const weightStats = useMemo(() => {
    return calculateWeightStats(state.weightRecords, state.weightGoal)
  }, [state.weightRecords, state.weightGoal])

  const weightAlerts = useMemo(() => {
    return getWeightAlerts(state.weightRecords, state.weightGoal)
  }, [state.weightRecords, state.weightGoal])

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      bmi,
      healthScore,
      weightTrend,
      weightStats,
      weightAlerts,
    }),
    [state, bmi, healthScore, weightTrend, weightStats, weightAlerts],
  )

  return <HealthDataContext.Provider value={contextValue}>{children}</HealthDataContext.Provider>
}

// ============ Hook ============
export function useHealthData() {
  const context = useContext(HealthDataContext)
  if (!context) {
    throw new Error('useHealthData 必须在 HealthDataProvider 内部使用')
  }
  return context
}

export { HealthDataContext }
