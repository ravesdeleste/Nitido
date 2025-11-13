import React, { useState, useCallback } from 'react';
import type { FormData, Recommendation, BudgetDetail } from './types';
import { initialFormData, INDOOR_ACOUSTIC_PROPERTIES, OUTDOOR_ACOUSTIC_PROPERTIES } from './constants';
import { getSoundSystemRecommendation } from './services/geminiService';

import Header from './components/Header';
import EventForm from './components/EventForm';
import RecommendationCard from './components/RecommendationCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import WelcomeMessage from './components/WelcomeMessage';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [budgetDetails, setBudgetDetails] = useState<BudgetDetail[]>([]);
  const [mixerChannels, setMixerChannels] = useState<2 | 4>(2);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      let processedValue: string | number | boolean;

      if (type === 'checkbox') {
          processedValue = (e.target as HTMLInputElement).checked;
      } else if (type === 'number') {
          processedValue = value === '' ? '' : parseFloat(value);
      } else {
          processedValue = value;
      }

      const newState = {
        ...prev,
        [name]: processedValue,
      };

      if (name === 'venueType') {
        if (value === 'outdoor') {
          newState.acousticProperties = OUTDOOR_ACOUSTIC_PROPERTIES[0].value as FormData['acousticProperties'];
        } else {
          newState.acousticProperties = INDOOR_ACOUSTIC_PROPERTIES[0].value as FormData['acousticProperties'];
        }
      }

      return newState;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    setBudgetDetails([]);
    setMixerChannels(2); // Reset mixer channels on new submission

    try {
      const result = await getSoundSystemRecommendation(formData);
      setRecommendation(result);
      if (result.budget?.details) {
        setBudgetDetails(result.budget.details);
      }
    } catch (err) {
      console.error(err);
      setError('Hubo un error al generar la recomendación. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBudgetItemToggle = (toggledIndex: number) => {
    setBudgetDetails(currentDetails =>
      currentDetails.map((item, index) =>
        index === toggledIndex ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const handleBudgetItemQuantityChange = (updatedIndex: number, newQuantity: number) => {
    const quantity = Math.max(0, newQuantity); // Prevent negative numbers
    setBudgetDetails(currentDetails =>
      currentDetails.map((item, index) =>
        index === updatedIndex ? { ...item, quantity: quantity } : item
      )
    );
  };

  const handleMixerChannelChange = (channels: 2 | 4) => {
    setMixerChannels(channels);
  };

  const acousticOptions = formData.venueType === 'indoor' ? INDOOR_ACOUSTIC_PROPERTIES : OUTDOOR_ACOUSTIC_PROPERTIES;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Detalles del Evento</h2>
            <EventForm 
              formData={formData} 
              onFormChange={handleFormChange} 
              onSubmit={handleSubmit} 
              isLoading={isLoading}
              acousticOptions={acousticOptions}
            />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[400px]">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && !recommendation && <WelcomeMessage />}
            {recommendation && (
              <RecommendationCard
                recommendation={recommendation}
                budgetDetails={budgetDetails}
                onToggleItem={handleBudgetItemToggle}
                onQuantityChange={handleBudgetItemQuantityChange}
                discountCode={formData.discountCode.toLowerCase().trim()}
                mixerChannels={mixerChannels}
                onMixerChannelChange={handleMixerChannelChange}
              />
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Potenciado por IA. Las recomendaciones son una guía y pueden requerir ajustes profesionales.</p>
      </footer>
    </div>
  );
};

export default App;
