import React, {useEffect, useState, useRef} from 'react';
import './App.scss';
import { Helmet } from 'react-helmet'
import Emoji from './components/emoji'
import localforage from 'localforage'
import LOCAL from './config';
import { Obj, Str } from './services'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import Modal from './components/modal';

function ModelContent() {
  this.text = ''
  this.copied = false
  this.withInfo = false
  this.info = ''
}

function ModelForm() {
  this.id = ''
  this.title = ''
  this.listContents = false
  this.contents = [
    new ModelContent()
  ]
  this.tags = []
  this.deleted = false
  this.pinned = false
}

function App() {
  const [data, setData] = useState([])
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [form, setForm] = useState(new ModelForm())
  const refAdd = useRef(null)
  const refEdit = useRef(null)

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
    setOpenAdd(true)
    setTimeout(() => {
      refAdd.current.focus()
    }, 100);
    let temp = form
    if(data.length === 0) {
      temp.id = LOCAL.initPackId
      // temp.contents[0].id = `${LOCAL.initPackId}-0001`
    }else{
      let id = data[data.length - 1].id
      let counter = `${+id.slice(-7) + 1}`
      id = id.slice(0,id.length - counter.length) + counter
      temp.id = id
      // temp.contents[0].id = `${id}-0001`
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
    let node = e.target.name.split('-')
    if(node[1] === 'info') {
      if(e.target.value.length <= LOCAL.infoLength) {
        temp.contents[node[0]][node[1]] = e.target.value
      }
    }else temp.contents[node[0]][node[1]] = e.target.value
    setForm(Obj.deepCopy(temp))
  }

  const onClose = () => {
    setOpenAdd(false)
    setOpenEdit(false)
    setTimeout(() => {
      setForm(new ModelForm())
    }, 200);
  }

  /*  Check on multiple text mode if info is empty */
  const formCheck = formData => {
    if(!formData.listContents) return formData
    let temp = Obj.deepCopy(formData)
    for(let i in temp.contents) {
      if(temp.contents[i].withInfo && temp.contents[i].info.length === 0) {
        temp.contents[i].withInfo = false
      }
    }
    return temp
  }

  /* Change pinned value on edit direcly change DB. */
  const onPinEdit = () => {
    let dataTemp = data
    let formTemp = form
    formTemp.pinned = !form.pinned
    setForm(Obj.deepCopy(formTemp))
    for(let i in dataTemp) {
      if(dataTemp[i].id === form.id) {
        dataTemp[i] = Obj.deepCopy(formTemp)
      }
    }
    localforage.setItem(LOCAL.tableName, dataTemp).then( res => {
      console.log(res)
      setData(res)
    })
  }

  const onSubmit = () => {
    let temp = data
    if(form.contents[0].text === "") {
      onClose()
      return
    }
    temp.push(formCheck(form))
    localforage.setItem(LOCAL.tableName, temp).then( res => {
      console.log(res)
      setData(res)
      onClose()
    })
  }

  const onCopy = (id, index) => {
    let temp = data
    temp[index].contents[0].copied = true
    setData(Obj.deepCopy(temp))
    setTimeout(() => {
      temp[index].contents[0].copied = false
      setData(Obj.deepCopy(temp))
    }, 1300);
  }

  const onEdit = item => {
    setForm(Obj.deepCopy(item))
    setOpenEdit(true)
    if(!item.listContents){
      setTimeout(() => {
        refEdit.current.focus()
      }, 100);
    }
  }

  const onEditSubmit = () => {
    let temp = data
    if(form.contents[0].text === "") {
      onClose()
      return
    }
    for(let i in temp) {
      if(temp[i].id === form.id) {
        temp[i] = formCheck(form)
      }
    }
    localforage.setItem(LOCAL.tableName, temp).then( res => {
      console.log(res)
      setData(res)
      onClose()
    })
  }

  const btnOperations = property => {
    let temp = form
    temp[property] = !form[property]
    setForm(Obj.deepCopy(temp))
  }

  const addList = () => {
    let temp = form
    temp.contents.push(new ModelContent())
    setForm(Obj.deepCopy(temp))
  }

  const closeList = i => {
    let temp = form
    temp.contents.splice(i, 1)
    setForm(Obj.deepCopy(temp))
  }

  const infoSwitch = i => {
    let temp = form
    temp.contents[i].withInfo = !temp.contents[i].withInfo
    setForm(Obj.deepCopy(temp))
  }
  
  const singularMultipleSwitch = () => {
    let temp = form
    if(temp.contents.length === 0) {
      temp.contents.push(new ModelContent())
    }
    setForm(Obj.deepCopy(temp))
    btnOperations('listContents')
  }

  return (
    <div className="outer-wrapper">

      <Helmet>
        <title>Easy Copy</title>
        <meta name="App to store your text and copy it with ease." content="Easy Copy Mobile Web Application." />
      </Helmet>

      <div className="app-frame">
        <div className="list-wrapper">

          {(data.filter(e => e.deleted === false).length) === 0 ?
            <div className="on-list-empty">{LOCAL.onListEmpty}<br/><Emoji /></div>
            : data.map((e, i) => {
              if(e.deleted) return null
              return (
                <div className="list-tile" key={e.id}>
                  {e.title?<div className="list-title" onClick={() => onEdit(e)}>{e.title}</div>: null}
                  <div className="list-content"> 

                    {/* TEXT Content */}
                    <div className="list-text" onClick={() => onEdit(e)}>
                      {Str.jsxNewLine(e.contents[0].text)}
                    </div>

                    <div className={e.contents[0].copied? "copy-sign-on" : "copy-sign-off"}>{LOCAL.onCopy}!</div>
                    <div className="list-boundary-line" />
                    
                    {/* COPY BUTTON */}
                    <CopyToClipboard text={e.contents[0].text} onCopy={() => onCopy(e.contents[0].id, i)}>
                      <button className="list-button">Copy</button>
                    </CopyToClipboard>
                  </div>
                </div>
              )
          })}

        </div>

        <button className="add-button" onClick={modalOpen}>+</button>

        <Modal form={form} 
          openModal={openAdd}
          onClose={onClose} 
          onPin = {() => btnOperations('pinned')}
          onSubmit={onSubmit} 
          onChangeTitle={onChangeTitle}
          onChangeText={onChangeText}
          ref={refAdd} btnOperations={btnOperations} 
          addList={addList} closeList={closeList} 
          singularMultipleSwitch={singularMultipleSwitch}
          infoSwitch={infoSwitch}
        />
        <Modal form={form} openModal={openEdit} 
          onClose={onClose} onSubmit={onEditSubmit}
          onChangeTitle={onChangeTitle} onChangeText={onChangeText}
          onPin = {onPinEdit}
          ref={refEdit} btnOperations={btnOperations}
          addList={addList} closeList={closeList} 
          singularMultipleSwitch={singularMultipleSwitch}
          infoSwitch={infoSwitch}  
        />
      </div>
    </div>
  );
}

export default App;
