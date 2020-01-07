import React, {useEffect, useState, useRef, useContext} from 'react';
import './App.scss';
import { Helmet } from 'react-helmet'
import localforage from 'localforage'
import LOCAL from './config';
import { Obj, Form } from './services'
import Modal from './components/modal';
import Headbar from './components/headbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ModelContent/* , ModelForm */ } from './model';
import List from './components/list';
import { formContext, setForm, clearForm, setFormNewId } from './store';

function App() {
  const { form, dispatch } = useContext(formContext)
  const [data, setData] = useState([])
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  // const [form, setForm] = useState(new ModelForm())
  const refAdd = useRef(null)
  const refEdit = useRef(null)

  useEffect(() => {
    console.log(window.navigator.userAgent) //Experiment for another project
    localforage.getItem(LOCAL.tableName).then( res => {
      if(res) {
        setData(res)
      }else setData([])
    })
    .catch( err => console.log(err) )
  }, [])

  /* Modified this function to be used on further changes */
  const modalOpen = (item = {})  => {
    setOpenAdd(true)
    if(Obj.isEmpty(item)) {
      debugger
      setTimeout(() => {
        refAdd.current.focus()
      }, 100);
      dispatch(setFormNewId(data))
    }else{
      dispatch(setForm(item))
    }
  }
  
  const onEdit = item => {
    dispatch(setForm(item))
    setOpenEdit(true)
  }

  const onClose = () => {
    setOpenAdd(false)
    setOpenEdit(false)
    setTimeout(() => {
      dispatch(clearForm())
    }, 200);
  }

  /* Change pinned value on edit direcly change DB. */
  const onPinEdit = () => { //MOVE TO CHILD AFTER DATA BEEN MIGRATED TO CONTEXT!!!!
    let dataTemp = data
    let formTemp = form
    formTemp.pinned = !form.pinned
    dispatch(setForm(formTemp))
    // setForm(Obj.deepCopy(formTemp))
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

  const onCopy = (listIndex, contentIndex) => {
    let temp = data
    temp[listIndex].contents[contentIndex].copied = true
    setData(Obj.deepCopy(temp))
    setTimeout(() => {
      temp[listIndex].contents[contentIndex].copied = false
      setData(Obj.deepCopy(temp))
    }, 1300);
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
    dispatch(setForm(temp))
    // setForm(Obj.deepCopy(temp))
  }

  const addList = () => {
    let temp = form
    temp.contents.push(new ModelContent())
    dispatch(setForm(temp))
    // setForm(Obj.deepCopy(temp))
  }

  const closeList = i => {
    let temp = form
    temp.contents.splice(i, 1)
    dispatch(setForm(temp))
    // setForm(Obj.deepCopy(temp))
  }

  const infoSwitch = i => {
    let temp = form
    temp.contents[i].withInfo = !temp.contents[i].withInfo
    dispatch(setForm(temp))
    // setForm(Obj.deepCopy(temp))
  }
  
  const singularMultipleSwitch = () => {
    let temp = form
    if(temp.contents.length === 0) {
      temp.contents.push(new ModelContent())
    }
    dispatch(setForm(temp))
    // setForm(Obj.deepCopy(temp))
    btnOperations('listContents')
  }

  const onMultipleFocus = e => {
    let temp = form
    let node = e.target.name.split('-')
    for(let i in temp.contents) {
      if(i !== node[0]) {
        temp.contents[i].focus = false
        temp.contents[i].infoFocus = false
        }else{
          temp.contents[i].focus = true
          if(node[1] === 'info'){
            temp.contents[i].infoFocus = true
          }
        }
      }
      dispatch(setForm(temp))
      // setForm(Obj.deepCopy(temp))
    }
    
  const onInfoBlur = () => {
    let temp = form
    for(let i in temp.contents) {
      temp.contents[i].infoFocus = false
    }
    dispatch(setForm(temp))
    // setForm(Obj.deepCopy(temp))
  }

  return (
    <div className="outer-wrapper">
      
      <Helmet>
        <title>Easy Copy</title>
        <meta name="App to store your text and copy it with ease." content="Easy Copy Mobile Web Application." />
      </Helmet>

      <div className="app-frame">
        <Headbar />
        <List data={data} onEdit={onEdit} onCopy={onCopy} />

        <button className="add-button" onClick={() => modalOpen()}>
          <FontAwesomeIcon icon="plus" />
        </button>

        <Modal
          openModal={openAdd}
          onClose={onClose} 
          onPin = {() => btnOperations('pinned')}
          onSubmit={onSubmit}
          ref={refAdd} btnOperations={btnOperations} 
          addList={addList} closeList={closeList} 
          singularMultipleSwitch={singularMultipleSwitch}
          infoSwitch={infoSwitch}
          onFocus={onMultipleFocus}
          onInfoBlur={onInfoBlur}
        />
        <Modal 
          openModal={openEdit} 
          onClose={onClose} 
          onSubmit={onEditSubmit}
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