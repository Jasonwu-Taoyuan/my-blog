'use client'

import dynamic from 'next/dynamic'

const MindElixirEditor = dynamic(() => import('./MindElixirEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-xl border border-slate-700 bg-slate-900 animate-pulse" style={{ height: '500px' }} />
  ),
})

export default function MindElixirViewer({ data }: { data: object }) {
  return <MindElixirEditor initialData={data} readOnly={true} />
}
