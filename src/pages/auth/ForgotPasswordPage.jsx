import React from 'react'
import { Button } from "flowbite-react";
import logo from '../../assets/logo_icon.png'
import { useState } from 'react'
import { checkEmailOrPhone } from '../../utils/validateEmailOrPhone'
import { LuLoader } from "react-icons/lu";
const ForgotPasswordPage = () => {
    const [isEmail, setIsEmail] = useState(true);
    const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmail(value);
    }
    const isValide = email.trim().length > 0 && checkEmailOrPhone(email);
  return (
    <div className='absolute inset-0 bg-[#0000009a]  flex py-8 justify-center top-0 left-0'>
            <div className="flex flex-col max-w-2xl w-full bg-white shadow-lg rounded-2xl overflow-hidden">
                <div className="px-6 my-2 flex flex-row justify-between items-start">
                    <img src={logo} alt="Logo" className="w-8 mb-4"/>
                    <button className="text-purple-700 font-bold cursor-pointer focus:outline-none hover:bg-gray-100 hover:p-2 hover:rounded-full" onClick={()=>navigate(-1)}>X</button> 
                </div>
                <div className="px-8">
                    <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">Mot de passe oublier</h1>
                    <p className='text-gray-400 mb-6 text-left '>
                    Entrez l'adresse email, le numéro de téléphone ou le nom d'utilisateur associé à votre compte pour modifier votre mot de passe.
					</p>
                    <form className="space-y-4 w-full h-full flex flex-col items-center justify-between px-8 mb-6">
                   
                        <input
                            type="email"
                            required
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            placeholder="Numéro de télépohone, Adresse e-mail"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        
                        <button className={"w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800" + (isValide ? "":" cursor-not-allowed")} disabled={!isValide}>
                            {isLoading ? <LuLoader className='size-6 animate-spin mx-auto' /> : "Envoyer le lien de réinitialisation"}
                        </button>
                    </form>
                    
                </div>
            </div>
        </div>
  )
}

export default ForgotPasswordPage
