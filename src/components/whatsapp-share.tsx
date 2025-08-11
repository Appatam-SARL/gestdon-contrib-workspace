import { WhatsappIcon } from 'react-share';

interface IWhatsappShareButtonProps {
  url: string;
  title: string;
  separator: string;
}

export const ShareWhatsapp = ({
  url,
  title,
  separator,
}: IWhatsappShareButtonProps) => {
  return (
    <div className='Demo__some-network'>
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
          title
        )}%20${encodeURIComponent(url)}`}
        target='_blank'
        rel='noreferrer'
      >
        <WhatsappIcon size={32} round />
      </a>
    </div>
  );
};
