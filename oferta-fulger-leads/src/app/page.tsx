import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-dark mb-6 leading-tight">
          Obține oferte exclusive în <span className="text-primary">Cluj</span> în fiecare săptămână!
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Fără spam, doar reduceri reale la cafenele, saloane, săli de sport, escape room-uri și restaurante locale.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/consumer-form" className="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-colors shadow-lg">
            Alătură-te acum la Cluj Deal Drop
          </Link>
          <Link href="/merchant-form" className="bg-accent text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-colors shadow-lg">
            Listează-ți afacerea
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Consumer Pitch */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-dark mb-4">Pentru Consumatori</h2>
          <p className="text-gray-700 mb-6">
            Descoperă cele mai bune oferte locale, direct în inbox-ul tău de WhatsApp. Economisește la experiențele tale preferate din Cluj.
          </p>
          <Link href="/consumer-form" className="text-primary font-semibold hover:underline">
            Vreau oferte! &rarr;
          </Link>
        </div>

        {/* Merchant Pitch */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-dark mb-4">Pentru Afaceri Locale</h2>
          <p className="text-gray-700 mb-6">
            Atrage clienți noi fără costuri inițiale. Fii prezent în fața unei audiențe locale interesate de ofertele tale.
          </p>
          <Link href="/merchant-form" className="text-accent font-semibold hover:underline">
            Listează-mi afacerea &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}