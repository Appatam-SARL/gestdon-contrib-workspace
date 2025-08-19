import { IPackage } from '@/interface/package.interface';
import { ShoppingCart } from 'lucide-react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Button } from '../ui/button';

const PricingItemCard = ({
  name,
  description,
  price,
  selected,
  onClick,
  features,
  isPopular,
  maxUsers,
  maxFollowing,
  maxActivity,
  maxAudience,
  maxDon,
  maxPromesse,
  maxReport,
}: IPackage & {
  price: string;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-full max-w-sm rounded-lg shadow-md border transition-all duration-300 cursor-pointer overflow-hidden
			${
        isPopular
          ? 'border-2 border-yellow-400 bg-yellow-50'
          : selected
          ? 'border-purple-700 bg-purple-50 ring-2 ring-purple-600'
          : 'border-gray-200 bg-white hover:shadow-lg'
      }
			`}
    >
      {isPopular && (
        <div className='absolute top-0 right-0 bg-yellow-400 text-white text-xs px-2 py-1 font-semibold rounded-bl-md'>
          Populaire
        </div>
      )}
      <div className='p-6'>
        <div className='flex flex-col items-center mb-6'>
          <h3 className='mb-2 text-2xl font-bold tracking-tight text-purple-700'>
            {name.toLocaleUpperCase()}
          </h3>
          <p className='mb-4 font-light text-gray-500 text-sm text-center'>
            {description}
          </p>
          <div className='text-xl uppercase font-semibold text-gray-800'>
            {price === 'Gratuit' || price === 'Sur devis'
              ? price
              : price + ' FCFA/mois'}
          </div>
          <Button className='mt-6 w-full'>
            <ShoppingCart />
            <span>Sélectionner</span>
          </Button>
        </div>
        <ul className='space-y-2 mb-6'>
          {features.map(
            (
              item: { name: string; value: string; enable: boolean },
              index: number
            ) => (
              <li
                key={index}
                className='flex items-center text-gray-700 text-2xl gap-2'
              >
                {item.enable ? (
                  <FaCheckCircle className='text-green-500 mr-2' />
                ) : (
                  <FaTimesCircle className='text-red-500 mr-2' />
                )}
                <span className='text-gray-700 text-[16px] flex-1'>
                  {item.name}
                </span>
              </li>
            )
          )}
          {[
            { value: maxUsers, label: 'utilisateurs' },
            { value: maxFollowing, label: 'abonnements' },
            { value: maxActivity, label: 'activités' },
            { value: maxAudience, label: 'audiences' },
            { value: maxDon, label: 'dons' },
            { value: maxPromesse, label: 'promesses' },
            { value: maxReport, label: 'rapports' },
          ]
            .filter((i) => i.value !== undefined)
            .map((item, idx) => (
              <li
                key={idx}
                className='flex items-center text-gray-700 text-2xl gap-2'
              >
                <FaCheckCircle className='text-green-500 mr-2' />
                <span className='text-gray-700 text-[16px] flex-1'>
                  {item.value === 'infinite'
                    ? item.label + ' illimité'
                    : item.value + ' ' + item.label}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingItemCard;
