import React from 'react';
import type { FormData } from '../types';
import { MUSIC_STYLES, VENUE_TYPES } from '../constants';

interface EventFormProps {
  formData: FormData;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  acousticOptions: { value: string; label: string }[];
}

const EventForm: React.FC<EventFormProps> = ({ formData, onFormChange, onSubmit, isLoading, acousticOptions }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="venueType" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Lugar</label>
          <select id="venueType" name="venueType" value={formData.venueType} onChange={onFormChange} className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
            {VENUE_TYPES.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="guestCount" className="block text-sm font-medium text-gray-300 mb-1">Cantidad de Personas</label>
          <input type="number" id="guestCount" name="guestCount" value={formData.guestCount} onChange={onFormChange} min="1" className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Dimensiones del Lugar (metros)</label>
        <div className="grid grid-cols-3 gap-2">
          <input type="number" name="venueWidth" placeholder="Ancho" value={formData.venueWidth} onChange={onFormChange} min="1" className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
          <input type="number" name="venueLength" placeholder="Largo" value={formData.venueLength} onChange={onFormChange} min="1" className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
          <input type="number" name="venueHeight" placeholder="Alto" value={formData.venueHeight} onChange={onFormChange} min="1" className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="acousticProperties" className="block text-sm font-medium text-gray-300 mb-1">Acústica del Lugar</label>
          <select id="acousticProperties" name="acousticProperties" value={formData.acousticProperties} onChange={onFormChange} className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
            {acousticOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="musicStyle" className="block text-sm font-medium text-gray-300 mb-1">Estilo Musical</label>
          <select id="musicStyle" name="musicStyle" value={formData.musicStyle} onChange={onFormChange} className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
            {MUSIC_STYLES.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center space-x-3 h-full">
            <input type="checkbox" name="dbRestriction" checked={formData.dbRestriction} onChange={onFormChange} className="bg-gray-700 border-gray-600 text-cyan-500 rounded focus:ring-cyan-500 h-5 w-5" />
            <span className="text-sm font-medium text-gray-300">¿Restricción de dB?</span>
          </label>
          {formData.dbRestriction && (
            <div className="mt-2">
              <input type="number" name="dbLevel" placeholder="Nivel máx. en dB" value={formData.dbLevel} onChange={onFormChange} className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="discountCode" className="block text-sm font-medium text-gray-300 mb-1">Código de Descuento</label>
          <input type="text" id="discountCode" name="discountCode" value={formData.discountCode} onChange={onFormChange} className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-md hover:from-cyan-600 hover:to-fuchsia-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
        {isLoading ? 'Calculando...' : 'Obtener Recomendación'}
      </button>
    </form>
  );
};

export default EventForm;
