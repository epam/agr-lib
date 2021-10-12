const tsNode = require('ts-node');
// const testTSConfig = require('./tsconfig.spec.json');

tsNode.register({
  files: true,
  project: './tsconfig.spec.json',
});
