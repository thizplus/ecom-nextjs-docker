import { useState, useEffect } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Pagination from '@mui/material/Pagination'

import type { TypeClient } from '@/types/clientTypes'
import type { TypeOrder } from '@/types/orderTypes'
import actionGetOrders from '@/actions/orders/getOrders'
import OrderDetail from './orderDetail'
import formatThaiDateTime from '@/components/global/functions/formatThaiDateTime'
import getStatusColor from '@/components/global/functions/statusColor'

type propsMyOrders = {
  profile: TypeClient;
  priceId: string;
}

const MyOrders = ({ profile, priceId }: propsMyOrders) => {
  const [open, setOpen] = useState<boolean>(false)
  const [orders, setOrders] = useState<TypeOrder[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await actionGetOrders({
          userId: profile.userId,
          typeId: priceId,
          page: currentPage,
          limit: 10
        })

        setOrders(result.items)
        setTotalPages(result.totalPages)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    if (open) {
      fetchOrders()
    }
  }, [profile.userId, priceId, currentPage, open])

  return (
    <>
      <img
        onClick={handleClickOpen}
        src={profile.pictureUrl}
        alt={profile.displayName}
        className='max-w-[46px] rounded border cursor-pointer'
      />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id='alert-dialog-title'>MY ORDERS</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <div className="font-bold mb-2">เลขที่คำสั่งซื้อ</div>
            {orders.map((order) => (
              <div key={order.orderId} className="border-b py-2 flex justify-between">
                <div className=' leading-none'>
                  <p className='text-sm font-bold leading-none block'>{order.orderId}</p>
                  <p className={`text-sm font-bold leading-none ${getStatusColor(order.payment.status)}`}>{order.payment.status}</p>
                  <p className='text-xs'>{formatThaiDateTime(order.createdAt.toString())}</p>
                </div>
                <div className='flex gap-2'>
                  <OrderDetail order={order} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='contained' color='error'>
            ปิดหน้าจอ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MyOrders
