'use client'

import { useEffect, useRef } from 'react'

interface Props {
  initialData?: object
  readOnly?: boolean
  editorRef?: React.MutableRefObject<any>
}

export default function MindElixirEditor({ initialData, readOnly = false, editorRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    import('mind-elixir').then(({ default: MindElixir, DARK_THEME }) => {
      // 清除舊實例
      if (containerRef.current) containerRef.current.innerHTML = ''

      const defaultData = {
        nodeData: {
          id: 'root',
          topic: '中心主題',
          root: true,
          children: [],
        },
      }

      const me = new MindElixir({
        el: containerRef.current!,
        direction: MindElixir.RIGHT,
        draggable: !readOnly,
        editable: !readOnly,
        contextMenu: !readOnly,
        toolBar: !readOnly,
        nodeMenu: !readOnly,
        keypress: !readOnly,
        theme: DARK_THEME,
      })

      me.init(initialData || defaultData)

      // 置中顯示
      setTimeout(() => {
        if (me.toCenter) me.toCenter()
      }, 100)

      if (editorRef) {
        editorRef.current = me
      }
    })

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl border border-slate-700"
      style={{ height: readOnly ? '500px' : '600px' }}
    />
  )
}
