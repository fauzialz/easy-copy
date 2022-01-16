import React, { createContext, FC, useState} from 'react'
import { FormType } from '../../model/MakeForm'

type NoteListCtx = {
    noteList: FormType[];
    setNoteList: (noteList: FormType[]) => void;
}

const noteListContext = createContext<NoteListCtx>({
    noteList: [],
    setNoteList: () => {}
})
const { Provider } = noteListContext

const NoteListProvider: FC = ({ children }) => {
    /*  I decide to not using useReducer just because noteList suppose to have a simple purpose:
        store temporary data from IndexedDB when the app is runing and update it periodically
        whenever IndexedDB is update. UseState is the best answer for this simple data manipulations. */
    const [note, setNote] = useState<FormType[]>([]) 

    const setNoteList = (payload: FormType[]) => setNote([...payload])

    return <Provider value={{ noteList: note, setNoteList}} >{ children }</Provider>
}

export {noteListContext, NoteListProvider}