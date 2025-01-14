import { useState } from "react"


const usePost = (formData , enpoint) => {
    
      const [data , setData] = useState()
      const [isLoading , setIsLoading] = useState(false)
      const [error , setError]  = useState()


      const request = (formData, enpoint) => {
             
          
      }



    


      return {request, data , isLoading , error}

}


export default usePost