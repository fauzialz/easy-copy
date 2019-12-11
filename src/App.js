import React, {useEffect, useState, useRef} from 'react';
import './App.scss';
import localforage from 'localforage'
// import {CopyToClipboard} from 'react-copy-to-clipboard'

function App() {
  // const [data, setData] = useState()
  const [openModal, setOpenModal] = useState(false)
  const dbName = 'local'
  const ref = useRef(null)

  const customerData = [
    { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com", copy : false },
    { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org", copy : false }
  ]

  useEffect(() => {
    localforage.setItem(dbName, customerData).then( value => {
      console.log('data available on indexedDB')
    })
  }, [customerData])

  // const getData = () => localforage.getItem(dbName).then(value => {
  //   setData(value)
  // })

  // const onCopy = key => {
  //   let temp = data
  //   for(let item of temp) {
  //     if(item.ssn === key) {
  //       item.copy = true
  //     } else item.copy = false
  //   }
  //   setData(JSON.parse(JSON.stringify(temp)))
  // }

  const modalOpen = () => {
    setOpenModal(true)
    setTimeout(() => {
      ref.current.focus()
    }, 100);
  }

  return (
    <div className="outer-wrapper">
      <div className="app-frame">
        <button className="add-button" onClick={modalOpen}>+</button>

        <div className={openModal? "modal-open" : "modal-close"}>
          <div className="modal-wrapper">
            <button className="modal-left-btn" onClick={() => setOpenModal(!openModal)}>Cancel</button>
            <button className="modal-right-btn" onClick={() => setOpenModal(!openModal)}>Save</button>
            <input className="modal-title" placeholder="Title (optional)"/>
            <textarea ref={ref} className="modal-textarea" placeholder="Note" />
          </div>
        </div>
      </div>
      {/* <button onClick={getData}>get data from IndexedDB</button>
      <div>
        {data ?
          data.map(customer => {
            if(!customer.ssn) {
              return null
            }
            return (
              <div key={customer.ssn}>{customer.name} -> {customer.email}   
                <CopyToClipboard text={customer.email} onCopy={() => onCopy(customer.ssn)}>
                  <button>copy email</button>
                </CopyToClipboard>
                {customer.copy? 'copied': null}
              </div>
            )
          })
          :null
        }
      </div> */}
    </div>
  );
}

export default App;
