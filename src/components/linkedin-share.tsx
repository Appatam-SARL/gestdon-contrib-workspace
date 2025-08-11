import { Helmet } from 'react-helmet';
import { LinkedinIcon, LinkedinShareButton } from 'react-share';

interface IProps {
  title: string;
  text: string;
  image: string;
}

const ShareLinkedIn = ({ title, text, image }: IProps) => {
  return (
    <div>
      <Helmet>
        <meta property='og:title' content={title} />
        <meta property='og:description' content={text} />
        <meta property='og:image' content={image} />
        <meta property='og:url' content={window.location.href} />
      </Helmet>

      <LinkedinShareButton url={window.location.href}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </div>
  );
};

export default ShareLinkedIn;
