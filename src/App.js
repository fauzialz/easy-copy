import React, {useEffect, useState, useRef} from 'react';
import './App.scss';
import localforage from 'localforage'
import LOCAL from './config';
import { Obj } from './services'
// import {CopyToClipboard} from 'react-copy-to-clipboard'

function App() {
  const [data, setData] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [form, setForm] = useState({
    id : '',
    title : '',
    contents : [
      { id : '', text : '', copied : false }
    ],
    tags : [],
  })
  const ref = useRef(null)

  useEffect(() => {
    try {
      localforage.getItem(LOCAL.tableName).then( res => {
        if(res) {
          setData(res)
        }else setData([])
      })
    } catch (err) {
     console.log(err)
    }
  }, [])

  // const getData = () => localforage.getItem(dbName).then(value => {
  //   setData(value)
  // })

  // const onCopy = key => {
  //   let temp = data
  //   for(let item of temp) {
  //     if(item.ssn === key) {
  //       item.copy = true
  //     } else item.copy = false
  //   }
  //   setData(JSON.parse(JSON.stringify(temp)))
  // }

  const modalOpen = () => {
    setOpenModal(true)
    setTimeout(() => {
      ref.current.focus()
    }, 100);
    let temp = form
    if(data.length === 0) {
      temp.id = LOCAL.initPackId
      temp.contents[0].id = `${LOCAL.initPackId}-0001`
    }else{
      let id = data[data.length - 1].id
      let counter = `${+id.slice(-4) + 1}`
      id = id.slice(0,id.length - counter.length) + counter
      temp.id = id
      temp.contents[0].id = `${id}-0001`
    }
    setForm(Obj.deepCopy(temp))
  }

  const onChangeTitle = e => {
    let temp = form
    temp.title = e.target.value
    setForm(Obj.deepCopy(temp))
  }

  const onChangeText = e => {
    let temp = form
    temp.contents[0].text = e.target.value
    setForm(Obj.deepCopy(temp))
  }

  const onSubmit = () => {
    let temp = data
    temp.push(form)
    localforage.setItem(LOCAL.tableName, temp).then( res => {
      console.log(res)
      setData(res)
      setOpenModal(false)
    })
  }

  return (
    <div className="outer-wrapper">
      <div className="app-frame">
        <button className="add-button" onClick={modalOpen}>+</button>

        {data.map(e => (
          <div>{e.contents[0].text}</div>
        ))}

        <div className={openModal? "modal-open" : "modal-close"}>
          <div className="modal-wrapper">
            <button className="modal-left-btn" onClick={() => setOpenModal(!openModal)}>Cancel</button>
            <button className="modal-right-btn" onClick={onSubmit}>Save</button>
            
            <input className="modal-title" placeholder="Title (optional)" value={form.title} onChange={onChangeTitle} />
            <textarea ref={ref} className="modal-textarea" placeholder="Text to copy" value={form.contents[0].text} onChange={onChangeText} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
