import { Button } from 'flowbite-react';
import { useState } from 'react';
import ImageUploader from '../../../components/commons/ImageUploader';
import SelectType from '../../../components/commons/SelectType';
import WHeader from '../../../components/welcome/WHeader';

const types = ['Personnalité', 'Association', 'ONG', 'Service Public'];
const domaines = [
  'Politique',
  'Musique',
  'Sport',
  'Éducation',
  'Santé',
  'Culture',
];

const OrganisationForm = () => {
  const [type, setType] = useState('');
  const [logos, setLogos] = useState([]);
  return (
    <div className='flex flex-col justify-between w-max-screen  bg-purple-100 relative overflow-hidden'>
      <WHeader />
      <main className='flex flex-col items-center px-4 py-8 pb-12  bg-white rounded-md shadow-md w-full max-w-2xl mx-auto mt-24'>
        <h1 className='text-2xl font-bold text-purple-700 mb-6 text-center'>
          Informations sur votre organisation
        </h1>
        <form className='w-full max-w-2xl space-y-4'>
          <SelectType value={type} onChange={setType} types={types} />

          <div>
            <label className='block text-sm font-medium mb-2'>
              Nom de l'organisation
            </label>
            <input
              type='text'
              placeholder='Nom'
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500'
            />
          </div>

          <ImageUploader value={logos} onChange={setLogos} />

          <div>
            <label className='block text-sm font-medium mb-2'>
              Domaine d'activité
            </label>
            <select className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500'>
              <option value=''>Sélectionner</option>
              {domaines.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Bio / Présentation
            </label>
            <textarea
              placeholder='Parlez-nous de votre organisation'
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500'
              rows={4}
            ></textarea>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Adresse</label>
            <input
              type='text'
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Pays</label>
              <input
                type='text'
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Province / Région
              </label>
              <input
                type='text'
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Ville</label>
              <input
                type='text'
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Email</label>
              <input
                type='email'
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Téléphone
              </label>
              <input
                type='tel'
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500'
              />
            </div>
          </div>
          <div className='text-sm text-gray-500 text-center'>
            En cliquant sur « Enregistrer et continuer », vous acceptez nos{' '}
            <a href='#' className='text-purple-700 underline'>
              Conditions d’utilisation
            </a>{' '}
            et reconnaissez avoir lu notre{' '}
            <a href='#' className='text-purple-700 underline'>
              Politique de confidentialité
            </a>
            .
          </div>
          <Button className='bg-purple-700 text-white hover:bg-purple-800 w-full pointer-cursor'>
            Enregistrer et continuer
          </Button>
        </form>
      </main>
    </div>
  );
};

export default OrganisationForm;
