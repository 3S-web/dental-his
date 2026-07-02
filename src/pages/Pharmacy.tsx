import { useState } from 'react'
import { drugs } from '../data/mock'

export default function Pharmacy() {
  const [search, setSearch] = useState('')
  const [inventory, setInventory] = useState(drugs)  // State for future modal usage

  const filtered = inventory.filter((d) => d.name.includes(search) || d.category.includes(search) || d.manufacturer.includes(search))

  const lowStockCount = inventory.filter((d) => d.stock <= d.alertStock).length

  const updateStock = (id: string, delta: number) => {
    setInventory((prev) => prev.map((d) => d.id === id ? { ...d, stock: Math.max(0, d.stock + delta) } : d))
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: '药品种类', value: `${inventory.length} 种`, color: 'text-teal-600 bg-teal-50' },
          { label: '库存预警', value: `${lowStockCount} 种`, color: lowStockCount > 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50' },
          { label: '库存总额', value: `¥${inventory.reduce((s, d) => s + d.stock * d.price, 0).toLocaleString()}`, color: 'text-sky-600 bg-sky-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"><span className="text-sm text-gray-400">{s.label}</span><div className={`text-2xl font-bold mt-1 font-[family-name:var(--font-display)] ${s.color.split(' ')[0]}`}>{s.value}</div></div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索药品名称、类别..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all placeholder:text-gray-400" />
        </div>
        <button type="button" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-200/30 hover:shadow-lg active:scale-95 transition-all">
          入库管理
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50/70 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
          <div className="col-span-3">药品名称</div><div className="col-span-1">类别</div><div className="col-span-1">规格</div><div className="col-span-1">库存</div><div className="col-span-1">单价</div><div className="col-span-2">厂家</div><div className="col-span-1">效期</div><div className="col-span-2">操作</div>
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.map((d) => (
            <div key={d.id} className={`md:grid md:grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-gray-50/50 transition-colors ${d.stock <= d.alertStock ? 'bg-red-50/30' : ''}`}>
              <div className="col-span-3 mb-1 md:mb-0"><p className="text-sm font-semibold text-gray-800">{d.name}</p></div>
              <div className="col-span-1 text-sm text-gray-500 mb-1 md:mb-0">{d.category}</div>
              <div className="col-span-1 text-sm text-gray-500 mb-1 md:mb-0">{d.spec}</div>
              <div className="col-span-1 mb-1 md:mb-0">
                <span className={`text-sm font-bold ${d.stock <= d.alertStock ? 'text-red-600' : 'text-gray-800'}`}>{d.stock}</span>
                <span className="text-xs text-gray-400 ml-0.5">{d.unit}</span>
              </div>
              <div className="col-span-1 text-sm text-gray-700 mb-1 md:mb-0">¥{d.price}</div>
              <div className="col-span-2 text-sm text-gray-500 mb-1 md:mb-0 truncate">{d.manufacturer}</div>
              <div className="col-span-1 text-sm text-gray-500 mb-1 md:mb-0">{d.expiryDate}</div>
              <div className="col-span-2 flex gap-1">
                <button onClick={() => updateStock(d.id, 10)} className="px-2 py-1 text-[11px] font-semibold bg-teal-50 text-teal-600 rounded-md hover:bg-teal-100 transition-colors">+入库</button>
                <button onClick={() => updateStock(d.id, -1)} className="px-2 py-1 text-[11px] font-semibold bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 transition-colors">-出库</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
