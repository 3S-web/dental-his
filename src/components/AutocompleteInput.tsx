import { useState, useRef, useEffect } from 'react'
import { searchTerms } from '../data/dentalTerms'

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
}

export default function AutocompleteInput({ value, onChange, placeholder, rows = 2, className }: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<{ text: string; category: string }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [lastPinyin, setLastPinyin] = useState('')

  // Detect when user types pinyin (consecutive lowercase letters)
  const handleChange = (newValue: string) => {
    onChange(newValue)

    // Extract the last "word" - either Chinese text or pinyin letters
    const cursorPos = inputRef.current?.selectionStart || newValue.length
    const textBeforeCursor = newValue.slice(0, cursorPos)

    // Match last pinyin-like segment (consecutive lowercase letters at end)
    const pinyinMatch = textBeforeCursor.match(/([a-z]+)$/i)
    const query = pinyinMatch ? pinyinMatch[1] : ''

    if (query.length >= 1) {
      setLastPinyin(query)
      const results = searchTerms(query)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
      setSelectedIndex(-1)
    } else {
      setLastPinyin('')
      setShowSuggestions(false)
    }
  }

  const insertSuggestion = (text: string) => {
    const cursorPos = inputRef.current?.selectionStart || value.length
    const before = value.slice(0, cursorPos)
    const after = value.slice(cursorPos)

    // Replace the pinyin letters with the selected text
    if (lastPinyin) {
      const pinyinStart = before.length - lastPinyin.length
      const newValue = value.slice(0, pinyinStart) + text + after
      onChange(newValue)
    } else {
      onChange(before + text + after)
    }

    setShowSuggestions(false)
    setLastPinyin('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault()
        insertSuggestion(suggestions[selectedIndex].text)
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const baseClass = className || "w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all resize-none"

  return (
    <div ref={wrapperRef} className="relative">
      <textarea
        ref={inputRef}
        rows={rows}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={baseClass}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
          <div className="p-1.5">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => insertSuggestion(s.text)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2.5 ${
                  i === selectedIndex ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs font-medium text-teal-500 bg-teal-50 px-1.5 py-0.5 rounded min-w-[36px] text-center shrink-0">
                  {s.category}
                </span>
                <span className="truncate">{s.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
