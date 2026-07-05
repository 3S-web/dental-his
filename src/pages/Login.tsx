import { useState, type FormEvent } from 'react'
import type { CurrentUser } from '../App'
import type { Role } from '../data/mock'

interface LoginProps { onLogin: (user: CurrentUser) => void }

export default function Login({ onLogin }: LoginProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)

  // Login form
  const [loginAccount, setLoginAccount] = useState('')
  const [loginPwd, setLoginPwd] = useState('')

  // Register form
  const [regName, setRegName] = useState('')
  const [regWorkId, setRegWorkId] = useState('')
  const [regRole, setRegRole] = useState<Role>('doctor')
  const [regAccount, setRegAccount] = useState('')
  const [regPwd, setRegPwd] = useState('')
  const [regPwdConfirm, setRegPwdConfirm] = useState('')
  const [registered, setRegistered] = useState(false)

  // Store registered users in localStorage for mock persistence
  const getRegisteredUsers = (): Record<string, { name: string; workId: string; role: Role; account: string; password: string }> => {
    try { return JSON.parse(localStorage.getItem('his_users') || '{}') } catch { return {} }
  }

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    if (!loginAccount || !loginPwd) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const registeredUsers = getRegisteredUsers()
      const found = registeredUsers[loginAccount]
      if (found && found.password === loginPwd) {
        onLogin({ name: found.name, workId: found.workId, account: found.account, role: found.role })
      } else {
        alert('账号或密码错误')
      }
    }, 600)
  }

  const handleRegister = (e: FormEvent) => {
    e.preventDefault()
    if (!regName || !regWorkId || !regAccount || !regPwd || regPwd !== regPwdConfirm) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const registeredUsers = getRegisteredUsers()
      if (registeredUsers[regAccount]) {
        alert('该账号已存在，请更换')
        return
      }
      registeredUsers[regAccount] = {
        name: regName,
        workId: regWorkId,
        role: regRole,
        account: regAccount,
        password: regPwd,
      }
      localStorage.setItem('his_users', JSON.stringify(registeredUsers))
      setRegistered(true)
      setRegName('')
      setRegWorkId('')
      setRegAccount('')
      setRegPwd('')
      setRegPwdConfirm('')
      setRegRole('doctor')
      setTimeout(() => { setRegistered(false); setTab('login') }, 2000)
    }, 800)
  }

  const inputClass = "w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400"

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-teal-50 font-[family-name:var(--font-sans)]">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-24 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative text-center text-white px-12">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold font-[family-name:var(--font-display)] mb-2">微笑齿科</h1>
          <p className="text-teal-200 text-lg">SmileCare Dental</p>
          <div className="w-16 h-px bg-white/20 mx-auto my-5" />
          <p className="text-white/70 leading-relaxed max-w-sm mx-auto">医院信息系统 HIS<br />Hospital Information System</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg mb-2">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-[family-name:var(--font-display)]">微笑齿科 HIS</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all duration-200 relative ${tab === 'login' ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                登录
                {tab === 'login' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-teal-500 rounded-full" />}
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all duration-200 relative ${tab === 'register' ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                注册
                {tab === 'register' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-teal-500 rounded-full" />}
              </button>
            </div>

            {/* Login form */}
            {tab === 'login' && (
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-display)] mb-1">欢迎回来</h2>
                <p className="text-sm text-gray-400 mb-6">请输入您的账号信息登录系统</p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="loginAccount" className="block text-sm font-semibold text-gray-700 mb-1.5">账号</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input id="loginAccount" type="text" value={loginAccount} onChange={(e) => setLoginAccount(e.target.value)} placeholder="请输入登录账号" className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="loginPwd" className="block text-sm font-semibold text-gray-700 mb-1.5">密码</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input id="loginPwd" type="password" value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)} placeholder="请输入密码" className={`${inputClass} pl-10`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                      <span className="text-gray-500">记住我</span>
                    </label>
                    <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">忘记密码？</a>
                  </div>

                  <button type="submit" disabled={!loginAccount || !loginPwd || loading}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${loginAccount && loginPwd && !loading ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200/30 hover:shadow-xl hover:from-teal-600 hover:to-teal-700 active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    {loading ? (
                      <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>登录中...</>
                    ) : '登录'}
                  </button>
                </form>
              </div>
            )}

            {/* Register form */}
            {tab === 'register' && (
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-display)] mb-1">创建账号</h2>
                <p className="text-sm text-gray-400 mb-6">注册新账号以使用系统</p>

                {registered ? (
                  <div className="flex flex-col items-center justify-center py-10 animate-fade-in-up">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-lg font-bold text-gray-900">注册成功！</p>
                    <p className="text-sm text-gray-400 mt-1">即将跳转到登录页...</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label htmlFor="regName" className="block text-xs font-semibold text-gray-700 mb-1">姓名</label>
                        <input id="regName" type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="请输入姓名" className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="regWorkId" className="block text-xs font-semibold text-gray-700 mb-1">工号</label>
                        <input id="regWorkId" type="text" value={regWorkId} onChange={(e) => setRegWorkId(e.target.value)} placeholder="请输入工号" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="regRole" className="block text-xs font-semibold text-gray-700 mb-1">注册角色</label>
                      <select id="regRole" value={regRole} onChange={(e) => setRegRole(e.target.value as Role)}
                        className={inputClass}>
                        <option value="doctor">医生</option>
                        <option value="nurse">护士</option>
                        <option value="reception">前台</option>
                        <option value="admin">管理员</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="regAccount" className="block text-xs font-semibold text-gray-700 mb-1">登录账号</label>
                      <input id="regAccount" type="text" value={regAccount} onChange={(e) => setRegAccount(e.target.value)} placeholder="设置登录账号" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="regPwd" className="block text-xs font-semibold text-gray-700 mb-1">设置密码</label>
                      <input id="regPwd" type="password" value={regPwd} onChange={(e) => setRegPwd(e.target.value)} placeholder="设置密码（至少6位）" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="regPwdConfirm" className="block text-xs font-semibold text-gray-700 mb-1">确认密码</label>
                      <input id="regPwdConfirm" type="password" value={regPwdConfirm} onChange={(e) => setRegPwdConfirm(e.target.value)} placeholder="再次输入密码" className={`${inputClass} ${regPwdConfirm && regPwd !== regPwdConfirm ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : ''}`} />
                      {regPwdConfirm && regPwd !== regPwdConfirm && <p className="text-xs text-red-500 mt-1">两次密码不一致</p>}
                    </div>

                    <button type="submit" disabled={!regName || !regWorkId || !regAccount || !regPwd || !regPwdConfirm || regPwd !== regPwdConfirm || loading}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${regName && regWorkId && regAccount && regPwd && regPwdConfirm && regPwd === regPwdConfirm && !loading ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200/30 hover:shadow-xl hover:from-teal-600 hover:to-teal-700 active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                      {loading ? (
                        <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>注册中...</>
                      ) : '注册'}
                    </button>

                    <p className="text-xs text-gray-400 text-center pt-1">
                      注册即表示同意
                      <a href="#" className="text-teal-600 hover:underline mx-1">用户协议</a>和<a href="#" className="text-teal-600 hover:underline ml-1">隐私政策</a>
                    </p>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
