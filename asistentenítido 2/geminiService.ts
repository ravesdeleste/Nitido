import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, Recommendation, Budget, BudgetDetail } from '../types';
import { EQUIPMENT_PRICES, SHIPPING_COST, OPERATIONAL_COST } from '../constants';

const recommendationSchema = {
    type: Type.OBJECT,
    properties: {
        mainSpeakers: {
            type: Type.OBJECT,
            properties: {
                quantity: { type: Type.INTEGER, description: "Número de altavoces principales." },
                type: { type: Type.STRING, description: "Tipo de altavoz, ej: '15 pulgadas activo'." },
                power: { type: Type.STRING, description: "Potencia recomendada en Watts RMS, ej: '1000W RMS'."}
            },
            required: ["quantity", "type", "power"]
        },
        subwoofers: {
            type: Type.OBJECT,
            properties: {
                quantity: { type: Type.INTEGER, description: "Número de subwoofers." },
                type: { type: Type.STRING, description: "Tipo de subwoofer, ej: '18 pulgadas activo'." },
                power: { type: Type.STRING, description: "Potencia recomendada en Watts RMS, ej: '1200W RMS'."}
            },
            required: ["quantity", "type", "power"]
        },
        monitors: {
            type: Type.OBJECT,
            properties: {
                quantity: { type: Type.INTEGER, description: "Número de monitores de escenario. 0 si no son necesarios." },
                type: { type: Type.STRING, description: "Tipo de monitor, ej: '12 pulgadas activo'." }
            },
        },
        mixer: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, description: "Tipo de mezcladora, ej: 'Digital' o 'Analógica'." },
                channels: { type: Type.INTEGER, description: "Número mínimo de canales necesarios." }
            },
            required: ["type", "channels"]
        },
        explanation: {
            type: Type.STRING,
            description: "Explicación detallada en español de por qué se recomienda esta configuración, considerando todos los factores de entrada."
        },
        placementSuggestion: {
            type: Type.STRING,
            description: "Una breve sugerencia en español sobre la colocación óptima del equipo en el espacio."
        }
    },
    required: ["mainSpeakers", "subwoofers", "mixer", "explanation", "placementSuggestion"]
};

const acousticPropertiesMap: Record<FormData['acousticProperties'], string> = {
    'reverberant': 'Reverberante (ej. hormigón, vidrio, sala vacía)',
    'neutral': 'Neutral (ej. habitación amueblada, algunas superficies blandas)',
    'dampened': 'Absorbente (ej. cortinas, alfombras, paneles acústicos)',
    'open-space': 'Espacio Abierto (sin obstrucciones, el sonido se disipa libremente)',
    'urban': 'Urbano (con edificios cercanos que pueden causar reflejos y eco)',
    'natural-absorption': 'Absorción Natural (cerca de árboles, césped o agua, que absorben el sonido)'
};

