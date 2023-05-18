import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Loader from "./Loader";
import Clipboard from "clipboard";
import { AiOutlineCopy} from 'react-icons/ai'
import { GrDocumentUpdate } from 'react-icons/gr'
import Tiptap from "./Tiptap";


const Template = () => {
  const [params, setParams] = useState(null);
  const [data, setData] = useState(null);
  const [lang, setLang] = useState(null);
  const [desc, setDesc] = useState("Enter your description");
  const [code, setCode] = useState("Enter your code");
  const [status, setStatus] = useState("Nothing happening yet");
  const [unlock, setUnlock] = useState(false);
  const [showloading, setShowloading] = useState(false);
  const [languages, setLanguages] = useState(null);
  const [descupdate,setDescupdate]=useState('')
  const [codeupdate,setCodeupdate]=useState('')

  


  async function getdata() {
    setShowloading(true);
    setStatus("Fetching all records ...");
    await axios
      .get(process.env.REACT_APP_GETDATAURL)
      .then((response) => {
        setData(response.data);
        setStatus("All records loaded");
        
      })
      .catch((error) => console.log(error));
    setShowloading(false);
  }

  async function getalllanguages() {
    await axios
      .get(process.env.REACT_APP_ALLLANG)
      .then((response) => {
        setLanguages(response.data);
        response.data.length !== 0
          ? setStatus("All languages found")
          : setStatus("No data found");
      })
      .catch((error) => console.log(error));
  }

  async function getdatabylanguage(event) {
    setShowloading(true)
    setData(null);
    const lang = event.target.value;
    await axios
      .get(process.env.REACT_APP_BYLANG, { params: { lang: lang } })
      .then((response) => {
        setData(response.data);
        response.data.length !== 0
          ? setStatus("Results by language below")
          : setStatus("No results");
      })
      .catch((error) => console.log(error));
      setShowloading(false)
  }

  async function handleUpdate(id) {
    setStatus("Updating record...");
    setShowloading(true);
    await axios
      .put(process.env.REACT_APP_UPDATE, {
          id: id,
          code: codeupdate,
          desc: '',
      })
      .then((response) => {
        setStatus("Record updated");
      })
      .catch((error) => console.log(error));
    setShowloading(false);
  }

  async function handledescUpdate(id) {
    setStatus("Updating record...");
    setShowloading(true);
    await axios
      .put(process.env.REACT_APP_UPDATEDESC, {
          id: id,
          desc: descupdate,
      })
      .then((response) => {
        setStatus("Record updated");
      })
      .catch((error) => console.log(error));
    setShowloading(false);
  }

  async function handleOnDelete(id) {
    setStatus("Deleting record...");
    setShowloading(true);
    await axios
      .delete(process.env.REACT_APP_DELETEURL, { params: { id: id } })
      .then((response) => {
        setStatus("Record deleted");
      })
      .catch((error) => console.log(error));
    setShowloading(false);
  }

  async function getbycode() {
    setData(null);
    setStatus("Getting your results...");
    setShowloading(true);
    await axios
      .get(process.env.REACT_APP_BYCODE, { params: { code: params } })
      .then((response) => {
        setData(response.data);
        response.data.length !== 0
          ? setStatus("Results by code below")
          : setStatus("No results");
      })
      .catch((error) => console.log(error));
    setShowloading(false);
  }

  const handlecodekeypress = (e) => {
    if (e.key === "Enter") {
      getbycode();
    }
  };

  const handledesckeypress = (e) => {
    if (e.key === "Enter") {
      getbydesc();
    }
  };

  async function getbydesc() {
    setData(null);
    setStatus("Getting your results...");
    setShowloading(true);
    await axios
      .get(process.env.REACT_APP_BYDESC, { params: { code: params } })
      .then((response) => {
        setData(response.data);
        response.data.length !== 0
          ? setStatus("Results by code below")
          : setStatus("No results");
      })
      .catch((error) => console.log(error));
    setShowloading(false);
  }

  async function postdata() {
    setStatus("Posting new snippet...");
    setShowloading(true);
    await axios
      .post(process.env.REACT_APP_POST, { lang: lang, desc: desc, code: code })
      .then((response) => {
        setStatus(response.data);
        setShowloading(false);
      })
      .catch((error) => {
        console.log(error)
        setStatus(error)
      })
  }

  async function alive() {
    await axios
      .get(process.env.REACT_APP_ALIVE)
      .then((response) => {
        setStatus(response.data);
      })
      .catch((error) => console.log(error));
  }
  const handlelock = () => {
    unlock ? setUnlock(false) : setUnlock(true);
    
  };
  useEffect(() => {
    alive();
    getalllanguages();
  }, []);

  
console.log("descupdate from template: "+descupdate)
  return (
    <div>
      {showloading && <Loader />}
      <div className="outercontainer">
        <div className="inputcontainer">
          <h3>Add new snippet</h3>
          <input
            type="text"
            placeholder="language"
            autoComplete="on"
            onChange={(e) => setLang(e.target.value)}
            className="newlanguage"
            title="Enter the type of language"
          />
          <textarea
            type="text"
            placeholder={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows="4"
            cols="50"
            className="newdesc"
            title="Enter your code description"
          />
          <textarea
            type="text"
            placeholder={code}
            onChange={(e) => setCode(e.target.value.trimStart())}
            rows="4"
            cols="50"
            className="newcode"
            title="Enter your code example"
          />
          <button onClick={postdata}>Add New code snippet</button>
        </div>
      </div>
      <div className="status">
        <div>
          <span id="lbtn" onClick={handlelock}>
            ----
          </span>
          Status:{status}----
        </div>
      </div>
      <hr />
      <div>
        <select name="category" onChange={getdatabylanguage}>
          <option>Select by language or category</option>
          {languages !== null &&
            languages.map((val, key) => <option>{val.language}</option>)}
        </select>
        <h3>Filter snippets</h3>
        
        <input
          type="text"
          className="getbyinput"
          placeholder="Filter by  code keyword"
          onChange={(e) => setParams(e.target.value)}
          title="Filter by code keyword"
          onKeyPress={handlecodekeypress}
        />

        <input
          type="text"
          className="getbyinput"
          placeholder="Filter by  code description"
          onChange={(e) => setParams(e.target.value)}
          title="Filter by description keyword"
          onKeyPress={handledesckeypress}
        />
      </div>
      <hr />
      <table>
        <th>Language</th>
        <th>Description</th>
        <th>Code examples</th>
        
        <tbody>
          {data !== null &&
            data.map((d, key) => {
              return (
                <tr>
                  <td className="dlanguage">{d.language}</td>
                  <td className="">
                    <textarea
                      type="text"
                      className="description"
                      onChange={(e) => setDescupdate(e.target.value)}
                      defaultValue={d.description}
                    />
                    <button
                    title="Update description"
                      className="desc-update-btn"
                      onClick={() => unlock && handledescUpdate(d.id)}
                      style={{
                        // backgroundColor: unlock ? "red" : "green",
                        backgroundImage: unlock ? "linear-gradient(to right, #433939, #19e10f)" : "Linear-gradient(to right, #433939, #9d9d93)",
                      }}
                    >
                      <GrDocumentUpdate />
                    </button>
                  </td>
                  <td className="codebtns">
                    {/* <textarea className="code" defaultValue={d.code} onChange={(e)=>setCodeupdate(e.target.value)} /> */}
                    <Tiptap content={d.code} setCodeupdate={setCodeupdate} codeupdate={codeupdate} descupdate={descupdate} />
                   
                    <button
                    title="Update code"
                      className="dbtnupdate"
                      onClick={() => unlock && handleUpdate(d.id)}
                      style={{
                        // background: unlock ? "red" : "green",
                        backgroundImage: unlock ? "linear-gradient(to right, #433939, #19e10f)" : "linear-gradient(to right, #433939, #9d9d93)",
                      }}
                    >
                      <GrDocumentUpdate />
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Template;



