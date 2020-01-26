import { Obj } from "."

export default {
    /* Fitler mutliple text input before save to DB */
    formFilter : formData => {
      let temp = Obj.deepCopy(formData)
      if(temp.listContents) {
        for(let i in temp.contents) {
          if(temp.contents[i].withInfo && temp.contents[i].info.length === 0) {
            temp.contents[i].withInfo = false
          }
          temp.contents[i].focus = false
          temp.contents[i].infoFocu = false
        }
      }
      temp.newEntry = false
      return temp
    } 
}