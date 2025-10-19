# 🎬 Casting Management Platform

A full-stack casting management web platform for managing commercial performers (actors/models). Built with Express.js, PostgreSQL, and modern web technologies.

## 🏗️ Tech Stack

- **Backend**: Node.js + Express.js (MVC architecture)
- **Database**: PostgreSQL with Sequelize ORM
- **Frontend**: HTML, TailwindCSS, Vanilla JavaScript
- **Authentication**: JWT tokens
- **AI Integration**: OpenAI API for email generation
- **Email Service**: Nodemailer

## 📋 Features

### Admin Panel
- **Performer Management**: Add, edit, delete performers with 3-step deletion confirmation
- **Generate Client Links**: Create secure 24-hour access links for clients
- **Casting Orders**: View finalized casting selections
- **AI Email Assistant**: Generate personalized emails using OpenAI
- **Email Management**: Preview and send emails to selected performers

### Client Portal
- **Performer Browse**: Grid view of all available performers
- **Advanced Filtering**: Filter by gender, age range, hair color, eye color, height, and keywords
- **Search**: Search performers by name
- **Casting Group**: Add/remove performers to casting group
- **Finalize Selection**: Submit final performer selection

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- OpenAI API key (for email generation)
- Email service credentials (Gmail, etc.)

### 2. Installation

```bash
# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/castingdb
JWT_SECRET=your_jwt_secret_here_change_this_in_production
OPENAI_API_KEY=your_openai_api_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourpassword
BASE_URL=http://localhost:3000
```

### 4. Database Setup

Ensure your PostgreSQL database is running and accessible with the credentials in your `.env` file.

### 5. Create Admin User

```bash
node scripts/createAdmin.js
```

Follow the prompts to create your first admin user.

### 6. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start at `http://localhost:3000`

## 📁 Project Structure

```
project-root/
├── src/
│   ├── config/
│   │   ├── database.js          # Database configuration
│   │   └── openai.js            # OpenAI configuration
│   ├── models/
│   │   ├── Admin.js             # Admin user model
│   │   ├── Performer.js         # Performer model
│   │   ├── Client.js            # Client session model
│   │   ├── CastingGroup.js      # Casting group model
│   │   ├── CastingOrder.js      # Finalized casting order
│   │   └── index.js             # Model relationships
│   ├── controllers/
│   │   ├── adminController.js   # Admin authentication
│   │   ├── performerController.js # Performer CRUD
│   │   └── clientController.js  # Client and casting operations
│   ├── routes/
│   │   ├── adminRoutes.js       # Admin API routes
│   │   ├── performerRoutes.js   # Performer API routes
│   │   ├── clientRoutes.js      # Client API routes
│   │   └── emailRoutes.js       # Email API routes
│   ├── services/
│   │   ├── emailService.js      # Email sending service
│   │   └── aiService.js         # OpenAI integration
│   └── middleware/
│       └── auth.js              # JWT authentication
├── public/
│   ├── admin/                   # Admin panel pages
│   ├── client/                  # Client portal pages
│   └── js/                      # Frontend JavaScript
├── scripts/
│   └── createAdmin.js           # Admin user creation script
├── server.js                    # Express server entry point
├── .env.example                 # Environment variables template
└── package.json
```

## 🔐 Authentication & Security

- **Admin Authentication**: JWT-based authentication for admin users
- **Client Access**: Time-limited (24h) unique access codes for client sessions
- **Password Security**: Bcrypt hashing for admin passwords
- **CORS**: Enabled for API access

## 📊 Database Models

### Performer
- Personal info (name, birthday, contact)
- Physical attributes (gender, height, hair/eye color, skin tone)
- Portfolio (up to 9 images)
- Distinctive marks

### Client
- Company name
- Commercial description
- Unique access code
- Expiration timestamp

### CastingGroup
- Selected performer IDs
- Associated client
- Finalization status

### CastingOrder
- Finalized casting details
- Full performer information snapshot
- Company and commercial info

## 🛣️ API Endpoints

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile

### Performer Routes
- `GET /api/performers` - Get all performers (admin)
- `GET /api/performers/search` - Search performers (public)
- `POST /api/performers` - Create performer (admin)
- `PUT /api/performers/:id` - Update performer (admin)
- `DELETE /api/performers/:id` - Delete performer (admin)

### Client Routes
- `POST /api/client/generate-link` - Generate client link (admin)
- `GET /api/client/validate/:accessCode` - Validate access code
- `POST /api/client/casting-group/add` - Add to casting group
- `POST /api/client/casting-group/remove` - Remove from casting group
- `GET /api/client/casting-group/:clientId` - Get casting group
- `POST /api/client/casting-group/finalize` - Finalize selection
- `GET /api/client/casting-orders` - Get all casting orders (admin)

### Email Routes
- `POST /api/email/generate` - Generate AI email (admin)
- `POST /api/email/send` - Send email to performer (admin)

## 🎯 Usage Flow

1. **Admin** logs into dashboard at `/admin/login`
2. **Admin** adds performers with details and images
3. **Admin** generates a client link with company info
4. **Client** opens the link and browses performers
5. **Client** filters and selects performers for casting group
6. **Client** finalizes the selection
7. **Admin** views the casting order in dashboard
8. **Admin** uses AI to generate personalized emails
9. **Admin** reviews and sends emails to performers

## 🔧 Development

### Run in Development Mode
```bash
npm run dev
```

This uses nodemon for automatic server restarts on file changes.

### Create Additional Admin Users
```bash
node scripts/createAdmin.js
```

## 📝 License

ISC

## 👨‍💻 Author

Built with Claude Code
