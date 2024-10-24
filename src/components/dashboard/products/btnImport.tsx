'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import actionImports from '@/actions/backend/products/imports'

const BtnImport = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [isImporting, setIsImporting] = useState<boolean>(false)

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleImport = async () => {
    setIsImporting(true)

    try {
      await actionImports()

      setSnackbar({ open: true, message: 'Import completed successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Import failed', severity: 'error' })
    } finally {
      setIsImporting(false)
      setOpen(false)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <>
      <Button variant='contained'
        startIcon={<i className='tabler-upload' />}
        onClick={handleClickOpen}
        disabled={isImporting}>
        {isImporting ? 'กำลังนำเข้าข้อมูล...' : 'IMPORT ข้อมูลสินค้า'}
      </Button>


      <Dialog
        open={open}
        maxWidth='xs'
        fullWidth
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>IMPORT PRODUCT</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            คุณต้องการ IMPORT ข้อมูลสินค้าจาก ZORTOUT ทั้งหมด ใช่หรือไม่ ?
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button variant='contained' onClick={handleImport} disabled={isImporting}>
            {isImporting ? 'กำลังนำเข้าข้อมูล...' : 'ยืนยัน'}
          </Button>
          <Button variant='contained' color='error' onClick={handleClose} disabled={isImporting}>
            ยกเลิก
          </Button>
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
            boxShadow: 3, // เพิ่มเงา
            borderRadius: 2 // ปรับความโค้งของมุม
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </>
  )
}

export default BtnImport
