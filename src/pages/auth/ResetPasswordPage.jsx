import React,{useState} from 'react'
import logo from '../../assets/logo_icon.png'


const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.length < 6) {
          setError("Le mot de passe doit contenir au moins 6 caractères.");
          setSuccess("");
          return;
        }
        if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas.");
          setSuccess("");
          return;
        }
        setError("");
        setSuccess("Votre mot de passe a été réinitialisé avec succès.");
        // Envoyer le nouveau mot de passe au backend ici
        console.log("Nouveau mot de passe :", password);
      };

  return (
    <div className='absolute inset-0 bg-[#0000009a]  flex py-8 justify-center top-0 left-0'>
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-2xl text-center">
        <div className="px-6 my-2 flex flex-row justify-between items-start">
            <img src={logo} alt="Logo" className="w-8 mb-4"/>
            <button className="text-purple-700 font-bold cursor-pointer focus:outline-none hover:bg-gray-100 hover:p-2 hover:rounded-full" onClick={()=>navigate(-1)}>X</button> 
        </div>
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Réinitialiser le mot de passe</h2>
        <p className="text-gray-600 mb-6">Veuillez entrer un nouveau mot de passe sécurisé.</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block mb-1 text-sm font-medium">Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-2 text-center">{success}</p>}

          <button type="submit" className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 mt-4">
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage