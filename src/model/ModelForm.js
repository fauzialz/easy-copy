import ModelContent from "./ModelContent"

function ModelForm() {
    this.id = ''
    this.title = ''
    this.listContents = false
    this.contents = [
      new ModelContent()
    ]
    this.tags = []
    this.deleted = false
    this.pinned = false
    this.newEntry = true
  }

  export default ModelForm