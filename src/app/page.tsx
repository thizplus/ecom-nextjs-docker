// Next Imports

import MainStore from "@/components/store/MainStore";


export default function Page() {
  return (
    <>
      <div className='w-full max-w-[430px] min-h-screen overflow-y-auto mx-auto bg-white border-[#eee] border-[1px]'>
        <MainStore />
      </div>

    </>
  )
}
