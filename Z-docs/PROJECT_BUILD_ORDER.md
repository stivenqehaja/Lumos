# Lumos Casting Platform - Build Order & File Logic

## Overview
This document explains the logical order of file creation and the dependency tree for the Lumos Casting Platform. Files are grouped by creation phase and importance.

---

## Phase 1: Project Foundation & Configuration
**Purpose**: Set up the project structure, dependencies, and environment

### 1.1 Root Configuration Files
```
├── package.json                    # Backend dependencies & scripts
├── .env.example                    # Environment variables template
├── .env                           # Actual environment variables (not in git)
└── .gitignore                     # Git ignore patterns
```

**Order of Creation**:
1. `package.json` - Define project dependencies (express, sequelize, anthropic-ai)
2. `.env.example` - Document required environment variables
3. `.gitignore` - Protect sensitive files

**Why First**: These files define the entire project structure and dependencies.

---

## Phase 2: Database Layer (Models)
**Purpose**: Define data structure and relationships

### 2.1 Database Configuration
```
src/
└── config/
    └── database.js                # Sequelize database connection
```

**Why Second**: Database connection must exist before models can be created.

### 2.2 Model Definitions
```
src/
└── models/
    ├── index.js                   # Central model export & associations
    ├── Admin.js                   # Admin user authentication
    ├── Performer.js               # Performer profiles
    ├── Client.js                  # Client companies with access codes
    ├── CastingGroup.js           # Temporary performer selections
    └── CastingOrder.js           # Finalized casting selections
```

**Order of Creation**:
1. `index.js` - Model aggregator and relationship manager
2. `Admin.js` - Authentication foundation
3. `Performer.js` - Core business entity
4. `Client.js` - Client access management
5. `CastingGroup.js` - Temporary selection storage
6. `CastingOrder.js` - Final order records

**Dependency Tree**:
```
index.js (root)
├── Admin.js
├── Performer.js
├── Client.js (depends on: nothing)
├── CastingGroup.js (depends on: Client, Performer)
└── CastingOrder.js (depends on: Client, CastingGroup, Performer)
```

**Key Relationships**:
- Client → CastingGroup (one-to-many)
- Client → CastingOrder (one-to-many)
- CastingGroup → Client (belongs-to)
- CastingOrder → Client (belongs-to)
- CastingOrder → CastingGroup (belongs-to)

---

## Phase 3: Business Logic Layer (Controllers)
**Purpose**: Implement business logic and data manipulation

```
src/
└── controllers/
    ├── adminController.js         # Admin login & authentication
    ├── performerController.js     # Performer CRUD operations
    ├── clientController.js        # Client access & casting groups
    └── emailController.js         # AI email generation
```

**Order of Creation**:
1. `adminController.js` - Authentication logic first
2. `performerController.js` - Core CRUD operations
3. `clientController.js` - Client-specific logic with casting
4. `emailController.js` - AI integration for communication

**Dependency Tree**:
```
Controllers Layer
├── adminController.js
│   └── depends on: Admin model, bcrypt, jsonwebtoken
├── performerController.js
│   └── depends on: Performer model, Sequelize operators
├── clientController.js
│   └── depends on: Client, CastingGroup, CastingOrder, Performer models
└── emailController.js
    └── depends on: AI service, Client, Performer models
```

---

## Phase 4: API Routes Layer
**Purpose**: Define HTTP endpoints and connect to controllers

```
src/
└── routes/
    ├── adminRoutes.js            # Admin authentication routes
    ├── performerRoutes.js        # Performer CRUD routes
    ├── clientRoutes.js           # Client & casting routes
    └── emailRoutes.js            # Email generation routes
```

**Order of Creation**:
1. `adminRoutes.js` - Authentication endpoints
2. `performerRoutes.js` - CRUD endpoints
3. `clientRoutes.js` - Client access endpoints
4. `emailRoutes.js` - AI email endpoints

