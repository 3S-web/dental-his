import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePatients } from '../data/useStore'

export default function Patients() {
  const { patients, addPatient } = usePatients()
  const [search, setSearch] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [newPatient, setNewPatient] = useState({ name: '', gender: '男', age: '', phone: '', allergies: '无', medicalHistory: '无', tags: '' })

  const filtered = patients.filter((p) =>
    p.name.includes(search) || p.phone.includes(search) || p.id.toLowerCase().includes(search.toLowerCase()) || p.tags.some((t) => t.includes(search))
  )

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.phone) return
    addPatient({
      name: newPatient.name,
      gender: newPatient.gender as '男' | '女',
      age: Number(newPatient.age) || 0,
      phone: newPatient.phone,
      allergies: newPatient.allergies,
      medicalHistory: newPatient.medicalHistory,
      tags: newPatient.tags ? newPatient.tags.split(/[,，]/).map(t => t.trim()).filter(Boolean) : [],
      address: '',
    })
    setNewPatient({ name: '', gender: '男', age: '', phone: '', allergies: '无', medicalHistory: '无', tags: '' })
    setShowNewForm(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索患者姓名、手机号、标签..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all placeholder:text-gray-400" />
        </div>
        <button onClick={() => setShowNewForm(true)} type="button" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-200/30 hover:shadow-lg active:scale-95 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>添加患者
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50/70 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
          <div className="col-span-3">患者信息</div><div className="col-span-2">联系方式</div><div className="col-span-2">末次就诊</div><div className="col-span-2">就诊次数</div><div className="col-span-2">标签</div><div className="col-span-1"></div>
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">未找到匹配的患者</div>
          ) : filtered.map((p) => (
            <Link key={p.id} to={`/patients/${p.id}`} className="md:grid md:grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-teal-50/30 transition-colors block cursor-pointer">
              <div className="col-span-3 flex items-center gap-3 mb-2 md:mb-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">{p.name[0]}</div>
                <div className="min-w-0"><p className="text-sm font-semibold text-gray-800">{p.name}</p><p className="text-xs text-gray-400">{p.gender} · {p.age}岁 · 编号{p.id}</p></div>
              </div>
              <div className="col-span-2 text-sm text-gray-600 truncate">{p.phone}</div>
              <div className="col-span-2 text-sm text-gray-500">{p.lastVisit}</div>
              <div className="col-span-2"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">{p.totalVisits}次</span></div>
              <div className="col-span-2 flex flex-wrap gap-1">
                {p.tags.slice(0, 2).map((tag) => <span key={tag} className="inline-block px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-md">{tag}</span>)}
                {p.tags.length > 2 && <span className="text-[11px] text-gray-400">+{p.tags.length - 2}</span>}
              </div>
              <div className="col-span-1 text-right"><svg className="w-4 h-4 text-gray-300 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></div>
            </Link>
          ))}
        </div>
      </div>

      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowNewForm(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">添加患者</h3>
              <button type="button" onClick={() => setShowNewForm(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">姓名 *</label>
                  <input type="text" value={newPatient.name} onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} placeholder="患者姓名" className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">性别</label>
                  <select value={newPatient.gender} onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400">
                    <option>男</option><option>女</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">年龄</label>
                  <input type="number" value={newPatient.age} onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })} placeholder="年龄" className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">手机号 *</label>
                  <input type="tel" value={newPatient.phone} onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} placeholder="手机号" className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">过敏史</label>
                  <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" value={newPatient.allergies} onChange={e => setNewPatient({...newPatient, allergies: e.target.value})}>
                    <option>无</option><option>青霉素过敏</option><option>磺胺类过敏</option><option>其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">既往病史</label>
                  <input type="text" value={newPatient.medicalHistory} onChange={(e) => setNewPatient({ ...newPatient, medicalHistory: e.target.value })} placeholder="无" className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">标签（逗号分隔）</label>
                <input type="text" value={newPatient.tags} onChange={(e) => setNewPatient({ ...newPatient, tags: e.target.value })} placeholder="如：种植牙，VIP" className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowNewForm(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">取消</button>
                <button type="button" onClick={handleAddPatient} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-md hover:shadow-lg active:scale-95">添加患者</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
