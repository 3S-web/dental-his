import { Link } from 'react-router-dom'
import { useAppointments, usePatients, useBillings } from '../data/useStore'
import { drugs, reportData } from '../data/mock'
import type { Role } from '../data/mock'

interface DashboardProps { role: Role }

export default function Dashboard(_props: DashboardProps) {
  const { appointments } = useAppointments()
  const { patients } = usePatients()
  const { billings } = useBillings()
  const today = new Date().toISOString().split('T')[0]
  const todayApps = appointments.filter((a) => a.date === today)
  const waiting = todayApps.filter((a) => a.status === 'waiting').length
  const inProgress = todayApps.filter((a) => a.status === 'in_progress').length
  const unpaidCount = billings.filter((b) => !b.paid).length
  const lowStock = drugs.filter((d) => d.stock <= d.alertStock).length
  const monthRevenue = reportData.monthlyRevenue[reportData.monthlyRevenue.length - 1].value

  const stats = [
    { label: '今日预约', value: todayApps.length, sub: `${waiting}位候诊 · ${inProgress}位治疗中`, color: 'bg-teal-50 text-teal-600', link: '/appointments' },
    { label: '本月营收', value: `¥${(monthRevenue / 10000).toFixed(1)}万`, sub: `环比+${(((286500 - 265000) / 265000) * 100).toFixed(1)}%`, color: 'bg-sky-50 text-sky-600', link: '/reports' },
    { label: '待收费', value: `${unpaidCount}笔`, sub: `¥${billings.filter(b => !b.paid).reduce((s, b) => s + b.total, 0).toLocaleString()}`, color: unpaidCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600', link: '/billing' },
    { label: '库存预警', value: `${lowStock}种`, sub: lowStock > 0 ? '需及时采购补货' : '库存正常', color: lowStock > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600', link: '/pharmacy' },
  ]

  const todayApptsForList = appointments.filter(a => a.date === today)

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.link}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-display)]">{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm font-[family-name:var(--font-display)]">今日预约 ({todayApptsForList.length}位)</h3>
            <Link to="/appointments" className="text-xs text-teal-600 font-semibold hover:underline">查看全部 →</Link>
          </div>
          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {todayApptsForList.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm">今日暂无预约</div>
            ) : todayApptsForList.map((apt) => {
              const statusColors: Record<string, string> = { waiting: 'bg-amber-100 text-amber-700', confirmed: 'bg-teal-100 text-teal-700', in_progress: 'bg-sky-100 text-sky-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-500' }
              const statusLabels: Record<string, string> = { waiting: '候诊', confirmed: '已确认', in_progress: '治疗中', completed: '已完成', cancelled: '已取消' }
              return (
                <div key={apt.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                  <span className="text-sm font-bold text-gray-600 min-w-[40px]">{apt.time}</span>
                  <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-[11px] shrink-0">{apt.patientName[0]}</div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-800 truncate">{apt.patientName}</p><p className="text-xs text-gray-400 truncate">{apt.type}</p></div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColors[apt.status]}`}>{statusLabels[apt.status]}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm font-[family-name:var(--font-display)] mb-3">快捷操作</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '新建预约', path: '/appointments', color: 'from-teal-500 to-teal-600', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { label: '新增患者', path: '/patients', color: 'from-sky-500 to-sky-600', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
                { label: '书写病历', path: '/records', color: 'from-violet-500 to-violet-600', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { label: '门诊收费', path: '/billing', color: 'from-amber-500 to-amber-600', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              ].map((action) => (
                <Link key={action.label} to={action.path}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={action.icon} /></svg>
                  <span className="text-[11px] font-semibold">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm font-[family-name:var(--font-display)] mb-3">最近就诊</h3>
            <div className="space-y-2.5">
              {patients.slice(0, 4).map((p) => (
                <Link key={p.id} to={`/patients/${p.id}`} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-[11px] shrink-0">{p.name[0]}</div>
                  <div className="flex-1 min-w-0"><p className="text-[13px] font-medium text-gray-800 truncate">{p.name}</p><p className="text-[11px] text-gray-400">{p.lastVisit}</p></div>
                  <span className="text-[11px] text-gray-400">{p.totalVisits}次</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
