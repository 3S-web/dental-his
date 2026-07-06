/* ==================== SpeechAgent — 真实浏览器语音识别 ==================== */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechAPI = any

const SpeechCtor: SpeechAPI | undefined =
  (window as unknown as Record<string, unknown>).SpeechRecognition ||
  (window as unknown as Record<string, unknown>).webkitSpeechRecognition

// Real Web Speech API recognition
export function createSpeechRecognition(lang = 'zh-CN'): SpeechAPI | null {
  if (!SpeechCtor) return null
  const recognition = new SpeechCtor()
  recognition.lang = lang
  recognition.interimResults = true
  recognition.continuous = true
  return recognition
}

// Check if browser supports speech recognition
export function isSpeechSupported(): boolean {
  return !!SpeechCtor
}

// Mock: simulate speech-to-text (fallback)
export function mockTranscribe(): string {
  const templates = [
    `今天来复诊，种植牙三个月了。恢复得挺好的，不疼，也没有肿。CBCT做了，骨结合不错。继续观察，三个月以后修复。不用开药。`,
    `帮我看看王晓明，今天来洁牙。他说牙龈有点出血。检查发现下前牙牙结石比较多。超声波洁治加喷砂抛光。`,
    `主诉牙疼三天，冷热刺激痛。检查发现左下六号牙深龋，探痛明显，冷诊敏感。诊断慢性牙髓炎，建议根管治疗。`,
    `新患者李小明，8岁，来检查牙齿。妈妈说后面大牙长出来了还没做窝沟封闭。检查四颗六龄牙都长出来了。`,
  ]
  return templates[Math.floor(Math.random() * templates.length)]
}

// Simulate streaming transcription (fallback)
export async function* mockStreamTranscribe(): AsyncGenerator<string> {
  const text = mockTranscribe()
  const words = text.split('')
  let current = ''
  for (const char of words) {
    current += char
    yield current
    await new Promise((r) => setTimeout(r, 30 + Math.random() * 50))
  }
}
