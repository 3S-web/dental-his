import { useState, useRef, useEffect } from 'react'

interface GeneratedRecord {
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

interface AIDictationDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (record: GeneratedRecord) => void
  patientNames: string[]
}

// Mock generated record (simulates AI output)
const mockRecord: GeneratedRecord = {
  chiefComplaint: '种植牙术后复诊',
  presentIllness: '患者3个月前于我院完成#16种植体植入，恢复良好，无明显疼痛及肿胀。术后遵医嘱执行口腔卫生维护。',
  pastHistory: '否认高血压、糖尿病等系统性疾病史，否认药物过敏史，否认手术外伤史。',
  oralExam: '#16种植体周围牙龈色泽正常，探诊无出血，角化龈宽度充足。全口口腔卫生状况良好，未见明显龋坏，牙石（-），软垢（-）。',
  auxExam: 'CBCT示#16种植体周围骨密度正常，骨结合良好，未见透射影。',
  diagnosis: '种植体愈合正常，骨结合稳定，牙龈色泽正常，探诊无出血。',
  treatmentPlan: '继续观察，3个月后行上部修复。建议继续保持口腔卫生，定期复查。',
  treatment: '完成术后3个月常规复查，口腔卫生指导。',
  orders: '保持口腔卫生，每日刷牙2次，使用软毛牙刷及牙线。按时复诊，不适随诊。',
  notes: '患者配合度高，口腔卫生维护良好。',
}

type Phase = 'idle' | 'recording' | 'processing' | 'result'

