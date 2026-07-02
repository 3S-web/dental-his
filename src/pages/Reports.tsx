import { reportData } from '../data/mock'

export default function Reports() {
  const { monthlyRevenue, serviceDistribution, patientStats } = reportData
  const maxRev = Math.max(...monthlyRevenue.map((m) => m.value))
  const maxService = Math.max(...serviceDistribution.map((s) => s.value))

  return (
    <div className="space-y-5">
      {/* Patient stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: '本月新患者', value: patientStats.newPatients, unit: '人', color: 'text-teal-600' },
          { label: '复诊患者', value: patientStats.returningPatients, unit: '人', color: 'text-sky-600' },
          { label: '总诊疗人次', value: patientStats.totalVisits, unit: '人次', color: 'text-violet-600' },
          { label: '人均费用', value: `¥${patientStats.avgFee.toLocaleString()}`, unit: '', color: 'text-amber-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <span className="text-sm text-gray-400">{s.label}</span>
            <div className={`text-2xl font-bold mt-1 font-[family-name:var(--font-display)] ${s.color}`}>{s.value}<span className="text-sm font-normal text-gray-400 ml-1">{s.unit}</span></div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Revenue bar chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h3 className="font-bold text-gray-900 text-sm mb-5 font-[family-name:var(--font-display)]">月度营收趋势</h3>
          <div className="flex items-end gap-2 sm:gap-3 h-48">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[11px] font-semibold text-gray-600">¥{(m.value / 10000).toFixed(1)}w</span>
                <div className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all hover:from-teal-600 hover:to-teal-500 cursor-pointer" style={{ height: `${(m.value / maxRev) * 100}%`, minHeight: '8px' }} title={`${m.month}: ¥${m.value.toLocaleString()}`} />
                <span className="text-[10px] text-gray-400 font-medium">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
            <span className="text-gray-400">月均营收</span>
            <span className="font-bold text-gray-900">
              ¥{(monthlyRevenue.reduce((s, m) => s + m.value, 0) / monthlyRevenue.length / 10000).toFixed(1)}万
            </span>
          </div>
        </div>

        {/* Service distribution */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h3 className="font-bold text-gray-900 text-sm mb-5 font-[family-name:var(--font-display)]">服务项目分布</h3>
          <div className="space-y-3">
            {serviceDistribution.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-20 shrink-0">{s.name}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-500 flex items-center justify-end pr-2" style={{ width: `${(s.value / maxService) * 100}%` }}>
                    <span className="text-[11px] font-bold text-white">{s.value}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-3 text-center text-sm">
            <div className="bg-teal-50 rounded-lg p-3"><span className="text-teal-600 font-bold">{serviceDistribution[0].value}%</span><p className="text-gray-500 text-xs mt-0.5">{serviceDistribution[0].name}</p></div>
            <div className="bg-sky-50 rounded-lg p-3"><span className="text-sky-600 font-bold">{serviceDistribution[1].value}%</span><p className="text-gray-500 text-xs mt-0.5">{serviceDistribution[1].name}</p></div>
          </div>
        </div>
      </div>

      {/* Doctor performance */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <h3 className="font-bold text-gray-900 text-sm mb-4 font-[family-name:var(--font-display)]">医生绩效概览</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                <th className="pb-3 pr-4">医生</th><th className="pb-3 pr-4">接诊量</th><th className="pb-3 pr-4">完成手术</th><th className="pb-3 pr-4">患者满意度</th><th className="pb-3">收入贡献</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: '陈志明', visits: 156, surgeries: 42, satisfaction: '99.2%', revenue: '¥186万' },
                { name: '林婉清', visits: 112, surgeries: 8, satisfaction: '98.5%', revenue: '¥82万' },
                { name: '张思远', visits: 44, surgeries: 2, satisfaction: '97.8%', revenue: '¥18万' },
              ].map((doc) => (
                <tr key={doc.name} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 pr-4 font-semibold text-gray-800">{doc.name}</td>
                  <td className="py-3 pr-4 text-gray-600">{doc.visits} 人次</td>
                  <td className="py-3 pr-4 text-gray-600">{doc.surgeries} 台</td>
                  <td className="py-3 pr-4"><span className="text-green-600 font-semibold">{doc.satisfaction}</span></td>
                  <td className="py-3 font-semibold text-gray-800">{doc.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
