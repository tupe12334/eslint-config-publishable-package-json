/**
 * ESLint config for validating package.json files for publishable packages
 *
 * This config ensures that package.json files contain all required fields
 * for packages that will be published to npm.
 */

export default {
  name: 'eslint-config-publishable-package-json',
  files: ['**/package.json'],
  plugins: {},
  rules: {
    // Add your ESLint rules here for validating package.json
  },
}
