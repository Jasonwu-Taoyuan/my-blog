'use client'

import { useEffect, useState } from 'react'
import { Plus, X, Edit2 } from 'lucide-react'
import Image from 'next/image'

interface PhotoWithCaption {
  file: File
  url: string
  description: string
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [pendingPhotos, setPendingPhotos] = useState<PhotoWithCaption[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<any>(null)
  const [editDescription, setEditDescription] = useState('')

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    const response = await fetch('/api/photos')
    const data = await response.json()
    setPhotos(data.photos)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPhotos: PhotoWithCaption[] = Array.from(files).map(file => ({
      file,
      url: URL.createObjectURL(file),
      description: ''
    }))

    setPendingPhotos(newPhotos)
    setShowUploadModal(true)
    e.target.value = ''
  }

  const updateDescription = (index: number, description: string) => {
    setPendingPhotos(prev => prev.map((photo, i) =>
      i === index ? { ...photo, description } : photo
    ))
  }

  const removePendingPhoto = (index: number) => {
    setPendingPhotos(prev => prev.filter((_, i) => i !== index))
    if (pendingPhotos.length === 1) {
      setShowUploadModal(false)
    }
  }

  const handleUploadAll = async () => {
    setUploading(true)
    const failed: string[] = []
    try {
      for (const photo of pendingPhotos) {
        const formData = new FormData()
        formData.append('file', photo.file)
        formData.append('folder', 'photos')

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const uploadData = await uploadRes.json()

        if (!uploadRes.ok || !uploadData.url) {
          failed.push(`${photo.file.name}：${uploadData.error || '上傳失敗'}`)
          continue
        }

        await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: uploadData.url,
            title: photo.file.name,
            description: photo.description || null,
          }),
        })
      }

      await fetchPhotos()
      setPendingPhotos([])
      setShowUploadModal(false)

      if (failed.length > 0) {
        alert(`以下相片上傳失敗：\n${failed.join('\n')}`)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('相片上傳失敗')
    } finally {
      setUploading(false)
    }
  }

  const handleEditDescription = async () => {
    if (!editingPhoto) return

    try {
      await fetch(`/api/photos/${editingPhoto.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: editDescription || null,
        }),
      })

      await fetchPhotos()
      setEditingPhoto(null)
      setEditDescription('')
    } catch (error) {
      console.error('Edit failed:', error)
      alert('相片更新失敗')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這張相片嗎？')) return

    try {
      await fetch(`/api/photos/${id}`, { method: 'DELETE' })
      await fetchPhotos()
    } catch (error) {
      console.error('Delete failed:', error)
      alert('相片刪除失敗')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">相片管理</h1>
        <label className="inline-flex items-center px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors cursor-pointer">
          <Plus className="h-5 w-5 mr-2" />
          上傳相片
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <div className="relative aspect-square">
              <Image
                src={photo.imageUrl}
                alt={photo.title || 'Photo'}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setEditingPhoto(photo)
                  setEditDescription(photo.description || '')
                }}
                className="bg-[var(--accent)] text-white p-2 rounded-full"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(photo.id)}
                className="bg-red-600 text-white p-2 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {photo.description && (
              <p className="text-xs text-neutral-400 mt-1 truncate">{photo.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-neutral-200 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-neutral-900">新增相片說明</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false)
                    setPendingPhotos([])
                  }}
                  className="text-neutral-400 hover:text-neutral-800"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {pendingPhotos.map((photo, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4 flex gap-4">
                    <img
                      src={photo.url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-neutral-800 mb-2">{photo.file.name}</p>
                      <textarea
                        placeholder="新增說明文字（選填）"
                        value={photo.description}
                        onChange={(e) => updateDescription(index, e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-neutral-900 resize-none"
                        rows={3}
                      />
                    </div>
                    <button
                      onClick={() => removePendingPhoto(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowUploadModal(false)
                    setPendingPhotos([])
                  }}
                  className="px-4 py-2 border border-neutral-300 text-neutral-600 rounded-lg hover:bg-neutral-50"
                  disabled={uploading}
                >
                  取消
                </button>
                <button
                  onClick={handleUploadAll}
                  disabled={uploading || pendingPhotos.length === 0}
                  className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50"
                >
                  {uploading ? '上傳中...' : `上傳 ${pendingPhotos.length} 張相片`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Description Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-neutral-200 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-neutral-900">編輯說明</h2>
                <button
                  onClick={() => {
                    setEditingPhoto(null)
                    setEditDescription('')
                  }}
                  className="text-neutral-400 hover:text-neutral-800"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <img
                  src={editingPhoto.imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded"
                />
              </div>

              <textarea
                placeholder="新增說明文字"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-neutral-900 resize-none mb-4"
                rows={4}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingPhoto(null)
                    setEditDescription('')
                  }}
                  className="px-4 py-2 border border-neutral-300 text-neutral-600 rounded-lg hover:bg-neutral-50"
                >
                  取消
                </button>
                <button
                  onClick={handleEditDescription}
                  className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)]"
                >
                  儲存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
