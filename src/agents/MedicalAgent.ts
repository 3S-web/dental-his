/* ==================== MedicalAgent — 病历生成 ==================== */

import type { ExtractedInfo } from './types'

// Mock: extract structured medical record from natural language transcript
export function extractMedicalRecord(transcript: string): ExtractedInfo {
  // Use keyword extraction to build structured record
  const hasPain = /疼|痛|不适/.test(transcript)
  const hasSwelling = /肿|胀/.test(transcript)
  const hasBleeding = /出血|流血/.test(transcript)
  const hasTooth = /牙|齿/.test(transcript)

  // Determine chief complaint
  let chiefComplaint = ''
  if (hasPain && hasTooth) chiefComplaint = '牙疼3天，冷热刺激痛'
  else if (hasBleeding) chiefComplaint = '牙龈出血，要求洁牙'
  else if (/种植|植体/.test(transcript)) chiefComplaint = '种植牙术后复诊'
  else if (/矫正|正畸|牙套/.test(transcript)) chiefComplaint = '正畸复诊'
  else if (/检查|涂氟|窝沟/.test(transcript)) chiefComplaint = '常规口腔检查'
  else chiefComplaint = '口腔不适来诊'

  // Present illness
  const phrases: string[] = []
  if (/三个月|3个月/.test(transcript)) phrases.push('3个月前于我院行种植体植入术')
  if (/上次|之前/.test(transcript)) phrases.push('曾于我院治疗')
  if (hasPain) phrases.push('自觉疼痛不适')
  if (hasSwelling) phrases.push('伴局部肿胀')
  if (hasBleeding) phrases.push('刷牙时牙龈出血')
  if (/恢复.*好|挺好|不错/.test(transcript)) phrases.push('术后恢复良好')
  if (!hasPain && !hasSwelling) phrases.push('无明显疼痛及肿胀')
  const presentIllness = phrases.length > 0 ? phrases.join('，') + '。' : '来诊要求口腔检查。'

  // Past history
  const pastHistory = '否认高血压、糖尿病等系统性疾病史，否认药物过敏史。'

  // Oral exam
  let oralExam = '口腔卫生状况良好。'
  if (/牙石|牙结石/.test(transcript)) oralExam = '下前牙区见龈上牙结石，牙龈缘轻度红肿。'
  if (/深龋|龋坏/.test(transcript)) oralExam = '左下第一磨牙可见深龋，探痛（+），冷诊敏感，叩诊（-）。'
  if (/种植|植体/.test(transcript)) oralExam = '种植体周围牙龈色泽正常，探诊无出血，角化龈宽度充足。'

  // Aux exam
  let auxExam = ''
  if (/CBCT|cbct|ct/.test(transcript)) auxExam = 'CBCT示种植体周围骨密度正常，骨结合良好。'
  else if (/片|X线|x线/.test(transcript)) auxExam = 'X线片示未见明显异常。'
  else auxExam = ''

  // Diagnosis
  let diagnosis = ''
  if (/种植|植体|骨结合/.test(transcript)) diagnosis = '种植体愈合正常，骨结合稳定'
  else if (/牙髓|根管/.test(transcript)) diagnosis = '慢性牙髓炎（#36）'
  else if (/牙周|刮治/.test(transcript)) diagnosis = '慢性牙周炎'
  else if (/龋|洞/.test(transcript)) diagnosis = '龋病'
  else if (/矫正|正畸/.test(transcript)) diagnosis = '安氏I类错颌畸形'
  else diagnosis = '口腔检查未见明显异常'

  // Treatment plan
  let treatmentPlan = ''
  if (/种植|植体/.test(transcript)) treatmentPlan = '继续观察，3个月后行上部修复'
  else if (/牙髓|根管/.test(transcript)) treatmentPlan = '1. 根管治疗（分次完成）；2. 治疗后全冠修复'
  else if (/牙周|刮治/.test(transcript)) treatmentPlan = '1. 分区龈下刮治；2. 定期牙周维护'
  else treatmentPlan = '定期口腔检查，保持口腔卫生'

  // Treatment
  let treatment = ''
  if (/种植|复查/.test(transcript)) treatment = '完成术后复查，口腔卫生指导'
  else if (/洁牙|洁治/.test(transcript)) treatment = '完成全口超声波洁治及喷砂抛光'
  else if (/牙周|刮治/.test(transcript)) treatment = '右下区龈下刮治及根面平整（局麻下完成）'
  else if (/根管|开髓/.test(transcript)) treatment = '开髓减压，封失活剂'
  else if (/窝沟/.test(transcript)) treatment = '四颗第一恒磨牙窝沟封闭'
  else treatment = '完成口腔检查及口腔卫生指导'

  // Orders
  let orders = ''
  if (/不开药|不用/.test(transcript)) orders = '无'
  else if (/阿莫西林/.test(transcript)) orders = '阿莫西林克拉维酸钾 625mg bid × 5天'
  else orders = '保持口腔卫生，按时复诊，不适随诊。'

  // Notes
  const notes = '患者配合度良好。'

  return {
    patientName: null,
    visitType: /初诊|第一次|新/.test(transcript) ? '初诊' : '复诊',
    chiefComplaint,
    presentIllness,
    pastHistory,
    oralExam,
    auxExam,
    diagnosis,
    treatmentPlan,
    treatment,
    orders,
    notes,
  }
}
