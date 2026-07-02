import { useState } from 'react'
import { billings, serviceCatalog } from '../data/mock'

export default function Billing() {
  const [search, setSearch] = useState('')
  const [paidFilter, setPaidFilter] = useState<'all' | 'paid' | 'unpaid'>('all')
  const [showNewBill, setShowNewBill] = useState(false)
  const [bills, setBills] = useState(billings)

  const filtered = bills.filter((b) => {
    if (paidFilter === 'paid' && !b.paid) return false
    if (paidFilter === 'unpaid' && b.paid) return false
    if (search && !b.patientName.includes(search)) return false
    return true
  })

  const markPaid = (id: string) => setBills((prev) => prev.map((b) => b.id === id ? { ...b, paid: true, method: '微信' as const } : b))

  const totalRevenue = bills.filter(b => b.paid).reduce((s, b) => s + b.total, 0)
  const totalUnpaid = bills.filter(b => !b.paid).reduce((s, b) => s + b.total, 0)

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: '总营收', value: `¥${totalRevenue.toLocaleString()}`, color: 'text-teal-600 bg-teal-50' },
          { label: '待收款', value: `¥${totalUnpaid.toLocaleString()}`, color: 'text-red-600 bg-red-50' },
          { label: '账单总数', value: `${bills.length} 笔`, color: 'text-sky-600 bg-sky-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <span className="text-sm text-gray-400">{s.label}</span>
            <div className={`text-2xl font-bold mt-1 font-[family-name:var(--font-display)] ${s.color.split(' ')[0]}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索患者..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all placeholder:text-gray-400" />
        </div>
        <button onClick={() => setShowNewBill(true)} type="button" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-200/30 hover:shadow-lg active:scale-95 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>新建账单
        </button>
      </div>

      <div className="flex gap-1.5">
        {(['all', 'paid', 'unpaid'] as const).map((k) => (
          <button key={k} type="button" onClick={() => setPaidFilter(k)} className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${paidFilter === k ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
            {k === 'all' ? '全部' : k === 'paid' ? '已收款' : '待收款'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">暂无匹配的账单</div>
        ) : filtered.map((b) => (
          <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-sm shrink-0">{b.patientName[0]}</div>
                <div><p className="text-sm font-bold text-gray-800">{b.patientName}</p><p className="text-xs text-gray-400">{b.date} · {b.cashier || '待收款'}</p></div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${b.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {b.paid ? `已收款 · ¥${b.total.toLocaleString()}` : `待支付 · ¥${b.total.toLocaleString()}`}
              </span>
            </div>
            <div className="space-y-1.5 mb-3 bg-gray-50 rounded-lg p-3">
              {b.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm"><span className="text-gray-600">{item.name} <span className="text-gray-400">×{item.qty}</span></span><span className="text-gray-800 font-medium">¥{(item.price * item.qty).toLocaleString()}</span></div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-900">合计：¥{b.total.toLocaleString()}</span>
              {!b.paid && (
                <button onClick={() => markPaid(b.id)} className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-lg hover:shadow-md active:scale-95 transition-all">确认收款</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New bill modal */}
      {showNewBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowNewBill(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-bold text-gray-900 font-[family-name:var(--font-display)]">新建收费账单</h3>
              <button type="button" onClick={() => setShowNewBill(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">患者</label>
                  <select className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400">
                    <option>请选择</option><option>王晓明</option><option>李芳华</option><option>张建国</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">日期</label>
                  <input type="date" defaultValue="2026-07-02" className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">收费项目</label>
                <div className="space-y-2">
                  {serviceCatalog.slice(0, 5).map((cat) => (
                    <details key={cat.category} className="bg-gray-50 rounded-xl p-3">
                      <summary className="text-sm font-semibold text-gray-700 cursor-pointer">{cat.category}</summary>
                      <div className="mt-2 space-y-1">
                        {cat.items.map((item) => (
                          <label key={item} className="flex items-center justify-between text-sm px-2 py-1 hover:bg-white rounded-lg cursor-pointer">
                            <span className="text-gray-600">{item}</span>
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                          </label>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowNewBill(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">取消</button>
                <button type="button" onClick={() => setShowNewBill(false)} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all">生成账单</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
