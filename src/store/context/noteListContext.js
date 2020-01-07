import React, { createContext, useReducer} from 'react'
import { ModelContent } from '../../model'
import { SET_NOTE_LIST } from '../actionTypes'

const initialNoteList = new ModelContent()
const noteListContext = createContext(initialNoteList)
const { Provider } = noteListContext

const NoteListProvider = ({ children }) => {
    const [noteList, dispatch] = useReducer((state, action) => {
        switch(action.type) {
            case SET_NOTE_LIST: {
                const { newNoteList } = action.payload
                return newNoteList
            }
            default: {
                throw new Error()
            }
        }
    }, initialNoteList)

    return <Provider value={{ noteList, dispatch}} >{ children }</Provider>
}

export {noteListContext, NoteListProvider}