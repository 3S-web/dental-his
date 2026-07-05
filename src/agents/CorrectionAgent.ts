/* ==================== CorrectionAgent — 医学术语纠错 ==================== */

// Oral → medical expression mapping
const corrections: [RegExp, string][] = [
  [/骨头长得挺好/g, '骨结合良好'],
  [/骨头长得不错/g, '骨结合良好'],
  [/没肿/g, '无明显肿胀'],
  [/不肿/g, '无明显肿胀'],
  [/不疼/g, '无明显疼痛'],
  [/没疼/g, '无明显疼痛'],
  [/恢复挺好的/g, '术后恢复良好'],
  [/恢复不错/g, '术后恢复良好'],
  [/长得不错/g, '愈合良好'],
  [/长得挺好/g, '愈合良好'],
  [/不出血了/g, '出血已停止'],
  [/有点出血/g, '轻微出血'],
  [/挺多的/g, '较多'],
  [/有点/g, '轻度'],
  [/挺/g, '较'],
  [/后面大牙/g, '磨牙'],
  [/前面牙/g, '前牙'],
  [/门牙/g, '中切牙'],
  [/虎牙/g, '尖牙'],
  [/虫牙/g, '龋齿'],
  [/牙洞/g, '龋坏'],
  [/牙石/g, '牙结石'],
  [/洗牙/g, '洁治'],
  [/补牙/g, '充填'],
  [/抽神经/g, '根管治疗'],
  [/种牙/g, '种植体植入'],
]

export function correctMedicalTerms(text: string): string {
  let result = text
  for (const [pattern, replacement] of corrections) {
    result = result.replace(pattern, replacement)
  }
  return result
}

// Simulate step-by-step correction with explanations
export async function* mockCorrectWithExplanations(text: string): AsyncGenerator<{
  original: string
  corrected: string
  explanation: string
}> {
  const items: { original: string; corrected: string; explanation: string }[] = []

  for (const [pattern, replacement] of corrections) {
    if (pattern.test(text)) {
      // Extract the first match
      const match = text.match(pattern)
      if (match) {
        items.push({
          original: match[0],
          corrected: replacement,
          explanation: `口语"${match[0]}" → 医学表达"${replacement}"`,
        })
      }
    }
  }

  // Only yield unique items (max 5)
  const seen = new Set<string>()
  let count = 0
  for (const item of items) {
    if (!seen.has(item.original) && count < 5) {
      seen.add(item.original)
      yield item
      count++
      await new Promise((r) => setTimeout(r, 300))
    }
  }
}
