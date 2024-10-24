// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import Snackbar from '@mui/material/Snackbar'

import Alert from '@mui/material/Alert'

import { useQueryClient } from '@tanstack/react-query'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import IconButton from '@mui/material/IconButton'

import type { TypePrice } from '@/types/priceTypes'
import deletePriceById from '@/actions/backend/price/deletePriceById'

type propsDelete = {
  items: TypePrice;
}

const BtnDeletePrice = ({ items }: propsDelete) => {
  // States

  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false)
  const [isProcess, setIsProcess] = useState<boolean>(false)

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })


  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleDeletePrice = async () => {
    if (!items._id) {
      return;
    }

    setIsProcess(true);

    try {

      await deletePriceById(items._id);

      setSnackbar({ open: true, message: 'Delete Price completed successfully', severity: 'success' });
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['prices'] }),
        queryClient.invalidateQueries({ queryKey: ['searchPrice'] })
      ]);
    } catch (error) {
      setSnackbar({ open: true, message: 'Delete Price failed', severity: 'error' });
    } finally {
      setIsProcess(false);
      setOpen(false);
    }
  };

  return (
    <>

      <IconButton aria-label="delete" color='error' onClick={handleClickOpen}>
        <DeleteForeverIcon />
      </IconButton>






      <Dialog
        open={open}
        maxWidth='xs'
        fullWidth
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>DELETE PRICE : {items.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            คุณต้องการลบราคาสินค้า {`"${items.name}"`} รหัส {`"${items._id}"`} ใช่หรือไม่ ?
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button
            onClick={handleDeletePrice}
            variant='contained'
            color='error'
            disabled={isProcess}
          > {isProcess ? 'กำลังลบข้อมูล...' : 'ยืนยัน'}</Button>
          <Button onClick={handleClose} variant='outlined'>ยกเลิก</Button>
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

export default BtnDeletePrice
