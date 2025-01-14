import { createContext, useState } from "react";


export const CartContex = createContext()

export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState([1, 2])

    return <CartContex.Provider value={{ cart, setCart }}>{children}</CartContex.Provider>
}