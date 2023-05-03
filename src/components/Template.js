import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Loader from './Loader'
import Clipboard from 'clipboard';



const Template = () => {
  const[params,setParams]=useState(null) 
  const[data,setData]=useState(null) 
  const[lang,setLang]=useState(null)
  const[desc,setDesc]=useState(null)
  const[code,setCode]=useState(null)
  const[status,setStatus]=useState('Nothing happening yet')
  const[unlock,setUnlock]=useState(false)
  const[showloading,setShowloading]=useState(false)



  
  
  async function getdata() {
    setShowloading(true)
    setStatus('Fetching all records ...')
    await axios.get(process.env.REACT_APP_GETDATAURL).then((response) => {
      setData(response.data);
      setStatus('All records loaded')
      console.table(response.data);
      console.log(response.data)
    }).catch(error => console.log(error));
    setShowloading(false)
  }
  
  async function handleOnDelete(id){
    setStatus('Deleting record...')
    setShowloading(true)
    await axios.delete(process.env.REACT_APP_DELETEURL,{params:{id:id}}).then((response) => {
        setStatus('Record deleted')
    }).catch(error => console.log(error));
    setShowloading(false)
  }      

  async function getbycode() {
    setStatus('Getting your results...')
    setShowloading(true)
    await axios.get(process.env.REACT_APP_BYCODE,{params:{code:params}}).then((response) => {
      setData(response.data);
      response.data.length !== 0 ? setStatus('Results by code below'):setStatus('No results')
      console.table(response.data);
    }).catch(error => console.log(error));
    setShowloading(false)
  }

  const handlecodekeypress = (e) =>{
    if (e.key === 'Enter') {
      getbycode()
    }
  }

  const handledesckeypress =(e)=>{
    if (e.key === 'Enter') {
      getbydesc()
    }
  }

  

  async function getbydesc() {
    setStatus('Getting your results...')
    setShowloading(true)
    await axios.get(process.env.REACT_APP_BYDESC,{params:{code:params}}).then((response) => {
      setData(response.data);
      console.log(response)
      response.data.length !== 0 ? setStatus('Results by code below'):setStatus('No results')
      console.table(response.data);
    }).catch(error => console.log(error));
    setShowloading(false)
  }

  async function postdata() {
    
    setStatus('Posting new snippet...')
    setShowloading(true)
    await axios.post(process.env.REACT_APP_POST,{lang:lang,desc:desc,code:code}).then((response) => {
      setStatus(response.data)
      setShowloading(false)
      console.log('data after post new' +data)
    })
    .catch(error => console.log(error));
    
  }

  async function alive() {
    await axios.get(process.env.REACT_APP_ALIVE).then((response) => {
        setStatus(response.data)
    }).catch(error => console.log(error));
  }
  const handlelock = () => {
    unlock ? setUnlock(false):setUnlock(true)
  } 
  useEffect(() => {
    alive();
    getdata()
  },[]);

  return (
    <div>
        {showloading && <Loader />}
        <div className='outercontainer'>
        <div className='inputcontainer'>
            <h3>Add new snippet</h3>
            <input type='text' placeholder='language' autoComplete='on' onChange={(e)=>setLang(e.target.value)} />
            <textarea type='text' 
                placeholder='description' 
                onChange={(e)=>setDesc(e.target.value)}
                rows="4" cols="50"
            />
            <textarea type='text'
                placeholder='code'
                onChange={(e)=>setCode(e.target.value.trimStart())}
                rows="4" cols="50"
            />
            <button onClick={postdata}>Add New code snippet</button>
        </div>
        
        <div className='displayrecs'>
            <h3>Sort by snippet</h3>
                <input 
                    type='text'
                    className='getbyinput' 
                    placeholder='Filter by  code keyword' 
                    onChange={(e)=>setParams(e.target.value)}
                    onKeyPress={handlecodekeypress}
                />
                
                <input 
                    type='text' 
                    className='getbyinput'
                    placeholder='Filter by  code description' 
                    onChange={(e)=>setParams(e.target.value)}
                    onKeyPress={handledesckeypress}
                />
                

                <button onClick={unlock && getdata}>Get all records</button>
                
                <div><span id='lbtn' onClick={handlelock}>----</span>Status:{status}</div>
            </div>  
        </div>
        <div>
        
        </div>
        {data !== null && data.map((d,key)=>{
            return(
                <div className='codeblock'>
                    <div className='lang'> {d.language}</div>
                    <textarea type ='text'  className='description' onChange={(e)=>setDesc(e.target.value)}  defaultValue={d.description}/>
                    <textarea className='code' rows='30' defaultValue={d.code}/>
                    <button onClick={() => unlock && handleOnDelete(d.id)}>Delete</button>
                </div>
            )
        })}
    </div>
  )
}

export default Template