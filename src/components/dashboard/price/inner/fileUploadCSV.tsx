import { useState } from 'react'

import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useDropzone } from 'react-dropzone'
import Alert from '@mui/material/Alert'

type FileProp = File & {
  name: string
  type: string
  size: number
  preview?: string
}

type FileUploadCSVProps = {
  onFileUpload: (file: File | null) => void
}

const FileUploadCSV = ({ onFileUpload }: FileUploadCSVProps) => {
  const [files, setFiles] = useState<FileProp[]>([])
  const [error, setError] = useState<string | null>(null)

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'text/csv': ['.csv']
    },
    onDrop: (acceptedFiles: File[], rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        setError('กรุณาอัปโหลดเฉพาะไฟล์ .csv เท่านั้น')

        return
      }

      setError(null)

      const newFiles = acceptedFiles.map((file) => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))

      setFiles(newFiles)
      onFileUpload(newFiles[0] || null)
    }
  })

  const handleRemoveFile = (file: FileProp) => {
    const updatedFiles = files.filter((i) => i.name !== file.name)

    setFiles(updatedFiles)
    onFileUpload(updatedFiles[0] || null)
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details flex gap-2'>
        <div className='file-preview'>
          <i className='tabler-file-spreadsheet text-2xl' />
        </div>
        <div>
          <Typography className='file-name break-all'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='tabler-x text-xl' />
      </IconButton>
    </ListItem>
  ))

  return (
    <>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className='flex items-center flex-col p-4 cursor-pointer border-dashed rounded-md border-2'>
          <Avatar variant='rounded' className='bs-12 is-12 mbe-2'>
            <i className='tabler-upload' />
          </Avatar>
          <Typography variant='h4' className='mbe-2.5'>
            วางไฟล์ .CSV ไว้ที่นี่เพื่ออัพโหลด
          </Typography>
          <Typography variant='body2' color="textSecondary">
            (รองรับเฉพาะไฟล์ .csv เท่านั้น)
          </Typography>
        </div>
      </div>
      {error && (
        <Alert severity="error" className="mt-2">
          {error}
        </Alert>
      )}
      {files.length > 0 && (
        <List>{fileList}</List>
      )}
    </>
  )
}

export default FileUploadCSV
