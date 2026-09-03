'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { PiCaretDownDuotone } from 'react-icons/pi'

export interface DropdownItem {
  label?: string
  icon?: ReactNode
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
  divider?: boolean
}

/**
 * Dropdown rendered through a portal with fixed positioning, so no parent
 * card/table (overflow-hidden, overflow-x-auto, etc.) can clip the menu.
 * The menu closes on outside click, Escape, scroll or resize.
 */
export function Dropdown({
  trigger,
  items,
  align = 'right',
  label,
  block = false,
  width = 'auto',
  menuClassName = '',
  caret = false,
}: {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  label?: string
  /** Make the trigger fill its container width. */
  block?: boolean
  /** Match the menu width to the trigger ('trigger') or use a min-width ('auto'). */
  width?: 'auto' | 'trigger'
  /** Extra classes for the menu panel. */
  menuClassName?: string
  /** Show a caret next to the trigger content. */
  caret?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<CSSProperties | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const computePos = useCallback(() => {
    const trig = triggerRef.current
    if (!trig) return
    const rect = trig.getBoundingClientRect()
    const gap = 6
    const edge = 8
    const menuMinWidth = width === 'trigger' ? rect.width : 190
    const estimatedHeight = Math.min(items.length * 38 + 14, window.innerHeight - 24)
    const spaceBelow = window.innerHeight - rect.bottom - gap
    const spaceAbove = rect.top - gap

    const style: CSSProperties = {
      position: 'fixed',
      minWidth: menuMinWidth,
      maxHeight: Math.min(estimatedHeight, window.innerHeight - 24),
      overflowY: 'auto',
      zIndex: 110,
    }

    // Vertically: prefer below, flip above when there is no room.
    if (spaceBelow >= estimatedHeight || spaceBelow >= spaceAbove) {
      style.top = rect.bottom + gap
    } else {
      style.bottom = window.innerHeight - rect.top + gap
    }

    // Horizontally: anchor the menu to the trigger, then clamp it into the
    // viewport. Always position with `left` only — setting left AND right
    // together would stretch the menu to fill the gap between them.
    const anchorLeft = align === 'left' ? rect.left : rect.right - menuMinWidth
    style.left = Math.max(edge, Math.min(anchorLeft, window.innerWidth - edge - menuMinWidth))

    setPos(style)
  }, [align, items.length, width])

  useEffect(() => {
    if (!open) return
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node
      // The menu is portaled to <body>, so treat clicks inside it as "inside".
      if (wrapRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onClose() {
      setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onClose)
    document.addEventListener('scroll', onClose, true)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onClose)
      document.removeEventListener('scroll', onClose, true)
    }
  }, [open])

  useEffect(() => {
    if (open) computePos()
  }, [open, computePos])

  function handleToggle() {
    if (!open) computePos()
    setOpen((o) => !o)
  }

  const triggerButton = (
    <button
      ref={triggerRef}
      type="button"
      onClick={handleToggle}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label={label ?? 'Actions'}
      className={`inline-flex items-center gap-1 rounded ${block ? 'w-full' : ''}`}
    >
      {trigger}
      {caret && <PiCaretDownDuotone className="w-4 h-4 text-dark/40 shrink-0" />}
    </button>
  )

  return (
    <div ref={wrapRef} className={`relative ${block ? 'block' : 'inline-block'}`}>
      {triggerButton}

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={pos ?? { position: 'fixed', top: -9999, left: -9999 }}
            className={`bg-white border border-dark/10 rounded-lg py-1.5 ${menuClassName}`}
          >
            {items.map((item, i) => (
              <div key={i}>
                {item.divider && <div className="my-1.5 border-t border-dark/10" />}
                {!item.divider && (
                  <button
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      setOpen(false)
                      item.onClick?.()
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left disabled:opacity-40 disabled:cursor-not-allowed ${
                      item.danger ? 'text-red-600 hover:bg-red-50' : 'text-dark/80 hover:bg-dark/5'
                    }`}
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  )
}