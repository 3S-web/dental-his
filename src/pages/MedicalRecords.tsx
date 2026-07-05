import { useState } from 'react'
import { useMedicalRecords } from '../data/useStore'

const typeColors = { '初诊': 'bg-sky-100 text-sky-700', '复诊': 'bg-teal-100 text-teal-700', '急诊': 'bg-red-100 text-red-700', '手术': 'bg-purple-100 text-purple-700' }

export default function MedicalRecords() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedRecord, setSelectedRecord] = useState<typeof medicalRecords[0] | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)

  const { records: medicalRecords } = useMedicalRecords()

  const filtered = medicalRecords.filter((r) => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false
    if (search && !r.patientName.includes(search) && !r.diagnosis.includes(search) && !r.treatmentDone.includes(search)) return false
    return true
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索患者、诊断、治疗..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all placeholder:text-gray-400" />
        </div>
        <button onClick={() => setShowNewForm(true)} type="button" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-200/30 hover:shadow-lg active:scale-95 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>新建病历
        </button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto">
        {['all', '初诊', '复诊', '急诊', '手术'].map((t) => (
          <button key={t} type="button" onClick={() => setTypeFilter(t)} className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${typeFilter === t ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>{t === 'all' ? '全部' : t}</button>
        ))}
      </div>

      {/* Records cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">暂无匹配的病历记录</div>
        ) : filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedRecord(r)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">{r.patientName[0]}</div>
                <div><p className="text-sm font-bold text-gray-900">{r.patientName}</p><p className="text-xs text-gray-400">{r.doctorName} · {r.date}</p></div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium self-start ${typeColors[r.type]}`}>{r.type}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-[11px] text-gray-400 font-medium mb-1 uppercase tracking-wider">诊断</p><p className="text-sm text-gray-800 font-medium line-clamp-2">{r.diagnosis}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-[11px] text-gray-400 font-medium mb-1 uppercase tracking-wider">治疗处置</p><p className="text-sm text-gray-800 font-medium line-clamp-2">{r.treatmentDone}</p></div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-teal-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">查看详情 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></div>
          </div>
        ))}
      </div>

      {/* Record detail modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedRecord(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-bold text-gray-900 font-[family-name:var(--font-display)]">病历详情 · {selectedRecord.patientName}</h3>
              <button type="button" onClick={() => setSelectedRecord(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md">{selectedRecord.patientName[0]}</div>
                <div><p className="text-base font-bold text-gray-900">{selectedRecord.patientName}</p><p className="text-sm text-gray-400">{selectedRecord.doctorName} · {selectedRecord.date} · <span className={`font-medium ${selectedRecord.type === '初诊' ? 'text-sky-600' : selectedRecord.type === '手术' ? 'text-purple-600' : 'text-teal-600'}`}>{selectedRecord.type}</span></p></div>
              </div>
              {[
                { label: '主诉', value: selectedRecord.chiefComplaint },
                { label: '诊断', value: selectedRecord.diagnosis },
                { label: '治疗计划', value: selectedRecord.treatmentPlan },
                { label: '本次处置', value: selectedRecord.treatmentDone },
                { label: '处方', value: selectedRecord.prescription || '无' },
                { label: '医嘱/备注', value: selectedRecord.notes || '无' },
              ].map((f) => (
                <div key={f.label} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[11px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">{f.label}</p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{f.value}</p>
                </div>
              ))}
              {selectedRecord.teeth.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[11px] text-gray-400 font-semibold mb-2 uppercase tracking-wider">涉及牙位</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRecord.teeth.map((t) => (
                      <span key={t.tooth} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-700 text-xs font-medium">#{t.tooth} {t.condition}</span>
                    ))}
                  </div>
                </div>
              )}
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
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">患者 <span className="text-red-400">*</span></label>
                  <select className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400">
                    <option value="">请选择患者</option>
                    <option>王晓明 (P001)</option><option>李芳华 (P002)</option><option>张建国 (P003)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">就诊类型 <span className="text-red-400">*</span></label>
                  <select className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400">
                    <option>初诊</option><option>复诊</option><option>急诊</option><option>手术</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">主诉 <span className="text-red-400">*</span></label>
                <textarea rows={2} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 resize-none" placeholder="患者主诉..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">诊断 <span className="text-red-400">*</span></label>
                <textarea rows={2} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 resize-none" placeholder="诊断结果..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">治疗计划</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 resize-none" placeholder="治疗计划..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">本次处置</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 resize-none" placeholder="本次处置..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">处方用药</label>
                <textarea rows={2} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 resize-none" placeholder="处方内容..." />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowNewForm(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">取消</button>
                <button type="button" onClick={() => setShowNewForm(false)} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all">保存病历</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
