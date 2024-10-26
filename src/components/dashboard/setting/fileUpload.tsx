import React, { useState, useCallback, useEffect } from 'react'

import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onFileSelected: (file: File | null) => void
  currentImageUrl?: string
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, currentImageUrl }) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);

      setPreview(previewUrl);
      onFileSelected(file);
    }
  }, [onFileSelected]);

  useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    },
    onDrop
  });

  return (
    <Box {...getRootProps({ className: 'dropzone' })} sx={{ height: 250, border: '1px dashed grey', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
      <input {...getInputProps()} />
      {preview ? (
        preview.endsWith('.svg') ? (
          <object data={preview} type="image/svg+xml" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}>
            Your browser does not support SVG
          </object>
        ) : (
          <img src={preview} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
        )
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Avatar sx={{ width: 40, height: 40, margin: '0 auto' }}>
            <i className="tabler-upload" />
          </Avatar>
          <Typography variant="subtitle1">
            แนบภาพ QR สำหรับให้ลูกค้าโอนเงินที่นี่...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload
