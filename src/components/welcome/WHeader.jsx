import logo from '../../assets/logo_icon.png';

const WHeader = () => {
  return (
    <header className='flex items-center justify-between px-6 py-2 bg-purple-100 mb-12 w-full fixed top-0 left-0 z-10'>
      <div className=' font-bold text-purple-700 flex items-center'>
        <img src={logo} alt='logo' className='w-8' />
        <span className='text-2xl font-bold'>Contrib</span>
      </div>
    </header>
  );
};

export default WHeader;
