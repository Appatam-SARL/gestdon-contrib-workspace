import { EmailIcon, EmailShareButton } from 'react-share';

export const ShareEmail = ({
  url,
  subject,
  body,
  className,
}: {
  url: string;
  subject: string;
  body: string;
  className?: string;
}) => {
  return (
    <div className='Demo__some-network'>
      <EmailShareButton
        url={url}
        subject={subject}
        body={body}
        className={`Demo__some-network__share-button ${className}`}
      >
        <EmailIcon size={32} round />
      </EmailShareButton>
    </div>
  );
};
