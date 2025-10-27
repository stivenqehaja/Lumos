import ngrok from '@ngrok/ngrok';

const authtoken = process.argv[2];

if (!authtoken) {
    console.error('\n❌ ERROR: Missing authtoken');
    console.log('Usage: node start-ngrok-simple.js YOUR_AUTHTOKEN\n');
    process.exit(1);
}

console.log('\n🚀 Starting ngrok...\n');

(async () => {
    try {
        // Forward both ports using the same authtoken
        const listener = await ngrok.forward({
            addr: 5174,
            authtoken: authtoken,
        });

        const url = listener.url();

        console.log('✅ Ngrok is LIVE!\n');
        console.log('═'.repeat(60));
        console.log('🌐 PUBLIC URL:', url);
        console.log('═'.repeat(60));
        console.log('\n📝 TODO:');
        console.log('1. Update .env → BASE_URL=' + url);
        console.log('2. Update client/.env.local → VITE_API_URL=' + url + '/api');
        console.log('3. Restart backend: node server.js');
        console.log('4. Share with clients: ' + url + '/client?code=CODE\n');
        console.log('⚠️  Keep this terminal open!\n');
        console.log('Ngrok session active... (Press Ctrl+C to stop)\n');

        // Keep the process alive
        setInterval(() => {
            console.log('⏰ Still running...', new Date().toLocaleTimeString());
        }, 60000); // Log every minute

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();
