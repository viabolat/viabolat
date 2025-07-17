import { createServerReadOnly } from '@/utils/supabase/server';
import DealCard, { Deal } from '@/components/DealCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUtensils, faSpa, faPlane, faTicketAlt, faShoppingBag, faHome, faArrowRight } from '@fortawesome/free-solid-svg-icons';

async function getDeals() {
  const supabase = createServerReadOnly();
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      profiles (
        website
      )
    `)
    .eq('is_active', true)
    .limit(6);

  if (error) {
    console.error('Error fetching deals:', error);
    return [];
  }

  return data as Deal[];
}

export default async function Home() {
  const deals = await getDeals();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Economisește până la 70% în orașul tău!</h1>
              <p className="text-xl mb-6">Descoperă cele mai bune oferte și promoții în restaurante, spa-uri, vacanțe și multe altele.</p>
              <div className="flex">
                <input type="text" placeholder="Caută dealuri..."
                  className="px-4 py-3 rounded-l-lg w-full text-gray-800 focus:outline-none" />
                <button className="bg-accent px-6 py-3 rounded-r-lg font-medium hover:bg-opacity-90">
                  <FontAwesomeIcon icon={faSearch} className="mr-2" />Caută
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div
                  className="bg-white rounded-xl shadow-xl p-4 w-64 h-64 transform rotate-3 absolute -top-4 -left-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full"></div>
                </div>
                <div className="bg-white rounded-xl shadow-xl p-4 w-64 h-64 transform -rotate-3">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Categorii Populare</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <a href="#"
              className="category-card bg-white rounded-lg shadow p-4 text-center transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faUtensils} className="text-white text-2xl" />
              </div>
              <span className="font-medium">Restaurante</span>
            </a>

            <a href="#"
              className="category-card bg-white rounded-lg shadow p-4 text-center transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faSpa} className="text-white text-2xl" />
              </div>
              <span className="font-medium">Spa & Wellness</span>
            </a>

            <a href="#"
              className="category-card bg-white rounded-lg shadow p-4 text-center transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faPlane} className="text-white text-2xl" />
              </div>
              <span className="font-medium">Vacanțe</span>
            </a>

            <a href="#"
              className="category-card bg-white rounded-lg shadow p-4 text-center transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-yellow-500 rounded-full flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faTicketAlt} className="text-white text-2xl" />
              </div>
              <span className="font-medium">Evenimente</span>
            </a>

            <a href="#"
              className="category-card bg-white rounded-lg shadow p-4 text-center transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faShoppingBag} className="text-white text-2xl" />
              </div>
              <span className="font-medium">Shopping</span>
            </a>

            <a href="#"
              className="category-card bg-white rounded-lg shadow p-4 text-center transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faHome} className="text-white text-2xl" />
              </div>
              <span className="font-medium">Acasă & Grădină</span>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Oferte Recomandate</h2>
            <a href="#" className="text-primary font-medium">Vezi toate ofertele <FontAwesomeIcon icon={faArrowRight} className="ml-2" /></a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>

          {deals.length === 0 && (
            <div className="text-center text-gray-500 mt-16">
              <p className="text-xl">Momentan nu sunt oferte active.</p>
              <p>Te rugăm să revii mai târziu sau să verifici dacă ai adăugat oferte în panoul de administrare Supabase.</p>
            </div>
          )}
        </div>
      </section>

      {/* Local Deals */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Oferte în Cluj-Napoca</h2>
            <a href="#" className="text-primary font-medium">Vezi toate ofertele <FontAwesomeIcon icon={faArrowRight} className="ml-2" /></a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for local deals - can be populated dynamically later */}
            <div className="deal-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
              <div className="relative">
                <div className="h-40 bg-gray-200 border-2 border-dashed w-full"></div>
                <div className="deal-badge bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -60%
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">Escape Room pentru 4 persoane</h3>
                <p className="text-gray-600 text-sm mb-3">Mind Escape - București</p>

                <div className="flex items-center mb-3">
                  <div>
                    <span className="text-gray-500 line-through text-sm">200 lei</span>
                    <span className="text-primary font-bold ml-2">80 lei</span>
                  </div>
                </div>

                <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Vezi
                  detalii</button>
              </div>
            </div>

            <div className="deal-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
              <div className="relative">
                <div className="h-40 bg-gray-200 border-2 border-dashed w-full"></div>
                <div className="deal-badge bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -55%
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">Tuns + Aranjat</h3>
                <p className="text-gray-600 text-sm mb-3">Salon Elegance - București</p>

                <div className="flex items-center mb-3">
                  <div>
                    <span className="text-gray-500 line-through text-sm">180 lei</span>
                    <span className="text-primary font-bold ml-2">80 lei</span>
                  </div>
                </div>

                <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Vezi
                  detalii</button>
              </div>
            </div>

            <div className="deal-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
              <div className="relative">
                <div className="h-40 bg-gray-200 border-2 border-dashed w-full"></div>
                <div className="deal-badge bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -70%
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">Curs de Sushi</h3>
                <p className="text-gray-600 text-sm mb-3">Sushi Academy - București</p>

                <div className="flex items-center mb-3">
                  <div>
                    <span className="text-gray-500 line-through text-sm">300 lei</span>
                    <span className="text-primary font-bold ml-2">90 lei</span>
                  </div>
                </div>

                <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Vezi
                  detalii</button>
              </div>
            </div>

            <div className="deal-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
              <div className="relative">
                <div className="h-40 bg-gray-200 border-2 border-dashed w-full"></div>
                <div className="deal-badge bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -45%
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">Bowling pentru 2</h3>
                <p className="text-gray-600 text-sm mb-3">Strike Bowling - București</p>

                <div className="flex items-center mb-3">
                  <div>
                    <span className="text-gray-500 line-through text-sm">110 lei</span>
                    <span className="text-primary font-bold ml-2">60 lei</span>
                  </div>
                </div>

                <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Vezi
                  detalii</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      </>
  );
}