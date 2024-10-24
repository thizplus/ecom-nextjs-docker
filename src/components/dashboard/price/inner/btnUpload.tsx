import { useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useQueryClient } from '@tanstack/react-query'

import BtnDownload from './btnDownload'
import FileUploadCSV from './fileUploadCSV'
import uploadPriceCSV from '@/actions/backend/price/inner/uploadPriceCSV'

type PropsUploadCSV = {
  priceId: string
  priceName: string
}

const BtnUploadCSV = ({ priceId, priceName }: PropsUploadCSV) => {
  const queryClient = useQueryClient()
  const [isProcess, setIsProcess] = useState<boolean>(false)

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  const [open, setOpen] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => {
    setUploadedFile(null)
    setOpen(false)
  }

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false })

  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file)
  }

  const handleProcess = async () => {
    if (!uploadedFile) {
      setSnackbar({ open: true, message: 'Please upload a CSV file first', severity: 'error' })

      return
    }

    setIsProcess(true)

    try {
      const formData = new FormData()

      formData.append('file', uploadedFile)
      formData.append('priceId', priceId)

      await uploadPriceCSV(formData)

      setSnackbar({ open: true, message: 'Upload .CSV completed successfully', severity: 'success' })
      setOpen(false)

      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['productsByPriceId'] }),
        queryClient.invalidateQueries({ queryKey: ['productSearchByPriceId'] })
      ]);

    } catch (error) {
      setSnackbar({ open: true, message: 'Upload .CSV failed', severity: 'error' })
    } finally {
      setIsProcess(false)


    }
  }

  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<DriveFolderUploadIcon />}
        color="error"
        onClick={handleClickOpen}
      >
        แก้ไขราคาด้วย .CSV
      </Button>

      <Dialog
        open={open}
        maxWidth='xs'
        fullWidth
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>แก้ไขราคา: {priceName} [{priceId}]</DialogTitle>
        <DialogContent>
          <p className='mb-1'>1. ดาวน์โหลดไฟล์ .CSV ราคาสินค้า</p>
          <BtnDownload priceId={priceId} priceName={priceName} />
          <p className='mt-4 mb-1'>2. อัพโหลดไฟล์ .CSV ที่แก้ไขราคาเรียบร้อยแล้ว</p>
          <FileUploadCSV onFileUpload={handleFileUpload} />
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button
            onClick={handleProcess}
            variant='contained'
            color='success'
            disabled={isProcess || !uploadedFile}>
            {isProcess ? 'กำลังประมวลผล...' : 'ประมวลผล'}
          </Button>
          <Button onClick={handleClose} variant='contained' color='error'>ยกเลิก</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            boxShadow: 3,
            borderRadius: 2
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default BtnUploadCSV
