import DonApi from '@/api/don.api';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Lottie from 'react-lottie';

import animationData from '@/assets/svg/success.json';

const ConfirmDon = () => {
  const token = new URLSearchParams(window.location.search).get('token');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!token) {
      setError('Token manquant.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await DonApi.confirmDon(token);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Erreur lors de la confirmation du don.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-neutral-100'>
      <div className='text-center bg-white border-2 border-gray-300 rounded-lg p-10 w-full max-w-md'>
        {success ? (
          <div style={{ color: 'green', margin: '10px 0' }}>
            <Lottie
              style={{ width: 100, height: 100 }}
              options={{
                loop: true,
                autoplay: true,
                animationData,
              }}
            />
            Merci, votre don a bien été confirmé !
          </div>
        ) : (
          <>
            <h2 className='text-2xl font-medium mb-1.5'>
              Confirmation de réception du don
            </h2>
            <p className='mb-4'>
              Veuillez cliquer sur le bouton ci-dessous pour confirmer que vous
              avez bien reçu le don.
            </p>
            {error && (
              <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>
            )}
            <Button
              className='bg-[#4caf50] text-white'
              onClick={handleConfirm}
              disabled={loading}
              style={{
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Confirmation en cours...' : "J'ai bien reçu le don"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmDon;
