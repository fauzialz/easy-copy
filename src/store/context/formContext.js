import React, {createContext, useReducer} from 'react'
import { ModelForm } from '../../model'
import { SET_FORM, CLEAR_FORM, SET_FORM_NEW_ID } from '../actionTypes'
import LOCAL from '../../config'
import { Obj } from '../../services'

const initialForm = new ModelForm()
const formContext = createContext(initialForm)
const { Provider } = formContext

const FormProvider = ({ children }) => {
    const [form, dispatch] = useReducer((state, action) => {
        switch(action.type) {
            case SET_FORM: {
                const { newForm } = action.payload
                return newForm
            }
            case SET_FORM_NEW_ID: {
                const { noteList } = action.payload
                let temp = Obj.deepCopy(state)
                if(noteList.length === 0) {
                    temp.id = LOCAL.initPackId
                }else{
                    let id = noteList[noteList.length - 1].id
                    let counter = `${+id.slice(-7) + 1}`
                    id = id.slice(0,id.length - counter.length) + counter
                    temp.id = id
                }
                return temp
            }
            case CLEAR_FORM: {
                return initialForm
            }
            default: {
                throw new Error();
            }
        }
    }, initialForm)

    return <Provider value={{ form, dispatch }} >{ children }</Provider>
}

export {formContext, FormProvider}