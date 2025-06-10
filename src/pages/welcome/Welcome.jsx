import React,{useState} from 'react'

import { Button } from "flowbite-react";

import { useNavigate } from 'react-router';
import WHeader from '../../components/welcome/WHeader';
const Welcome = () => {
    
    const navigate = useNavigate()
    const handleRoleToggle = () => {

    }    
  return (
    <div className="flex flex-col justify-between w-max-screen  bg-purple-100 relative overflow-hidden">
    {/* Header */}
    
    <WHeader />

    {/* Main Content */}
    <main className="flex flex-col items-center px-4 py-8 pb-12 mt-12">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">Félicitations pour votre inscription !</h1>
      <p className="text-gray-600 text-center max-w-xl mb-10">
        Merci de rejoindre notre communauté. Veuillez choisir comment vous souhaitez utiliser la plateforme pour que nous puissions vous offrir la meilleure expérience possible.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <div className="border rounded-2xl shadow-md p-6 hover:shadow-xl transition">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">En tant que contributeur</h2>
          <p className="text-gray-600 mb-4">
            Pour suivre mes activités, mesurer ma réputation, tenir mon agenda...
          </p>
          <Button className="bg-purple-700 text-white hover:bg-purple-800 w-full">
            Choisir ce rôle
          </Button>
        </div>

        <div className="border rounded-2xl shadow-md p-6 hover:shadow-xl transition">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">En tant que fan</h2>
          <p className="text-gray-600 mb-4">
            Je veux m'informer sur l'actualités mes personnalités préférées, stars, associations, hommes politiques…
          </p>
          <Button className="bg-purple-700 text-white hover:bg-purple-800 w-full">
            Choisir ce rôle
          </Button>
        </div>
      </div>
    </main>

   
  </div>
  )
}

export default Welcome
