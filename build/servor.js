const servor = require('servor');
const testConfig = process.env.VITE_BUILD_ENV === 'local' ? require('./local.json') : require('./test.json')
const { build } = require('vite');

async function runServor() {
  await build();
  const {port} = await servor({
    root: 'dist',
    fallback: 'index.html',
    port: testConfig.PORT,
  });
  console.log(`Running servor http://0.0.0.0:${port}`)
}

runServor()
