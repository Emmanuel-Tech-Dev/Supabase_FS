import { createContext, useState } from "react";


export const ThemeContext = createContext("light")

export const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState("light")
    const [lang, setLang] = useState("en")

    return <ThemeContext.Provider value={{ theme, setTheme, lang, setLang }}>{children}</ThemeContext.Provider>

}

