import React from 'react'
import {formContext, FormProvider} from './context/formContext'
import { setForm, clearForm, setFormNewId } from './actions'
import { NoteListProvider, noteListContext } from './context/noteListContext'

const GlobalProvider = ({ children }) => (
    <NoteListProvider>
        <FormProvider>
            {children}
        </FormProvider>
    </NoteListProvider>
)
export {
    GlobalProvider,
    
    noteListContext,

    formContext,
    setForm,
    setFormNewId,
    clearForm
}