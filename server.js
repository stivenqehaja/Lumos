import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import sequelize, { testConnection, syncDatabase } from './src/config/database.js';
import swaggerSpec from './src/config/swagger.js';

// Import routes
import adminRoutes from './src/routes/adminRoutes.js';
import performerRoutes from './src/routes/performerRoutes.js';
import clientRoutes from './src/routes/clientRoutes.js';
import emailRoutes from './src/routes/emailRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Fix __dirname since we use ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Lumos API Documentation',
    customfavIcon: '/favicon.ico'
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/performers', performerRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/email', emailRoutes);

// Public Marketing Website Routes (legacy - can be removed if not needed)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/contact.html'));
});

// Static files (CSS, JS, images) - AFTER specific routes
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Database initialization and server start
const startServer = async () => {
    const connected = await testConnection();

    if (connected) {
        await syncDatabase();

        app.listen(port, () => {
            console.log(`[SERVER] Started at port ${port}`);
        });
    } else {
        console.error('[SERVER] Failed to connect to database. Server not started.');
        process.exit(1);
    }
};

startServer();
