import React, { useState, useRef, useContext, useEffect} from 'react';
import './App.scss';
import { Helmet } from 'react-helmet'
import { Obj } from './services'
import Modal from './components/modal';
import Headbar from './components/headbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import localforage from 'localforage'
import List from './components/list';
import { formContext, setForm, clearForm, setFormNewId, noteListContext, settingContext } from './store';
import LOCAL from './config';
import { makeSetting } from './model';

function App() {
  const { dispatch } = useContext(formContext)
  const { noteList, setNoteList } = useContext(noteListContext)
  const { setSetting } = useContext(settingContext)
  const [openModal, setOpenModal] = useState(false)
  const refAdd = useRef(null)

  useEffect(() => {
    localforage.getItem(LOCAL.tableName).then( res => {
        if(res) {
            setNoteList(res)
        }
    }).catch( err => console.error(err))

    localforage.getItem(LOCAL.appSetting).then( res => {
      if(res) {
        setSetting({...res})
        return
      }
      localforage.setItem(LOCAL.appSetting, makeSetting()).then( res => {
        setSetting({...res})
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
    // eslint-disable-next-line
}, [])

  /* Open Modal handler */
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

  return (
    <div className="outer-wrapper">
      
      <Helmet>
        <title>Easy Copy</title>
        <meta name="App to store your text and copy it with ease." content="Easy Copy Mobile Web Application." />
      </Helmet>

      <div className="app-frame">
        <Headbar onEdit={openModalHandler} />
        <List onEdit={openModalHandler} />

        <button className="add-button" onClick={() => openModalHandler()}>
          <FontAwesomeIcon icon="plus" />
        </button>

        <Modal
          openModal={openModal}
          onClose={onClose}
          ref={refAdd}
        />
      </div>
    </div>
  );
}

export default App;