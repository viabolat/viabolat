'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ConsumerFormPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    dealTypes: {
      coffee: false,
      salon: false,
      gym: false,
      escapeRooms: false,
      food: false,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        dealTypes: {
          ...prev.dealTypes,
          [name]: (e.target as HTMLInputElement).checked,
        },
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
    console.log('Consumer Form Submitted:', formData);
    alert('Mulțumim! Te vom contacta în curând cu cele mai bune oferte!');
    setFormData({
      name: '',
      phone: '',
      area: '',
      dealTypes: {
        coffee: false,
        salon: false,
        gym: false,
        escapeRooms: false,
        food: false,
      },
    });
  };

  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-dark mb-6">Alătură-te Cluj Deal Drop</h1>
        <p className="text-gray-700 text-center mb-6">Completează formularul pentru a primi oferte exclusive direct pe WhatsApp.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nume:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Telefon (pentru WhatsApp):</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ex: 07xxxxxxxx"
              required
            />
          </div>

          <div>
            <label htmlFor="area" className="block text-gray-700 text-sm font-bold mb-2">Zona/Cartier (opțional):</label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <span className="block text-gray-700 text-sm font-bold mb-2">Ce tipuri de oferte te interesează?</span>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="coffee"
                  checked={formData.dealTypes.coffee}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-primary"
                />
                <span className="ml-2 text-gray-700">Cafenele</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="checkbox"
                  name="salon"
                  checked={formData.dealTypes.salon}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-primary"
                />
                <span className="ml-2 text-gray-700">Saloane</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="checkbox"
                  name="gym"
                  checked={formData.dealTypes.gym}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-primary"
                />
                <span className="ml-2 text-gray-700">Săli de sport</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="checkbox"
                  name="escapeRooms"
                  checked={formData.dealTypes.escapeRooms}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-primary"
                />
                <span className="ml-2 text-gray-700">Escape Rooms</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="checkbox"
                  name="food"
                  checked={formData.dealTypes.food}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-primary"
                />
                <span className="ml-2 text-gray-700">Mâncare/Restaurante</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white px-4 py-2 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md"
          >
            Alătură-te Cluj Deal Drop
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          <Link href="/" className="text-primary hover:underline">Înapoi la pagina principală</Link>
        </p>
      </div>
    </div>
  );
}
