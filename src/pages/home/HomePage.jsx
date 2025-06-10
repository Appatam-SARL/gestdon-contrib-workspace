import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import { useState } from 'react';
import logo from '../../assets/logo.png';
import logo_i from '../../assets/logo_icon.png';
const HomePage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleSubMenu = (menu) => {
    setActiveSubMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <div className='flex min-h-screen bg-purple-100'>
      {/* Sidebar comme Facebook à gauche */}
      <aside className='hidden md:flex flex-col w-64 bg-purple-700 text-white p-4'>
        <div className='mb-6 flex items-center justify-center'>
          <img src={logo} alt='' className='w-24' />
        </div>
        <nav className='flex flex-col gap-4'>
          <button className='flex items-center gap-3 hover:bg-purple-600 p-2 rounded'>
            {/* <FaHome className='w-5 h-5' /> Accueil */}
          </button>
          <button className='flex items-center gap-3 hover:bg-purple-600 p-2 rounded'>
            {/* <FaUsers className='w-5 h-5' /> Activités */}
          </button>
          <button className='flex items-center gap-3 hover:bg-purple-600 p-2 rounded'>
            {/* <FaCalendarAlt className='w-5 h-5' /> Agenda */}
          </button>
          {/* <button className='flex items-center gap-3 hover:bg-purple-600 p-2 rounded'>
            <FaPlusCircle className='w-5 h-5' /> Créer */}
          {/* </button> */}
        </nav>
        <div className='mt-auto text-sm text-gray-300'>© 2025 MonApp</div>
      </aside>

      {/* Main Content */}
      <div className='flex-1'>
        {/* Header */}
        <Navbar fluid className='bg-white border-b border-purple-200 px-4 py-2'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-2'>
              <img src={logo_i} className='w-8' alt='Logo' />
              <span className='text-xl hidden md:flex font-bold text-purple-700'>
                Contrib
              </span>
            </div>
            <form className='hidden md:block mx-auto w-1/2'>
              {/* <TextInput
                type='text'
                icon={FaSearch}
                placeholder='Rechercher...'
              /> */}
            </form>
            <div className='flex items-center gap-4'>
              <Button
                size='sm'
                color='gray'
                className='flex md:hidden rounded-full'
              >
                {/* <FaSearch className='w-5 h-5' /> */}
              </Button>
              <Button size='sm' color='gray' className='rounded-full'>
                {/* <FaEnvelope className='w-5 h-5' /> */}
              </Button>
              <Button size='sm' color='gray' className='rounded-full'>
                {/* <FaBell className='w-5 h-5' /> */}
              </Button>
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar alt='User' img='https://i.pravatar.cc/30' rounded />
                }
              >
                <Dropdown.Header>
                  <span className='block text-sm'>Jean Dupont</span>
                  <span className='block truncate text-sm font-medium'>
                    jean@example.com
                  </span>
                </Dropdown.Header>
                <Dropdown.Item>Mon profil</Dropdown.Item>
                <Dropdown.Item>Paramètres</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>Se déconnecter</Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </Navbar>

        {/* Feed Content */}
        <main className='p-4'>
          <h2 className='text-2xl font-semibold mb-4 text-purple-700'>
            Fil d’actualité
          </h2>
          <div className='bg-white p-4 rounded shadow-sm'>
            <p className='text-gray-600'>
              Bienvenue sur votre tableau de bord.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
