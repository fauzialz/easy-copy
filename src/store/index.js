import React from 'react'
import {formContext, FormProvider} from './context/formContext'
import { setForm, clearForm, setFormNewId, setNoteList } from './actions'
import { NoteListProvider } from './context/noteListContext'

const GlobalProvider = ({ children }) => (
    <NoteListProvider>
        <FormProvider>
            {children}
        </FormProvider>
    </NoteListProvider>
)

export {
    GlobalProvider,
    formContext,
    setNoteList,
    setForm,
    setFormNewId,
    clearForm
}