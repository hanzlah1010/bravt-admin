import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"

import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants"

type FileWithPreview = File & {
  preview: string
}

export function useSingleFileSelect(disabled: boolean) {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>()

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    }
  }

  const dropzone = useDropzone({
    onDrop,
    disabled,
    accept: ALLOWED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    multiple: false,
    onDropRejected: (rejections) => {
      rejections.forEach(({ file, errors }) => {
        errors.forEach((err) => {
          switch (err.code) {
            case "too-many-files":
              toast.error("Maximum of 1 file is allowed.", { id: err.code })
              break

            case "file-invalid-type":
              toast.error(`"${file.name}" is not a valid image.`)
              break

            case "file-too-large":
              toast.error(
                `"${file.name}" exceeds the ${MAX_FILE_SIZE / 1024 / 1024} limit.`
              )
              break

            default:
              toast.error(`"${file.name}" was rejected.`)
              break
          }
        })
      })
    }
  })

  useEffect(() => {
    return () => {
      if (selectedFile) URL.revokeObjectURL(selectedFile.preview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { selectedFile, setSelectedFile, ...dropzone }
}
