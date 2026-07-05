import { useState } from 'react'
import { useMedicalRecords, usePatients } from '../data/useStore'
import AutocompleteInput from '../components/AutocompleteInput'
import AIDictationDrawer from '../components/AIDictationDrawer'
import type { MedicalRecord, RecordType } from '../data/mock'

const typeColors = { '初诊': 'bg-sky-100 text-sky-700', '复诊': 'bg-teal-100 text-teal-700', '急诊': 'bg-red-100 text-red-700', '手术': 'bg-purple-100 text-purple-700' }

const emptyForm = {
  patientName: '', patientId: '', type: '复诊' as RecordType,
  chiefComplaint: '', presentIllness: '', pastHistory: '',
  oralExam: '', auxExam: '',
  diagnosis: '', treatmentPlan: '', treatment: '',
  orders: '', notes: '',
}

export default function MedicalRecords() {
  const { records, addRecord, updateRecord } = useMedicalRecords()
  const { patients } = usePatients()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [showAIDrawer, setShowAIDrawer] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const filtered = records.filter((r) => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false
    if (search && !r.patientName.includes(search) && !r.diagnosis.includes(search) && !r.treatment.includes(search)) return false
    return true
  })

  const resetForm = () => setForm(emptyForm)

  // Save AI-generated record
  const handleAISave = (gen: { chiefComplaint: string; presentIllness: string; pastHistory: string; oralExam: string; auxExam: string; diagnosis: string; treatmentPlan: string; treatment: string; orders: string; notes: string }) => {
    addRecord({
      patientName: 'AI口述患者',
      patientId: '',
      type: '复诊',
      doctorName: '陈志明',
      date: new Date().toISOString().split('T')[0],
      ...gen,
      teeth: [],
    })
  }

  const handleSaveNew = () => {
    if (!form.patientName || !form.diagnosis || !form.treatment) return
    addRecord({
      ...form,
      doctorName: '陈志明', date: new Date().toISOString().split('T')[0],
      patientId: patients.find(p => p.name === form.patientName)?.id || '',
      teeth: [],
    })
    resetForm()
    setShowNewForm(false)
  }

  const handleSaveEdit = () => {
    if (!editingRecord) return
    updateRecord(editingRecord.id, editingRecord)
    setEditingRecord(null)
  }

  const inputClass = "w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all"
  const labelClass = "block text-xs font-semibold text-gray-700 mb-1"

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索患者、诊断..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all placeholder:text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAIDrawer(true)} type="button" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-green-200/30 hover:shadow-lg hover:from-green-600 hover:to-emerald-600 active:scale-95 transition-all">
            <span className="text-base">🎤</span> AI口述病例
          </button>
          <button onClick={() => { resetForm(); setShowNewForm(true) }} type="button" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-200/30 hover:shadow-lg active:scale-95 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>新建病历
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto">
        {['all', '初诊', '复诊', '急诊', '手术'].map((t) => (
          <button key={t} type="button" onClick={() => setTypeFilter(t)} className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${typeFilter === t ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>{t === 'all' ? '全部' : t}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">暂无病历记录，点击"新建病历"创建</div>
        ) : filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedRecord(r)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">{r.patientName[0]}</div>
                <div><p className="text-sm font-bold text-gray-900">{r.patientName}</p><p className="text-xs text-gray-400">{r.doctorName} · {r.date}</p></div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium self-start ${typeColors[r.type]}`}>{r.type}</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-[11px] text-gray-400 font-medium mb-1">主诉</p><p className="text-sm text-gray-800 line-clamp-2">{r.chiefComplaint}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-[11px] text-gray-400 font-medium mb-1">诊断</p><p className="text-sm text-gray-800 line-clamp-2">{r.diagnosis}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-[11px] text-gray-400 font-medium mb-1">处置</p><p className="text-sm text-gray-800 line-clamp-2">{r.treatment}</p></div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-teal-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              点击查看详情/编辑 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Detail + Edit modal */}
      {selectedRecord && !editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedRecord(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-bold text-gray-900 font-[family-name:var(--font-display)]">病历详情 · {selectedRecord.patientName}</h3>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { setEditingRecord(selectedRecord); setSelectedRecord(null) }} className="px-3 py-1.5 text-xs font-semibold text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">编辑</button>
                <button type="button" onClick={() => setSelectedRecord(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md">{selectedRecord.patientName[0]}</div>
                <div><p className="text-base font-bold text-gray-900">{selectedRecord.patientName}</p><p className="text-sm text-gray-400">{selectedRecord.doctorName} · {selectedRecord.date} · <span className="font-medium text-teal-600">{selectedRecord.type}</span></p></div>
              </div>
              {[
                { label: '主诉', value: selectedRecord.chiefComplaint },
                { label: '现病史', value: selectedRecord.presentIllness || '无' },
                { label: '既往史', value: selectedRecord.pastHistory || '无' },
                { label: '口腔检查', value: selectedRecord.oralExam || '无' },
                { label: '辅助检查', value: selectedRecord.auxExam || '无' },
                { label: '诊断', value: selectedRecord.diagnosis },
                { label: '治疗计划', value: selectedRecord.treatmentPlan },
                { label: '处置', value: selectedRecord.treatment },
                { label: '医嘱', value: selectedRecord.orders || '无' },
                { label: '备注', value: selectedRecord.notes || '无' },
              ].map((f) => (
                <div key={f.label} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[11px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">{f.label}</p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit form modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setEditingRecord(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-bold text-gray-900 font-[family-name:var(--font-display)]">编辑病历 · {editingRecord.patientName}</h3>
              <button type="button" onClick={() => setEditingRecord(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>患者姓名</label>
                  <input type="text" value={editingRecord.patientName} onChange={(e) => setEditingRecord({ ...editingRecord, patientName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>就诊类型</label>
                  <select value={editingRecord.type} onChange={(e) => setEditingRecord({ ...editingRecord, type: e.target.value as RecordType })} className={inputClass}>
                    <option>初诊</option><option>复诊</option><option>急诊</option><option>手术</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>医生</label>
                  <input type="text" value={editingRecord.doctorName} onChange={(e) => setEditingRecord({ ...editingRecord, doctorName: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>主诉 <span className="text-red-400">*</span></label>
                <AutocompleteInput value={editingRecord.chiefComplaint} onChange={(v) => setEditingRecord({ ...editingRecord, chiefComplaint: v })} placeholder="患者主要不适及持续时间...（输入拼音首字母联想）" />
              </div>
              <div>
                <label className={labelClass}>现病史</label>
                <AutocompleteInput value={editingRecord.presentIllness || ''} onChange={(v) => setEditingRecord({ ...editingRecord, presentIllness: v })} placeholder="本次发病过程...（输入拼音首字母联想）" rows={3} />
              </div>
              <div>
                <label className={labelClass}>既往史</label>
                <AutocompleteInput value={editingRecord.pastHistory || ''} onChange={(v) => setEditingRecord({ ...editingRecord, pastHistory: v })} placeholder="既往疾病史、手术史...（输入拼音首字母联想）" />
              </div>
              <div>
                <label className={labelClass}>口腔检查</label>
                <AutocompleteInput value={editingRecord.oralExam || ''} onChange={(v) => setEditingRecord({ ...editingRecord, oralExam: v })} placeholder="口内检查所见...（输入拼音首字母联想）" rows={3} />
              </div>
              <div>
                <label className={labelClass}>辅助检查</label>
                <AutocompleteInput value={editingRecord.auxExam || ''} onChange={(v) => setEditingRecord({ ...editingRecord, auxExam: v })} placeholder="CBCT/全景片/化验等...（输入拼音首字母联想）" rows={2} />
              </div>
              <div>
                <label className={labelClass}>诊断 <span className="text-red-400">*</span></label>
                <AutocompleteInput value={editingRecord.diagnosis} onChange={(v) => setEditingRecord({ ...editingRecord, diagnosis: v })} placeholder="诊断结果...（输入拼音首字母联想）" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>治疗计划</label>
                  <AutocompleteInput value={editingRecord.treatmentPlan} onChange={(v) => setEditingRecord({ ...editingRecord, treatmentPlan: v })} placeholder="治疗计划...（输入拼音首字母联想）" rows={3} />
                </div>
                <div>
                  <label className={labelClass}>本次处置 <span className="text-red-400">*</span></label>
                  <AutocompleteInput value={editingRecord.treatment} onChange={(v) => setEditingRecord({ ...editingRecord, treatment: v })} placeholder="处置...（输入拼音首字母联想）" rows={3} />
                </div>
              </div>
              <div>
                <label className={labelClass}>医嘱</label>
                <AutocompleteInput value={editingRecord.orders || ''} onChange={(v) => setEditingRecord({ ...editingRecord, orders: v })} placeholder="医嘱...（输入拼音首字母联想）" />
              </div>
              <div>
                <label className={labelClass}>备注</label>
                <AutocompleteInput value={editingRecord.notes || ''} onChange={(v) => setEditingRecord({ ...editingRecord, notes: v })} placeholder="备注...（输入拼音首字母联想）" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setEditingRecord(null)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">取消</button>
                <button type="button" onClick={handleSaveEdit} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-md hover:shadow-lg active:scale-95">保存修改</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New record form modal */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowNewForm(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-bold text-gray-900 font-[family-name:var(--font-display)]">新建病历</h3>
              <button type="button" onClick={() => setShowNewForm(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>患者姓名 <span className="text-red-400">*</span></label>
                  <select value={form.patientName} onChange={(e) => { const p = patients.find(x => x.name === e.target.value); setForm({ ...form, patientName: e.target.value, patientId: p?.id || '' }) }} className={inputClass}>
                    <option value="">请选择患者</option>
                    {patients.map(p => <option key={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>就诊类型</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as RecordType })} className={inputClass}>
                    <option>初诊</option><option>复诊</option><option>急诊</option><option>手术</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>主诉 <span className="text-red-400">*</span></label>
                <AutocompleteInput value={form.chiefComplaint} onChange={(v) => setForm({ ...form, chiefComplaint: v })} placeholder="患者主要不适及持续时间...（输入拼音首字母联想）" />
              </div>
              <div>
                <label className={labelClass}>现病史</label>
                <AutocompleteInput value={form.presentIllness} onChange={(v) => setForm({ ...form, presentIllness: v })} placeholder="本次发病过程...（输入拼音首字母联想）" rows={3} />
              </div>
              <div>
                <label className={labelClass}>既往史</label>
                <AutocompleteInput value={form.pastHistory} onChange={(v) => setForm({ ...form, pastHistory: v })} placeholder="既往疾病史、手术史、过敏史...（输入拼音首字母联想）" />
              </div>
              <div>
                <label className={labelClass}>口腔检查</label>
                <AutocompleteInput value={form.oralExam} onChange={(v) => setForm({ ...form, oralExam: v })} placeholder="口内检查所见...（输入拼音首字母联想）" rows={3} />
              </div>
              <div>
                <label className={labelClass}>辅助检查</label>
                <AutocompleteInput value={form.auxExam} onChange={(v) => setForm({ ...form, auxExam: v })} placeholder="CBCT/全景片/化验等辅助检查结果...（输入拼音首字母联想）" rows={2} />
              </div>
              <div>
                <label className={labelClass}>诊断 <span className="text-red-400">*</span></label>
                <AutocompleteInput value={form.diagnosis} onChange={(v) => setForm({ ...form, diagnosis: v })} placeholder="诊断结果...（输入拼音首字母联想）" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>治疗计划</label>
                  <AutocompleteInput value={form.treatmentPlan} onChange={(v) => setForm({ ...form, treatmentPlan: v })} placeholder="治疗计划...（输入拼音首字母联想）" rows={3} />
                </div>
                <div>
                  <label className={labelClass}>本次处置 <span className="text-red-400">*</span></label>
                  <AutocompleteInput value={form.treatment} onChange={(v) => setForm({ ...form, treatment: v })} placeholder="处置...（输入拼音首字母联想）" rows={3} />
                </div>
              </div>
              <div>
                <label className={labelClass}>医嘱</label>
                <AutocompleteInput value={form.orders} onChange={(v) => setForm({ ...form, orders: v })} placeholder="医嘱...（输入拼音首字母联想）" />
              </div>
              <div>
                <label className={labelClass}>备注</label>
                <AutocompleteInput value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} placeholder="备注...（输入拼音首字母联想）" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowNewForm(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">取消</button>
                <button type="button" onClick={handleSaveNew} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-md hover:shadow-lg active:scale-95">保存病历</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* AI Dictation Drawer */}
      <AIDictationDrawer
        isOpen={showAIDrawer}
        onClose={() => setShowAIDrawer(false)}
        onSave={handleAISave}
        patientNames={patients.map((p) => p.name)}
      />
    </div>
  )
}
