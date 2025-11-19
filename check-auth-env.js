// Quick diagnostic script to check OAuth environment variables
require('dotenv').config({ path: '.env.local' });

const requiredVars = [
  'ZETKIN_CLIENT_ID',
  'ZETKIN_CLIENT_SECRET',
  'ZETKIN_API_DOMAIN',
  'ZETKIN_API_HOST',
  'SESSION_PASSWORD',
  'ZETKIN_USE_TLS',
  'ZETKIN_APP_PROTOCOL',
];

console.log('=== OAuth Environment Variables Check ===\n');

let allGood = true;

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive values
    const displayValue = ['CLIENT_SECRET', 'SESSION_PASSWORD'].some(s => varName.includes(s))
      ? '***' + value.slice(-4)
      : value;
    console.log(`✓ ${varName}: ${displayValue}`);
  } else {
    console.log(`✗ ${varName}: NOT SET`);
    allGood = false;
  }
});

console.log('\n=== App URL Configuration ===');
const protocol = process.env.ZETKIN_APP_PROTOCOL || 'http';
const host = process.env.ZETKIN_APP_HOST || 'localhost:3000';
console.log(`App URL: ${protocol}://${host}`);
console.log(`OAuth Redirect URI: ${protocol}://${host}/`);

console.log('\n=== API Configuration ===');
const apiHost = process.env.ZETKIN_API_HOST;
const apiPort = process.env.ZETKIN_API_PORT;
const useTLS = process.env.ZETKIN_USE_TLS === 'true' || process.env.ZETKIN_USE_TLS === '1';
const apiProtocol = useTLS ? 'https' : 'http';
const apiUrl = apiPort ? `${apiProtocol}://${apiHost}:${apiPort}` : `${apiProtocol}://${apiHost}`;
console.log(`API URL: ${apiUrl}`);

console.log('\n' + (allGood ? '✓ All required variables are set' : '✗ Some required variables are missing'));
console.log('\nNote: Make sure your OAuth redirect URI is registered in Zetkin:');
console.log(`  ${protocol}://${host}/`);
