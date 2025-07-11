import Logo from '@/assets/logo_icon.png';

export const Welcome = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100'>
      <div className='flex flex-col items-center justify-center bg-white/80 rounded-2xl p-8'>
        <img src={Logo} alt='logo' className='w-50 h-80 mb-4 animate-bounce' />
        <p className='mt-8 text-2xl font-semibold text-purple-700 text-center'>
          Bienvenue sur notre espace marchands
        </p>
      </div>
    </div>
  );
};
