import { Link } from 'react-router-dom';
import logo from '../../assets/logo_icon.png';

const WHeader = () => {
  return (
    <header className='flex items-center justify-between px-6 py-2 bg-purple-100 mb-12 w-full fixed top-0 left-0 z-10'>
      <Link to={'/'} className='font-bold flex items-center gap-2'>
        <img src={logo} alt='logo' loading='lazy' className='w-8' />
        <span className='text-2xl text-primary font-bold'>Contrib</span>
      </Link>
    </header>
  );
};

export default WHeader;
