/* ==================== EMRAgent — 自动填充电子病历 ==================== */

import type { ExtractedInfo } from './types'
import type { MedicalRecord } from '../data/mock'

// Convert extracted info to a full MedicalRecord ready for saving
export function fillEMR(
  extracted: ExtractedInfo,
  patientName: string,
  patientId: string,
  doctorName: string
): Omit<MedicalRecord, 'id'> {
  return {
    patientName,
    patientId,
    date: new Date().toISOString().split('T')[0],
    doctorName,
    type: extracted.visitType,
    chiefComplaint: extracted.chiefComplaint,
    presentIllness: extracted.presentIllness,
    pastHistory: extracted.pastHistory,
    oralExam: extracted.oralExam,
    auxExam: extracted.auxExam,
    diagnosis: extracted.diagnosis,
    treatmentPlan: extracted.treatmentPlan,
    treatment: extracted.treatment,
    orders: extracted.orders,
    notes: extracted.notes,
    teeth: [],
  }
}

// Validate that all required fields are filled
export function validateEMR(record: Omit<MedicalRecord, 'id'>): { valid: boolean; missing: string[] } {
  const required: { field: keyof typeof record; label: string }[] = [
    { field: 'chiefComplaint', label: '主诉' },
    { field: 'diagnosis', label: '诊断' },
    { field: 'treatment', label: '处置' },
  ]
  const missing = required.filter((r) => !record[r.field] || (record[r.field] as string).trim() === '').map((r) => r.label)
  return { valid: missing.length === 0, missing }
}
