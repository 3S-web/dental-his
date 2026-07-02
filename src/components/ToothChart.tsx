import { useState } from 'react'
import { permanentTeeth, toothConditionColors, toothConditionLabels } from '../data/mock'
import type { ToothCondition, ToothRecord } from '../data/mock'

interface ToothChartProps {
  teethRecords?: ToothRecord[]
  onToothClick?: (tooth: number) => void
  selectedTooth?: number | null
  editable?: boolean
}

const quadrants = [
  { label: '右上颌', teeth: permanentTeeth.upperRight, className: 'justify-end' },
  { label: '左上颌', teeth: permanentTeeth.upperLeft, className: 'justify-start' },
  { label: '右下颌', teeth: permanentTeeth.lowerRight, className: 'justify-end' },
  { label: '左下颌', teeth: permanentTeeth.lowerLeft, className: 'justify-start' },
]

export default function ToothChart({ teethRecords = [], onToothClick, selectedTooth, editable = false }: ToothChartProps) {
  const [hoveredTooth, setHoveredTooth] = useState<number | null>(null)
  const [showConditionPicker, setShowConditionPicker] = useState<number | null>(null)

  const getToothRecord = (tooth: number): ToothRecord | undefined =>
    teethRecords.find((t) => t.tooth === tooth)

  const conditions: ToothCondition[] = ['healthy', 'decay', 'filled', 'crown', 'missing', 'implant', 'root_canal', 'bridge']

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
      <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        牙位图 (FDI)
      </h4>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-5">
        {conditions.map((c) => (
          <span key={c} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${toothConditionColors[c]}`}>
            {toothConditionLabels[c]}
          </span>
        ))}
      </div>

      {/* Tooth chart grid */}
      <div className="space-y-3">
        {quadrants.map((quadrant) => (
          <div key={quadrant.label} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-medium w-12 text-right shrink-0">{quadrant.label}</span>
            <div className={`flex gap-0.5 flex-1 ${quadrant.className}`}>
              {quadrant.teeth.map((tooth) => {
                const record = getToothRecord(tooth)
                const condition = record?.condition || 'healthy'
                const isSelected = selectedTooth === tooth
                const isHovered = hoveredTooth === tooth

                return (
                  <div key={tooth} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        if (editable) {
                          setShowConditionPicker(showConditionPicker === tooth ? null : tooth)
                        }
                        onToothClick?.(tooth)
                      }}
                      onMouseEnter={() => setHoveredTooth(tooth)}
                      onMouseLeave={() => setHoveredTooth(null)}
                      className={`w-8 h-10 sm:w-9 sm:h-12 rounded-md border-2 flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-150 cursor-pointer
                        ${toothConditionColors[condition]}
                        ${isSelected ? 'ring-2 ring-teal-500 ring-offset-1 scale-110' : ''}
                        ${isHovered && !isSelected ? 'scale-105 shadow-sm' : ''}
                        ${editable ? 'hover:border-teal-400' : ''}
                      `}
                      title={`#${tooth} ${toothConditionLabels[condition]}${record?.note ? ` - ${record.note}` : ''}`}
                    >
                      <span className="leading-none">{tooth}</span>
                      <span className="text-[7px] sm:text-[8px] font-normal leading-none opacity-60 mt-0.5">{toothConditionLabels[condition]}</span>
                    </button>

                    {/* Condition picker popup for editable mode */}
                    {editable && showConditionPicker === tooth && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-20 min-w-[120px]">
                        <p className="text-[10px] font-semibold text-gray-500 mb-1.5 text-center">标记 #{tooth}</p>
                        <div className="grid grid-cols-2 gap-1">
                          {conditions.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                // In real app, update tooth record
                                setShowConditionPicker(null)
                              }}
                              className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-colors ${toothConditionColors[c]} hover:ring-1 hover:ring-teal-400 ${condition === c ? 'ring-2 ring-teal-500' : ''}`}
                            >
                              {toothConditionLabels[c]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
