import type { ChangeEvent } from 'react';
import { useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import { useQueryClient } from '@tanstack/react-query'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import CustomTextField from '@core/components/mui/TextField'
import type { TypesProductInner } from '@/types/productTypes'
import actionUpdatePrice from '@/actions/backend/price/inner/updatePrice'

type PropsUpdate = {
  items: TypesProductInner;
  priceId: string;
}

const BtnUpdate = ({ items, priceId }: PropsUpdate) => {
  const queryClient = useQueryClient()
  const [isProcess, setIsProcess] = useState<boolean>(false)

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  const [open, setOpen] = useState<boolean>(false)
  const [price, setPrice] = useState<number>(items.price)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrice(parseInt(event.target.value))
  }

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false })

  const handleUpdate = async () => {
    if (!price) {
      setSnackbar({ open: true, message: 'Please input price before update', severity: 'error' })

      return
    }

    setIsProcess(true)

    try {
      await actionUpdatePrice({ sku: items.sku, priceId: priceId, newPrice: price })
      setSnackbar({ open: true, message: 'Update price completed successfully', severity: 'success' })
      setOpen(false)

      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['productsByPriceId'] }),
        queryClient.invalidateQueries({ queryKey: ['productSearchByPriceId'] })
      ])
    } catch (error) {
      setSnackbar({ open: true, message: 'Update price failed', severity: 'error' })
    } finally {
      setIsProcess(false)
    }
  }

  // New function to handle key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleUpdate()
    }
  }

  return (
    <>
      <IconButton aria-label="edit" onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>UPDATE PRICE</DialogTitle>
        <DialogContent>
          <DialogContentText className='mbe-3'>
            รหัสสินค้า {items.sku} : {items.name}
          </DialogContentText>
          <CustomTextField
            onChange={handleChange}
            onKeyDown={handleKeyDown} // Add this line
            onFocus={(event) => event.target.select()}
            value={price}
            id='price'
            autoFocus
            fullWidth
            type='number'
            label='ราคา'
          />
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button
            onClick={handleUpdate}
            variant='contained'
            color='success'
            disabled={isProcess}>
            {isProcess ? 'กำลังแก้ไขราคา...' : 'แก้ไขราคา'}
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

export default BtnUpdate
