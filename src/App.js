import React, { useContext, useEffect, useRef} from 'react';
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
import { Switch, Route, useHistory, useLocation, Redirect } from 'react-router-dom';

function App() {
  const { dispatch } = useContext(formContext)
  const { noteList, setNoteList } = useContext(noteListContext)
  const { setSetting } = useContext(settingContext)
  const init = useRef(true)
  let history = useHistory()
  let { pathname } = useLocation()

  useEffect(() => {
    if(pathname !== '/') return //whenever close modal
    dispatch(clearForm())

    if(!init.current) return

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
    init.current = false
    // eslint-disable-next-line
}, [pathname])

  /* Open Modal handler */
  const openModalHandler = (item = {})  => {
    history.push('/modal')
    if(Obj.isEmpty(item)) {
      dispatch(setFormNewId(noteList))
      return
    }
    dispatch(setForm(item))
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

        <Switch>
          <Route exact path="/modal" >
            <Modal />
          </Route>
          <Route path="*">
            <Redirect to={{pathname : '/'}} />
          </Route>
        </Switch>

      </div>
    </div>
  );
}

export default App;