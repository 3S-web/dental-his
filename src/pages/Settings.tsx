import { useMemo } from 'react'
import type { Role } from '../data/mock'

const roleLabels: Record<Role, string> = { doctor: '医生', nurse: '护士', reception: '前台', admin: '管理员' }

function getRegisteredUsers(): { name: string; workId: string; role: Role }[] {
  try {
    const users: Record<string, { name: string; workId: string; role: Role }> = JSON.parse(localStorage.getItem('his_users') || '{}')
    return Object.values(users)
  } catch { return [] }
}

export default function Settings() {
  const registeredUsers = useMemo(() => getRegisteredUsers(), [])
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 font-[family-name:var(--font-display)] mb-5">诊所信息</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: '诊所名称', value: '微笑齿科 SmileCare Dental' },
            { label: '联系电话', value: '400-888-9999' },
            { label: '地址', value: '上海市静安区南京西路1688号恒隆广场3楼' },
            { label: '营业时间', value: '周一至周日 9:00 - 18:00' },
            { label: '邮箱', value: 'contact@smilecare-dental.com' },
            { label: 'HIS 版本', value: 'v3.2.1 · 2026-07-01更新' },
          ].map((f) => (
            <div key={f.label} className="p-3 rounded-xl bg-gray-50">
              <p className="text-[11px] text-gray-400 font-medium mb-0.5">{f.label}</p>
              <p className="text-sm font-semibold text-gray-800">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 font-[family-name:var(--font-display)] mb-5">用户管理</h3>
        <div className="space-y-3">
          {registeredUsers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">暂无注册用户，请先注册账号</p>
          ) : registeredUsers.map((user) => (
            <div key={user.workId} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">{user.name[0]}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400">{roleLabels[user.role]} · 工号{user.workId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500" />在线
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 font-[family-name:var(--font-display)] mb-5">系统日志</h3>
        <div className="space-y-2 text-sm">
          {[
            { time: '2026-07-02 08:30', action: '系统启动完成', type: 'info' },
            { time: '2026-07-02 08:35', action: '患者 孙雅文 挂号成功（牙齿美白）', type: 'info' },
            { time: '2026-07-02 09:00', action: '孙雅文 冷光美白治疗完成', type: 'success' },
            { time: '2026-07-02 09:15', action: '收费：¥2,800（孙雅文-牙齿美白）已收款', type: 'success' },
            { time: '2026-07-02 09:30', action: '药品库存预警：3M Clinpro 窝沟封闭剂 库存不足', type: 'warning' },
            { time: '2026-07-02 10:00', action: '张建国 血压测量 138/86mmHg - 符合治疗条件', type: 'info' },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${log.type === 'success' ? 'bg-green-500' : log.type === 'warning' ? 'bg-amber-500' : 'bg-sky-500'}`} />
              <span className="text-xs text-gray-400 font-mono w-36 shrink-0">{log.time}</span>
              <span className="text-gray-600">{log.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
