
import React, { useState } from 'react'
import { useSwipeGesture } from '@/hooks/useSwipeGesture'
import { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent } from './enhanced-tabs'
import { cn } from '@/lib/utils'

interface SwipeableTabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  tabs: Array<{
    value: string
    label: string
  }>
}

export const SwipeableTabs = ({ 
  defaultValue, 
  value, 
  onValueChange, 
  children, 
  className,
  tabs
}: SwipeableTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value || '')
  const currentValue = value || activeTab

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue)
    onValueChange?.(newValue)
  }

  const handleSwipeLeft = () => {
    const currentIndex = tabs.findIndex(tab => tab.value === currentValue)
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1].value
      handleTabChange(nextTab)
    }
  }

  const handleSwipeRight = () => {
    const currentIndex = tabs.findIndex(tab => tab.value === currentValue)
    if (currentIndex > 0) {
      const prevTab = tabs[currentIndex - 1].value
      handleTabChange(prevTab)
    }
  }

  const swipeRef = useSwipeGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    minSwipeDistance: 50
  })

  return (
    <div ref={swipeRef} className={cn("w-full", className)}>
      <EnhancedTabs value={currentValue} onValueChange={handleTabChange}>
        <EnhancedTabsList className="grid w-full mb-6 h-12 bg-white rounded-xl shadow-sm border border-gray-200" 
          style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map((tab) => (
            <EnhancedTabsTrigger 
              key={tab.value}
              value={tab.value}
              className="text-sm sm:text-base font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-300 rounded-lg m-1"
            >
              {tab.label}
            </EnhancedTabsTrigger>
          ))}
        </EnhancedTabsList>
        {children}
      </EnhancedTabs>
    </div>
  )
}

export const SwipeableTabsContent = EnhancedTabsContent
