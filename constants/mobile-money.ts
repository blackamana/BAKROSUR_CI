export type MobileMoneyProvider = 'ORANGE_MONEY' | 'MTN_MOBILE_MONEY' | 'WAVE' | 'MOOV_MONEY';
export type PaymentGateway = 'CINETPAY' | 'FEDAPAY';

export interface MobileMoneyPayment {
  id: string;
  provider: MobileMoneyProvider;
  phoneNumber: string;
  amount: number;
  currency: 'XOF';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  propertyId?: string;
  transactionId?: string;
  gateway: PaymentGateway;
  createdAt: string;
}

export const MOBILE_MONEY_PROVIDERS = [
  {
    id: 'ORANGE_MONEY' as MobileMoneyProvider,
    name: 'Orange Money',
    icon: '🟠',
    color: '#FF6F00',
    minAmount: 100,
    maxAmount: 5000000,
  },
  {
    id: 'MTN_MOBILE_MONEY' as MobileMoneyProvider,
    name: 'MTN Mobile Money',
    icon: '🟡',
    color: '#FFCC00',
    minAmount: 100,
    maxAmount: 5000000,
  },
  {
    id: 'WAVE' as MobileMoneyProvider,
    name: 'Wave',
    icon: '💙',
    color: '#007AFF',
    minAmount: 100,
    maxAmount: 5000000,
  },
  {
    id: 'MOOV_MONEY' as MobileMoneyProvider,
    name: 'Moov Money',
    icon: '🔵',
    color: '#0066CC',
    minAmount: 100,
    maxAmount: 5000000,
  },
];

export const PAYMENT_GATEWAYS = {
  CINETPAY: {
    name: 'CinetPay',
    apiUrl: 'https://api-checkout.cinetpay.com/v2',
    supportedProviders: ['ORANGE_MONEY', 'MTN_MOBILE_MONEY', 'WAVE', 'MOOV_MONEY'],
  },
  FEDAPAY: {
    name: 'FedaPay',
    apiUrl: 'https://api.fedapay.com/v1',
    supportedProviders: ['ORANGE_MONEY', 'MTN_MOBILE_MONEY', 'MOOV_MONEY'],
  },
};
