import animationData from '@/assets/svg/not-found.json';
import Lottie from 'react-lottie';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto', // Ajuste la hauteur pour centrer verticalement
    width: '500px', // Prend toute la largeur du conteneur
  },
};

export const ErrorNotFound = () => {
  return (
    <div
      className='errorNotFound'
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={styles.container}>
        <Lottie
          options={defaultOptions}
          height={'100%'}
          width={'100%'}
          isStopped={false}
          isPaused={false}
        />
      </div>
      <p>Page non trouvée</p>
    </div>
  );
};