**Route Structure**:
```
Routes Layer
├── adminRoutes.js
│   ├── POST /api/admin/login
│   └── GET /api/admin/profile (protected)
│
├── performerRoutes.js
│   ├── GET /api/performers (protected)
│   ├── GET /api/performers/search
│   ├── GET /api/performers/:id
│   ├── POST /api/performers (protected)
│   ├── PUT /api/performers/:id (protected)
│   └── DELETE /api/performers/:id (protected)
│
├── clientRoutes.js
│   ├── POST /api/client/generate-link (protected)
│   ├── GET /api/client/validate/:accessCode
│   ├── POST /api/client/casting-group/add
│   ├── POST /api/client/casting-group/remove
│   ├── GET /api/client/casting-group/:clientId
│   ├── POST /api/client/casting-group/finalize
│   ├── GET /api/client/casting-orders (protected)
│   └── GET /api/client/casting-orders/:id (protected)
│
└── emailRoutes.js
    ├── POST /api/email/generate (protected)
    └── POST /api/email/send (protected)
```

---

## Phase 5: Middleware & Services
**Purpose**: Cross-cutting concerns and external integrations

```
src/
├── middleware/
│   └── auth.js                   # JWT authentication middleware
│
├── services/
│   └── aiService.js              # Claude AI integration
│
└── config/
    └── aiClient.js               # Anthropic API client
```

**Order of Creation**:
1. `config/aiClient.js` - AI client configuration
2. `services/aiService.js` - AI business logic
3. `middleware/auth.js` - Route protection

**Dependency Tree**:
```
Middleware & Services
├── auth.js (middleware)
│   └── depends on: jsonwebtoken, Admin model
│
└── aiService.js (service)
    └── depends on: aiClient.js
        └── depends on: @anthropic-ai/sdk
```

---

## Phase 6: Server Entry Point
**Purpose**: Initialize and start the application

```
├── server.js                     # Express app configuration & startup
└── src/
    └── app.js                    # App initialization (if separated)
```

**Order of Creation**:
1. `server.js` - Main entry point

**Dependency Tree**:
```
server.js (root)
├── express
├── cors
├── dotenv
├── models/index.js (imports all models)
├── routes/adminRoutes.js
├── routes/performerRoutes.js
├── routes/clientRoutes.js
├── routes/emailRoutes.js
└── middleware/auth.js
```

**Server.js Logic Flow**:
1. Load environment variables
2. Initialize Express app
3. Configure middleware (cors, json parser)
4. Sync database models
5. Mount API routes
6. Start listening on port

---

## Phase 7: Frontend Foundation
**Purpose**: Set up React application structure

### 7.1 Frontend Configuration
```
client/
├── package.json                  # Frontend dependencies
├── vite.config.js               # Vite configuration
├── index.html                   # Entry HTML
└── .env.example                 # Frontend environment variables
```

**Order of Creation**:
1. `package.json` - React, React Router, Axios dependencies
2. `vite.config.js` - Build configuration
3. `index.html` - HTML entry point
4. `.env.example` - API URL configuration

---

## Phase 8: Frontend Core Infrastructure
**Purpose**: Set up routing, contexts, and global styles

### 8.1 Global Styles
```
client/src/
└── styles/
    ├── lumos.css                # Design system & global styles
    └── index.css                # CSS reset
```

**Why First**: Design tokens must be defined before components.

### 8.2 Context Providers (Global State)
```
client/src/
└── contexts/
    ├── AuthContext.jsx          # Authentication state management
    └── ToastContext.jsx         # Toast notification system
```

**Order of Creation**:
1. `AuthContext.jsx` - User session management
2. `ToastContext.jsx` - Global notifications

**Dependency Tree**:
```
Contexts
├── AuthContext.jsx
│   └── provides: user, login, logout, isAuthenticated
│
└── ToastContext.jsx
    └── provides: showSuccess, showError, showDelete, toasts[]
```

