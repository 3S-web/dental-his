/* ==================== SpeechAgent — 语音识别（Mock） ==================== */

// Mock: simulate speech-to-text with realistic dental consultation content
export function mockTranscribe(_audioDuration?: number): string {
  const templates = [
    `今天来复诊，种植牙三个月了。恢复得挺好的，不疼，也没有肿。CBCT做了，骨结合不错。继续观察，三个月以后修复。不用开药。`,
    `帮我看看王晓明，今天来洁牙。他说牙龈有点出血。检查发现下前牙牙结石比较多。超声波洁治加喷砂抛光。`,
    `张建国来复诊，牙周炎。上次刮治以后好多了，但刷牙还是出血。再刮一次右下区，局麻下做。血压今天量了138/86，可以做。`,
    `新患者李小明，8岁，来检查牙齿。妈妈说后面大牙长出来了还没做窝沟封闭。检查四颗六龄牙都长出来了，做窝沟封闭。`,
    `赵丽娜今天种牙。右上六号牙缺了三个月，骨量够。士卓曼BLT 4.1乘10。术后开阿莫西林和布洛芬。`,
    `主诉牙疼三天，冷热刺激痛。检查发现左下六号牙深龋，探痛明显，冷诊敏感。诊断慢性牙髓炎，建议根管治疗。今天先开髓减压。`,
  ]
  return templates[Math.floor(Math.random() * templates.length)]
}

// Simulate streaming transcription
export async function* mockStreamTranscribe(): AsyncGenerator<string> {
  const text = mockTranscribe(0)
  const words = text.split('')
  let current = ''
  for (const char of words) {
    current += char
    yield current
    await new Promise((r) => setTimeout(r, 30 + Math.random() * 50))
  }
}
