const supabase = require("../../supbase_config/config");

const signUpEmailPassowrd = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({
      message: "Sign up successfull! Check your email for confirmation",
      session: data.session, // includes access_token and refresh_token if session is created
      user: data.user,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: `"Internal server erorr : " ${error.message}` });
  }
};


const loginWithEmail = async(req , res) => {

   try{

    const {email , password} = req.body

    const {data  , error} = await supabase.auth.signInWithPassword({
      email , password

    })

    if(error){
      return res.status(404).json({message : error.message})
    }

    return res.status(200).json({
      message: "Login successful",
      session: data.session, // Contains access_token, refresh_token, and session expiration
      user: data.user,
    });

   }catch(error){
    console.log(error)
    return res.status(500).json({message : `"Internal server error : " ${error.message}`})
   }


}


const signUpwithMagicLink = async (req , res) => {
      try{

        const {email} = req.body

        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: "http://localhost:3000/auth-callback",
          },
        });

        if(error) return res.status(404).json({message : error.message})

         return res.status(200).json({
           message: "Magic link sent to email.",
         });

      }catch(error){
        console.log(error.message)
         return res
           .status(500)
           .json({ message: `"Internal server error : " ${error.message}` });
      }
}


const signInWithPhone  = async ( req , res) => {
  
  try{

     const { phone } = req.body;

     const { data, error } = await supabase.auth.signInWithOtp({
       phone,
     });
     if (error) return res.status(404).json({ message: error.message });

     return res.status(200).json({
       message: "Magic Otp sent to phone.",
     });


  }catch(error){
    console.log(error.message)
      return res
        .status(500)
        .json({ message: `"Internal server error : " ${error.message}` });
    

  }
 
}


module.exports = {
    signUpEmailPassowrd,
    loginWithEmail , 
    signUpwithMagicLink,
    signInWithPhone,
}