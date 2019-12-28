import { Obj } from "."

export default {
    /*  Check on multiple text mode if info is empty */
    formCheck : formData => {
        if(!formData.listContents) return formData
        let temp = Obj.deepCopy(formData)
        for(let i in temp.contents) {
          if(temp.contents[i].withInfo && temp.contents[i].info.length === 0) {
            temp.contents[i].withInfo = false
          }
        }
        return temp
      } 
}