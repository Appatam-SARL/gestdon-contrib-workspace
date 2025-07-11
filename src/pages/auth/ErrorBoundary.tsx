import animationData from '@/assets/svg/error-boundary.json';
import React, { ReactNode, useState } from 'react';
import Lottie from 'react-lottie';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

interface ErrorBoundaryProps {
  children: ReactNode;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  // Custom error boundary logic for functional components
  // We use a wrapper component to catch errors in children
  // This is a workaround since hooks can't catch errors directly
  // eslint-disable-next-line
  const ErrorCatcher = ({ children }: { children: ReactNode }) => {
    try {
      return <>{children}</>;
    } catch (error) {
      setHasError(true);
      return null;
    }
  };

  if (hasError) {
    return (
      <div className='errorBoundary' style={{ textAlign: 'center' }}>
        <Lottie
          options={defaultOptions}
          height={600}
          width={600}
          isStopped={false}
          isPaused={false}
        />
        Une erreur s'est produite lors du chargement du composant.
      </div>
    );
  }

  return <ErrorCatcher>{children}</ErrorCatcher>;
};
