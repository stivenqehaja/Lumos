import ngrok from '@ngrok/ngrok';

const authtoken = process.argv[2];

if (!authtoken) {
    console.error('\n❌ ERROR: Missing ngrok authtoken');
    console.log('Usage: node start-ngrok.js YOUR_AUTHTOKEN\n');
    process.exit(1);
}

console.log('\n🚀 Starting ngrok tunnels...\n');

(async () => {
    try {
        // 🌐 Backend tunnel
        console.log('🔗 Opening Backend API (port 3000)...');
        const backend = await ngrok.forward({
            addr: 3000,
            authtoken: authtoken,
        });
        const backendUrl = backend.url();
        console.log(`✅ Backend URL: ${backendUrl}`);

        // 💻 Frontend tunnel
        console.log('\n🔗 Opening Frontend (port 5174)...');
        const frontend = await ngrok.forward({
            addr: 5174,
            authtoken: authtoken,
        });
        const frontendUrl = frontend.url();
        console.log(`✅ Frontend URL: ${frontendUrl}`);

        // 💡 Display next steps
        console.log('\n' + '═'.repeat(60));
        console.log('📋 CONFIGURATION');
        console.log('═'.repeat(60));
        console.log(`1️⃣  In your backend .env → BASE_URL=${frontendUrl}`);
        console.log(`2️⃣  In client/.env.local → VITE_API_URL=${backendUrl}/api`);
        console.log('3️⃣  Restart your backend → node server.js');
        console.log('4️⃣  Access frontend →', frontendUrl);
        console.log('═'.repeat(60));
        console.log('\n⚠️  Keep this terminal open — ngrok will stop if you close it.\n');

        // Keep process alive
        setInterval(() => {
            console.log('⏰ Still running:', new Date().toLocaleTimeString());
        }, 60000);

    } catch (err) {
        console.error('\n❌ Error:', err.message);
        process.exit(1);
    }
})();
