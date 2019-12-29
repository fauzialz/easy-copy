import React, {useEffect, useState, useRef} from 'react';
import './App.scss';
import { Helmet } from 'react-helmet'
import Emoji from './components/emoji'
import localforage from 'localforage'
import LOCAL from './config';
import { Obj, Form } from './services'
import Modal from './components/modal';
import Headbar from './components/headbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ModelContent, ModelForm } from './model';
import List from './components/list';

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

  /* Change pinned value on edit direcly change DB. */
  const onPinEdit = () => {
    let dataTemp = data
    let formTemp = form
    formTemp.pinned = !form.pinned
    setForm(Obj.deepCopy(formTemp))
    for(let i in dataTemp) {
      if(dataTemp[i].id === form.id) {
        dataTemp[i].pinned = formTemp.pinned
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
    temp.push(Form.formFilter(form))
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
  }

  const onEditSubmit = () => {
    let temp = data
    if(form.contents[0].text === "") {
      onClose()
      return
    }
    for(let i in temp) {
      if(temp[i].id === form.id) {
        temp[i] = Form.formFilter(form)
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

  const onMultipleFocus = e => {
    let temp = form
    let node = e.target.name.split('-')
    // console.log(node)
    for(let i in temp.contents) {
      if(i !== node[0]) {
        temp.contents[i].focus = false
        temp.contents[i].infoFocus = false
        // if(node[1] === 'info'){
          // }
        }else{
          temp.contents[i].focus = true
          if(node[1] === 'info'){
            temp.contents[i].infoFocus = true
          }
        }
      }
      setForm(Obj.deepCopy(temp))
    }
    
  const onInfoBlur = () => {
    let temp = form
    for(let i in temp.contents) {
      temp.contents[i].infoFocus = false
    }
    setForm(Obj.deepCopy(temp))
  }

  return (
    <div className="outer-wrapper">
      
      <Helmet>
        <title>Easy Copy</title>
        <meta name="App to store your text and copy it with ease." content="Easy Copy Mobile Web Application." />
      </Helmet>

      <div className="app-frame">
        <Headbar />
        <div className="list-wrapper">

          {(data.filter(e => e.deleted === false).length) === 0 ?
            <div className="on-list-empty">{LOCAL.onListEmpty}<br/><Emoji /></div>
            : <List data={data} onEdit={onEdit} onCopy={onCopy} />
          }

        </div>

        <button className="add-button" onClick={modalOpen}>
          <FontAwesomeIcon icon="plus" />
        </button>

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
          onFocus={onMultipleFocus}
          onInfoBlur={onInfoBlur}
          />
        <Modal form={form} openModal={openEdit} 
          onClose={onClose} onSubmit={onEditSubmit}
          onChangeTitle={onChangeTitle} onChangeText={onChangeText}
          onPin = {onPinEdit}
          ref={refEdit} btnOperations={btnOperations}
          addList={addList} closeList={closeList} 
          singularMultipleSwitch={singularMultipleSwitch}
          infoSwitch={infoSwitch}  
          onFocus={onMultipleFocus}
          onInfoBlur={onInfoBlur}
        />
      </div>
    </div>
  );
}

export default App;