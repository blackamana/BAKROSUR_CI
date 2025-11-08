import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';
import Colors from '@/constants/colors';

export default function SupabaseTestScreen() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
    console.log(message);
  };

  const testConnection = async () => {
    setResults([]);
    setLoading(true);
    addResult('=== Debut test Supabase ===');

    try {
      // Test 1: Client initialise
      addResult('Test 1: Verification client...');
      if (!supabase) {
        addResult('ERREUR: Client Supabase non initialise');
        setLoading(false);
        return;
      }
      addResult('OK: Client initialise');

      // Test 2: Session
      addResult('Test 2: Verification session...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        addResult('ERREUR session: ' + sessionError.message);
      } else {
        addResult('OK: Session ' + (sessionData.session ? 'active' : 'inactive'));
      }

      // Test 3: Acces table users
      addResult('Test 3: Test requete table users...');
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .limit(3);

      if (usersError) {
        addResult('ERREUR users: ' + usersError.message);
        if (usersError.code === 'PGRST301') {
          addResult('INFO: Table users non accessible');
        }
      } else {
        addResult('OK: ' + (users?.length || 0) + ' utilisateurs trouves');
      }

      // Test 4: Acces table properties
      addResult('Test 4: Test requete table properties...');
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, title')
        .limit(3);

      if (propertiesError) {
        addResult('ERREUR properties: ' + propertiesError.message);
      } else {
        addResult('OK: ' + (properties?.length || 0) + ' proprietes trouvees');
      }

      addResult('=== Test termine ===');
    } catch (err: any) {
      addResult('ERREUR CRITIQUE: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const testSpecificTable = async (tableName: string) => {
    addResult('Test table: ' + tableName);
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(5);

      if (error) {
        addResult('ERREUR ' + tableName + ': ' + error.message);
      } else {
        addResult('OK ' + tableName + ': ' + (data?.length || 0) + ' lignes');
        if (data && data.length > 0) {
          addResult('Colonnes: ' + Object.keys(data[0]).join(', '));
        }
      }
    } catch (err: any) {
      addResult('ERREUR: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Connexion Supabase</Text>
      
      <View style={styles.buttons}>
        <Pressable 
          style={styles.button} 
          onPress={testConnection}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Test en cours...' : 'Lancer test complet'}
          </Text>
        </Pressable>

        <Pressable 
          style={[styles.button, styles.buttonSecondary]} 
          onPress={() => testSpecificTable('users')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test table users</Text>
        </Pressable>

        <Pressable 
          style={[styles.button, styles.buttonSecondary]} 
          onPress={() => testSpecificTable('properties')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test table properties</Text>
        </Pressable>

        <Pressable 
          style={[styles.button, styles.buttonDanger]} 
          onPress={() => setResults([])}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Effacer resultats</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.results}>
        {results.map((result, index) => (
          <Text 
            key={index} 
            style={[
              styles.resultText,
              result.includes('ERREUR') && styles.errorText,
              result.includes('OK:') && styles.successText,
            ]}
          >
            {result}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 20,
  },
  buttons: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: Colors.light.secondary,
  },
  buttonDanger: {
    backgroundColor: Colors.light.error,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  results: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  resultText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  errorText: {
    color: Colors.light.error,
    fontWeight: '600',
  },
  successText: {
    color: Colors.light.success,
    fontWeight: '600',
  },
});
