import React, { createContext, useState} from 'react'

const noteListContext = createContext([])
const { Provider } = noteListContext

const NoteListProvider = ({ children }) => {
    /*  I decide to not using useReducer just because noteList suppose to have a simple purpose:
        store temporary data from IndexedDB when the app is runing and update it periodically
        whenever IndexedDB is update. UseState is the best answer for this simple data manipulations. */
    const [note, setNote] = useState([]) 

    const setNoteList = (payload) => setNote([...payload])

    return <Provider value={{ noteList: note, setNoteList}} >{ children }</Provider>
}

export {noteListContext, NoteListProvider}