### 8.3 API Service Layer
```
client/src/
└── services/
    └── api.js                   # Axios instance & API methods
```

**api.js Structure**:
```javascript
api.js
├── axios instance (with interceptors)
├── authAPI { login, getProfile }
├── performerAPI { getAll, search, getById, create, update, delete }
├── clientAPI { generateLink, validate, castingGroup operations, orders }
└── emailAPI { generate, send }
```

---

## Phase 9: Reusable Components
**Purpose**: Build component library bottom-up

### 9.1 Basic UI Components
```
client/src/components/common/
├── Toast.jsx & Toast.css        # Notification component
├── ConfirmModal.jsx & .css      # Confirmation dialogs
├── ImageUpload.jsx & .css       # Image upload widget
└── ProtectedRoute.jsx           # Route authentication guard
```

**Order of Creation**:
1. `Toast.jsx` - Used by ToastContext
2. `ConfirmModal.jsx` - Used for delete confirmations
3. `ImageUpload.jsx` - Used in forms
4. `ProtectedRoute.jsx` - Used in routing

**Component Dependency Tree**:
```
Common Components
├── Toast.jsx
│   └── depends on: ToastContext
│
├── ConfirmModal.jsx
│   └── depends on: nothing (pure component)
│
├── ImageUpload.jsx
│   └── depends on: ToastContext
│
└── ProtectedRoute.jsx
    └── depends on: AuthContext, react-router-dom
```

### 9.2 Layout Components
```
client/src/components/common/
└── Navbar.jsx & Navbar.css      # Main navigation
```

**Order of Creation**:
1. `Navbar.jsx` - Main layout component

**Navbar Dependencies**:
- AuthContext (for user state)
- react-router-dom (for navigation)

---

## Phase 10: Domain-Specific Components
**Purpose**: Build feature-specific components

### 10.1 Admin Components
```
client/src/components/admin/
├── PerformerForm.jsx & .css     # Add/Edit performer form
├── PerformersList.jsx & .css    # Performer management list
└── ClientLinkGenerator.jsx & .css # Generate client access links
```

**Order of Creation**:
1. `PerformerForm.jsx` - Form for creating/editing performers
2. `PerformersList.jsx` - List view with CRUD operations
3. `ClientLinkGenerator.jsx` - Client link generation

**Component Dependencies**:
```
Admin Components
├── PerformerForm.jsx
│   └── depends on: ImageUpload, ToastContext, performerAPI
│
├── PerformersList.jsx
│   └── depends on: PerformerForm, ConfirmModal, ToastContext, performerAPI
│
└── ClientLinkGenerator.jsx
    └── depends on: ToastContext, clientAPI
```

### 10.2 Client Components
```
client/src/components/client/
├── PerformerCard.jsx & .css     # Performer card in grid
└── PerformerModal.jsx & .css    # Performer detail modal
```

**Order of Creation**:
1. `PerformerCard.jsx` - Grid item component
2. `PerformerModal.jsx` - Detail view modal

**Component Dependencies**:
```
Client Components
├── PerformerCard.jsx
│   └── depends on: nothing (receives props)
│
└── PerformerModal.jsx
    └── depends on: nothing (receives props)
```

---

## Phase 11: Page Components
**Purpose**: Compose components into full pages

### 11.1 Public Pages
```
client/src/pages/
├── Home.jsx & Home.css          # Landing page
├── About.jsx                    # About page
└── Contact.jsx                  # Contact page
```

**Order of Creation**:
1. `Home.jsx` - Main landing page
2. `About.jsx` - Information page
3. `Contact.jsx` - Contact form

### 11.2 Admin Pages
```
client/src/pages/admin/
├── Login.jsx & Login.css        # Admin login
├── Dashboard.jsx & .css         # Admin dashboard
├── Performers.jsx & .css        # Performer management
├── CastingOrders.jsx            # Orders list
└── CastingOrderDetail.jsx & .css # Order detail view
```

