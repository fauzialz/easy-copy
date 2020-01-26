import React, { useState, useRef, useContext} from 'react';
import './App.scss';
import { Helmet } from 'react-helmet'
import { Obj } from './services'
import Modal from './components/modal';
import Headbar from './components/headbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import List from './components/list';
import { formContext, setForm, clearForm, setFormNewId, noteListContext } from './store';

function App() {
  const { dispatch } = useContext(formContext)
  const { noteList } = useContext(noteListContext)
  const [openModal, setOpenModal] = useState(false)
  const refAdd = useRef(null)

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
        <Headbar />
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