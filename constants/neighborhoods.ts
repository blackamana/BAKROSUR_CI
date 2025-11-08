export interface Neighborhood {
  id: string;
  name: string;
  cityId: string;
  cityName: string;
  commune: string;
  region: string;
  department: string;
  type: 'Quartier' | 'Village';
}

export const NEIGHBORHOODS: Neighborhood[] = [
  // Agnéby-Tiassa - Agboville
  { id: '1', name: 'Dioulabougou', cityId: '11', cityName: 'Agboville', commune: 'Agboville', region: 'Agnéby-Tiassa', department: 'Agboville', type: 'Quartier' },
  { id: '2', name: 'Gare', cityId: '11', cityName: 'Agboville', commune: 'Agboville', region: 'Agnéby-Tiassa', department: 'Agboville', type: 'Quartier' },
  { id: '3', name: 'Guessiguié', cityId: '11', cityName: 'Agboville', commune: 'Agboville', region: 'Agnéby-Tiassa', department: 'Agboville', type: 'Village' },
  { id: '4', name: 'Habitat', cityId: '11', cityName: 'Agboville', commune: 'Agboville', region: 'Agnéby-Tiassa', department: 'Agboville', type: 'Quartier' },
  { id: '5', name: 'Rubino', cityId: '11', cityName: 'Agboville', commune: 'Agboville', region: 'Agnéby-Tiassa', department: 'Agboville', type: 'Village' },
  { id: '6', name: 'Sicogi', cityId: '11', cityName: 'Agboville', commune: 'Agboville', region: 'Agnéby-Tiassa', department: 'Agboville', type: 'Quartier' },

  // Agnéby-Tiassa - Tiassalé
  { id: '7', name: 'Gbolouville', cityId: '28', cityName: 'Tiassalé', commune: 'Tiassalé', region: 'Agnéby-Tiassa', department: 'Tiassalé', type: 'Village' },
  { id: '8', name: 'Habitat', cityId: '28', cityName: 'Tiassalé', commune: 'Tiassalé', region: 'Agnéby-Tiassa', department: 'Tiassalé', type: 'Quartier' },
  { id: '9', name: 'Moronou', cityId: '28', cityName: 'Tiassalé', commune: 'Tiassalé', region: 'Agnéby-Tiassa', department: 'Tiassalé', type: 'Village' },
  { id: '10', name: 'N\'Douci', cityId: '28', cityName: 'Tiassalé', commune: 'Tiassalé', region: 'Agnéby-Tiassa', department: 'Tiassalé', type: 'Village' },
  { id: '11', name: 'Plateau', cityId: '28', cityName: 'Tiassalé', commune: 'Tiassalé', region: 'Agnéby-Tiassa', department: 'Tiassalé', type: 'Quartier' },
  { id: '12', name: 'Sicogi', cityId: '28', cityName: 'Tiassalé', commune: 'Tiassalé', region: 'Agnéby-Tiassa', department: 'Tiassalé', type: 'Quartier' },

  // Bagoué - Boundiali
  { id: '13', name: 'Commerce', cityId: '26', cityName: 'Boundiali', commune: 'Boundiali', region: 'Bagoué', department: 'Boundiali', type: 'Quartier' },
  { id: '14', name: 'Dioulabougou', cityId: '26', cityName: 'Boundiali', commune: 'Boundiali', region: 'Bagoué', department: 'Boundiali', type: 'Quartier' },
  { id: '15', name: 'Ganaoni', cityId: '26', cityName: 'Boundiali', commune: 'Boundiali', region: 'Bagoué', department: 'Boundiali', type: 'Village' },
  { id: '16', name: 'Kolia', cityId: '26', cityName: 'Boundiali', commune: 'Boundiali', region: 'Bagoué', department: 'Boundiali', type: 'Village' },
  { id: '17', name: 'Kouto', cityId: '26', cityName: 'Boundiali', commune: 'Boundiali', region: 'Bagoué', department: 'Boundiali', type: 'Village' },
  { id: '18', name: 'Sokoura', cityId: '26', cityName: 'Boundiali', commune: 'Boundiali', region: 'Bagoué', department: 'Boundiali', type: 'Quartier' },

  // Bagoué - Tingréla
  { id: '19', name: 'Commerce', cityId: '59', cityName: 'Tingréla', commune: 'Tingréla', region: 'Bagoué', department: 'Tingréla', type: 'Quartier' },
  { id: '20', name: 'Dioulabougou', cityId: '59', cityName: 'Tingréla', commune: 'Tingréla', region: 'Bagoué', department: 'Tingréla', type: 'Quartier' },
  { id: '21', name: 'Kadioha', cityId: '59', cityName: 'Tingréla', commune: 'Tingréla', region: 'Bagoué', department: 'Tingréla', type: 'Village' },
  { id: '22', name: 'Kanakono', cityId: '59', cityName: 'Tingréla', commune: 'Tingréla', region: 'Bagoué', department: 'Tingréla', type: 'Village' },
  { id: '23', name: 'Sohouo', cityId: '59', cityName: 'Tingréla', commune: 'Tingréla', region: 'Bagoué', department: 'Tingréla', type: 'Village' },
  { id: '24', name: 'Sokoura', cityId: '59', cityName: 'Tingréla', commune: 'Tingréla', region: 'Bagoué', department: 'Tingréla', type: 'Quartier' },

  // Bas-Sassandra - San-Pédro
  { id: '25', name: 'Balmer', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Quartier' },
  { id: '26', name: 'Bardot', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Quartier' },
  { id: '27', name: 'Cité', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Quartier' },
  { id: '28', name: 'Djidji', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Village' },
  { id: '29', name: 'Doba', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Village' },
  { id: '30', name: 'Enseignants', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Quartier' },
  { id: '31', name: 'Gbô', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Village' },
  { id: '32', name: 'Grand-Béréby', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Village' },
  { id: '33', name: 'Nero-Mer', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Village' },
  { id: '34', name: 'Sicogi', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Quartier' },
  { id: '35', name: 'Sogefiha', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Quartier' },
  { id: '36', name: 'Séwéké', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Quartier' },
  { id: '37', name: 'Yocoboué', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Village' },
  { id: '38', name: 'Zone industrielle', cityId: '5', cityName: 'San-Pédro', commune: 'San-Pédro', region: 'Bas-Sassandra', department: 'San-Pédro', type: 'Quartier' },

  // Bélier - Toumodi
  { id: '39', name: 'Béganssou', cityId: '32', cityName: 'Toumodi', commune: 'Toumodi', region: 'Bélier', department: 'Toumodi', type: 'Village' },
  { id: '40', name: 'Dioulabougou', cityId: '32', cityName: 'Toumodi', commune: 'Toumodi', region: 'Bélier', department: 'Toumodi', type: 'Quartier' },
  { id: '41', name: 'Habitat', cityId: '32', cityName: 'Toumodi', commune: 'Toumodi', region: 'Bélier', department: 'Toumodi', type: 'Quartier' },
  { id: '42', name: 'Kokumbo', cityId: '32', cityName: 'Toumodi', commune: 'Toumodi', region: 'Bélier', department: 'Toumodi', type: 'Village' },
  { id: '43', name: 'Kplébouo', cityId: '32', cityName: 'Toumodi', commune: 'Toumodi', region: 'Bélier', department: 'Toumodi', type: 'Village' },
  { id: '44', name: 'Plateau', cityId: '32', cityName: 'Toumodi', commune: 'Toumodi', region: 'Bélier', department: 'Toumodi', type: 'Quartier' },

  // Cavally - Guiglo
  { id: '45', name: 'Commerce', cityId: '39', cityName: 'Guiglo', commune: 'Guiglo', region: 'Cavally', department: 'Guiglo', type: 'Quartier' },
  { id: '46', name: 'Dioulabougou', cityId: '39', cityName: 'Guiglo', commune: 'Guiglo', region: 'Cavally', department: 'Guiglo', type: 'Quartier' },
  { id: '47', name: 'Domobly', cityId: '39', cityName: 'Guiglo', commune: 'Guiglo', region: 'Cavally', department: 'Guiglo', type: 'Quartier' },
  { id: '48', name: 'Kaadé', cityId: '39', cityName: 'Guiglo', commune: 'Guiglo', region: 'Cavally', department: 'Guiglo', type: 'Village' },
  { id: '49', name: 'Péhé', cityId: '39', cityName: 'Guiglo', commune: 'Guiglo', region: 'Cavally', department: 'Guiglo', type: 'Village' },
  { id: '50', name: 'Zagné', cityId: '39', cityName: 'Guiglo', commune: 'Guiglo', region: 'Cavally', department: 'Guiglo', type: 'Village' },

  // District Autonome d'Abidjan - Abobo
  { id: '51', name: 'Abobo Baoulé', cityId: '1', cityName: 'Abidjan', commune: 'Abobo', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '52', name: 'Abobo-Gare', cityId: '1', cityName: 'Abidjan', commune: 'Abobo', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '53', name: 'Aboboté', cityId: '1', cityName: 'Abidjan', commune: 'Abobo', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '54', name: 'Agbekoi', cityId: '1', cityName: 'Abidjan', commune: 'Abobo', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '55', name: 'Agoueto', cityId: '1', cityName: 'Abidjan', commune: 'Abobo', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '56', name: 'Akeikoi', cityId: '1', cityName: 'Abidjan', commune: 'Abobo', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '57', name: 'Anonkoua Kouté', cityId: '1', cityName: 'Abidjan', commune: 'Abobo', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '58', name: 'Avocatier', cityId: '1', cityName: 'Abidjan', commune: 'Abobo', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '59', name: 'Banco', cityId: '1', cityName: 'Abidjan', commune: 'Abobo', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '60', name: 'Colatier', cityId: '1', cityName: 'Abidjan', commune: 'Abobo', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '61', name: 'PK18', cityId: '1', cityName: 'Abidjan', commune: 'Abobo', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '62', name: 'Sagbé', cityId: '1', cityName: 'Abidjan', commune: 'Abobo', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },

  // District Autonome d'Abidjan - Adjamé
  { id: '63', name: '220 Logements', cityId: '1', cityName: 'Abidjan', commune: 'Adjamé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '64', name: 'Adjamé-Centre', cityId: '1', cityName: 'Abidjan', commune: 'Adjamé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '65', name: 'Adjamé-Liberté', cityId: '1', cityName: 'Abidjan', commune: 'Adjamé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '66', name: 'Bracodi', cityId: '1', cityName: 'Abidjan', commune: 'Adjamé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '67', name: 'La Casse', cityId: '1', cityName: 'Abidjan', commune: 'Adjamé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '68', name: 'Williamsville', cityId: '1', cityName: 'Abidjan', commune: 'Adjamé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },

  // District Autonome d'Abidjan - Anyama
  { id: '69', name: 'Akoupé-Zeudji', cityId: '1', cityName: 'Abidjan', commune: 'Anyama', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '70', name: 'Akéïkoi', cityId: '1', cityName: 'Abidjan', commune: 'Anyama', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '71', name: 'Anyama centre', cityId: '1', cityName: 'Abidjan', commune: 'Anyama', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '72', name: 'Attinguié', cityId: '1', cityName: 'Abidjan', commune: 'Anyama', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },

  // District Autonome d'Abidjan - Attécoubé
  { id: '73', name: 'Abobo-Doumé', cityId: '1', cityName: 'Abidjan', commune: 'Attécoubé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '74', name: 'Attécoubé-Centre', cityId: '1', cityName: 'Abidjan', commune: 'Attécoubé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '75', name: 'Ecole de Police', cityId: '1', cityName: 'Abidjan', commune: 'Attécoubé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '76', name: 'Locodjro', cityId: '1', cityName: 'Abidjan', commune: 'Attécoubé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '77', name: 'Mossikro', cityId: '1', cityName: 'Abidjan', commune: 'Attécoubé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '78', name: 'Sebroko', cityId: '1', cityName: 'Abidjan', commune: 'Attécoubé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '79', name: 'Toits-Rouges', cityId: '1', cityName: 'Abidjan', commune: 'Attécoubé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },

  // District Autonome d'Abidjan - Bingerville
  { id: '80', name: 'Adjamé Bingerville', cityId: '1', cityName: 'Abidjan', commune: 'Bingerville', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '81', name: 'Akandjé', cityId: '1', cityName: 'Abidjan', commune: 'Bingerville', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '82', name: 'Akouai Agban', cityId: '1', cityName: 'Abidjan', commune: 'Bingerville', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '83', name: 'Bingerville centre', cityId: '1', cityName: 'Abidjan', commune: 'Bingerville', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '84', name: 'Eloka', cityId: '1', cityName: 'Abidjan', commune: 'Bingerville', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },

  // District Autonome d'Abidjan - Brofodoumé
  { id: '85', name: 'Brofodoumé village', cityId: '1', cityName: 'Abidjan', commune: 'Brofodoumé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '86', name: 'M\'brago 1', cityId: '1', cityName: 'Abidjan', commune: 'Brofodoumé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '87', name: 'M\'brago 2', cityId: '1', cityName: 'Abidjan', commune: 'Brofodoumé', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },

  // District Autonome d'Abidjan - Cocody
  { id: '88', name: 'Abatta', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '89', name: 'Akouedo', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '90', name: 'Angré 7e Tranche', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '91', name: 'Angré 8e Tranche', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '92', name: 'Anono', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '93', name: 'Cocody Centre', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '94', name: 'Deux-Plateaux', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '95', name: 'Djorogobité 1', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '96', name: 'Djorogobité 2', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '97', name: 'Le Vallon', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '98', name: 'M\'pouto', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '99', name: 'Riviera 1', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '100', name: 'Riviera 2', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '101', name: 'Riviera 3', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '102', name: 'Riviera Bonoumin', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '103', name: 'Riviera Faya', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '104', name: 'Riviera Golf', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '105', name: 'Riviera Palmeraie', cityId: '1', cityName: 'Abidjan', commune: 'Cocody', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },

  // District Autonome d'Abidjan - Koumassi
  { id: '106', name: 'Abri 2000', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '107', name: 'Aklomiabla', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '108', name: 'Grand Campement', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '109', name: 'Houphouët Boigny 1', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '110', name: 'Houphouët Boigny 2', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '111', name: 'Prodomo', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '112', name: 'Quartier Divo', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '113', name: 'SICOGI', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '114', name: 'SOBRICI', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '115', name: 'SOGEFIHA', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '116', name: 'SOPIM', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '117', name: 'Yapokro', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '118', name: 'Zone industrielle', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '119', name: 'Zoé Bruno', cityId: '1', cityName: 'Abidjan', commune: 'Koumassi', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },

  // District Autonome d'Abidjan - Marcory
  { id: '120', name: 'Abia-Abety', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '121', name: 'Abia-Koumassi', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '122', name: 'Adeimin', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '123', name: 'Aliodan', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '124', name: 'Anoumabo', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '125', name: 'Biétry', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '126', name: 'Champroux', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '127', name: 'Gnanzoua', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '128', name: 'Hibiscus', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '129', name: 'Jean-Baptiste Mockey', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '130', name: 'Kablan Brou Félix', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '131', name: 'Konan Raphaël', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '132', name: 'Marie Koré', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '133', name: 'Résidentiel', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '134', name: 'Zone 4 C', cityId: '1', cityName: 'Abidjan', commune: 'Marcory', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },

  // District Autonome d'Abidjan - Plateau
  { id: '135', name: 'Cité Administrative', cityId: '1', cityName: 'Abidjan', commune: 'Plateau', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '136', name: 'Indénié', cityId: '1', cityName: 'Abidjan', commune: 'Plateau', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '137', name: 'Lagunaire', cityId: '1', cityName: 'Abidjan', commune: 'Plateau', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '138', name: 'Plateau-Business', cityId: '1', cityName: 'Abidjan', commune: 'Plateau', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },

  // District Autonome d'Abidjan - Port-Bouët
  { id: '139', name: 'Abouabou', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '140', name: 'Adjahui-Coubé', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '141', name: 'Adjahui-Namoué', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '142', name: 'Adjouffou', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '143', name: 'Agbafou', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '144', name: 'Ako Braké', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '145', name: 'Amangoua-Koi', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '146', name: 'Anani', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '147', name: 'Benegosso', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '148', name: 'Derrière-Wharf', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '149', name: 'Ellokro', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '150', name: 'Gonzagueville', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '151', name: 'Jean-Folly', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '152', name: 'Mafiblé', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '153', name: 'Petit-Bassam', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '154', name: 'Port-Bouët Centre', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '155', name: 'Vridi', cityId: '1', cityName: 'Abidjan', commune: 'Port-Bouët', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },

  // District Autonome d'Abidjan - Songon
  { id: '156', name: 'Dagbé', cityId: '1', cityName: 'Abidjan', commune: 'Songon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '157', name: 'Songon Agban', cityId: '1', cityName: 'Abidjan', commune: 'Songon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '158', name: 'Songon Dagbé', cityId: '1', cityName: 'Abidjan', commune: 'Songon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '159', name: 'Songon Kassemblé', cityId: '1', cityName: 'Abidjan', commune: 'Songon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },
  { id: '160', name: 'Songon M\'Braté', cityId: '1', cityName: 'Abidjan', commune: 'Songon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Village' },

  // District Autonome d'Abidjan - Treichville
  { id: '161', name: 'Avenue 16', cityId: '1', cityName: 'Abidjan', commune: 'Treichville', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '162', name: 'Avenue 21', cityId: '1', cityName: 'Abidjan', commune: 'Treichville', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '163', name: 'Gare de Treichville', cityId: '1', cityName: 'Abidjan', commune: 'Treichville', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '164', name: 'Petit Paris', cityId: '1', cityName: 'Abidjan', commune: 'Treichville', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '165', name: 'Zone 3', cityId: '1', cityName: 'Abidjan', commune: 'Treichville', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },

  // District Autonome d'Abidjan - Yopougon
  { id: '166', name: 'Andokoi', cityId: '1', cityName: 'Abidjan', commune: 'Yopougon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '167', name: 'Gesco', cityId: '1', cityName: 'Abidjan', commune: 'Yopougon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '168', name: 'Kouté', cityId: '1', cityName: 'Abidjan', commune: 'Yopougon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '169', name: 'Koweit', cityId: '1', cityName: 'Abidjan', commune: 'Yopougon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '170', name: 'Niangon Nord', cityId: '1', cityName: 'Abidjan', commune: 'Yopougon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '171', name: 'Niangon Sud', cityId: '1', cityName: 'Abidjan', commune: 'Yopougon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '172', name: 'Port-Bouët 2', cityId: '1', cityName: 'Abidjan', commune: 'Yopougon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '173', name: 'Sicogi', cityId: '1', cityName: 'Abidjan', commune: 'Yopougon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '174', name: 'Sideci', cityId: '1', cityName: 'Abidjan', commune: 'Yopougon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },
  { id: '175', name: 'Toits-Rouges', cityId: '1', cityName: 'Abidjan', commune: 'Yopougon', region: 'District Autonome d\'Abidjan', department: 'Abidjan', type: 'Quartier' },

  // District Autonome de Yamoussoukro
  { id: '176', name: 'Ahoussi', cityId: '4', cityName: 'Yamoussoukro', commune: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro', department: 'Yamoussoukro', type: 'Village' },
  { id: '177', name: 'Assabou', cityId: '4', cityName: 'Yamoussoukro', commune: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro', department: 'Yamoussoukro', type: 'Quartier' },
  { id: '178', name: 'Habitat', cityId: '4', cityName: 'Yamoussoukro', commune: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro', department: 'Yamoussoukro', type: 'Quartier' },
  { id: '179', name: 'Kpoussoussou', cityId: '4', cityName: 'Yamoussoukro', commune: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro', department: 'Yamoussoukro', type: 'Village' },
  { id: '180', name: 'Logbakro', cityId: '4', cityName: 'Yamoussoukro', commune: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro', department: 'Yamoussoukro', type: 'Village' },
  { id: '181', name: 'Morofé', cityId: '4', cityName: 'Yamoussoukro', commune: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro', department: 'Yamoussoukro', type: 'Quartier' },
  { id: '182', name: 'N\'Da-Konankro', cityId: '4', cityName: 'Yamoussoukro', commune: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro', department: 'Yamoussoukro', type: 'Village' },
  { id: '183', name: 'Riviera', cityId: '4', cityName: 'Yamoussoukro', commune: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro', department: 'Yamoussoukro', type: 'Quartier' },
  { id: '184', name: 'Sopim', cityId: '4', cityName: 'Yamoussoukro', commune: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro', department: 'Yamoussoukro', type: 'Quartier' },
  { id: '185', name: 'Subiakro', cityId: '4', cityName: 'Yamoussoukro', commune: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro', department: 'Yamoussoukro', type: 'Village' },
  { id: '186', name: 'Zambakro', cityId: '4', cityName: 'Yamoussoukro', commune: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro', department: 'Yamoussoukro', type: 'Village' },
  { id: '187', name: 'Énergie', cityId: '4', cityName: 'Yamoussoukro', commune: 'Yamoussoukro', region: 'District Autonome de Yamoussoukro', department: 'Yamoussoukro', type: 'Quartier' },

  // Gbôklé - Sassandra
  { id: '188', name: 'Dahiépa-Kéhi', cityId: '31', cityName: 'Sassandra', commune: 'Sassandra', region: 'Gbôklé', department: 'Sassandra', type: 'Village' },
  { id: '189', name: 'Dakpadou', cityId: '31', cityName: 'Sassandra', commune: 'Sassandra', region: 'Gbôklé', department: 'Sassandra', type: 'Village' },
  { id: '190', name: 'Dioulabougou', cityId: '31', cityName: 'Sassandra', commune: 'Sassandra', region: 'Gbôklé', department: 'Sassandra', type: 'Quartier' },
  { id: '191', name: 'Fresco', cityId: '31', cityName: 'Sassandra', commune: 'Sassandra', region: 'Gbôklé', department: 'Sassandra', type: 'Village' },
  { id: '192', name: 'Habitat', cityId: '31', cityName: 'Sassandra', commune: 'Sassandra', region: 'Gbôklé', department: 'Sassandra', type: 'Quartier' },
  { id: '193', name: 'Port', cityId: '31', cityName: 'Sassandra', commune: 'Sassandra', region: 'Gbôklé', department: 'Sassandra', type: 'Quartier' },

  // Gontougo - Bondoukou
  { id: '194', name: 'Château', cityId: '17', cityName: 'Bondoukou', commune: 'Bondoukou', region: 'Gontougo', department: 'Bondoukou', type: 'Quartier' },
  { id: '195', name: 'Dioulabougou', cityId: '17', cityName: 'Bondoukou', commune: 'Bondoukou', region: 'Gontougo', department: 'Bondoukou', type: 'Quartier' },
  { id: '196', name: 'Sokoura', cityId: '17', cityName: 'Bondoukou', commune: 'Bondoukou', region: 'Gontougo', department: 'Bondoukou', type: 'Quartier' },
  { id: '197', name: 'Sorobango', cityId: '17', cityName: 'Bondoukou', commune: 'Bondoukou', region: 'Gontougo', department: 'Bondoukou', type: 'Village' },
  { id: '198', name: 'Tabagne', cityId: '17', cityName: 'Bondoukou', commune: 'Bondoukou', region: 'Gontougo', department: 'Bondoukou', type: 'Village' },
  { id: '199', name: 'Zanzan', cityId: '17', cityName: 'Bondoukou', commune: 'Bondoukou', region: 'Gontougo', department: 'Bondoukou', type: 'Quartier' },

  // Grands-Ponts - Dabou
  { id: '200', name: 'Broukro', cityId: '19', cityName: 'Dabou', commune: 'Dabou', region: 'Grands-Ponts', department: 'Dabou', type: 'Quartier' },
  { id: '201', name: 'Dioulabougou', cityId: '19', cityName: 'Dabou', commune: 'Dabou', region: 'Grands-Ponts', department: 'Dabou', type: 'Quartier' },
  { id: '202', name: 'Lopou', cityId: '19', cityName: 'Dabou', commune: 'Dabou', region: 'Grands-Ponts', department: 'Dabou', type: 'Village' },
  { id: '203', name: 'Plateau', cityId: '19', cityName: 'Dabou', commune: 'Dabou', region: 'Grands-Ponts', department: 'Dabou', type: 'Quartier' },
  { id: '204', name: 'Sicogi', cityId: '19', cityName: 'Dabou', commune: 'Dabou', region: 'Grands-Ponts', department: 'Dabou', type: 'Quartier' },
  { id: '205', name: 'Toupah', cityId: '19', cityName: 'Dabou', commune: 'Dabou', region: 'Grands-Ponts', department: 'Dabou', type: 'Village' },

  // Gôh - Gagnoa
  { id: '206', name: 'Babré', cityId: '9', cityName: 'Gagnoa', commune: 'Gagnoa', region: 'Gôh', department: 'Gagnoa', type: 'Quartier' },
  { id: '207', name: 'Dignago', cityId: '9', cityName: 'Gagnoa', commune: 'Gagnoa', region: 'Gôh', department: 'Gagnoa', type: 'Village' },
  { id: '208', name: 'Dioulabougou', cityId: '9', cityName: 'Gagnoa', commune: 'Gagnoa', region: 'Gôh', department: 'Gagnoa', type: 'Quartier' },
  { id: '209', name: 'Garahio', cityId: '9', cityName: 'Gagnoa', commune: 'Gagnoa', region: 'Gôh', department: 'Gagnoa', type: 'Quartier' },
  { id: '210', name: 'Ouragahio', cityId: '9', cityName: 'Gagnoa', commune: 'Gagnoa', region: 'Gôh', department: 'Gagnoa', type: 'Village' },
  { id: '211', name: 'Soleil', cityId: '9', cityName: 'Gagnoa', commune: 'Gagnoa', region: 'Gôh', department: 'Gagnoa', type: 'Quartier' },

  // Haut-Sassandra - Daloa
  { id: '212', name: 'Abattoir', cityId: '3', cityName: 'Daloa', commune: 'Daloa', region: 'Haut-Sassandra', department: 'Daloa', type: 'Quartier' },
  { id: '213', name: 'Commerce', cityId: '3', cityName: 'Daloa', commune: 'Daloa', region: 'Haut-Sassandra', department: 'Daloa', type: 'Quartier' },
  { id: '214', name: 'Dioulabougou', cityId: '3', cityName: 'Daloa', commune: 'Daloa', region: 'Haut-Sassandra', department: 'Daloa', type: 'Quartier' },
  { id: '215', name: 'Garage', cityId: '3', cityName: 'Daloa', commune: 'Daloa', region: 'Haut-Sassandra', department: 'Daloa', type: 'Quartier' },
  { id: '216', name: 'Gboguhé', cityId: '3', cityName: 'Daloa', commune: 'Daloa', region: 'Haut-Sassandra', department: 'Daloa', type: 'Village' },
  { id: '217', name: 'Guessabo', cityId: '3', cityName: 'Daloa', commune: 'Daloa', region: 'Haut-Sassandra', department: 'Daloa', type: 'Village' },
  { id: '218', name: 'Kennedy', cityId: '3', cityName: 'Daloa', commune: 'Daloa', region: 'Haut-Sassandra', department: 'Daloa', type: 'Quartier' },
  { id: '219', name: 'Lobia', cityId: '3', cityName: 'Daloa', commune: 'Daloa', region: 'Haut-Sassandra', department: 'Daloa', type: 'Quartier' },
  { id: '220', name: 'Orly', cityId: '3', cityName: 'Daloa', commune: 'Daloa', region: 'Haut-Sassandra', department: 'Daloa', type: 'Quartier' },
  { id: '221', name: 'Tazibouo', cityId: '3', cityName: 'Daloa', commune: 'Daloa', region: 'Haut-Sassandra', department: 'Daloa', type: 'Quartier' },
  { id: '222', name: 'Zakoua', cityId: '3', cityName: 'Daloa', commune: 'Daloa', region: 'Haut-Sassandra', department: 'Daloa', type: 'Village' },

  // Haut-Sassandra - Issia
  { id: '223', name: 'Boguedia', cityId: '22', cityName: 'Issia', commune: 'Issia', region: 'Haut-Sassandra', department: 'Issia', type: 'Village' },
  { id: '224', name: 'Dioulabougou', cityId: '22', cityName: 'Issia', commune: 'Issia', region: 'Haut-Sassandra', department: 'Issia', type: 'Quartier' },
  { id: '225', name: 'Garage', cityId: '22', cityName: 'Issia', commune: 'Issia', region: 'Haut-Sassandra', department: 'Issia', type: 'Quartier' },
  { id: '226', name: 'Nahio', cityId: '22', cityName: 'Issia', commune: 'Issia', region: 'Haut-Sassandra', department: 'Issia', type: 'Village' },
  { id: '227', name: 'Saïoua', cityId: '22', cityName: 'Issia', commune: 'Issia', region: 'Haut-Sassandra', department: 'Issia', type: 'Village' },
  { id: '228', name: 'Sicogi', cityId: '22', cityName: 'Issia', commune: 'Issia', region: 'Haut-Sassandra', department: 'Issia', type: 'Quartier' },

  // Haut-Sassandra - Vavoua
  { id: '229', name: 'Dioulabougou', cityId: '37', cityName: 'Vavoua', commune: 'Vavoua', region: 'Haut-Sassandra', department: 'Vavoua', type: 'Quartier' },
  { id: '230', name: 'Djibrosso', cityId: '37', cityName: 'Vavoua', commune: 'Vavoua', region: 'Haut-Sassandra', department: 'Vavoua', type: 'Village' },
  { id: '231', name: 'Habitat', cityId: '37', cityName: 'Vavoua', commune: 'Vavoua', region: 'Haut-Sassandra', department: 'Vavoua', type: 'Quartier' },
  { id: '232', name: 'Kokoun', cityId: '37', cityName: 'Vavoua', commune: 'Vavoua', region: 'Haut-Sassandra', department: 'Vavoua', type: 'Village' },
  { id: '233', name: 'Plateau', cityId: '37', cityName: 'Vavoua', commune: 'Vavoua', region: 'Haut-Sassandra', department: 'Vavoua', type: 'Quartier' },
  { id: '234', name: 'Séguéla (PK)', cityId: '37', cityName: 'Vavoua', commune: 'Vavoua', region: 'Haut-Sassandra', department: 'Vavoua', type: 'Village' },

  // Iffou - Daoukro
  { id: '235', name: 'Commerce', cityId: '41', cityName: 'Daoukro', commune: 'Daoukro', region: 'Iffou', department: 'Daoukro', type: 'Quartier' },
  { id: '236', name: 'Dioulabougou', cityId: '41', cityName: 'Daoukro', commune: 'Daoukro', region: 'Iffou', department: 'Daoukro', type: 'Quartier' },
  { id: '237', name: 'Habitat', cityId: '41', cityName: 'Daoukro', commune: 'Daoukro', region: 'Iffou', department: 'Daoukro', type: 'Quartier' },
  { id: '238', name: 'Nguénou', cityId: '41', cityName: 'Daoukro', commune: 'Daoukro', region: 'Iffou', department: 'Daoukro', type: 'Village' },
  { id: '239', name: 'Ouellé', cityId: '41', cityName: 'Daoukro', commune: 'Daoukro', region: 'Iffou', department: 'Daoukro', type: 'Village' },
  { id: '240', name: 'Prikro', cityId: '41', cityName: 'Daoukro', commune: 'Daoukro', region: 'Iffou', department: 'Daoukro', type: 'Village' },

  // Indénié-Djuablin - Abengourou
  { id: '241', name: 'Agnibilékrou', cityId: '10', cityName: 'Abengourou', commune: 'Abengourou', region: 'Indénié-Djuablin', department: 'Abengourou', type: 'Village' },
  { id: '242', name: 'Agnikro', cityId: '10', cityName: 'Abengourou', commune: 'Abengourou', region: 'Indénié-Djuablin', department: 'Abengourou', type: 'Quartier' },
  { id: '243', name: 'Kennedy', cityId: '10', cityName: 'Abengourou', commune: 'Abengourou', region: 'Indénié-Djuablin', department: 'Abengourou', type: 'Quartier' },
  { id: '244', name: 'Plateau', cityId: '10', cityName: 'Abengourou', commune: 'Abengourou', region: 'Indénié-Djuablin', department: 'Abengourou', type: 'Quartier' },
  { id: '245', name: 'Yakassé-Féyassé', cityId: '10', cityName: 'Abengourou', commune: 'Abengourou', region: 'Indénié-Djuablin', department: 'Abengourou', type: 'Village' },
  { id: '246', name: 'Zoghossou', cityId: '10', cityName: 'Abengourou', commune: 'Abengourou', region: 'Indénié-Djuablin', department: 'Abengourou', type: 'Quartier' },

  // Kabadougou - Odienné
  { id: '247', name: 'Dioulabougou', cityId: '18', cityName: 'Odienné', commune: 'Odienné', region: 'Kabadougou', department: 'Odienné', type: 'Quartier' },
  { id: '248', name: 'Koko', cityId: '18', cityName: 'Odienné', commune: 'Odienné', region: 'Kabadougou', department: 'Odienné', type: 'Quartier' },
  { id: '249', name: 'Papara', cityId: '18', cityName: 'Odienné', commune: 'Odienné', region: 'Kabadougou', department: 'Odienné', type: 'Quartier' },
  { id: '250', name: 'Samatiguila', cityId: '18', cityName: 'Odienné', commune: 'Odienné', region: 'Kabadougou', department: 'Odienné', type: 'Village' },
  { id: '251', name: 'Sokoura', cityId: '18', cityName: 'Odienné', commune: 'Odienné', region: 'Kabadougou', department: 'Odienné', type: 'Quartier' },
  { id: '252', name: 'Tiémé', cityId: '18', cityName: 'Odienné', commune: 'Odienné', region: 'Kabadougou', department: 'Odienné', type: 'Village' },

  // La Mé - Adzopé
  { id: '253', name: 'Agou', cityId: '13', cityName: 'Adzopé', commune: 'Adzopé', region: 'La Mé', department: 'Adzopé', type: 'Village' },
  { id: '254', name: 'Dioulabougou', cityId: '13', cityName: 'Adzopé', commune: 'Adzopé', region: 'La Mé', department: 'Adzopé', type: 'Quartier' },
  { id: '255', name: 'Habitat', cityId: '13', cityName: 'Adzopé', commune: 'Adzopé', region: 'La Mé', department: 'Adzopé', type: 'Quartier' },
  { id: '256', name: 'M\'Batto', cityId: '13', cityName: 'Adzopé', commune: 'Adzopé', region: 'La Mé', department: 'Adzopé', type: 'Quartier' },
  { id: '257', name: 'Plateau', cityId: '13', cityName: 'Adzopé', commune: 'Adzopé', region: 'La Mé', department: 'Adzopé', type: 'Quartier' },
  { id: '258', name: 'Yakassé-Mé', cityId: '13', cityName: 'Adzopé', commune: 'Adzopé', region: 'La Mé', department: 'Adzopé', type: 'Village' },

  // Lôh-Djiboua - Divo
  { id: '259', name: '8 Km', cityId: '8', cityName: 'Divo', commune: 'Divo', region: 'Lôh-Djiboua', department: 'Divo', type: 'Quartier' },
  { id: '260', name: 'Didoko', cityId: '8', cityName: 'Divo', commune: 'Divo', region: 'Lôh-Djiboua', department: 'Divo', type: 'Village' },
  { id: '261', name: 'Hiré', cityId: '8', cityName: 'Divo', commune: 'Divo', region: 'Lôh-Djiboua', department: 'Divo', type: 'Village' },
  { id: '262', name: 'Konankro', cityId: '8', cityName: 'Divo', commune: 'Divo', region: 'Lôh-Djiboua', department: 'Divo', type: 'Quartier' },
  { id: '263', name: 'Plateau', cityId: '8', cityName: 'Divo', commune: 'Divo', region: 'Lôh-Djiboua', department: 'Divo', type: 'Quartier' },
  { id: '264', name: 'Tazibouo', cityId: '8', cityName: 'Divo', commune: 'Divo', region: 'Lôh-Djiboua', department: 'Divo', type: 'Quartier' },

  // Marahoué - Bouaflé
  { id: '265', name: 'Bonon', cityId: '61', cityName: 'Bouaflé', commune: 'Bouaflé', region: 'Marahoué', department: 'Bouaflé', type: 'Village' },
  { id: '266', name: 'Centre', cityId: '61', cityName: 'Bouaflé', commune: 'Bouaflé', region: 'Marahoué', department: 'Bouaflé', type: 'Quartier' },
  { id: '267', name: 'Dioulabougou', cityId: '61', cityName: 'Bouaflé', commune: 'Bouaflé', region: 'Marahoué', department: 'Bouaflé', type: 'Quartier' },
  { id: '268', name: 'Garahio', cityId: '61', cityName: 'Bouaflé', commune: 'Bouaflé', region: 'Marahoué', department: 'Bouaflé', type: 'Quartier' },
  { id: '269', name: 'Pakouabo', cityId: '61', cityName: 'Bouaflé', commune: 'Bouaflé', region: 'Marahoué', department: 'Bouaflé', type: 'Village' },
  { id: '270', name: 'Sicogi', cityId: '61', cityName: 'Bouaflé', commune: 'Bouaflé', region: 'Marahoué', department: 'Bouaflé', type: 'Quartier' },

  // Marahoué - Sinfra
  { id: '271', name: 'Bouadikro', cityId: '30', cityName: 'Sinfra', commune: 'Sinfra', region: 'Marahoué', department: 'Sinfra', type: 'Village' },
  { id: '272', name: 'Commerce', cityId: '30', cityName: 'Sinfra', commune: 'Sinfra', region: 'Marahoué', department: 'Sinfra', type: 'Quartier' },
  { id: '273', name: 'Dioulabougou', cityId: '30', cityName: 'Sinfra', commune: 'Sinfra', region: 'Marahoué', department: 'Sinfra', type: 'Quartier' },
  { id: '274', name: 'Habitat', cityId: '30', cityName: 'Sinfra', commune: 'Sinfra', region: 'Marahoué', department: 'Sinfra', type: 'Quartier' },
  { id: '275', name: 'Kononfla', cityId: '30', cityName: 'Sinfra', commune: 'Sinfra', region: 'Marahoué', department: 'Sinfra', type: 'Village' },
  { id: '276', name: 'Zégo', cityId: '30', cityName: 'Sinfra', commune: 'Sinfra', region: 'Marahoué', department: 'Sinfra', type: 'Village' },

  // Marahoué - Zuénoula
  { id: '277', name: 'Bonoufla', cityId: '45', cityName: 'Zuénoula', commune: 'Zuénoula', region: 'Marahoué', department: 'Zuénoula', type: 'Village' },
  { id: '278', name: 'Commerce', cityId: '45', cityName: 'Zuénoula', commune: 'Zuénoula', region: 'Marahoué', department: 'Zuénoula', type: 'Quartier' },
  { id: '279', name: 'Dioulabougou', cityId: '45', cityName: 'Zuénoula', commune: 'Zuénoula', region: 'Marahoué', department: 'Zuénoula', type: 'Quartier' },
  { id: '280', name: 'Habitat', cityId: '45', cityName: 'Zuénoula', commune: 'Zuénoula', region: 'Marahoué', department: 'Zuénoula', type: 'Quartier' },
  { id: '281', name: 'Kanzra', cityId: '45', cityName: 'Zuénoula', commune: 'Zuénoula', region: 'Marahoué', department: 'Zuénoula', type: 'Village' },
  { id: '282', name: 'Zaguiguia', cityId: '45', cityName: 'Zuénoula', commune: 'Zuénoula', region: 'Marahoué', department: 'Zuénoula', type: 'Village' },

  // N'Zi - Dimbokro
  { id: '283', name: 'Bocanda', cityId: '50', cityName: 'Dimbokro', commune: 'Dimbokro', region: 'N\'Zi', department: 'Dimbokro', type: 'Village' },
  { id: '284', name: 'Commerce', cityId: '50', cityName: 'Dimbokro', commune: 'Dimbokro', region: 'N\'Zi', department: 'Dimbokro', type: 'Quartier' },
  { id: '285', name: 'Dioulabougou', cityId: '50', cityName: 'Dimbokro', commune: 'Dimbokro', region: 'N\'Zi', department: 'Dimbokro', type: 'Quartier' },
  { id: '286', name: 'Habitat', cityId: '50', cityName: 'Dimbokro', commune: 'Dimbokro', region: 'N\'Zi', department: 'Dimbokro', type: 'Quartier' },
  { id: '287', name: 'Kouadioblékro', cityId: '50', cityName: 'Dimbokro', commune: 'Dimbokro', region: 'N\'Zi', department: 'Dimbokro', type: 'Village' },
  { id: '288', name: 'Nofou', cityId: '50', cityName: 'Dimbokro', commune: 'Dimbokro', region: 'N\'Zi', department: 'Dimbokro', type: 'Village' },

  // Nawa - Soubré
  { id: '289', name: 'Dioulabougou', cityId: '14', cityName: 'Soubré', commune: 'Soubré', region: 'Nawa', department: 'Soubré', type: 'Quartier' },
  { id: '290', name: 'Gnamangui', cityId: '14', cityName: 'Soubré', commune: 'Soubré', region: 'Nawa', department: 'Soubré', type: 'Quartier' },
  { id: '291', name: 'Grand-Zattry', cityId: '14', cityName: 'Soubré', commune: 'Soubré', region: 'Nawa', department: 'Soubré', type: 'Village' },
  { id: '292', name: 'Liliyo', cityId: '14', cityName: 'Soubré', commune: 'Soubré', region: 'Nawa', department: 'Soubré', type: 'Village' },
  { id: '293', name: 'Petit-Paris', cityId: '14', cityName: 'Soubré', commune: 'Soubré', region: 'Nawa', department: 'Soubré', type: 'Quartier' },
  { id: '294', name: 'Zone industrielle', cityId: '14', cityName: 'Soubré', commune: 'Soubré', region: 'Nawa', department: 'Soubré', type: 'Quartier' },

  // San-Pédro - Tabou
  { id: '295', name: 'Dioulabougou', cityId: '42', cityName: 'Tabou', commune: 'Tabou', region: 'San-Pédro', department: 'Tabou', type: 'Quartier' },
  { id: '296', name: 'Grabo', cityId: '42', cityName: 'Tabou', commune: 'Tabou', region: 'San-Pédro', department: 'Tabou', type: 'Village' },
  { id: '297', name: 'Habitat', cityId: '42', cityName: 'Tabou', commune: 'Tabou', region: 'San-Pédro', department: 'Tabou', type: 'Quartier' },
  { id: '298', name: 'Kablaké', cityId: '42', cityName: 'Tabou', commune: 'Tabou', region: 'San-Pédro', department: 'Tabou', type: 'Village' },
  { id: '299', name: 'Port', cityId: '42', cityName: 'Tabou', commune: 'Tabou', region: 'San-Pédro', department: 'Tabou', type: 'Quartier' },
  { id: '300', name: 'Prollo', cityId: '42', cityName: 'Tabou', commune: 'Tabou', region: 'San-Pédro', department: 'Tabou', type: 'Village' },

  // Savanes - Korhogo
  { id: '301', name: 'Air France', cityId: '6', cityName: 'Korhogo', commune: 'Korhogo', region: 'Savanes', department: 'Korhogo', type: 'Quartier' },
  { id: '302', name: 'Haoussabougou (Kossorokaha)', cityId: '6', cityName: 'Korhogo', commune: 'Korhogo', region: 'Savanes', department: 'Korhogo', type: 'Quartier' },
  { id: '303', name: 'Kassirimé', cityId: '6', cityName: 'Korhogo', commune: 'Korhogo', region: 'Savanes', department: 'Korhogo', type: 'Quartier' },
  { id: '304', name: 'Kôkô (Naguinkaha)', cityId: '6', cityName: 'Korhogo', commune: 'Korhogo', region: 'Savanes', department: 'Korhogo', type: 'Quartier' },
  { id: '305', name: 'Logokaha', cityId: '6', cityName: 'Korhogo', commune: 'Korhogo', region: 'Savanes', department: 'Korhogo', type: 'Quartier' },
  { id: '306', name: 'Natio (Natyo Kobadara)', cityId: '6', cityName: 'Korhogo', commune: 'Korhogo', region: 'Savanes', department: 'Korhogo', type: 'Quartier' },
  { id: '307', name: 'Petit Paris', cityId: '6', cityName: 'Korhogo', commune: 'Korhogo', region: 'Savanes', department: 'Korhogo', type: 'Quartier' },
  { id: '308', name: 'Place de la paix', cityId: '6', cityName: 'Korhogo', commune: 'Korhogo', region: 'Savanes', department: 'Korhogo', type: 'Quartier' },
  { id: '309', name: 'Prémafolo', cityId: '6', cityName: 'Korhogo', commune: 'Korhogo', region: 'Savanes', department: 'Korhogo', type: 'Quartier' },
  { id: '310', name: 'Quartier 14', cityId: '6', cityName: 'Korhogo', commune: 'Korhogo', region: 'Savanes', department: 'Korhogo', type: 'Quartier' },
  { id: '311', name: 'Soba', cityId: '6', cityName: 'Korhogo', commune: 'Korhogo', region: 'Savanes', department: 'Korhogo', type: 'Quartier' },

  // Sud-Comoé - Aboisso
  { id: '312', name: 'Adaou', cityId: '27', cityName: 'Aboisso', commune: 'Aboisso', region: 'Sud-Comoé', department: 'Aboisso', type: 'Village' },
  { id: '313', name: 'Ayamé', cityId: '27', cityName: 'Aboisso', commune: 'Aboisso', region: 'Sud-Comoé', department: 'Aboisso', type: 'Village' },
  { id: '314', name: 'Château', cityId: '27', cityName: 'Aboisso', commune: 'Aboisso', region: 'Sud-Comoé', department: 'Aboisso', type: 'Quartier' },
  { id: '315', name: 'Dioulabougou', cityId: '27', cityName: 'Aboisso', commune: 'Aboisso', region: 'Sud-Comoé', department: 'Aboisso', type: 'Quartier' },
  { id: '316', name: 'Habitat', cityId: '27', cityName: 'Aboisso', commune: 'Aboisso', region: 'Sud-Comoé', department: 'Aboisso', type: 'Quartier' },
  { id: '317', name: 'Nouamou', cityId: '27', cityName: 'Aboisso', commune: 'Aboisso', region: 'Sud-Comoé', department: 'Aboisso', type: 'Village' },

  // Sud-Comoé - Adiaké
  { id: '318', name: 'Assinie', cityId: '72', cityName: 'Adiaké', commune: 'Adiaké', region: 'Sud-Comoé', department: 'Adiaké', type: 'Village' },
  { id: '319', name: 'Assinie-Mafia', cityId: '72', cityName: 'Adiaké', commune: 'Adiaké', region: 'Sud-Comoé', department: 'Adiaké', type: 'Village' },
  { id: '320', name: 'Etuéboué', cityId: '72', cityName: 'Adiaké', commune: 'Adiaké', region: 'Sud-Comoé', department: 'Adiaké', type: 'Village' },

  // Sud-Comoé - Grand-Bassam
  { id: '321', name: 'Azuretti', cityId: '21', cityName: 'Grand-Bassam', commune: 'Grand-Bassam', region: 'Sud-Comoé', department: 'Grand-Bassam', type: 'Village' },
  { id: '322', name: 'France', cityId: '21', cityName: 'Grand-Bassam', commune: 'Grand-Bassam', region: 'Sud-Comoé', department: 'Grand-Bassam', type: 'Quartier' },
  { id: '323', name: 'Impérial', cityId: '21', cityName: 'Grand-Bassam', commune: 'Grand-Bassam', region: 'Sud-Comoé', department: 'Grand-Bassam', type: 'Quartier' },
  { id: '324', name: 'Mockeyville', cityId: '21', cityName: 'Grand-Bassam', commune: 'Grand-Bassam', region: 'Sud-Comoé', department: 'Grand-Bassam', type: 'Quartier' },
  { id: '325', name: 'Modeste', cityId: '21', cityName: 'Grand-Bassam', commune: 'Grand-Bassam', region: 'Sud-Comoé', department: 'Grand-Bassam', type: 'Village' },
  { id: '326', name: 'Vitré', cityId: '21', cityName: 'Grand-Bassam', commune: 'Grand-Bassam', region: 'Sud-Comoé', department: 'Grand-Bassam', type: 'Village' },

  // Tchologo - Ferkessédougou
  { id: '327', name: 'Dar-es-salam', cityId: '15', cityName: 'Ferkessédougou', commune: 'Ferkessédougou', region: 'Tchologo', department: 'Ferkessédougou', type: 'Quartier' },
  { id: '328', name: 'Kennedy', cityId: '15', cityName: 'Ferkessédougou', commune: 'Ferkessédougou', region: 'Tchologo', department: 'Ferkessédougou', type: 'Quartier' },
  { id: '329', name: 'Kong', cityId: '15', cityName: 'Ferkessédougou', commune: 'Ferkessédougou', region: 'Tchologo', department: 'Ferkessédougou', type: 'Village' },
  { id: '330', name: 'Ouangolodougou', cityId: '15', cityName: 'Ferkessédougou', commune: 'Ferkessédougou', region: 'Tchologo', department: 'Ferkessédougou', type: 'Village' },
  { id: '331', name: 'Sinistrés', cityId: '15', cityName: 'Ferkessédougou', commune: 'Ferkessédougou', region: 'Tchologo', department: 'Ferkessédougou', type: 'Quartier' },
  { id: '332', name: 'Sokoura', cityId: '15', cityName: 'Ferkessédougou', commune: 'Ferkessédougou', region: 'Tchologo', department: 'Ferkessédougou', type: 'Quartier' },

  // Tonkpi - Man
  { id: '333', name: 'Campement', cityId: '7', cityName: 'Man', commune: 'Man', region: 'Tonkpi', department: 'Man', type: 'Quartier' },
  { id: '334', name: 'Dioulabougou', cityId: '7', cityName: 'Man', commune: 'Man', region: 'Tonkpi', department: 'Man', type: 'Quartier' },
  { id: '335', name: 'Dompleu', cityId: '7', cityName: 'Man', commune: 'Man', region: 'Tonkpi', department: 'Man', type: 'Quartier' },
  { id: '336', name: 'Gbatongouin', cityId: '7', cityName: 'Man', commune: 'Man', region: 'Tonkpi', department: 'Man', type: 'Village' },
  { id: '337', name: 'Grand Gbapleu', cityId: '7', cityName: 'Man', commune: 'Man', region: 'Tonkpi', department: 'Man', type: 'Quartier' },
  { id: '338', name: 'Libreville', cityId: '7', cityName: 'Man', commune: 'Man', region: 'Tonkpi', department: 'Man', type: 'Quartier' },
  { id: '339', name: 'Logoualé', cityId: '7', cityName: 'Man', commune: 'Man', region: 'Tonkpi', department: 'Man', type: 'Village' },
  { id: '340', name: 'Zouan-Hounien', cityId: '7', cityName: 'Man', commune: 'Man', region: 'Tonkpi', department: 'Man', type: 'Village' },

  // Vallée du Bandama - Bouaké
  { id: '341', name: 'Ahougnanssou', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '342', name: 'Air France 1', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '343', name: 'Air France 2', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '344', name: 'Air France 3', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '345', name: 'Allokokro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '346', name: 'Attienkro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '347', name: 'Aéroport', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '348', name: 'Beaufort', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '349', name: 'Belleville 1', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '350', name: 'Belleville 2', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '351', name: 'Broukro 1', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '352', name: 'Broukro 2', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '353', name: 'Commerce', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '354', name: 'Corridor Sud', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '355', name: 'Dar-es-salam 1', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '356', name: 'Dar-es-salam 2', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '357', name: 'Dar-es-salam 3', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '358', name: 'Dougouba', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '359', name: 'Gnankoukro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '360', name: 'Gonfreville', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '361', name: 'Habitat La Caisse', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '362', name: 'Houphouët-ville', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '363', name: 'IDESSA', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '364', name: 'Kamounoukro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '365', name: 'Kanakro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '366', name: 'Kennedy', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '367', name: 'Kodiakoffikro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '368', name: 'Koko', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '369', name: 'Konankankro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '370', name: 'Liberté (Djambourou)', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '371', name: 'Lycée Municipal', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '372', name: 'Mamianou', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '373', name: 'Maroc', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '374', name: 'N\'Dakro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '375', name: 'N\'Gattakro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '376', name: 'N\'Gouatanoukro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '377', name: 'Niankoukro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '378', name: 'Nimbo', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '379', name: 'Odienekourani', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '380', name: 'Sokoura', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '381', name: 'Tièrèkro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '382', name: 'Tollakouadiokro', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '383', name: 'Zone', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },
  { id: '384', name: 'Zone industrielle', cityId: '2', cityName: 'Bouaké', commune: 'Bouaké', region: 'Vallée du Bandama', department: 'Bouaké', type: 'Quartier' },

  // Worodougou - Séguéla
  { id: '385', name: 'Commerce', cityId: '16', cityName: 'Séguéla', commune: 'Séguéla', region: 'Worodougou', department: 'Séguéla', type: 'Quartier' },
  { id: '386', name: 'Dar-es-salam', cityId: '16', cityName: 'Séguéla', commune: 'Séguéla', region: 'Worodougou', department: 'Séguéla', type: 'Quartier' },
  { id: '387', name: 'Dioulabougou', cityId: '16', cityName: 'Séguéla', commune: 'Séguéla', region: 'Worodougou', department: 'Séguéla', type: 'Quartier' },
  { id: '388', name: 'Garahio', cityId: '16', cityName: 'Séguéla', commune: 'Séguéla', region: 'Worodougou', department: 'Séguéla', type: 'Quartier' },
  { id: '389', name: 'Kissidougou', cityId: '16', cityName: 'Séguéla', commune: 'Séguéla', region: 'Worodougou', department: 'Séguéla', type: 'Village' },
  { id: '390', name: 'Koko', cityId: '16', cityName: 'Séguéla', commune: 'Séguéla', region: 'Worodougou', department: 'Séguéla', type: 'Quartier' },
  { id: '391', name: 'Massala', cityId: '16', cityName: 'Séguéla', commune: 'Séguéla', region: 'Worodougou', department: 'Séguéla', type: 'Village' },
  { id: '392', name: 'Sicogi', cityId: '16', cityName: 'Séguéla', commune: 'Séguéla', region: 'Worodougou', department: 'Séguéla', type: 'Quartier' },
  { id: '393', name: 'Sokoura', cityId: '16', cityName: 'Séguéla', commune: 'Séguéla', region: 'Worodougou', department: 'Séguéla', type: 'Quartier' },
  { id: '394', name: 'Worofla', cityId: '16', cityName: 'Séguéla', commune: 'Séguéla', region: 'Worodougou', department: 'Séguéla', type: 'Village' },
];
