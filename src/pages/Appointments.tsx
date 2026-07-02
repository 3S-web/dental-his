import { useState } from 'react'
import { appointments as allAppts } from '../data/mock'
import type { ApptStatus } from '../data/mock'

const statusColors: Record<ApptStatus, string> = { waiting: 'bg-amber-100 text-amber-700', confirmed: 'bg-teal-100 text-teal-700', in_progress: 'bg-sky-100 text-sky-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-500' }
const statusLabels: Record<ApptStatus, string> = { waiting: '候诊', confirmed: '已确认', in_progress: '治疗中', completed: '已完成', cancelled: '已取消' }

export default function Appointments() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApptStatus | 'all'>('all')
  const [appts, setAppts] = useState(allAppts)

  const filtered = appts.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    if (search && !a.patientName.includes(search) && !a.type.includes(search) && !a.doctorName.includes(search)) return false
    return true
  })

  const updateStatus = (id: string, status: ApptStatus) => {
    setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  const today = '2026-07-02'

  return (
    <div className="space-y-5">
      {/* Queue board */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 text-sm font-[family-name:var(--font-display)] mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          今日叫号队列
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {appts.filter((a) => a.date === today && (a.status === 'waiting' || a.status === 'in_progress' || a.status === 'confirmed')).map((apt) => (
            <div key={apt.id} className={`min-w-[120px] rounded-xl p-3 border-2 transition-all ${apt.status === 'in_progress' ? 'border-sky-400 bg-sky-50/50 shadow-sm' : apt.status === 'waiting' ? 'border-amber-300 bg-amber-50/30' : 'border-gray-100 bg-white'}`}>
              <div className="text-[10px] text-gray-400 font-medium mb-1">{apt.queueNumber || '-'}</div>
              <div className="text-sm font-bold text-gray-800">{apt.patientName}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{apt.time}</div>
              <div className="flex gap-1 mt-2">
                {apt.status === 'waiting' && (
                  <button onClick={() => updateStatus(apt.id, 'in_progress')} className="flex-1 text-[10px] font-semibold bg-sky-500 text-white px-2 py-1 rounded-md hover:bg-sky-600 transition-colors">叫号</button>
                )}
                {apt.status === 'in_progress' && (
                  <button onClick={() => updateStatus(apt.id, 'completed')} className="flex-1 text-[10px] font-semibold bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition-colors">完成</button>
                )}
                {apt.status === 'confirmed' && (
                  <button onClick={() => updateStatus(apt.id, 'waiting')} className="flex-1 text-[10px] font-semibold bg-amber-500 text-white px-2 py-1 rounded-md hover:bg-amber-600 transition-colors">签到</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索患者、服务类型..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all placeholder:text-gray-400" />
        </div>
        <button type="button" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-200/30 hover:shadow-lg active:scale-95 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>新建预约
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1.5 overflow-x-auto">
        {([['all', '全部'], ['confirmed', '已确认'], ['waiting', '候诊中'], ['in_progress', '治疗中'], ['completed', '已完成'], ['cancelled', '已取消']] as [ApptStatus | 'all', string][]).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setStatusFilter(key)}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${statusFilter === key ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Appointments table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50/70 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
          <div className="col-span-2">日期/时间</div><div className="col-span-2">患者</div><div className="col-span-3">项目</div><div className="col-span-2">医生</div><div className="col-span-2">状态</div><div className="col-span-1">操作</div>
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">暂无匹配的预约记录</div>
          ) : filtered.map((apt) => (
            <div key={apt.id} className="md:grid md:grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-gray-50/50 transition-colors">
              <div className="col-span-2 mb-1 md:mb-0"><p className="text-sm font-semibold text-gray-800">{apt.date}</p><p className="text-xs text-gray-400">{apt.time}</p></div>
              <div className="col-span-2 flex items-center gap-2 mb-1 md:mb-0"><div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-[11px] shrink-0">{apt.patientName[0]}</div><span className="text-sm font-medium text-gray-800">{apt.patientName}</span></div>
              <div className="col-span-3 mb-1 md:mb-0"><span className="text-sm text-gray-700">{apt.type}</span>{apt.note && <p className="text-xs text-gray-400 truncate">{apt.note}</p>}</div>
              <div className="col-span-2 text-sm text-gray-500 mb-1 md:mb-0">{apt.doctorName}</div>
              <div className="col-span-2 mb-1 md:mb-0"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>{statusLabels[apt.status]}</span></div>
              <div className="col-span-1 flex gap-1">
                {apt.status === 'confirmed' && <button onClick={() => updateStatus(apt.id, 'waiting')} className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors" title="签到"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></button>}
                {apt.status === 'waiting' && <button onClick={() => updateStatus(apt.id, 'in_progress')} className="p-1.5 rounded-lg text-sky-500 hover:bg-sky-50 transition-colors" title="叫号"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072" /></svg></button>}
                {apt.status === 'in_progress' && <button onClick={() => updateStatus(apt.id, 'completed')} className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 transition-colors" title="完成"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>}
                {(apt.status === 'confirmed' || apt.status === 'waiting') && <button onClick={() => updateStatus(apt.id, 'cancelled')} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="取消"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
