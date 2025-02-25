import React from 'react'

interface ScrollableRowProps {
  items: React.ReactNode[]
}

export function ScrollableRow({ items }: ScrollableRowProps) {
  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <div className="flex gap-4 pb-4 snap-x snap-mandatory">
        {items.map((item, index) => (
          <div key={index} className="snap-start">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

