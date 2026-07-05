import { useState, useRef, useEffect } from 'react'
import { usePatients } from '../data/useStore'
import { extractPatientName, searchPatient, createPatient } from '../agents/PatientAgent'
import { mockStreamTranscribe } from '../agents/SpeechAgent'
import { extractMedicalRecord } from '../agents/MedicalAgent'
import { correctMedicalTerms, mockCorrectWithExplanations } from '../agents/CorrectionAgent'
import { fillEMR, validateEMR } from '../agents/EMRAgent'
import type { ExtractedInfo, AgentStep } from '../agents/types'
import { EMPTY_EXTRACTED } from '../agents/types'
import type { MedicalRecord } from '../data/mock'

/* ==================== 工作流状态类型 ==================== */
type WorkflowState =
  | 'idle'           // 初始输入
  | 'patient_query'  // 查询患者
  | 'patient_found'  // 找到患者
  | 'patient_not_found' // 未找到，创建患者
  | 'recording'      // 录音中
  | 'transcribing'   // 语音转文字
  | 'processing'     // AI分析中
  | 'result'         // 生成结果
  | 'saved'          // 已保存

interface AIConsultationDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSaveRecord: (record: Omit<MedicalRecord, 'id'>) => void
}

export default function AIConsultationDrawer({ isOpen, onClose, onSaveRecord }: AIConsultationDrawerProps) {
  const { patients, addPatient } = usePatients()

  // Workflow state
  const [workflow, setWorkflow] = useState<WorkflowState>('idle')
  const [inputText, setInputText] = useState('')

  // Patient
  const [foundPatient, setFoundPatient] = useState<ReturnType<typeof searchPatient>>(null)
  const [newPatientForm, setNewPatientForm] = useState({ name: '', gender: '男', age: '', phone: '' })

  // Recording
  const [recordingTime, setRecordingTime] = useState(0)
  const [liveText, setLiveText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // AI processing
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([])
  const [corrections, setCorrections] = useState<{ original: string; corrected: string; explanation: string }[]>([])

  // Result
  const [extractedRecord, setExtractedRecord] = useState<ExtractedInfo>(EMPTY_EXTRACTED)

  const liveTextRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Cleanup
  const resetAll = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setWorkflow('idle')
    setInputText('')
    setFoundPatient(null)
    setNewPatientForm({ name: '', gender: '男', age: '', phone: '' })
    setRecordingTime(0)
    setLiveText('')
    setIsRecording(false)
    setAgentSteps([])
    setCorrections([])
    setExtractedRecord(EMPTY_EXTRACTED)
  }

  const handleClose = () => { resetAll(); onClose() }

  // ===== ① Patient Query =====
  const handleInputSubmit = () => {
    if (!inputText.trim()) return
    const name = extractPatientName(inputText)
    setWorkflow('patient_query')

    setTimeout(() => {
      if (name) {
        const found = searchPatient(name, patients)
        if (found) {
          setFoundPatient(found)
          setWorkflow('patient_found')
        } else {
          setNewPatientForm((prev) => ({ ...prev, name }))
          setWorkflow('patient_not_found')
        }
      } else {
        // No name found, go straight to recording
        setWorkflow('recording')
      }
    }, 800)
  }

  // ===== ② Start Recording =====
  const startRecording = () => {
    setIsRecording(true)
    setWorkflow('recording')
    setRecordingTime(0)
    setLiveText('')

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)

    // Simulate streaming transcription
    ;(async () => {
      let currentText = ''
      for await (const chunk of mockStreamTranscribe()) {
        currentText = chunk
        setLiveText(currentText)
        if (liveTextRef.current) {
          liveTextRef.current.scrollTop = liveTextRef.current.scrollHeight
        }
      }
    })()
  }

  // ===== ③ Stop Recording → AI Processing =====
  const stopRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)
    setWorkflow('processing')

    const steps: AgentStep[] = [
      { id: 'analyze', label: '正在理解口述内容...', status: 'pending' },
      { id: 'extract', label: '正在提取关键医学信息...', status: 'pending' },
      { id: 'correct', label: '正在修正医学术语...', status: 'pending' },
      { id: 'generate', label: '正在生成电子病历...', status: 'pending' },
      { id: 'validate', label: '正在校验病历完整性...', status: 'pending' },
    ]
    setAgentSteps(steps)

    // Step 1: Understand
    await delay(400)
    updateStep(0, 'running')
    await delay(500)
    updateStep(0, 'done')

    // Step 2: Extract
    await delay(300)
    updateStep(1, 'running')
    const extracted = extractMedicalRecord(liveText || inputText)
    await delay(600)
    updateStep(1, 'done')

    // Step 3: Correct terminology
    await delay(300)
    updateStep(2, 'running')
    const correctedCorrections: typeof corrections = []
    for await (const c of mockCorrectWithExplanations(liveText || inputText)) {
      correctedCorrections.push(c)
      setCorrections([...correctedCorrections])
    }
    updateStep(2, 'done')

    // Apply corrections to extracted record
    if (correctedCorrections.length > 0) {
      const correctedText = correctMedicalTerms(liveText || inputText)
      const reExtracted = extractMedicalRecord(correctedText)
      // Merge: keep original if no correction affected that field
      Object.assign(extracted, reExtracted)
    }

    // Step 4: Generate
    await delay(300)
    updateStep(3, 'running')
    await delay(400)
    updateStep(3, 'done')

    // Step 5: Validate
    await delay(300)
    updateStep(4, 'running')
    await delay(300)
    updateStep(4, 'done')

    // Show result
    setExtractedRecord(extracted)
    setWorkflow('result')
  }

  const updateStep = (index: number, status: AgentStep['status']) => {
    setAgentSteps((prev) => prev.map((s, i) => (i === index ? { ...s, status } : s)))
  }

  // ===== Create new patient =====
  const handleCreatePatient = () => {
    if (!newPatientForm.name) return
    const np = createPatient(
      newPatientForm.name,
      newPatientForm.gender,
      parseInt(newPatientForm.age) || 30,
      newPatientForm.phone
    )
    addPatient({
      name: np.name,
      gender: np.gender as '男' | '女',
      age: np.age,
      phone: np.phone || '未填写',
      allergies: '不详',
      medicalHistory: '不详',
      tags: [],
      address: '',
    })
    setFoundPatient(np)
    setWorkflow('patient_found')
  }

  // ===== Save to EMR =====
  const handleSave = () => {
    const patientName = foundPatient?.name || 'AI接诊患者'
    const patientId = foundPatient?.id || ''
    const record = fillEMR(extractedRecord, patientName, patientId, '陈志明')
    const validation = validateEMR(record)
    if (!validation.valid) {
      alert(`请填写以下必填字段：${validation.missing.join('、')}`)
      return
    }
    onSaveRecord(record)
    setWorkflow('saved')
    setTimeout(handleClose, 1500)
  }

  // Update field in extracted record
  const updateField = (field: keyof ExtractedInfo, value: string) => {
    setExtractedRecord((prev) => ({ ...prev, [field]: value }))
  }

  // Auto-scroll live text
  useEffect(() => {
    if (liveTextRef.current) liveTextRef.current.scrollTop = liveTextRef.current.scrollHeight
  }, [liveText])

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const textareaClass = "w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all resize-none"

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50 transition-opacity" onClick={handleClose} />

      <div className="fixed top-0 right-0 h-full w-full max-w-[560px] bg-white shadow-2xl z-50 flex flex-col"
        style={{ animation: 'slideInRight 0.3s ease-out' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-display)] flex items-center gap-2">
              <span>🤖</span> AI智能接诊助手
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">请直接自然描述患者信息，无需按照病历格式说话</p>
          </div>
          <button type="button" onClick={handleClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* ===== IDLE: Input area ===== */}
          {workflow === 'idle' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-500 space-y-1.5">
                <p className="font-semibold text-gray-600 mb-2">💡 试试这样说：</p>
                <p>• "帮我看看王晓明，今天来复诊"</p>
                <p>• "李四第一次来，牙疼三天了"</p>
                <p>• "张建国来复诊，血压138/86"</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">请描述接诊信息</label>
                <textarea
                  ref={inputRef}
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleInputSubmit() } }}
                  placeholder="例如：王晓明今天来复诊，种植牙三个月了，恢复得挺好的..."
                  className={textareaClass + ' text-base'}
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={handleInputSubmit}
                disabled={!inputText.trim()}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${inputText.trim() ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200/30 hover:shadow-xl active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                🤖 开始智能接诊
              </button>
            </div>
          )}

          {/* ===== PATIENT QUERY ===== */}
          {workflow === 'patient_query' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-teal-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">🔍 正在查询患者信息...</p>
            </div>
          )}

          {/* ===== PATIENT FOUND ===== */}
          {workflow === 'patient_found' && foundPatient && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
                  {foundPatient.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-sm font-bold text-green-800">已找到患者</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 font-[family-name:var(--font-display)]">{foundPatient.name}</p>
                  <p className="text-sm text-gray-500">{foundPatient.gender} · {foundPatient.age}岁 · {foundPatient.phone}</p>
                  <p className="text-xs text-gray-400 mt-1">最近就诊：{foundPatient.lastVisit} · 累计{foundPatient.totalVisits}次</p>
                </div>
              </div>
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-500">是否开始记录本次病历？</p>
                <div className="flex gap-3">
                  <button type="button" onClick={startRecording}
                    className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all">
                    🎤 开始记录
                  </button>
                  <button type="button" onClick={() => setWorkflow('idle')}
                    className="px-5 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                    重新输入
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== PATIENT NOT FOUND ===== */}
          {workflow === 'patient_not_found' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                  <span className="text-sm font-bold text-amber-800">未找到该患者</span>
                </div>
                <p className="text-sm text-amber-600 mb-1">请填写信息创建新患者</p>
              </div>
              <div className="space-y-3 bg-white border border-gray-200 rounded-2xl p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">姓名 *</label>
                    <input type="text" value={newPatientForm.name} onChange={(e) => setNewPatientForm({ ...newPatientForm, name: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">性别</label>
                    <select value={newPatientForm.gender} onChange={(e) => setNewPatientForm({ ...newPatientForm, gender: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400">
                      <option>男</option><option>女</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">年龄</label>
                    <input type="number" value={newPatientForm.age} onChange={(e) => setNewPatientForm({ ...newPatientForm, age: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">手机号</label>
                    <input type="tel" value={newPatientForm.phone} onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
                  </div>
                </div>
                <button type="button" onClick={handleCreatePatient}
                  disabled={!newPatientForm.name}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${newPatientForm.name ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md hover:shadow-lg active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  创建患者并继续
                </button>
              </div>
            </div>
          )}

          {/* ===== RECORDING ===== */}
          {(workflow === 'recording' || isRecording) && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-red-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <span className="text-lg font-bold text-red-500 font-mono">{formatTime(recordingTime)}</span>
                  <button type="button" onClick={stopRecording}
                    className="px-6 py-3 bg-red-100 text-red-600 font-semibold rounded-full hover:bg-red-200 active:scale-95 transition-all">
                    <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
                    停止录音
                  </button>
                </div>
                <div ref={liveTextRef} className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-48 overflow-y-auto">
                  {liveText ? (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{liveText}</p>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="ml-2">正在聆听...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== AI PROCESSING ===== */}
          {workflow === 'processing' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">AI Agent 正在处理中...</p>
                    <p className="text-xs text-gray-400">
                      {agentSteps.filter((s) => s.status === 'done').length}/{agentSteps.length} 步完成
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {agentSteps.map((step) => (
                    <div key={step.id} className="flex items-center gap-2.5 animate-[fadeIn_0.3s_ease-out]">
                      {step.status === 'done' ? (
                        <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : step.status === 'running' ? (
                        <svg className="w-4 h-4 text-teal-500 animate-spin shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-200 shrink-0" />
                      )}
                      <span className={`text-sm ${step.status === 'done' ? 'text-green-600' : step.status === 'running' ? 'text-teal-600 font-medium' : 'text-gray-300'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Corrections */}
              {corrections.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-amber-700 mb-2">🔧 医学术语修正</p>
                  <div className="space-y-1.5">
                    {corrections.map((c) => (
                      <div key={c.original} className="text-xs animate-[fadeIn_0.3s_ease-out]">
                        <span className="text-gray-400 line-through">"{c.original}"</span>
                        <span className="mx-1">→</span>
                        <span className="text-green-700 font-medium">"{c.corrected}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== RESULT ===== */}
          {workflow === 'result' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <p className="text-sm font-bold text-green-800">AI病历生成完成</p>
                  <p className="text-xs text-green-600">请检查并修改以下字段，确认后保存</p>
                </div>
              </div>

              {[
                { label: '主诉', field: 'chiefComplaint' as const, rows: 2 },
                { label: '现病史', field: 'presentIllness' as const, rows: 3 },
                { label: '既往史', field: 'pastHistory' as const, rows: 2 },
                { label: '口腔检查', field: 'oralExam' as const, rows: 3 },
                { label: '辅助检查', field: 'auxExam' as const, rows: 2 },
                { label: '诊断', field: 'diagnosis' as const, rows: 2 },
                { label: '治疗计划', field: 'treatmentPlan' as const, rows: 2 },
                { label: '处置', field: 'treatment' as const, rows: 3 },
                { label: '医嘱', field: 'orders' as const, rows: 2 },
                { label: '备注', field: 'notes' as const, rows: 2 },
              ].map(({ label, field, rows }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                  <textarea rows={rows} value={extractedRecord[field]} onChange={(e) => updateField(field, e.target.value)} className={textareaClass} />
                </div>
              ))}

              <div className="flex gap-3 pt-2 pb-4">
                <button type="button" onClick={() => { setWorkflow('idle'); setExtractedRecord(EMPTY_EXTRACTED) }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  🔄 重新开始
                </button>
                <button type="button" onClick={handleSave}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-md shadow-teal-200/30 hover:shadow-lg active:scale-95 transition-all">
                  💾 保存电子病历
                </button>
              </div>
            </div>
          )}

          {/* ===== SAVED ===== */}
          {workflow === 'saved' && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-gray-900">✅ 病历已保存</p>
              <p className="text-sm text-gray-400">即将关闭...</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  )
}
