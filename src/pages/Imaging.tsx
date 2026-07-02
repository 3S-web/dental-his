import { useState } from 'react'
import { imagings } from '../data/mock'

const typeIcons: Record<string, string> = { 'CBCT': 'bg-purple-50 text-purple-600', '全景片': 'bg-sky-50 text-sky-600', '根尖片': 'bg-teal-50 text-teal-600', '头颅侧位片': 'bg-indigo-50 text-indigo-600' }

export default function Imaging() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = imagings.filter((img) => {
    if (typeFilter !== 'all' && img.type !== typeFilter) return false
    if (search && !img.patientName.includes(search) && !img.type.includes(search)) return false
    return true
  })

  const types = ['all', ...new Set(imagings.map((i) => i.type))]

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: '影像总数', value: `${imagings.length} 份`, color: 'bg-teal-50 text-teal-600' },
          { label: 'CBCT', value: `${imagings.filter(i => i.type === 'CBCT').length} 份`, color: 'bg-purple-50 text-purple-600' },
          { label: '全景片', value: `${imagings.filter(i => i.type === '全景片').length} 份`, color: 'bg-sky-50 text-sky-600' },
          { label: '待阅片', value: `${imagings.filter(i => i.status === '待阅片').length} 份`, color: 'bg-amber-50 text-amber-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"><span className="text-sm text-gray-400">{s.label}</span><div className={`text-2xl font-bold mt-1 ${s.color.split(' ')[0]} font-[family-name:var(--font-display)]`}>{s.value}</div></div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索患者、检查类型..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all placeholder:text-gray-400" />
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto">
        {types.map((t) => (
          <button key={t} type="button" onClick={() => setTypeFilter(t)} className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${typeFilter === t ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>{t === 'all' ? '全部' : t}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((img) => (
          <div key={img.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${typeIcons[img.type] || 'bg-gray-50 text-gray-500'}`}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${img.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{img.status}</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">{img.type}</h4>
            <p className="text-sm text-gray-500 mb-1">{img.patientName}</p>
            <p className="text-xs text-gray-400 mb-3">{img.date} · {img.doctor}</p>
            {img.report && <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5 line-clamp-2 leading-relaxed">{img.report}</p>}
            <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between">
              <span className="text-xs text-teal-600 font-semibold group-hover:underline">查看影像</span>
              {img.status === '待阅片' && <span className="text-xs text-amber-600 font-semibold group-hover:underline">撰写报告</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
