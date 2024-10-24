'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import DialogContentText from '@mui/material/DialogContentText'

import { useQueryClient } from '@tanstack/react-query'

import SelectData from '@/components/global/selectData'

import type { TypePrice } from "@/types/priceTypes";
import actionCreatePrice from '@/actions/backend/price/createPrice'

//import actionImports from '@/actions/backend/products/imports'

type propsListItems = {
  listItems: TypePrice[]
}


const BtnCreatePrice = ({ listItems }: propsListItems) => {

  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false)
  const [isProcess, setIsProcess] = useState<boolean>(false)
  const [namePrice, setNamePrice] = useState<string>('')
  const [idPrice, setIdPrice] = useState<string | null>('')

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => {
    setIdPrice(null)
    setOpen(false)
  }


  const handleCreate = async () => {

    console.log('idPrice:', idPrice)

    if (!namePrice) {
      return;
    }

    setIsProcess(true);

    try {
      const createPriceData = {
        priceName: namePrice,
        defaultPrice: 0,
        copyFromId: idPrice || null
      };

      await actionCreatePrice(createPriceData);
      console.log('namePrice: ', namePrice);

      setSnackbar({ open: true, message: 'Add Price completed successfully', severity: 'success' });
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['prices'] }),
        queryClient.invalidateQueries({ queryKey: ['searchPrice'] })
      ]);
    } catch (error) {
      setSnackbar({ open: true, message: 'Add Price failed', severity: 'error' });
    } finally {
      setIdPrice(null)
      setIsProcess(false);
      setOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const onChangeCopy = (value: string) => {
    setIdPrice(value)
  }

  return (
    <>
      <Button variant='contained'
        startIcon={<i className='tabler-plus' />}
        onClick={handleClickOpen}
        disabled={isProcess}>
        {isProcess ? 'กำลังเพิ่มข้อมูล...' : 'เพิ่มราคาสินค้า'}
      </Button>


      <Dialog
        open={open}
        maxWidth='xs'
        fullWidth
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>CREATE PRICE</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' className='mb-2'>
            กรุณาตั้งชื่อเรทราคา [ห้ามซ้ำกัน]
          </DialogContentText>
          <TextField
            label="ชื่อเรทราคา"
            onChange={(e) => setNamePrice(e.target.value)}
            size="small"
            className='mb-4'
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                height: '40px',
              },
              '& .MuiInputLabel-root': {
                transform: 'translate(14px, 8px) scale(1)',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -6px) scale(0.75)',
                },
              },
            }}
          />

          <DialogContentText id='alert-dialog-copy' className='mb-2'>
            คัดลอกราคา
          </DialogContentText>
          <SelectData items={listItems} onChange={onChangeCopy} />

        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button variant='contained' onClick={handleCreate} disabled={isProcess}>
            {isProcess ? 'กำลังเพิ่มราคาสินค้า...' : 'ยืนยัน'}
          </Button>
          <Button variant='contained' color='error' onClick={handleClose} disabled={isProcess}>
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

export default BtnCreatePrice
