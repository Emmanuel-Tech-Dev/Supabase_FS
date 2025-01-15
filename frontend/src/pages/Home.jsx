import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { axiosInstance } from "../services/PostRequests/apis"
import { use } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { LanguageContext } from "../context/LanguageContext"
import { CartContex } from "../context/CartContext"
import { Button } from "antd"

const Home = () => {

  const [user, setUser] = useState()
  const { theme, setTheme, lang, setLang } = useContext(ThemeContext)
  const { cart, setCart } = useContext(CartContex)


  console.log(cart)


  // useEffect(() => {
  //   const userData = async () => {

  //     const res = await axiosInstance.get(`/auth/user/profile`,
  //     )
  //     const data = res.data

  //     if (res) {
  //       setUser(data)
  //     }



  //   }

  //   userData()
  // }, [])

  const handleThemeChange = (e) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setTheme(newTheme);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLang(newLanguage);
  };

  useEffect(() => {
    const getPreferredTheme = () => {
      if (window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        } else {
          return 'light';
        }
      }
      return 'light'
    }

    const initialTheme = getPreferredTheme()
    // console.log(initialTheme)
    setTheme(initialTheme)
    // console.log(theme)
    // document.body.classList.add(initialTheme)
  }, [])


  useEffect(() => {
    document.body.classList.remove(theme === "dark" ? "light" : "dark")
    document.body.classList.add(theme)
  }, [theme])


  const addToCart = () => {
    setCart((prev) => [...prev, +1])
  }

  const removeFromCart = () => {
    if (cart.length === 0) return
    setCart((prev) => prev.slice(0, -1));
  }



  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        <input type="checkbox" checked={theme === "dark"} onChange={handleThemeChange} />
        Hello {theme}
        Hello, {lang === "en" ? "World" : "Monde"}!
      </h1>

      <div>
        <label htmlFor="language">Select Language: </label>
        <select
          id="language"
          value={lang}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
        </select>
      </div>
      <Button type="primary" onClick={addToCart} >Add to Cart</Button>
      <Button type="primary" danger onClick={removeFromCart}>Remove from Cart</Button>

      <div>
        {cart}
      </div>
    </div>
  )
}

export default Home