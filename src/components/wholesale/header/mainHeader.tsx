
import { useClientStores } from '@/stores/authStore'

//import { useAuth } from '@/actions/client/useAuth'
import MyOrders from '../../global/header/myOrders'
import TotalCart from './totalCart'



type propsPriceInfo = {
  priceId: string
  priceName: string

}

const MainHeader = ({ priceId, priceName }: propsPriceInfo) => {
  const { user, isLoggedIn } = useClientStores()

  //const { handleLogout } = useAuth()

  return (
    <>
      <div className="p-4 fixed w-full bg-white shadow-md z-10 max-w-[430px]">
        <div className='flex gap-2 justify-between'>
          <div className="flex gap-2 leading-none">
            {user && isLoggedIn &&
              <MyOrders profile={user} priceId={priceId} />
            }
            <div className='block leading-none'>
              <h2 className='text-[22px]'>{priceName}</h2>
              <p className="text-xs leading-none">รหัส: {priceId}</p>
              {user && isLoggedIn &&
                <p className="text-xs leading-none">คุณ: {user.displayName}</p>
              }
            </div>
          </div>

          {isLoggedIn &&
            <TotalCart priceId={priceId} />
          }
        </div>
      </div>
      <div className="h-[80px]"></div>
    </>
  )
}

export default MainHeader