export default function AIDictationDrawer({ isOpen, onClose, onSave, patientNames }: AIDictationDrawerProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [liveText, setLiveText] = useState('')
  const [processingSteps, setProcessingSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [generatedRecord, setGeneratedRecord] = useState<GeneratedRecord>(mockRecord)
  const [selectedPatient, setSelectedPatient] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const liveTextRef = useRef<HTMLDivElement>(null)

  // Simulated live text during recording
  const mockLiveLines = [
    '患者主诉：种植牙术后复诊...',
    '现病史询问中：3个月前于我院行种植体植入术...',
    '术后恢复情况：无明显疼痛...',
    '既往史采集：否认系统性疾病史...',
    '过敏史：否认药物过敏...',
    '诊断初步：种植体愈合正常...',
  ]

  // Cleanup on close
  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('idle')
    setRecordingTime(0)
    setLiveText('')
    setProcessingSteps([])
    setCurrentStep(0)
    setGeneratedRecord(mockRecord)
    setSelectedPatient('')
    onClose()
  }

  // Start recording
  const startRecording = () => {
    setPhase('recording')
    setRecordingTime(0)
    setLiveText('')
    setProcessingSteps([])
    setCurrentStep(0)

    // Timer
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)

    // Simulate live text appearing
    let lineIndex = 0
    const textInterval = setInterval(() => {
      if (lineIndex < mockLiveLines.length) {
        setLiveText((prev) => prev + mockLiveLines[lineIndex] + '\n')
        lineIndex++
        // Auto-scroll
        if (liveTextRef.current) {
          liveTextRef.current.scrollTop = liveTextRef.current.scrollHeight
        }
      } else {
        clearInterval(textInterval)
      }
    }, 1200)
  }

  // Stop recording and start AI processing
  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setRecordingTime((prev) => prev)
    setPhase('processing')

    const steps = [
      '正在分析主诉...',
      '正在整理现病史...',
      '正在提取既往史...',
      '正在生成诊断意见...',
      '正在制定治疗计划...',
      '正在生成医嘱建议...',
    ]

    steps.forEach((step, i) => {
      setTimeout(() => {
        setProcessingSteps((prev) => [...prev, step])
        setCurrentStep(i + 1)
        if (i === steps.length - 1) {
          setTimeout(() => {
            setPhase('result')
            setGeneratedRecord(mockRecord)
          }, 500)
        }
      }, (i + 1) * 400)
    })
  }

  // Auto-scroll live text
  useEffect(() => {
    if (liveTextRef.current) {
      liveTextRef.current.scrollTop = liveTextRef.current.scrollHeight
    }
  }, [liveText])

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const updateField = (field: keyof GeneratedRecord, value: string) => {
    setGeneratedRecord((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(generatedRecord)
    handleClose()
  }

  const textareaClass = "w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all resize-none"

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-50 transition-opacity duration-300" onClick={handleClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[520px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out animate-[slideIn_0.3s_ease-out]"
        style={{ animation: '0.3s ease-out slideIn' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-display)] flex items-center gap-2">
              <span className="text-xl">🎤</span> AI口述病例
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">通过语音快速生成标准牙科电子病历</p>
          </div>
          <button type="button" onClick={handleClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
          {/* Patient selection */}
          {phase === 'idle' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">选择患者（可选）</label>
              <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400">
                <option value="">不选择患者</option>
                {patientNames.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
          )}

          {/* Recording area */}
          {(phase === 'idle' || phase === 'recording') && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
              {/* Recording controls */}
              <div className="flex items-center justify-center gap-4">
                {phase === 'idle' && (
                  <button type="button" onClick={startRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-full shadow-lg shadow-red-200/30 hover:shadow-xl hover:from-red-600 hover:to-rose-600 active:scale-95 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" /><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" /></svg>
                    开始录音
                  </button>
                )}
                {phase === 'recording' && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                      </span>
                      <span className="text-sm font-semibold text-red-500 font-mono">{formatTime(recordingTime)}</span>
                    </div>
                    <button type="button" onClick={stopRecording}
                      className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-600 font-semibold rounded-full hover:bg-red-200 active:scale-95 transition-all">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
                      停止录音
                    </button>
                  </>
                )}
              </div>

              {/* Live text display */}
              {phase === 'recording' && (
                <div
                  ref={liveTextRef}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-48 overflow-y-auto"
                >
                  {liveText ? (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono">{liveText}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">等待语音输入...</p>
                  )}
                </div>
              )}

              {phase === 'idle' && (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  <p className="text-sm text-gray-400">点击"开始录音"按钮，模拟口述病例采集</p>
                  <p className="text-xs text-gray-300 mt-1">录音结束后AI将自动整理生成病历</p>
                </div>
              )}
            </div>
          )}

          {/* AI Processing */}
          {phase === 'processing' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">AI正在整理病例...</p>
                  <p className="text-xs text-gray-400">正在分析语音内容并生成结构化病历</p>
                </div>
              </div>

              <div className="space-y-2">
                {processingSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5 animate-[fadeIn_0.3s_ease-out]">
                    {i < currentStep - 1 ? (
                      <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : i === currentStep - 1 ? (
                      <svg className="w-4 h-4 text-teal-500 animate-spin shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200 shrink-0" />
                    )}
                    <span className={`text-sm ${i < currentStep - 1 ? 'text-green-600' : i === currentStep - 1 ? 'text-teal-600 font-medium' : 'text-gray-300'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated record */}
          {phase === 'result' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl shrink-0">✅</div>
                <div>
                  <p className="text-sm font-bold text-green-800">AI病历生成完成</p>
                  <p className="text-xs text-green-600">您可以检查和修改以下字段，确认后保存到电子病历</p>
                </div>
              </div>

              {/* Editable fields */}
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
                  <textarea
                    rows={rows}
                    value={generatedRecord[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                    className={textareaClass}
                  />
                </div>
              ))}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2 pb-4">
                <button type="button" onClick={() => { setPhase('idle'); setGeneratedRecord(mockRecord) }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  🔄 重新生成
                </button>
                <button type="button" onClick={handleSave}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-md shadow-teal-200/30 hover:shadow-lg active:scale-95 transition-all">
                  💾 保存到电子病历
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-in animation keyframes */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