const calculateBudget = (recommendation: Omit<Recommendation, 'budget'>): Budget => {
    const details: BudgetDetail[] = [];
    const { mainSpeaker, subwoofer, mixer, vinylDeck, monitor } = EQUIPMENT_PRICES;

    // Main Speakers
    if (recommendation.mainSpeakers.quantity > 0) {
        details.push({
            item: 'Altavoces Principales',
            quantity: recommendation.mainSpeakers.quantity,
            unitPriceIdeal: mainSpeaker.ideal,
            unitPriceAverage: mainSpeaker.average,
            unitPriceMaxDiscount: mainSpeaker.maxDiscount,
            isChecked: true,
            isQuantityAdjustable: true,
        });
    }

    // Subwoofers
    if (recommendation.subwoofers.quantity > 0) {
        details.push({
            item: 'Subwoofers',
            quantity: recommendation.subwoofers.quantity,
            unitPriceIdeal: subwoofer.ideal,
            unitPriceAverage: subwoofer.average,
            unitPriceMaxDiscount: subwoofer.maxDiscount,
            isChecked: true,
            isQuantityAdjustable: true,
        });
    }

    // Monitors
    if (recommendation.monitors && recommendation.monitors.quantity > 0) {
        details.push({
            item: 'Monitores de Escenario',
            quantity: recommendation.monitors.quantity,
            unitPriceIdeal: monitor.ideal,
            unitPriceAverage: monitor.average,
            unitPriceMaxDiscount: monitor.maxDiscount,
            isChecked: true,
            isQuantityAdjustable: true,
        });
    }

    // Mixer (quantity is always 1)
    details.push({
        item: 'Mixer',
        quantity: 1,
        unitPriceIdeal: mixer.ideal,
        unitPriceAverage: mixer.average,
        unitPriceMaxDiscount: mixer.maxDiscount,
        isChecked: true,
        isQuantityAdjustable: false,
    });

    // Optional Vinyl Decks
    details.push({
        item: 'Bandejas de Vinilo',
        quantity: 2,
        unitPriceIdeal: vinylDeck.ideal,
        unitPriceAverage: vinylDeck.average,
        unitPriceMaxDiscount: vinylDeck.maxDiscount,
        isChecked: false, // Optional, so unchecked by default
        isQuantityAdjustable: true,
    });
    
    // Shipping cost detail
    details.push({
        item: 'Envío',
        quantity: 1,
        unitPriceIdeal: SHIPPING_COST,
        unitPriceAverage: SHIPPING_COST,
        unitPriceMaxDiscount: SHIPPING_COST,
        isChecked: true,
        isQuantityAdjustable: false,
    });

    // Operational cost detail
    details.push({
        item: 'Operativa',
        quantity: 1,
        unitPriceIdeal: OPERATIONAL_COST,
        unitPriceAverage: OPERATIONAL_COST,
        unitPriceMaxDiscount: OPERATIONAL_COST,
        isChecked: true,
        isQuantityAdjustable: false,
    });

    // Optional Lighting
    details.push({
        item: 'Iluminación',
        quantity: 1,
        unitPriceIdeal: 0,
        unitPriceAverage: 0,
        unitPriceMaxDiscount: 0,
        isChecked: false,
        isQuantityAdjustable: false,
    });

    return { details };
};


export const getSoundSystemRecommendation = async (formData: FormData): Promise<Recommendation> => {
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const acousticDescription = acousticPropertiesMap[formData.acousticProperties] || formData.acousticProperties;

    const prompt = `
      Analiza los siguientes detalles de un evento y recomienda un sistema de sonido completo.
      - Tipo de lugar: ${formData.venueType === 'indoor' ? 'Interior' : 'Exterior'}
      - Dimensiones del lugar (Ancho x Largo x Alto): ${formData.venueWidth}m x ${formData.venueLength}m x ${formData.venueHeight}m
      - Propiedades acústicas: ${acousticDescription}
      - Cantidad de invitados: ${formData.guestCount}
      - Estilo de música: ${formData.musicStyle}
      - Restricciones de decibelios: ${formData.dbRestriction ? `Sí, máximo ${formData.dbLevel} dB` : 'No'}

      Calcula la potencia necesaria y el tipo de equipamiento. Considera que en exteriores el sonido se disipa más. 
      Para música con muchos graves (electrónica, hip-hop), los subwoofers son cruciales.
      Si el estilo musical es en vivo (pop/rock, jazz), incluye monitores de escenario.
      Para discursos, la claridad es más importante que la potencia de bajos.
      Ajusta la recomendación si hay restricciones de dB.
      Proporciona la recomendación en el formato JSON especificado.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recommendationSchema,
                temperature: 0.5,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (!parsedJson.mainSpeakers || !parsedJson.subwoofers || !parsedJson.mixer) {
            throw new Error("La respuesta de la IA no tiene el formato esperado.");
        }

        const recommendationWithBudget: Recommendation = {
            ...parsedJson,
            budget: calculateBudget(parsedJson),
        };

        return recommendationWithBudget;

    } catch (error) {
        console.error("Error al llamar a la API de Gemini:", error);
        throw new Error("No se pudo obtener una recomendación de la IA.");
    }
};