import Link from 'next/link';
import Image from 'next/image';

// Define the type for a Deal object
export type Deal = {
  id: number;
  title: string;
  description: string | null;
  original_price: number;
  deal_price: number;
  discount_percentage: number;
  image_url: string | null;
  coupons_total: number;
  coupons_sold: number;
  expires_at: string | null;
  is_active: boolean;
  profiles: {
    website: string | null;
  } | null;
};

type DealCardProps = {
  deal: Deal;
};

const DealCard = ({ deal }: DealCardProps) => {
  const progress = (deal.coupons_sold / deal.coupons_total) * 100;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/deals/${deal.id}`}>
        <div className="relative">
          <div className="h-48 w-full relative">
            <Image
              src={deal.image_url || '/placeholder.png'}
              alt={deal.title}
              layout="fill"
              objectFit="cover"
              className="bg-gray-200"
            />
          </div>
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            -{Math.round(deal.discount_percentage)}%
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 truncate">{deal.title}</h3>
          <p className="text-gray-600 text-sm mb-4 truncate">{deal.profiles?.website || 'Partener'}</p>

          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-gray-500 line-through">{deal.original_price} lei</span>
              <span className="text-pink-600 font-bold text-xl ml-2">{deal.deal_price} lei</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Vândute: {deal.coupons_sold}</span>
              <span>Disponibile: {deal.coupons_total - deal.coupons_sold}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-pink-600 rounded-full h-2" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <button className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors">
            Vezi Oferta
          </button>
        </div>
      </Link>
    </div>
  );
};

export default DealCard;
