const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['react-native-paper'],
      },
    },
    argv
  );

  // Personalizar config para Paper y otros módulos
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native-vector-icons': 'react-native-vector-icons/dist',
  };

  return config;
};