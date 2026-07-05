/* ==================== PatientAgent — 患者查询与创建 ==================== */

import type { PatientInfo } from './types'

// Mock: extract patient name from natural language
export function extractPatientName(text: string): string | null {
  const patterns = [
    /(?:看看|查一下|找一下|搜索|帮我看看)[：:\s]*([^\s，。,\.！!？?]+)/,
    /([^\s，。,\.！!？?]+)(?:来了|来复诊|来复查|预约了|今天|下午|上午)/,
    /([^\s，。,\.！!？?]{2,4})/,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m && m[1] && m[1].length >= 2 && m[1].length <= 4) {
      return m[1].trim()
    }
  }
  return null
}

// Mock: search patient from local data
export function searchPatient(name: string, allPatients: PatientInfo[]): PatientInfo | null {
  const found = allPatients.find(
    (p) => p.name === name || p.name.includes(name) || name.includes(p.name)
  )
  return found || null
}

// Mock: create a new patient (returns minimal info)
export function createPatient(name: string, gender: string, age: number, phone: string): PatientInfo {
  return {
    id: `P${Date.now().toString(36).toUpperCase()}`,
    name,
    gender,
    age,
    phone,
    lastVisit: new Date().toISOString().split('T')[0],
    totalVisits: 1,
    tags: [],
  }
}

// Detects visit type from text
export function detectVisitType(text: string): '初诊' | '复诊' | '急诊' | '手术' {
  if (/初诊|第一次|首次|新患者|第一次来/.test(text)) return '初诊'
  if (/急诊|紧急|很痛|疼得厉害|受不了/.test(text)) return '急诊'
  if (/手术|种植体植入|拔牙|开刀/.test(text)) return '手术'
  return '复诊'
}
