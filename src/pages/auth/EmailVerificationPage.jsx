import React,{useState} from 'react'
import { Button } from "flowbite-react";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const joinedCode = code.join("");
    if (joinedCode.length < 6) {
      setError("Veuillez entrer le code complet à 6 chiffres.");
      return;
    }
    setError("");
    // Traitement de la vérification ici
    console.log("Code entré :", joinedCode);
  };

  return (
    <div className='absolute inset-0 bg-[#0000009a]  flex py-8 justify-center top-0 left-0'>
    <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-2xl text-center">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Vérification de l'adresse e-mail</h2>
      <p className="text-gray-600 mb-6">Veuillez entrer le code à 6 chiffres envoyé à votre adresse e-mail.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button type="submit" className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 mt-4">
          Vérifier le code
        </button>

        <p className="text-sm text-gray-600 mt-4">
          Vous n'avez pas reçu le code ? <a href="#" className="text-purple-600 font-bold hover:underline">Renvoyer</a>
        </p>
      </form>
    </div>
  </div>
  )
}

export default EmailVerificationPage