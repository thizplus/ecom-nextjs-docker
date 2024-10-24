// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import Providers from '@/components/Providers'


export const metadata = {
  title: `${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description:
    `${process.env.NEXT_PUBLIC_SITE_NAME}`
}

const Layout = async ({ children }: ChildrenType) => {
  const direction = 'ltr'


  return (

    <Providers direction={direction}>

      <div className='w-full max-w-[430px] min-h-screen overflow-y-auto mx-auto bg-white border-[#eee] border-[1px]'>
        {children}
      </div>


    </Providers>


  )
}

export default Layout
