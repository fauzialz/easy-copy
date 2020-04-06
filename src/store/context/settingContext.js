import React, { createContext, useState } from 'react'

const settingContext = createContext({})
const { Provider } = settingContext

const SettingProvider = ({ children }) => {
    const [setting, setSetting] = useState({})

    return <Provider value={{ setting, setSetting }}>{children}</Provider>
}

export {settingContext, SettingProvider}