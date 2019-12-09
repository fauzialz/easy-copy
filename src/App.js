import React, {useEffect, useState} from 'react';
import './App.css';
import localforage from 'localforage'
import {CopyToClipboard} from 'react-copy-to-clipboard'

function App() {
  const [data, setData] = useState()
  const dbName = 'local'

  const customerData = [
    { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com", copy : false },
    { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org", copy : false }
  ]

  useEffect(() => {
    localforage.setItem(dbName, customerData).then( value => {
      console.log('data available on indexedDB')
    })
  }, [customerData])

  const getData = () => localforage.getItem(dbName).then(value => {
    setData(value)
  })

  const onCopy = key => {
    let temp = data
    for(let item of temp) {
      if(item.ssn === key) {
        item.copy = true
      } else item.copy = false
    }
    setData(JSON.parse(JSON.stringify(temp)))
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getData}>get data from IndexedDB</button>
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
        </div>
      </header>
    </div>
  );
}

export default App;
