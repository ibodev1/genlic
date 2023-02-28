module.exports = {
  typescript: {
    extensions: [
      'ts',
    ],
    rewritePaths: {
      'src/': 'bin/',
    },
    compile: false,
  },
  require: [
    '@babel/register',
  ],
};