**Order of Creation**:
1. `Login.jsx` - Authentication entry point
2. `Dashboard.jsx` - Admin home
3. `Performers.jsx` - Main performer management
4. `CastingOrders.jsx` - View finalized orders
5. `CastingOrderDetail.jsx` - Order details

**Page Dependencies**:
```
Admin Pages
├── Login.jsx
│   └── depends on: AuthContext, authAPI
│
├── Dashboard.jsx
│   └── depends on: AuthContext, react-router-dom
│
├── Performers.jsx
│   └── depends on: PerformerForm, ConfirmModal, ToastContext, performerAPI
│
├── CastingOrders.jsx
│   └── depends on: clientAPI
│
└── CastingOrderDetail.jsx
    └── depends on: clientAPI, react-router-dom
```

### 11.3 Client Pages
```
client/src/pages/client/
└── ClientPortal.jsx & .css      # Client casting interface
```

**Order of Creation**:
1. `ClientPortal.jsx` - Main client interface with filters, selection, finalization

**Page Dependencies**:
```
ClientPortal.jsx
├── PerformerCard
├── PerformerModal
├── ConfirmModal
├── ToastContext
├── performerAPI
└── clientAPI
```

---

## Phase 12: Application Root
**Purpose**: Wire everything together

```
client/src/
├── App.jsx                      # Route definitions & providers
├── App.css                      # App-specific styles
└── main.jsx                     # React DOM render
```

**Order of Creation**:
1. `App.jsx` - Define all routes and wrap with providers
2. `App.css` - App-level styles (back button, etc.)
3. `main.jsx` - Entry point that renders App

**App.jsx Structure**:
```
App.jsx
├── Providers (outer to inner)
│   ├── ToastProvider
│   └── AuthProvider
│
├── Router
│   └── Routes
│       ├── Navbar (on all routes)
│       ├── Public Routes
│       │   ├── / → Home
│       │   ├── /about → About
│       │   ├── /contact → Contact
│       │   ├── /admin/login → Login
│       │   └── /client → ClientPortal
│       │
│       └── Protected Routes (wrapped with ProtectedRoute)
│           ├── /admin → Dashboard
│           ├── /admin/performers → Performers
│           ├── /admin/casting-orders → CastingOrders
│           └── /admin/casting-orders/:id → CastingOrderDetail
```

---

## Phase 13: Utility Scripts
**Purpose**: Development and data generation tools

```
scripts/
└── generatePerformers.js        # Generate random test performers
```

**Order of Creation**:
1. `generatePerformers.js` - After models are complete

---

## Complete Dependency Flow

### Backend Flow
```
1. Environment Setup (.env, package.json)
   ↓
2. Database Connection (config/database.js)
   ↓
3. Models (Admin, Performer, Client, CastingGroup, CastingOrder)
   ↓
4. Services (aiClient.js → aiService.js)
   ↓
5. Middleware (auth.js)
   ↓
6. Controllers (adminController, performerController, clientController, emailController)
   ↓
7. Routes (adminRoutes, performerRoutes, clientRoutes, emailRoutes)
   ↓
8. Server (server.js) - Ties everything together
```

### Frontend Flow
```
1. Build Setup (package.json, vite.config.js)
   ↓
2. Global Styles (lumos.css, index.css)
   ↓
3. API Service (api.js)
   ↓
4. Contexts (AuthContext, ToastContext)
   ↓
5. Common Components (Toast, ConfirmModal, ImageUpload, ProtectedRoute, Navbar)
   ↓
6. Domain Components (Admin & Client components)
   ↓
7. Pages (Public, Admin, Client pages)
   ↓
8. App Root (App.jsx, main.jsx)
```

---

## Reading Order for Understanding Logic

### Option 1: Top-Down (User Journey)
Best for understanding user flows and features:

