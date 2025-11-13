export interface FormData {
  venueType: 'indoor' | 'outdoor';
  venueWidth: number | '';
  venueLength: number | '';
  venueHeight: number | '';
  acousticProperties: 'reverberant' | 'neutral' | 'dampened' | 'open-space' | 'urban' | 'natural-absorption';
  guestCount: number | '';
  musicStyle: string;
  dbRestriction: boolean;
  dbLevel: number | '';
  discountCode: string;
}

export interface BudgetDetail {
  item: string;
  quantity: number;
  unitPriceIdeal: number;
  unitPriceAverage: number;
  unitPriceMaxDiscount: number;
  isChecked: boolean;
  isQuantityAdjustable: boolean;
}

export interface Budget {
  details: BudgetDetail[];
}

export interface Recommendation {
  mainSpeakers: {
    quantity: number;
    type: string;
    power: string;
  };
  subwoofers: {
    quantity: number;
    type: string;
    power: string;
  };
  monitors?: {
    quantity: number;
    type: string;
  };
  mixer: {
    type: string;
    channels: number;
  };
  explanation: string;
  placementSuggestion: string;
  budget?: Budget;
}
