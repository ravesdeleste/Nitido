import React, { useMemo } from 'react';
import type { Recommendation, BudgetDetail } from '../types';
import { WHATSAPP_NUMBER, MIXER_4_CHANNEL_ADDITIONAL_COST } from '../constants';

interface RecommendationCardProps {
  recommendation: Recommendation;
  budgetDetails: BudgetDetail[];
  onToggleItem: (index: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
  discountCode: string;
  mixerChannels: 2 | 4;
  onMixerChannelChange: (channels: 2 | 4) => void;
}

const SpeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H7zm5 2a4 4 0 110 8 4 4 0 010-8zm0 10a2 2 0 110 4 2 2 0 010-4z" />
    </svg>
);

const MixerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a2 2 0 012-2h14a2 2 0 012 2v18a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm4 4h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm4-8h2v6h-2V7zm0 8h2v2h-2v-2zm4-8h2v10h-2V7z" clipRule="evenodd" />
    </svg>
);

const MoneyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c2.17-.43 3.5-1.66 3.5-3.68 0-2.02-1.47-3.15-4.2-3.77z"/>
  </svg>
);


const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, budgetDetails, onToggleItem, onQuantityChange, discountCode, mixerChannels, onMixerChannelChange }) => {
  const { mainSpeakers, subwoofers, monitors, mixer, explanation, placementSuggestion } = recommendation;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU', minimumFractionDigits: 0 }).format(value);
  };

  const totalPrice = useMemo(() => {
    return budgetDetails.reduce((total, item) => {
      if (!item.isChecked) {
        return total;
      }
      let pricePerUnit = item.unitPriceIdeal;
      if (discountCode === 'nitidofriend') {
        pricePerUnit = item.unitPriceMaxDiscount;
      } else if (discountCode === 'nitidobro') {
        pricePerUnit = item.unitPriceAverage;
      }

      let itemTotal = pricePerUnit * item.quantity;

      if (item.item === 'Mixer' && mixerChannels === 4) {
        itemTotal += MIXER_4_CHANNEL_ADDITIONAL_COST;
      }

      return total + itemTotal;
    }, 0);
  }, [budgetDetails, discountCode, mixerChannels]);

  const handleWhatsAppInquiry = () => {
    const lightingItem = budgetDetails.find(item => item.item === 'Iluminación');

    const selectedItems = budgetDetails
      .filter(item => item.isChecked && item.quantity > 0 && item.item !== 'Iluminación')
      .map(item => {
        let line = `- ${item.item}`;
        if (item.item === 'Mixer') {
          line += ` (${mixerChannels}ch)`;
        } else if (item.quantity > 1) {
          line += ` (x${item.quantity})`;
        }
        return line;
      })
      .join('\n');
    
    let lightingMessage = '';
    if (lightingItem?.isChecked) {
        lightingMessage = '\n- Solicitud de presupuesto para Iluminación.';
    }

    if (!selectedItems) {
      alert("Por favor, selecciona al menos un ítem para contratar.");
      return;
    }

    const message = `¡Hola! Quisiera contratar el siguiente equipo de AsistenteNítido:\n\n${selectedItems}${lightingMessage}\n\nTotal estimado: ${formatCurrency(totalPrice)}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const getPriceTier = () => {
    if (discountCode === 'nitidofriend') return { label: 'Rebaja Máxima', color: 'text-green-400' };
    if (discountCode === 'nitidobro') return { label: 'Precio Promedio', color: 'text-yellow-400' };
    return { label: 'Precio Ideal', color: 'text-cyan-400' };
  };
  const priceTier = getPriceTier();
  const lightingItem = budgetDetails.find(item => item.item === 'Iluminación');

  return (
    <div className="w-full h-full p-4 bg-gray-900 rounded-lg text-left animate-fade-in space-y-4 overflow-y-auto">
      <h3 className="text-xl font-bold text-cyan-400">Sistema de Sonido Recomendado</h3>
      
      <div className="space-y-3">
        {/* Main Speakers */}
        <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-md">
            <SpeakerIcon className="h-8 w-8 text-cyan-400 mt-1 flex-shrink-0" />
            <div>
                <h4 className="font-semibold text-white">Altavoces Principales (P.A.)</h4>
                <p className="text-gray-300">{mainSpeakers.quantity} x {mainSpeakers.type}</p>
                <p className="text-sm text-gray-400">Potencia: {mainSpeakers.power}</p>
            </div>
        </div>
        {subwoofers.quantity > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-md">
                <SpeakerIcon className="h-8 w-8 text-fuchsia-500 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-white">Subwoofers</h4>
                    <p className="text-gray-300">{subwoofers.quantity} x {subwoofers.type}</p>
                    <p className="text-sm text-gray-400">Potencia: {subwoofers.power}</p>
                </div>
            </div>
        )}
        {monitors && monitors.quantity > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-md">
                <SpeakerIcon className="h-8 w-8 text-teal-400 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-white">Monitores de Escenario</h4>
                    <p className="text-gray-300">{monitors.quantity} x {monitors.type}</p>
                </div>
            </div>
        )}
        <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-md">
            <MixerIcon className="h-8 w-8 text-cyan-400 mt-1 flex-shrink-0" />
            <div>
                <h4 className="font-semibold text-white">Mezcladora</h4>
                <p className="text-gray-300">{mixer.type} de al menos {mixer.channels} canales</p>
            </div>
        </div>
      </div>
      
       {budgetDetails.length > 0 && (
        <div className="pt-2">
            <div className="flex items-center space-x-3 mb-3">
                <MoneyIcon className="h-7 w-7 text-green-400 flex-shrink-0" />
                <h3 className="text-xl font-bold text-green-400">Presupuesto de Alquiler</h3>
            </div>
            
            <div className="space-y-4 bg-gray-800 p-4 rounded-md">
              <div className="text-center border-b border-gray-700 pb-3">
                <p className={`text-sm font-semibold ${priceTier.color}`}>{priceTier.label}</p>
                <p className="text-4xl font-bold text-white">{formatCurrency(totalPrice)}</p>
              </div>

              <div className="pt-2">
                <h4 className="font-semibold text-white mb-2 text-base">Desglose de Equipo</h4>
                <div className="space-y-2 text-sm">
                  {budgetDetails.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700/50">
                        <input
                          type="checkbox"
                          checked={item.isChecked}
                          onChange={() => onToggleItem(index)}
                          className="bg-gray-700 border-gray-600 text-cyan-500 rounded focus:ring-cyan-500 h-5 w-5 flex-shrink-0 cursor-pointer"
                        />
                        <label className="flex-grow text-gray-300 cursor-pointer" onClick={() => onToggleItem(index)}>
                          {item.item}
                        </label>
                        {item.item === 'Mixer' && (
                          <div className='flex items-center space-x-1'>
                              <button onClick={() => onMixerChannelChange(2)} className={`px-2 py-0.5 rounded text-xs ${mixerChannels === 2 ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}>2ch</button>
                              <button onClick={() => onMixerChannelChange(4)} className={`px-2 py-0.5 rounded text-xs ${mixerChannels === 4 ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}>4ch</button>
                          </div>
                        )}
                        {item.isQuantityAdjustable && (
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => onQuantityChange(index, parseInt(e.target.value, 10) || 0)}
                            disabled={!item.isChecked}
                            className="w-16 bg-gray-900 border border-gray-600 text-white rounded-md p-1 text-center focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
                            min="0"
                          />
                        )}
                      </div>
                      {item.item === 'Iluminación' && item.isChecked && (
                          <p className="text-xs text-gray-400 mt-1 ml-8 pl-1">El presupuesto de iluminación lo presupuestamos en una siguiente instancia.</p>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleWhatsAppInquiry}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-4 rounded-md hover:from-green-600 hover:to-teal-600 transition duration-300"
                >
                  Contratar por WhatsApp
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">*Los precios son estimaciones y pueden variar.</p>
              </div>
            </div>
        </div>
        )}

      <div className="pt-2">
        <h4 className="font-semibold text-cyan-400 mb-1">Justificación</h4>
        <p className="text-gray-300 text-sm leading-relaxed">{explanation}</p>
      </div>

       <div className="pt-2">
        <h4 className="font-semibold text-cyan-400 mb-1">Sugerencia de Colocación</h4>
        <p className="text-gray-300 text-sm leading-relaxed">{placementSuggestion}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;