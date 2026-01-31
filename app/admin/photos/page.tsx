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
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload photos')
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
      alert('Failed to update photo')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      await fetch(`/api/photos/${id}`, { method: 'DELETE' })
      await fetchPhotos()
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete photo')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Photos Management</h1>
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          <Plus className="h-5 w-5 mr-2" />
          Upload Photos
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
                className="bg-blue-600 text-white p-2 rounded-full"
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
              <p className="text-xs text-gray-600 mt-1 truncate">{photo.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Add Photo Captions</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false)
                    setPendingPhotos([])
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {pendingPhotos.map((photo, index) => (
                  <div key={index} className="border rounded-lg p-4 flex gap-4">
                    <img
                      src={photo.url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium mb-2">{photo.file.name}</p>
                      <textarea
                        placeholder="Add a caption/description (optional)"
                        value={photo.description}
                        onChange={(e) => updateDescription(index, e.target.value)}
                        className="w-full border rounded px-3 py-2 resize-none"
                        rows={3}
                      />
                    </div>
                    <button
                      onClick={() => removePendingPhoto(index)}
                      className="text-red-600 hover:text-red-700"
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
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadAll}
                  disabled={uploading || pendingPhotos.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : `Upload ${pendingPhotos.length} Photo${pendingPhotos.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Description Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Caption</h2>
                <button
                  onClick={() => {
                    setEditingPhoto(null)
                    setEditDescription('')
                  }}
                  className="text-gray-500 hover:text-gray-700"
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
                placeholder="Add a caption/description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full border rounded px-3 py-2 resize-none mb-4"
                rows={4}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingPhoto(null)
                    setEditDescription('')
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditDescription}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
