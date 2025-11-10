import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [file, setFile] = useState<File | null>(null)
    const maxFileSize = 20 * 1024 * 1024 // 20MB

    const onDrop = useCallback((acceptedFiles: File[], event?: any) => {
        // If event exists and items are available, prevent directories
        if (event?.dataTransfer?.items) {
            for (const item of event.dataTransfer.items) {
                if (item.kind === 'file') {
                    const entry = item.webkitGetAsEntry?.()
                    if (entry?.isDirectory) {
                        alert('Directories are not allowed. Please select a PDF file.')
                        return
                    }
                }
            }
        }

        // Pick the first PDF file
        const pdfFile = acceptedFiles.find(f => f.type === 'application/pdf')
        if (!pdfFile) {
            alert('Only PDF files are allowed.')
            setFile(null)
            onFileSelect?.(null)
            return
        }

        setFile(pdfFile)
        onFileSelect?.(pdfFile)
    }, [onFileSelect])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize
    })

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()} className="cursor-pointer p-4 text-center border-2 border-dashed rounded">
                <input {...getInputProps()} />
                {file ? (
                    <div className="uploader-selected-file flex items-center justify-between px-2 py-1 bg-gray-100 rounded">
                        <div className="flex items-center space-x-3">
                            <img src="/images/pdf.png" alt="pdf" className="w-6 h-6" />
                            <div>
                                <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</p>
                                <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={e => {
                                e.stopPropagation()
                                setFile(null)
                                onFileSelect?.(null)
                            }}
                        >
                            <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                            <img src="/icons/info.svg" alt="upload" className="w-16 h-16" />
                        </div>
                        <p className="text-lg text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-lg text-gray-500">PDF only (max {formatSize(maxFileSize)})</p>
                        {isDragActive && <p className="text-red-500 mt-2">Drop the file here...</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FileUploader
