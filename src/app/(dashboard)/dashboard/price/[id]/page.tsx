import React from 'react'

import MainInner from '@/components/dashboard/price/inner/MainInner'

export default function page({ params }: { params: { id: string } }) {
  return (
    <MainInner params={params} />
  )
}
