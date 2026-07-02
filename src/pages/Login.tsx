import { useState, type FormEvent, type ReactNode } from 'react'
import { users } from '../data/mock'
import type { Role } from '../data/mock'

interface LoginProps { onLogin: (role: Role) => void }

export default function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<Role>('doctor')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); onLogin(selectedRole) }, 600)
  }

  const roleOptions: { key: Role; label: string; desc: string; icon: ReactNode }[] = [
    { key: 'doctor', label: '医生', desc: '接诊、病历、处方', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { key: 'nurse', label: '护士', desc: '分诊、治疗配合、器械管理', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> },
    { key: 'reception', label: '前台', desc: '预约、挂号、收费', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { key: 'admin', label: '管理员', desc: '统计报表、系统设置', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.72 1.72 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> },
  ]

  const selectedUser = users.find((u) => u.role === selectedRole)

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-teal-50 via-white to-sky-50 font-[family-name:var(--font-sans)]">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0"><div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" /><div className="absolute -bottom-12 -left-24 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" /></div>
        <div className="relative text-center text-white px-12">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>
          </div>
          <h1 className="text-4xl font-bold font-[family-name:var(--font-display)] mb-2">微笑齿科</h1>
          <p className="text-teal-200 text-lg">SmileCare Dental</p>
          <div className="w-16 h-px bg-white/20 mx-auto my-5" />
          <p className="text-white/70 leading-relaxed max-w-sm mx-auto">医院信息系统 HIS<br />Hospital Information System</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg mb-2">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-[family-name:var(--font-display)]">微笑齿科 HIS</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-display)] mb-1">登录系统</h2>
            <p className="text-sm text-gray-400 mb-5">选择登录角色进入对应工作端</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">登录角色</label>
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions.map((opt) => (
                    <button key={opt.key} type="button" onClick={() => setSelectedRole(opt.key)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${selectedRole === opt.key ? 'border-teal-500 bg-teal-50 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}>
                      <svg className={`w-5 h-5 ${selectedRole === opt.key ? 'text-teal-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>{opt.icon}</svg>
                      <span className={`text-xs font-semibold ${selectedRole === opt.key ? 'text-teal-700' : 'text-gray-500'}`}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedUser && (
                <div className="bg-teal-50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-sm">{selectedUser.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{selectedUser.name}</p>
                    <p className="text-xs text-teal-600">{selectedUser.title}</p>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${!loading ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200/30 hover:shadow-xl hover:from-teal-600 hover:to-teal-700 active:scale-[0.98]' : 'bg-gray-100 text-gray-400'}`}>
                {loading ? '登录中...' : '进入系统'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
