const path = require('path');
const configFactory = require('./config/webpack.config');

module.exports = {
  title: 'Lens Style Guide',
  pagePerSection: true,
  sections: [
    {
      name: 'Common Components',
      components: 'src/components/**/*.{js,jsx,ts,tsx}',
    }, {
      name: 'Catalog Components',
      components: 'src/containers/catalog/**/*.{js,jsx,ts,tsx}',
    }, {
      name: 'Editor Components',
      components: 'src/containers/editor/**/*.{js,jsx,ts,tsx}',
    }
  ],
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  propsParser: require('react-docgen-typescript').withCustomConfig(
    './tsconfig.json', {
    propFilter: {
      skipPropsWithoutDoc: false,
    },
  }).parse,
  webpackConfig: configFactory('development'),
  skipComponentsWithoutExample: true,
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'style-guide-wrapper'),
  },
  usageMode: 'collapse',
};
