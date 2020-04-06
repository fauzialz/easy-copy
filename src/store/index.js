import React from 'react'
import {formContext, FormProvider} from './context/formContext'
import { setForm, clearForm, setFormNewId } from './actions'
import { NoteListProvider, noteListContext } from './context/noteListContext'
import { SettingProvider, settingContext } from './context/settingContext'


const GlobalProvider = ({ children }) => (
    <NoteListProvider>
        <FormProvider>
            <SettingProvider>
            {children}
            </SettingProvider>
        </FormProvider>
    </NoteListProvider>
)
export {
    GlobalProvider,
    
    noteListContext,
    settingContext,

    formContext,
    setForm,
    setFormNewId,
    clearForm
}