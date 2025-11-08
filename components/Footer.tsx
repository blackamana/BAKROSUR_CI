import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin } from 'lucide-react-native';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';

interface FooterProps {
  style?: any;
}

export default function Footer({ style }: FooterProps) {
  const handlePress = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.socialSection}>
        <Text style={styles.socialTitle}>Suivez-nous</Text>
        <View style={styles.socialIcons}>
          <Pressable 
            style={styles.socialIcon}
            onPress={() => handlePress('https://facebook.com/bakrôsur')}
          >
            <Facebook size={20} color="rgba(255, 255, 255, 0.9)" />
          </Pressable>
          <Pressable 
            style={styles.socialIcon}
            onPress={() => handlePress('https://twitter.com/bakrôsur')}
          >
            <Twitter size={20} color="rgba(255, 255, 255, 0.9)" />
          </Pressable>
          <Pressable 
            style={styles.socialIcon}
            onPress={() => handlePress('https://instagram.com/bakrôsur')}
          >
            <Instagram size={20} color="rgba(255, 255, 255, 0.9)" />
          </Pressable>
          <Pressable 
            style={styles.socialIcon}
            onPress={() => handlePress('https://linkedin.com/company/bakrôsur')}
          >
            <Linkedin size={20} color="rgba(255, 255, 255, 0.9)" />
          </Pressable>
          <Pressable 
            style={styles.socialIcon}
            onPress={() => handlePress('https://youtube.com/bakrôsur')}
          >
            <Youtube size={20} color="rgba(255, 255, 255, 0.9)" />
          </Pressable>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.hoursSection}>
        <Text style={styles.hoursTitle}>Horaires d&apos;ouverture</Text>
        <Text style={styles.hoursText}>Lundi - Vendredi: 8h00 - 18h00</Text>
        <Text style={styles.hoursText}>Samedi: 9h00 - 14h00</Text>
        <Text style={styles.hoursText}>Dimanche: Fermé</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.addressSection}>
        <Text style={styles.addressTitle}>Notre siège social</Text>
        <View style={styles.addressItem}>
          <MapPin size={16} color={Colors.light.primary} />
          <Text style={styles.addressText}>Cocody Riviera Palmeraie, Abidjan, Côte d&apos;Ivoire</Text>
        </View>
        <Text style={styles.addressText}>Nous sommes également présents à Plateau, Marcory et Yopougon</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomSection}>
        <Text style={styles.copyright}>
          © 2025 BAKRÔSUR. Tous droits réservés.
        </Text>
        <View style={styles.bottomLinks}>
          <Text style={styles.bottomLink}>Mentions légales</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.bottomLink}>Confidentialité</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.bottomLink}>CGU</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#334155',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactInfo: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  whatsappIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappIconText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 24,
  },
  linksSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkColumn: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 12,
  },
  link: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  newsletterSection: {
    marginBottom: 8,
  },
  newsletterTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 8,
  },
  newsletterText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  newsletterInput: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  subscribeButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  subscribeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.background,
  },
  socialSection: {
    marginBottom: 8,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 12,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  hoursSection: {
    marginBottom: 8,
  },
  hoursTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 12,
  },
  hoursText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  bottomSection: {
    alignItems: 'center',
    gap: 12,
  },
  copyright: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  bottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomLink: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  separator: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  partnersSection: {
    marginBottom: 8,
  },
  partnersTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 4,
  },
  partnersSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  partnerCategories: {
    gap: 16,
  },
  partnerCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  partnerCategoryTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FF7900',
    marginBottom: 12,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  partnerItem: {
    marginBottom: 12,
  },
  partnerInfo: {
    gap: 4,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  partnerDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  securitySection: {
    marginBottom: 8,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  securitySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    lineHeight: 20,
  },
  legalStatusGrid: {
    gap: 12,
  },
  legalStatusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopWidth: 4,
  },
  legalStatusBadge: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 8,
  },
  legalStatusTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 8,
  },
  legalStatusDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    marginBottom: 12,
  },
  trustBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trustBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  addressSection: {
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 12,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    flex: 1,
  },
  statsSection: {
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    width: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FF7900',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  guaranteeSection: {
    marginBottom: 8,
  },
  guaranteeTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 12,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  guaranteeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  certificationSection: {
    marginBottom: 8,
  },
  certificationTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 12,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  certificationText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    lineHeight: 18,
  },
});
