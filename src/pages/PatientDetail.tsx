import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePatients, useMedicalRecords, useBillings } from '../data/useStore'
import { imagings } from '../data/mock'
import ToothChart from '../components/ToothChart'
import type { ToothRecord } from '../data/mock'

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>()
  const { patients } = usePatients()
  const { records: medicalRecords } = useMedicalRecords()
  const { billings } = useBillings()
  const patient = patients.find((p) => p.id === id)
  const [activeTab, setActiveTab] = useState<'records' | 'teeth' | 'imaging' | 'billing'>('records')

  if (!patient) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <p className="text-gray-500 font-semibold">患者未找到</p>
        <Link to="/patients" className="text-teal-600 text-sm mt-2 inline-block hover:underline">返回患者列表</Link>
      </div>
    )
  }

  const patientRecords = medicalRecords.filter((r) => r.patientId === patient.id)
  const patientImagings = imagings.filter((r) => r.patientId === patient.id)
  const patientBillings = billings.filter((r) => r.patientId === patient.id)
  const allTeeth: ToothRecord[] = patientRecords.flatMap((r) => r.teeth)

  const tabs = [
    { key: 'records' as const, label: '就诊记录', count: patientRecords.length },
    { key: 'teeth' as const, label: '牙位图', count: allTeeth.length },
    { key: 'imaging' as const, label: '影像记录', count: patientImagings.length },
    { key: 'billing' as const, label: '收费记录', count: patientBillings.length },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shrink-0">{patient.name[0]}</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1"><h2 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-display)]">{patient.name}</h2><span className="text-sm text-gray-400">{patient.gender} · {patient.age}岁</span></div>
            <p className="text-sm text-gray-400">编号：{patient.id} · 首诊：{patient.createdAt} · 累计就诊：{patient.totalVisits}次</p>
            <div className="flex flex-wrap gap-1 mt-2">{patient.tags.map((t) => <span key={t} className="px-2 py-0.5 text-[11px] font-medium bg-teal-50 text-teal-700 rounded-md">{t}</span>)}</div>
          </div>
          <Link to="/records" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>新建病历
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            { label: '手机号', value: patient.phone }, { label: '过敏史', value: patient.allergies || '无' },
            { label: '既往病史', value: patient.medicalHistory || '无' }, { label: '备注', value: patient.notes || '无' },
          ].map((info) => (
            <div key={info.label} className="p-3 rounded-xl bg-gray-50"><p className="text-[11px] text-gray-400 font-medium mb-0.5">{info.label}</p><p className="text-sm font-semibold text-gray-800">{info.value}</p></div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === tab.key ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
            {tab.label}<span className={`text-[11px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'records' && (
        <div className="space-y-3">
          {patientRecords.length === 0 ? <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">暂无就诊记录</div> : patientRecords.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3"><span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${r.type === '初诊' ? 'bg-sky-100 text-sky-700' : r.type === '手术' ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'}`}>{r.type}</span><span className="text-xs text-gray-400">{r.date} · {r.doctorName}</span></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-[11px] text-gray-400 font-medium mb-1">主诉</p><p className="text-sm text-gray-800 line-clamp-2">{r.chiefComplaint}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-[11px] text-gray-400 font-medium mb-1">诊断</p><p className="text-sm text-gray-800 line-clamp-2">{r.diagnosis}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-[11px] text-gray-400 font-medium mb-1">口腔检查</p><p className="text-sm text-gray-800 line-clamp-2">{r.oralExam || '无'}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-[11px] text-gray-400 font-medium mb-1">辅助检查</p><p className="text-sm text-gray-800 line-clamp-2">{r.auxExam || '无'}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-[11px] text-gray-400 font-medium mb-1">治疗计划</p><p className="text-sm text-gray-800 line-clamp-2">{r.treatmentPlan}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-[11px] text-gray-400 font-medium mb-1">处置</p><p className="text-sm text-gray-800 line-clamp-2">{r.treatment}</p></div>
              </div>
              {r.orders && r.orders !== '无' && <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100"><p className="text-[11px] text-amber-600 font-medium mb-1">💊 医嘱</p><p className="text-sm text-gray-700 whitespace-pre-line">{r.orders}</p></div>}
              {r.fee && <div className="mt-3 text-right text-sm"><span className="text-gray-400">费用：</span><span className="font-bold text-gray-800">¥{r.fee.toLocaleString()}</span></div>}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'teeth' && <ToothChart teethRecords={allTeeth} editable={true} />}

      {activeTab === 'imaging' && (
        <div className="space-y-3">
          {patientImagings.length === 0 ? <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">暂无影像记录</div> : patientImagings.map((img) => (
            <div key={img.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${img.type === 'CBCT' ? 'bg-purple-50 text-purple-600' : img.type === '全景片' ? 'bg-sky-50 text-sky-600' : 'bg-teal-50 text-teal-600'}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{img.type}</p>
                  <p className="text-xs text-gray-400">{img.date} · {img.doctor} · <span className={img.status === '已完成' ? 'text-green-600' : 'text-amber-600'}>{img.status}</span></p>
                  {img.report && <p className="text-xs text-gray-500 mt-1 max-w-md line-clamp-2">{img.report}</p>}
                </div>
              </div>
              <button type="button" className="text-xs text-teal-600 font-semibold hover:underline shrink-0">查看影像</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-3">
          {patientBillings.length === 0 ? <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">暂无收费记录</div> : patientBillings.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3"><span className="text-sm text-gray-400">{b.date}</span><span className={`text-sm font-bold ${b.paid ? 'text-green-600' : 'text-red-500'}`}>{b.paid ? `已付 · ${b.method}` : '待支付'}</span></div>
              <div className="space-y-2 mb-3">{b.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm"><span className="text-gray-600">{item.name} × {item.qty}</span><span className="text-gray-800 font-medium">¥{(item.price * item.qty).toLocaleString()}</span></div>
              ))}</div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50"><span className="text-sm font-semibold text-gray-700">合计</span><span className="text-lg font-bold text-gray-900 font-[family-name:var(--font-display)]">¥{b.total.toLocaleString()}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
