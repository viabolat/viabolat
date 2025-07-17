'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MerchantFormPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contact: '',
    dealIdea: '',
    category: '',
    optIn: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Merchant Form Submitted:', formData);
    alert('Mulțumim! Te vom contacta în curând pentru a discuta despre afacerea ta!');
    setFormData({
      businessName: '',
      contact: '',
      dealIdea: '',
      category: '',
      optIn: false,
    });
  };

  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-dark mb-6">Listează-ți Afacerea Locală</h1>
        <p className="text-gray-700 text-center mb-6">Completează formularul pentru a atrage clienți noi fără costuri inițiale.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="businessName" className="block text-gray-700 text-sm font-bold mb-2">Numele Afacerii:</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-gray-700 text-sm font-bold mb-2">Contact (Telefon/Email):</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ex: 07xxxxxxxx sau email@exemplu.com"
              required
            />
          </div>

          <div>
            <label htmlFor="dealIdea" className="block text-gray-700 text-sm font-bold mb-2">Idee de Ofertă (opțional):</label>
            <textarea
              id="dealIdea"
              name="dealIdea"
              value={formData.dealIdea}
              onChange={handleChange}
              rows={3}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ex: 10% reducere la cafea, ședință de probă gratuită, etc."
            ></textarea>
          </div>

          <div>
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Categorie:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Selectează o categorie</option>
              <option value="food">Mâncare/Restaurante</option>
              <option value="beauty">Beauty/Saloane</option>
              <option value="fitness">Fitness/Săli de sport</option>
              <option value="service">Servicii</option>
              <option value="other">Altele</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="optIn"
              name="optIn"
              checked={formData.optIn}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-accent"
              required
            />
            <label htmlFor="optIn" className="ml-2 text-gray-700 text-sm">Vreau să fiu prezentat în Cluj Deal Drop.</label>
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-white px-4 py-2 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md"
          >
            Trimite Cererea
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          <Link href="/" className="text-accent hover:underline">Înapoi la pagina principală</Link>
        </p>
      </div>
    </div>
  );
}
