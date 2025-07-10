import React from 'react'

const ServiceCards = ({serviceCardContent} : {serviceCardContent:any}) => {

  return (
    <div className='flex flex-col gap-y-8 px-4 py-8 shadow-lg font-sohnelight w-full'>
        <span className='text-governmentBlue h-10 w-10'>{serviceCardContent?.icon}</span>
        <p className='text-2xl'>{serviceCardContent?.title}</p>
        <p className='text-base font-extralight'>{serviceCardContent?.subtitle}</p>
    </div>
  )
}

export default ServiceCards