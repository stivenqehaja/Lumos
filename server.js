import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(express.static('public'));

// Fix __dirname since we use ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/about.html'));
})

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/contact.html'));
})

app.listen(port, () => {
    console.log(`[SERVER] Started at port ${port}`);
});