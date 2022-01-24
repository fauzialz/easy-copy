import React, { useContext, useEffect, useMemo} from 'react';
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
import ModalImage from './components/modalImage';
import { generateInitialNotes } from './services/serviceGenerateInitialNotes';

function App() {
  const { dispatch } = useContext(formContext)
  const { noteList, setNoteList } = useContext(noteListContext)
  const { setSetting } = useContext(settingContext)
  let history = useHistory()
  let { pathname } = useLocation()

  const setNotlistHandler = async () => {
    try {
      const res = await localforage.getItem(LOCAL.tableName)
      if (res) setNoteList(res)
      populateFirstTimeDataHandler(res)
    } catch (err) {
      console.error(err)
    }
  }

  const setSettingHandler = async () => {
    try {
      const resGet = await localforage.getItem(LOCAL.appSetting)
      if (resGet) {
        setSetting({...resGet})
        return
      }

      const resSet = await localforage.setItem(LOCAL.appSetting, makeSetting())
      setSetting({...resSet})
    } catch (err) {
      console.log(err)
    }
  }

  const noteListHaveFirstTimeData = useMemo(() => {
    for (let i = 0; i < noteList.length; i++) {
      if (noteList[i].isFirstTimeData) return true
    }
    return false
  }, [noteList])

  const populateFirstTimeDataHandler = async (notes) => {
    try {
      const isOngoing = await localforage.getItem(LOCAL.isOngoing)

      if (isOngoing) return
      await localforage.setItem(LOCAL.isOngoing, true)

      if (notes?.length) return
      const initialNotes = generateInitialNotes()
      const resNotes = await localforage.setItem(LOCAL.tableName, initialNotes)
      setNoteList(resNotes)

      const overideSetting = {...makeSetting()}
      overideSetting['mosaicView'] = true
      const newSetting = await localforage.setItem(LOCAL.appSetting, overideSetting)
      setSetting({...newSetting})
    } catch (err) {
      console.error(err)
    }
  }

  const resetFirstTimeDataHandler = async () => {
    try {
      const newNoteList = noteList.filter((note) => !note.isFirstTimeData)
      await localforage.setItem(LOCAL.tableName, newNoteList)
      setNoteList(newNoteList)
    } catch (err) {
      console.error(err)
    }
  }

  /* Open Modal handler */
  const openModalHandler = (item = {})  => {
    history.push('/modal')
    if(Obj.isEmpty(item)) {
      dispatch(setFormNewId(noteList))
      return
    }
    dispatch(setForm(item))
  }

  useEffect(() => {
    if(pathname !== '/') return //whenever close modal
    dispatch(clearForm())
  }, [pathname, dispatch])

  useEffect(() => {
    setSettingHandler()
    setNotlistHandler()
    // eslint-disable-next-line
  }, [])

  return (
    <div className="outer-wrapper">

      <Helmet>
        <title>Easy Copy</title>
        <meta name="App to store your text and copy it with ease." content="Easy Copy Mobile Web Application." />
      </Helmet>

      <div className="app-frame">
        <Headbar onEdit={openModalHandler} />
        <List onEdit={openModalHandler} />

        <div className='elevate-buttons'>
          {noteListHaveFirstTimeData && (
            <button className='button-reset button-bounce' onClick={resetFirstTimeDataHandler}>RESET</button>
          )}

          <div className="button-wrapper">
            <button className="add-button rounded-left button-bounce" onClick={() => history.push('/image')}>
              <FontAwesomeIcon icon="file-image" />
            </button>
            <button className="add-button button-bounce" onClick={() => openModalHandler()}>
              <FontAwesomeIcon icon="plus" />
            </button>
          </div>
        </div>

        <Switch>
          <Route exact path="/modal" >
            <Modal />
          </Route>
          <Route exact path="/image" >
            <ModalImage />
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