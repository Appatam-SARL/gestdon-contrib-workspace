// ShareLinkedIn.jsx
import { Helmet } from 'react-helmet';
import { FacebookIcon, FacebookShareButton } from 'react-share';

interface IProps {
  title: string;
  text: string;
  image: string;
}

const ShareFacebook = ({ title, text, image }: IProps) => {
  const currentUrl = window.location.href;

  return (
    <div className='Demo__some-network'>
      <Helmet>
        <meta property='og:title' content={title} />
        <meta property='og:description' content={text} />
        <meta property='og:image' content={image} />
        <meta property='og:url' content={currentUrl} />
        <meta property='og:type' content='website' />
      </Helmet>
      <FacebookShareButton
        url={currentUrl}
        title='Partager sur Facebook'
        htmlTitle='Partager sur Facebook'
        content='Partager sur Facebook'
        className='Demo__some-network__share-button'
        hashtag='#contrib, #monapp'
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>
    </div>
  );
};

export default ShareFacebook;
