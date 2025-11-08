const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclure react-native-maps sur web
config.resolver.platforms = ['ios', 'android', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;