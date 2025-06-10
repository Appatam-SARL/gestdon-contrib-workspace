import React from 'react'
import { Link } from 'react-router-dom'
 const Hfooter = ()=> {
  return (
    <div className='flex flex-col justify-space-between items-center  md:pt-8 px-8  '>

        <ul className="flex flex-col md:flex-row justify-between items-center md:pt-8 text-gray-600 text-sm mb-4 md:mb-0 space-x-4">
            <li><Link className='text-gray-600' to="/about">À propos</Link></li>
            <li><Link to="/download-app">Téléchargez l'application</Link></li>
            <li><Link to="/help-center">Centre d'assistance</Link></li>
            <li><Link to="/cgu">Conditions d’utilisation</Link></li>
            <li><Link to="/policy">Politique de Confidentialité</Link></li>
            <li><Link to="/cookies">Politique relative aux cookies</Link></li>
            <li><Link to="/publicites">Informations sur les publicités</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/ressources">Ressources de la marque</Link></li>
        </ul>

        <p className="text-gray-600 text-sm mt-4 md:mb-0">
            © {new Date().getFullYear()} Appatam SN. Tous droits reservés.
        </p>
    </div>
  )
}












export default Hfooter
