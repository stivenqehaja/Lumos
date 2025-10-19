import readline from 'readline';
import dotenv from 'dotenv';
import sequelize from '../src/config/database.js';
import { Admin } from '../src/models/index.js';

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
    try {
        console.log('\n=== Create Admin User ===\n');

        // Connect to database
        await sequelize.authenticate();
        console.log('[DATABASE] Connected successfully\n');

        // Sync models
        await sequelize.sync();

        const username = await question('Username: ');
        const email = await question('Email: ');
        const password = await question('Password: ');

        if (!username || !email || !password) {
            console.log('\n[ERROR] All fields are required!');
            rl.close();
            process.exit(1);
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({
            where: { username }
        });

        if (existingAdmin) {
            console.log('\n[ERROR] Admin with this username already exists!');
            rl.close();
            process.exit(1);
        }

        // Create admin
        const admin = await Admin.create({
            username,
            email,
            password
        });

        console.log('\n[SUCCESS] Admin user created successfully!');
        console.log(`Username: ${admin.username}`);
        console.log(`Email: ${admin.email}`);
        console.log('\nYou can now login at: http://localhost:3000/admin/login\n');

        rl.close();
        process.exit(0);
    } catch (error) {
        console.error('\n[ERROR]', error.message);
        rl.close();
        process.exit(1);
    }
}

createAdmin();
