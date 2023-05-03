import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

const Filter = (props) => {
  const[filt,setFilt]=useState(null)

  const filterby = () =>{
    var filterArray = props.data.filter(function (el)
    {
      return el.language  === props.language
    })
    console.log(filterArray)
    setFilt(filterArray)
  }

  useEffect(()=>{
    props.data !== null && filterby()
  },[props.data])
  return (
    <div>
        <h1>Filtered results</h1>
        {filt !== null && filt.map((d,key)=>{
            return(
                <div className='codeblock'>
                    <div className='lang'> {d.language}</div>
                    <textarea type ='text'  className='description' defaultValue={d.description}/>
                    <textarea className='code' rows='30' defaultValue={d.code}/>
                    
                </div>
            )
        })}
        <h1>Filtered results end</h1>
    </div>
  )
}

export default Filter