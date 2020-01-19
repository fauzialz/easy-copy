import React, { createContext, useState} from 'react'
import { Obj } from '../../services'

const noteListContext = createContext([])
const { Provider } = noteListContext

const NoteListProvider = ({ children }) => {
    const [note, setNote] = useState([])

    const setNoteList = (payload) => setNote(Obj.deepCopy(payload))

    return <Provider value={{ noteList: note, setNoteList}} >{ children }</Provider>
}

export {noteListContext, NoteListProvider}