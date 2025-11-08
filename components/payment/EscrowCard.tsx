/**
 * Carte Escrow - Affichage d'un compte séquestre
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Lock, CheckCircle, Clock, AlertCircle, User } from 'lucide-react-native';
import { EscrowAccount } from '@/lib/bakrosur-pay/escrow.service';

interface EscrowCardProps {
  escrow: EscrowAccount & {
    property?: any;
    buyer?: any;
    seller?: any;
  };
  currentUserId: string;
  onPress?: () => void;
}

export const EscrowCard: React.FC<EscrowCardProps> = ({
  escrow,
  currentUserId,
  onPress,
}) => {
  const isSeller = escrow.seller_id === currentUserId;
  const isBuyer = escrow.buyer_id === currentUserId;

  // Déterminer la couleur du statut
  const getStatusColor = () => {
    switch (escrow.status) {
      case 'RELEASED':
        return '#10B981'; // green
      case 'FULL_PAYMENT':
      case 'APPROVED':
        return '#3B82F6'; // blue
      case 'DEPOSIT_PAID':
      case 'DOCUMENTS_REVIEW':
        return '#F59E0B'; // amber
      case 'CANCELLED':
      case 'DISPUTED':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  // Texte du statut en français
  const getStatusText = () => {
    const statuses: Record<string, string> = {
      PENDING: 'En attente',
      DEPOSIT_PAID: 'Acompte payé',
      DOCUMENTS_REVIEW: 'Vérification documents',
      APPROVED: 'Approuvé',
      FULL_PAYMENT: 'Paiement complet',
      RELEASED: 'Fonds libérés',
      CANCELLED: 'Annulé',
      DISPUTED: 'Litige',
    };
    return statuses[escrow.status] || escrow.status;
  };

  // Icône du statut
  const StatusIcon = () => {
    switch (escrow.status) {
      case 'RELEASED':
        return <CheckCircle size={20} color="#10B981" />;
      case 'CANCELLED':
      case 'DISPUTED':
        return <AlertCircle size={20} color="#EF4444" />;
      default:
        return <Clock size={20} color="#F59E0B" />;
    }
  };

  // Formater les montants
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
      activeOpacity={0.7}
    >
      {/* Header avec image de la propriété */}
      {escrow.property?.images && escrow.property.images[0] && (
        <View className="relative">
          <Image
            source={{ uri: escrow.property.images[0] }}
            className="w-full h-32"
            resizeMode="cover"
          />
          <View className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex-row items-center">
            <Lock size={14} color="#6B7280" />
            <Text className="ml-1.5 text-xs font-semibold text-gray-700">
              Séquestre
            </Text>
          </View>
        </View>
      )}

      {/* Contenu */}
      <View className="p-4">
        {/* Titre propriété */}
        <Text className="text-lg font-bold text-gray-900 mb-1">
          {escrow.property?.title || 'Propriété'}
        </Text>
        <Text className="text-sm text-gray-600 mb-3">
          {escrow.property?.city_name}
        </Text>

        {/* Statut */}
        <View className="flex-row items-center mb-4">
          <StatusIcon />
          <Text
            className="ml-2 text-sm font-semibold"
            style={{ color: getStatusColor() }}
          >
            {getStatusText()}
          </Text>
        </View>

        {/* Montants */}
        <View className="space-y-2 mb-4">
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-600">Montant total</Text>
            <Text className="text-sm font-bold text-gray-900">
              {formatAmount(escrow.total_amount)} FCFA
            </Text>
          </View>

          {escrow.status !== 'RELEASED' && escrow.status !== 'CANCELLED' && (
            <>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Acompte</Text>
                <Text className="text-sm font-semibold text-blue-600">
                  {formatAmount(escrow.deposit_amount)} FCFA
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Reste à payer</Text>
                <Text className="text-sm font-semibold text-orange-600">
                  {formatAmount(escrow.remaining_amount)} FCFA
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Participants */}
        <View className="border-t border-gray-100 pt-3 space-y-2">
          {/* Vendeur */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <User size={16} color="#6B7280" />
              <Text className="ml-2 text-xs text-gray-600">
                {isSeller ? 'Vous (Vendeur)' : 'Vendeur'}
              </Text>
            </View>
            {escrow.seller && (
              <Text className="text-xs font-medium text-gray-700">
                {escrow.seller.name}
              </Text>
            )}
          </View>

          {/* Acheteur */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <User size={16} color="#6B7280" />
              <Text className="ml-2 text-xs text-gray-600">
                {isBuyer ? 'Vous (Acheteur)' : 'Acheteur'}
              </Text>
            </View>
            {escrow.buyer && (
              <Text className="text-xs font-medium text-gray-700">
                {escrow.buyer.name}
              </Text>
            )}
          </View>
        </View>

        {/* Actions selon le statut et le rôle */}
        {isBuyer && escrow.status === 'PENDING' && (
          <TouchableOpacity className="mt-4 bg-orange-600 rounded-lg py-3 items-center">
            <Text className="text-white font-semibold">
              Payer l'acompte ({formatAmount(escrow.deposit_amount)} FCFA)
            </Text>
          </TouchableOpacity>
        )}

        {isBuyer && escrow.status === 'DEPOSIT_PAID' && (
          <TouchableOpacity className="mt-4 bg-blue-600 rounded-lg py-3 items-center">
            <Text className="text-white font-semibold">
              Payer le solde ({formatAmount(escrow.remaining_amount)} FCFA)
            </Text>
          </TouchableOpacity>
        )}

        {isSeller && escrow.status === 'RELEASED' && (
          <View className="mt-4 bg-green-50 rounded-lg p-3">
            <Text className="text-green-800 text-sm text-center">
              ✅ Fonds libérés le{' '}
              {new Date(escrow.released_at!).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};