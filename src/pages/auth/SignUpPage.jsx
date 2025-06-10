import React,{useState} from 'react'
import logo from '../../assets/logo_icon.png'
import { Link,useNavigate } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button } from "flowbite-react";
import { isValidEmail, isValidIvorianPhone, valieMessage } from '../../utils/validateEmailOrPhone';
function SignUpPage() {
    const navigate = useNavigate();
    const [isEmail, setIsEmail] = React.useState(true);
    const [signupField, setSignupField] = React.useState({
        type: isEmail ? 'email' : 'phone', // 'email' or 'phone'
        email: '',
        password:"",
        name:"",
    });
    const [errors, setErrors] = useState({ email: "", password: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignupField((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
      
   const handleChangeType = (type) => {
        setIsEmail(type === 'email');
        setSignupField((prevState) => ({
            ...prevState,
            type: type,
        }));
    }
      
    const isValide = (signupField.name.trim().length > 0 && signupField.email.trim().length > 0 && signupField.password.trim().length > 0) || (signupField.name.trim().length > 0 && signupField.phone.trim().length > 0 && signupField.password.trim().length > 0);
  return (
    <div className='absolute inset-0 bg-[#0000009a]  flex py-8 justify-center top-0 left-0'>
  
        <div className="flex flex-col max-w-2xl w-full bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="px-6 my-2 flex flex-row justify-between items-start">
                <img src={logo} alt="Logo" className="w-8 mb-4"/>
                <button className="text-purple-700 font-bold cursor-pointer focus:outline-none hover:bg-gray-100 hover:p-2 hover:rounded-full" onClick={()=>navigate(-1)}>X</button> 
            </div>
            <div className="px-8">
                <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">Inscription</h1>

                <form className="space-y-4 w-full flex flex-col items-center px-8 mb-6">
                   <div className='flex w-full'>
                    <Button type='button' onClick={()=>handleChangeType('email')} className={`flex flex-1 px-4 py-2 active:ring-0 cursor-pointer ${isEmail ?"focus:outline-none focus:ring-0 text-white font-bold rounded-none rounded-s-md bg-purple-700 hover:bg-purple-800 border-purple-800" :"bg-transparent text-purple-700 rounded-none border-1 rounded-s-md hover:bg-transparent"} `}>Utiliser un email</Button>
                    <Button type='button' onClick={()=>handleChangeType('phone')} className={`flex flex-1 px-4 py-2 active:ring-0 cursor-pointer  ${isEmail?"bg-transparent hover:bg-transparent text-purple-700 border-1 rounded-none rounded-e-md border-purple-700":"focus:outline-none focus:ring-0 text-white font-bold rounded-none rounded-e-md bg-purple-700 hover:bg-purple-800 border-purple-800"}`}>Utiliser un téléphone</Button>
                   </div>
                    <input
                    type="text"
                    required
                    name="name"
                    value={signupField.name}
                    onChange={handleInputChange}
                    placeholder="Nom d'utilisateur"
                    className={`w-full p-3 border  rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500
                        ${errors.name ? "border-red-500" : "border-gray-300"}
                        `}
                    />
                     {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    {isEmail&& (
                        <>
                            <input
                            type="email"
                            required
                            name="email"
                            value={signupField.email}
                            onChange={handleInputChange}
                            placeholder="Adresse e-mail"
                            className={`w-full p-3 border  rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500
                                ${(errors.email || (signupField.email!=='' && !isValidEmail(signupField.email))) ? "border-red-500" : "border-gray-300"}
                                `}
                            />
                             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            {(signupField.email!=='' && !isValidEmail(signupField.email)) && <p className="text-red-500 text-sm mt-1">{valieMessage}</p>}
                        
                        </>
                       )}
                    {!isEmail&& (
                        <>
                         <input
                            type="phone"
                            name="phone"
                            value={signupField.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="Téléphone"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500
                                    ${(errors.phone || (signupField.phone!=='' && !isValidIvorianPhone(signupField.phone))) ? "border-red-500" : "border-gray-300"}
                                `}
                        />
                         {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                         {(signupField.phone!=='' && !isValidIvorianPhone(signupField.phone)) && <p className="text-red-500 text-sm mt-1">{valieMessage}</p>}
                        
                        </>
                        
                    )}
                    
                    <button className={"w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800" + (isValide ? "":" cursor-not-allowed")} disabled={!isValide}>
                        Suivant
                    </button>
                </form>
                <div className="flex flex-col gap-3 px-8">
                    <Button className="w-full cursor-pointer flex items-center justify-center bg-red-500 text-white py-3 rounded-lg hover:bg-red-600">
                    <FcGoogle className="mr-2 text-xl" /> Continuer avec Google
                    </Button>
                    <Button className="w-full cursor-pointer flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                    <FaFacebook className="mr-2 text-xl" /> Continuer avec Facebook
                    </Button>
                </div>
                <div className="text-center mt-6">
                    <span>Vous avez déjà un compte ? </span>
                    <a href="#" className="text-purple-600 font-bold hover:underline">Connectez-vous</a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SignUpPage 
