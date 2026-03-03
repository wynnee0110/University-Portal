import { UploadCloud } from 'lucide-react'
import React, { useRef, useState, useEffect } from 'react'

type UploadedFile = {
    url: string
    publicId: string
    format?: string
    width?: number
    height?: number
    bytes?: number
    createdAt?: string
}

type UploadWidgetProps = {
    value?: UploadedFile | null
    onChange?: (file: UploadedFile | null) => void
    disabled?: boolean
}

const UploadWidget = ({ value = null, onChange, disabled = false }: UploadWidgetProps) => {
    const widgetRef = useRef<any>(null)
    const onChangeRef = useRef(onChange)
    const [preview, setPreview] = useState<UploadedFile | null>(value)
    const [deleteToken, setDeleteToken] = useState<string | null>(null)

    useEffect(() => {
        setPreview(value)
        if (!value) setDeleteToken(null)
    }, [value])

    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
        if (widgetRef.current) return

        const widget = (window as any).cloudinary.createUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
                folder: 'classroom',
                resourceType: 'image',
                clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif'],
                maxFileSize: 10485760,
            },
            (error: any, results: any) => {
                if (error) {
                    console.error('Upload error:', error)
                    return
                }
                if (results?.event === 'success') {
                    const file: UploadedFile = {
                        url: results.info.secure_url,
                        publicId: results.info.public_id,
                        format: results.info.format,
                        width: results.info.width,
                        height: results.info.height,
                        bytes: results.info.bytes,
                        createdAt: new Date().toISOString(),
                    }
                    setPreview(file)
                    setDeleteToken(results.info.public_id)
                    onChangeRef.current?.(file)
                }
            }
        )

        widgetRef.current = widget
    }, [])

    const openWidget = () => {
        if (!disabled) {
            widgetRef.current?.open()
        }
    }

    const removeImage = () => {
        setPreview(null)
        setDeleteToken(null)
        onChangeRef.current?.(null)
    }

    return (
        <div className='space-y-2'>
            {preview ? (
                <div className='upload-preview'>
                    <img src={preview.url} alt='Uploaded file' className='upload-preview-img' />
                    <button
                        type='button'
                        className='upload-remove-btn'
                        onClick={removeImage}
                        disabled={disabled}
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <div
                    className='upload-dropzone'
                    role='button'
                    tabIndex={0}
                    onClick={openWidget}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            openWidget()
                        }
                    }}
                >
                    <div className='upload-prompt'>
                        <UploadCloud className='icon' />
                        <div>
                            <p className='upload-text'>Click to upload or drag and drop</p>
                            <p className='upload-text-small'>PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UploadWidget