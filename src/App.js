import React, {useEffect, useState, useRef} from 'react';
import './App.scss';
import Emoji from './components/Emoji'
import localforage from 'localforage'
import LOCAL from './config';
import { Obj } from './services'
import {CopyToClipboard} from 'react-copy-to-clipboard'

function ModelForm() {
  this.id = ''
  this.title = ''
  this.contents = [
    { id : '', text : '', copied : false, deleted : false }
  ]
  this.tags = []
  this.deleted = false
}

function App() {
  const [data, setData] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [form, setForm] = useState(new ModelForm())
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

  const onClose = () => {
    setOpenModal(false)
    setForm(new ModelForm())
  }

  const onSubmit = () => {
    let temp = data
    if(form.contents[0].text === "") {
      onClose()
      return
    }
    temp.push(form)
    localforage.setItem(LOCAL.tableName, temp).then( res => {
      console.log(res)
      setData(res)
      onClose()
    })
  }

  const onCopy = (id, index) => {
    let temp = data
    // temp[index].contents.forEach( (content, i) => {
    //   if(content.id === id) {
      //   }
      // })
    temp[index].contents[0].copied = true
    setData(Obj.deepCopy(temp))
    setTimeout(() => {
      temp[index].contents[0].copied = false
      setData(Obj.deepCopy(temp))
    }, 1300);
  }

  return (
    <div className="outer-wrapper">
      <div className="app-frame">
        <div className="list-wrapper">

          {data.length === 0?
            <div className="on-list-empty">{LOCAL.onListEmpty}<br/><Emoji /></div>
          : data.map((e, i) => (
            <div className="list-tile" key={e.id}>
              {e.title?<div className="list-title">{e.title}</div>: null}
              <div className="list-content">{e.contents[0].text}
                <div className={e.contents[0].copied? "copy-sign-on" : "copy-sign-off"}>Copied to clipboard!</div>
                <div className="list-boundary-line" />
                <CopyToClipboard text={e.contents[0].text} onCopy={() => onCopy(e.contents[0].id, i)}>
                  <button className="list-button">Copy</button>
                </CopyToClipboard>
              </div>
            </div>
          ))}

        </div>

        <button className="add-button" onClick={modalOpen}>+</button>

        <div className={openModal? "modal-open" : "modal-close"}>
          <div className="modal-wrapper">
            <button className="modal-left-btn" onClick={onClose}>Cancel</button>
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
