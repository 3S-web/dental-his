/* ==================== AI Agent 类型定义 ==================== */

export interface PatientInfo {
  id: string
  name: string
  gender: string
  age: number
  phone: string
  lastVisit: string
  totalVisits: number
  tags: string[]
}

export interface ExtractedInfo {
  patientName: string | null
  visitType: '初诊' | '复诊' | '急诊' | '手术'
  chiefComplaint: string
  presentIllness: string
  pastHistory: string
  oralExam: string
  auxExam: string
  diagnosis: string
  treatmentPlan: string
  treatment: string
  orders: string
  notes: string
}

export interface AgentStep {
  id: string
  label: string
  status: 'pending' | 'running' | 'done'
}

export const EMPTY_EXTRACTED: ExtractedInfo = {
  patientName: null,
  visitType: '复诊',
  chiefComplaint: '',
  presentIllness: '',
  pastHistory: '',
  oralExam: '',
  auxExam: '',
  diagnosis: '',
  treatmentPlan: '',
  treatment: '',
  orders: '',
  notes: '',
}
