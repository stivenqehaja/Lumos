import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function createDatabase() {
    // Parse the DATABASE_URL to get connection details
    const dbUrl = process.env.DATABASE_URL;
    const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

    if (!match) {
        console.error('[ERROR] Invalid DATABASE_URL format');
        process.exit(1);
    }

    const [, user, password, host, port, database] = match;

    // Connect to 'postgres' database first (default database)
    const client = new Client({
        user,
        password,
        host,
        port: parseInt(port),
        database: 'postgres' // Connect to default database
    });

    try {
        await client.connect();
        console.log('[DATABASE] Connected to PostgreSQL');

        // Check if database exists
        const result = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [database]
        );

        if (result.rows.length === 0) {
            // Database doesn't exist, create it
            await client.query(`CREATE DATABASE ${database}`);
            console.log(`[SUCCESS] Database '${database}' created successfully!`);
        } else {
            console.log(`[INFO] Database '${database}' already exists`);
        }

        await client.end();
        process.exit(0);
    } catch (error) {
        console.error('[ERROR]', error.message);
        await client.end();
        process.exit(1);
    }
}

createDatabase();
