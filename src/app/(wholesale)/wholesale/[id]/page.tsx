
import React from 'react'

import MainWholesale from '@/components/wholesale/mainWholesale'



function page({ params }: { params: { id: string } }) {
  return (
    <>
      <MainWholesale priceId={params.id} />
    </>
  )
}

export default page
