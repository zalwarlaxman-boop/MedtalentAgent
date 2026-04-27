export const STORAGE_KEYS = {
  HEALTH_PROFILE: 'zlwt_health_profile',
  WEIGHT_RECORDS: 'zlwt_weight_records',
  CHAT_MESSAGES: 'zlwt_chat_messages',
  WEIGHT_GOAL: 'zlwt_weight_goal',
  CART_ITEMS: 'zlwt_cart_items',
}

export function getStorage(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return defaultValue
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Failed to write localStorage:', e)
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.error('Failed to remove localStorage:', e)
  }
}
