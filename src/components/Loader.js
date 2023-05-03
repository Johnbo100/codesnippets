import React from 'react'
import spinner from '../spinner.svg'
<spinner className="svg"></spinner>

const Loader = () => {
  return (
    <div className='loader'>
        <h1>Please wait</h1>
        <div className='App-logo'><img src={spinner}/></div>
    </div>
  )
}

export default Loader