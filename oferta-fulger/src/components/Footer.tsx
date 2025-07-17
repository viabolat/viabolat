import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-dark text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">OfertaFulger</h3>
            <p className="mb-4">Cea mai bună platformă pentru descoperirea de oferte exclusive în România.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FontAwesomeIcon icon={faYoutube} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Link-uri utile</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Despre noi</a></li>
              <li><a href="#" className="hover:text-white">Cum funcționează</a></li>
              <li><a href="#" className="hover:text-white">Întrebări frecvente</a></li>
              <li><a href="#" className="hover:text-white">Termeni și condiții</a></li>
              <li><a href="#" className="hover:text-white">Politica de confidențialitate</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Pentru parteneri</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Adaugă afacerea ta</a></li>
              <li><a href="#" className="hover:text-white">De ce OfertaFulger?</a></li>
              <li><a href="#" className="hover:text-white">Resurse pentru parteneri</a></li>
              <li><a href="#" className="hover:text-white">Contact parteneri</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
                <span>Bd. Unirii 15, București</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faPhone} className="mr-3" />
                <span>021 123 4567</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
                <span>contact@viabolat.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p>&copy; 2025 OfertaFulger. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
