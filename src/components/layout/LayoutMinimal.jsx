import React from 'react'
import Hfooter from '../home/Hfooter'

const LayoutMinimal = ({children}) => {
  return (
    <div className='min-h-screen bg-purple-100 flex flex-col items-center justify-center relative overflow-hidden'>
      {children}
     <Hfooter />
    
    </div>
  )
}

export default LayoutMinimal
