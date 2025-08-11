import { useFacebookSDK } from '@/hook/useFacebookSDK';
import { FacebookShareData } from '@/types/facebook';
import React from 'react';

interface FacebookShareButtonProps {
  post: FacebookShareData;
  onShareSuccess?: (postId: string) => void;
  onShareError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export const FacebookShareButton: React.FC<FacebookShareButtonProps> = ({
  post,
  onShareSuccess,
  onShareError,
  className = '',
  children,
}) => {
  const { isInitialized } = useFacebookSDK();

  const handleShare = () => {
    console.log('handleShare');
    if (!isInitialized || !window.FB) {
      onShareError?.('Facebook SDK non initialisé');
      return;
    }

    const shareUrl =
      post.url || `${window.location.origin}/partages/post/${post.id}`;

    window.FB.ui(
      {
        method: 'share',
        href: shareUrl,
        quote:
          post.contenu.length > 200
            ? post.contenu.substring(0, 200) + '...'
            : post.contenu,
        hashtag: post.hashtag || '#MonApp',
      },
      (response: any) => {
        if (response && !response.error_message) {
          console.log('Post partagé avec succès!');
          onShareSuccess?.(post.id);
        } else {
          console.error('Erreur lors du partage:', response.error_message);
          onShareError?.(response.error_message || 'Erreur inconnue');
        }
      }
    );
  };

  return (
    <button
      onClick={() => handleShare()}
      disabled={!isInitialized}
      className={`facebook-share-btn ${className}`}
      aria-label='Partager sur Facebook'
    >
      {children || (
        <>
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='facebook-icon'
          >
            <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
          </svg>
          Partager sur Facebook
        </>
      )}
    </button>
  );
};
