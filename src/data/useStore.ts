import { useState, useCallback } from 'react'
import type { Patient, Appointment, MedicalRecord, BillingItem } from '../data/mock'

// Minimal initial mock data
const defaultPatients: Patient[] = [
  { id: 'P001', name: '王晓明', gender: '男', age: 32, phone: '138****6789', allergies: '无', medicalHistory: '无', tags: ['种植牙'], totalVisits: 1, lastVisit: '2026-07-02', createdAt: '2026-07-02' },
]

const defaultAppointments: Appointment[] = [
  { id: 'A001', patientId: 'P001', patientName: '王晓明', doctorName: '陈志明', date: '2026-07-03', time: '09:00', type: '种植牙复诊', status: 'confirmed' },
]

const defaultRecords: MedicalRecord[] = [
  { id: 'R001', patientId: 'P001', patientName: '王晓明', date: '2026-07-02', doctorName: '陈志明', type: '复诊',
    chiefComplaint: '种植牙术后感觉良好',
    presentIllness: '3个月前于我院行#16种植体植入术，术后恢复顺利，无明显疼痛及肿胀',
    pastHistory: '否认高血压、糖尿病等系统性疾病史，否认药物过敏史',
    oralExam: '#16种植体周围牙龈色泽正常，探诊无出血，角化龈宽度充足。全口口腔卫生状况良好，未见明显龋坏。',
    auxExam: 'CBCT示#16种植体周围骨密度正常，骨结合良好，未见透射影。',
    diagnosis: '种植体愈合正常，骨结合稳定',
    treatmentPlan: '继续观察，3个月后行上部修复。建议继续保持良好口腔卫生，定期复查。',
    treatment: '完成术后3个月常规复查，口腔卫生指导',
    orders: '保持口腔卫生，每日刷牙2次，使用软毛牙刷及牙线。按时复诊，不适随诊。',
    notes: '患者配合度高，口腔卫生维护优秀',
    teeth: [] },
]

const defaultBillings: BillingItem[] = [
  { id: 'B001', patientName: '王晓明', patientId: 'P001', date: '2026-07-02', items: [{ name: '种植牙复查', category: '检查', price: 150, qty: 1 }], total: 150, paid: true, method: '微信', cashier: '赵琳' },
]

// Generic localStorage persistence
function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setAndPersist = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
      localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }, [key])

  return [state, setAndPersist] as const
}

// --- Custom hooks for each data domain ---

export function usePatients() {
  const [patients, setPatients] = usePersistedState<Patient[]>('his_patients', defaultPatients)

  const addPatient = (p: Omit<Patient, 'id' | 'totalVisits' | 'lastVisit' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...p,
      id: `P${String(patients.length + 1).padStart(3, '0')}`,
      totalVisits: 1,
      lastVisit: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    }
    setPatients((prev) => [...prev, newPatient])
    return newPatient
  }

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p))
  }

  return { patients, addPatient, updatePatient }
}

export function useAppointments() {
  const [appointments, setAppointments] = usePersistedState<Appointment[]>('his_appointments', defaultAppointments)

  const addAppointment = (a: Omit<Appointment, 'id'>) => {
    const newAppt: Appointment = {
      ...a,
      id: `A${String(appointments.length + 1).padStart(3, '0')}`,
    }
    setAppointments((prev) => [...prev, newAppt])
    return newAppt
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, ...updates } : a))
  }

  return { appointments, addAppointment, updateAppointment }
}

export function useMedicalRecords() {
  const [records, setRecords] = usePersistedState<MedicalRecord[]>('his_records', defaultRecords)

  const addRecord = (r: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
      ...r,
      id: `R${String(records.length + 1).padStart(3, '0')}`,
    }
    setRecords((prev) => [...prev, newRecord])
    return newRecord
  }

  const updateRecord = (id: string, updates: Partial<MedicalRecord>) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, ...updates } : r))
  }

  return { records, addRecord, updateRecord, setRecords }
}

export function useBillings() {
  const [billings, setBillings] = usePersistedState<BillingItem[]>('his_billings', defaultBillings)

  const addBilling = (b: Omit<BillingItem, 'id'>) => {
    const newBilling: BillingItem = {
      ...b,
      id: `B${String(billings.length + 1).padStart(3, '0')}`,
    }
    setBillings((prev) => [...prev, newBilling])
    return newBilling
  }

  const updateBilling = (id: string, updates: Partial<BillingItem>) => {
    setBillings((prev) => prev.map((b) => b.id === id ? { ...b, ...updates } : b))
  }

  return { billings, addBilling, updateBilling }
}
