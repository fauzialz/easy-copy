import { FormType } from "../model/MakeForm";
import { SET_FORM, CLEAR_FORM, SET_FORM_NEW_ID } from "./actionTypes";

export const setForm = (newForm: FormType) => ({type : SET_FORM, payload : { newForm } })
export const clearForm = () => ({type : CLEAR_FORM, payload : {} })
export const setFormNewId = (noteList: FormType[]) => ({type : SET_FORM_NEW_ID, payload : { noteList } })