1. **Start**: `client/src/main.jsx` → `App.jsx`
2. **Public Flow**: `Home.jsx` → `Navbar.jsx`
3. **Admin Flow**:
   - `Login.jsx` → `AuthContext.jsx`
   - `Dashboard.jsx`
   - `Performers.jsx` → `PerformerForm.jsx` → `performerAPI` → `performerController.js` → `Performer.js` (model)
   - `CastingOrders.jsx` → `CastingOrderDetail.jsx`
4. **Client Flow**:
   - `ClientPortal.jsx` → `PerformerCard.jsx` → `PerformerModal.jsx`
   - Follow selection → finalization flow

### Option 2: Bottom-Up (Architecture)
Best for understanding technical architecture:

1. **Database**: Models (`Performer.js`, `Client.js`, etc.)
2. **Business Logic**: Controllers
3. **API Layer**: Routes
4. **Server**: `server.js`
5. **Frontend Data**: `api.js` service
6. **Frontend State**: Contexts
7. **Frontend UI**: Components → Pages
8. **Frontend Routing**: `App.jsx`

### Option 3: Feature-Focused
Best for understanding specific features:

**Feature: Performer Management**
```
Performer.js (model)
→ performerController.js (logic)
→ performerRoutes.js (API)
→ api.js (frontend service)
→ PerformerForm.jsx (UI)
→ Performers.jsx (page)
```

**Feature: Client Casting**
```
Client.js, CastingGroup.js, CastingOrder.js (models)
→ clientController.js (logic)
→ clientRoutes.js (API)
→ api.js (frontend service)
→ PerformerCard.jsx (UI)
→ ClientPortal.jsx (page)
```

**Feature: Authentication**
```
Admin.js (model)
→ adminController.js (logic)
→ auth.js (middleware)
→ adminRoutes.js (API)
→ AuthContext.jsx (state)
→ Login.jsx (UI)
→ ProtectedRoute.jsx (guard)
```

---

## Critical Files to Understand First

### Backend (5 files)
1. `src/models/index.js` - Understanding data relationships
2. `src/routes/*.js` - API endpoints overview
3. `server.js` - How everything connects
4. `src/middleware/auth.js` - Security layer
5. `src/config/aiClient.js` - External integrations

### Frontend (5 files)
1. `client/src/App.jsx` - Routing and structure
2. `client/src/services/api.js` - Backend communication
3. `client/src/contexts/AuthContext.jsx` - Authentication flow
4. `client/src/pages/admin/Performers.jsx` - Core CRUD example
5. `client/src/pages/client/ClientPortal.jsx` - Client experience

---

## File Importance Ranking

### Critical (Must Understand)
- `server.js` - Application entry
- `src/models/index.js` - Data structure
- `client/src/App.jsx` - Frontend routing
- `client/src/services/api.js` - API communication
- `client/src/contexts/AuthContext.jsx` - Authentication

### Important (Key Features)
- `src/controllers/clientController.js` - Core business logic
- `src/middleware/auth.js` - Security
- `client/src/pages/client/ClientPortal.jsx` - Main user feature
- `client/src/pages/admin/Performers.jsx` - Main admin feature
- `client/src/contexts/ToastContext.jsx` - User feedback

### Supporting (Infrastructure)
- All other controllers, routes, components, pages
- CSS files
- Configuration files

---

## Summary

**Total Files Created**: ~60-70 files
**Build Time Estimate**: 2-3 weeks for experienced developer
**Complexity Level**: Medium-High (Full-stack with AI integration)

**Key Architectural Decisions**:
1. Separation of concerns (MVC pattern)
2. Context-based state management (not Redux)
3. Protected routes with JWT authentication
4. Modular component structure
5. AI integration for email generation
6. Real-time UI updates with optimistic rendering
7. Comprehensive toast notification system
8. Double-check delete with undo functionality
9. Dynamic reordering with animations on client side

