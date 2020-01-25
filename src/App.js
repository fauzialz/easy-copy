import React, { useState, useRef, useContext} from 'react';
import './App.scss';
import { Helmet } from 'react-helmet'
import { Obj } from './services'
import Modal from './components/modal';
import Headbar from './components/headbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeContent } from './model';
import List from './components/list';
import { formContext, setForm, clearForm, setFormNewId, noteListContext } from './store';

function App() {
  const { form, dispatch } = useContext(formContext)
  const { noteList, setNoteList } = useContext(noteListContext)
  const [openModal, setOpenModal] = useState(false)
  const refAdd = useRef(null)

  /* Modified this function to be used on further changes */
  const openModalHandler = (item = {})  => {
    setOpenModal(true)
    if(Obj.isEmpty(item)) {
      setTimeout(() => {
        refAdd.current.focus()
      }, 100);
      dispatch(setFormNewId(noteList))
    }else{
      dispatch(setForm(item))
    }
  }

  const onClose = () => {
    setOpenModal(false)
    setTimeout(() => {
      dispatch(clearForm())
    }, 200);
  }

  const onCopy = (listIndex, contentIndex) => {
    let temp = noteList
    temp[listIndex].contents[contentIndex].copied = true
    setNoteList(Obj.deepCopy(temp))
    setTimeout(() => {
      temp[listIndex].contents[contentIndex].copied = false
      setNoteList(Obj.deepCopy(temp))
    }, 1300);
  }

  const btnOperations = property => {
    let temp = form
    temp[property] = !form[property]
    dispatch(setForm(temp))
  }

  const addList = () => {
    let temp = form
    temp.contents.push(makeContent())
    dispatch(setForm(temp))
  }

  const closeList = i => {
    let temp = form
    temp.contents.splice(i, 1)
    dispatch(setForm(temp))
  }

  const infoSwitch = i => {
    let temp = form
    temp.contents[i].withInfo = !temp.contents[i].withInfo
    dispatch(setForm(temp))
  }
  
  const singularMultipleSwitch = () => {
    let temp = form
    if(temp.contents.length === 0) {
      temp.contents.push(makeContent())
    }
    dispatch(setForm(temp))
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
    }
    
  const onInfoBlur = () => {
    let temp = form
    for(let i in temp.contents) {
      temp.contents[i].infoFocus = false
    }
    dispatch(setForm(temp))
  }

  return (
    <div className="outer-wrapper">
      
      <Helmet>
        <title>Easy Copy</title>
        <meta name="App to store your text and copy it with ease." content="Easy Copy Mobile Web Application." />
      </Helmet>

      <div className="app-frame">
        <Headbar />
        <List onEdit={openModalHandler} onCopy={onCopy} />

        <button className="add-button" onClick={() => openModalHandler()}>
          <FontAwesomeIcon icon="plus" />
        </button>

        <Modal
          openModal={openModal}
          onClose={onClose}
          ref={refAdd} btnOperations={btnOperations} 
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