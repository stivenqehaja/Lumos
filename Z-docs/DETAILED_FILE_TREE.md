# Lumos Casting Platform - Complete File Tree & Logic Flow

## Visual Legend
```
📦 Package/Config File
🗄️ Database/Model File
⚙️ Configuration File
🎯 Controller/Logic File
🛣️ Route File
🔒 Middleware File
🌐 Service File
⚛️ React Component
📄 Page Component
🎨 Style File
🔧 Utility/Script
📋 Documentation
```

---

## Complete Project Tree with Creation Order & Dependencies

```
LUMOS ROOT
│
├─[1]─📦 package.json ........................... Backend dependencies
│     │                                          Dependencies: none
│     │                                          Creates: Project foundation
│     └─── Defines: express, sequelize, @anthropic-ai/sdk, bcryptjs, jsonwebtoken, uuid, dotenv, cors
│
├─[2]─⚙️ .env.example ........................... Environment template
│     │                                          Dependencies: none
│     └─── Documents: PORT, DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY, BASE_URL
│
├─[3]─⚙️ .env .................................. Actual environment variables
│     │                                          Dependencies: .env.example
│     └─── Contains: Real API keys and secrets
│
├─[4]─📋 .gitignore ............................ Git ignore patterns
│     │                                          Dependencies: none
│     └─── Protects: node_modules, .env, dist, build
│
│
├─[5]─📂 src/ .................................. Backend source code
│     │
│     ├─[6]─📂 config/ ......................... Configuration files
│     │     │
│     │     ├─[7]─⚙️ database.js ............... Sequelize connection
│     │     │     │                              Dependencies: sequelize, dotenv
│     │     │     │                              Purpose: PostgreSQL connection pool
│     │     │     └─── Exports: sequelize instance
│     │     │
│     │     └─[8]─⚙️ aiClient.js ............... Anthropic API client
│     │           │                              Dependencies: @anthropic-ai/sdk, dotenv
│     │           │                              Purpose: Claude AI connection
│     │           └─── Exports: anthropic instance
│     │
│     │
│     ├─[9]─📂 models/ ......................... Database models
│     │     │
│     │     ├─[10]─🗄️ index.js ................ Model aggregator
│     │     │      │                             Dependencies: sequelize (from config/database.js)
│     │     │      │                             Purpose: Import all models, define relationships, sync DB
│     │     │      │
│     │     │      ├─── Imports: Admin, Performer, Client, CastingGroup, CastingOrder
│     │     │      │
│     │     │      └─── Defines Relationships:
│     │     │            ├─ Client.hasMany(CastingGroup)
│     │     │            ├─ Client.hasMany(CastingOrder)
│     │     │            ├─ CastingGroup.belongsTo(Client)
│     │     │            ├─ CastingOrder.belongsTo(Client)
│     │     │            └─ CastingOrder.belongsTo(CastingGroup)
│     │     │
│     │     ├─[11]─🗄️ Admin.js ................ Admin user model
│     │     │      │                             Dependencies: sequelize, DataTypes
│     │     │      │                             Purpose: Admin authentication
│     │     │      │
│     │     │      └─── Schema:
│     │     │            ├─ id (UUID, primary key)
│     │     │            ├─ username (unique)
│     │     │            ├─ email (unique)
│     │     │            └─ password (hashed)
│     │     │
│     │     ├─[12]─🗄️ Performer.js ............ Performer profile model
│     │     │      │                             Dependencies: sequelize, DataTypes
│     │     │      │                             Purpose: Store performer data
│     │     │      │
│     │     │      └─── Schema:
│     │     │            ├─ id (UUID, primary key)
│     │     │            ├─ firstName, lastName
│     │     │            ├─ birthday, email, phone
│     │     │            ├─ gender, height
│     │     │            ├─ hairColor, eyeColor, skinTone, faceShape
│     │     │            ├─ distinctiveMarks
│     │     │            ├─ images (JSONB array)
│     │     │            └─ profileImageIndex
│     │     │
│     │     ├─[13]─🗄️ Client.js ............... Client company model
│     │     │      │                             Dependencies: sequelize, DataTypes
│     │     │      │                             Purpose: Client access management
│     │     │      │
│     │     │      └─── Schema:
│     │     │            ├─ id (UUID, primary key)
│     │     │            ├─ companyName
│     │     │            ├─ commercialDescription
│     │     │            ├─ accessCode (unique)
│     │     │            ├─ expiresAt
│     │     │            └─ isActive
│     │     │
│     │     ├─[14]─🗄️ CastingGroup.js ......... Temporary selection model
│     │     │      │                             Dependencies: sequelize, DataTypes
│     │     │      │                             Purpose: Store in-progress selections
│     │     │      │
│     │     │      └─── Schema:
│     │     │            ├─ id (UUID, primary key)
│     │     │            ├─ clientId (foreign key → Client)
│     │     │            ├─ performerIds (JSONB array)
│     │     │            └─ isFinalized
│     │     │
│     │     └─[15]─🗄️ CastingOrder.js ......... Finalized order model
│     │            │                             Dependencies: sequelize, DataTypes
│     │            │                             Purpose: Store completed orders
│     │            │
│     │            └─── Schema:
│     │                  ├─ id (UUID, primary key)
│     │                  ├─ clientId (foreign key → Client)
│     │                  ├─ castingGroupId (foreign key → CastingGroup)
│     │                  ├─ companyName
│     │                  ├─ commercialDescription
│     │                  └─ selectedPerformers (JSONB)
│     │
│     │
│     ├─[16]─📂 services/ ...................... External services
│     │     │
│     │     └─[17]─🌐 aiService.js ............. AI email generation
│     │           │                              Dependencies: config/aiClient.js
│     │           │                              Purpose: Generate emails via Claude AI
│     │           │
│     │           └─── Functions:
│     │                 └─ generateEmail(performerDetails, clientInfo, role)
│     │                      ├─ Uses: Claude 3.5 Sonnet model
│     │                      ├─ Max tokens: 500
│     │                      └─ Returns: Generated email text
│     │
│     │
│     ├─[18]─📂 middleware/ .................... Express middleware
│     │     │
│     │     └─[19]─🔒 auth.js .................. JWT authentication
│     │           │                              Dependencies: jsonwebtoken, Admin model
│     │           │                              Purpose: Protect admin routes
│     │           │
│     │           └─── Function: authenticateAdmin(req, res, next)
│     │                 ├─ Extracts JWT from Authorization header
│     │                 ├─ Verifies token
│     │                 ├─ Attaches admin user to req.admin
│     │                 └─ Calls next() or returns 401/403
│     │
│     │
│     ├─[20]─📂 controllers/ ................... Business logic
│     │     │
│     │     ├─[21]─🎯 adminController.js ....... Admin operations
│     │     │      │                             Dependencies: Admin model, bcrypt, jsonwebtoken
│     │     │      │                             Purpose: Authentication logic
│     │     │      │
│     │     │      └─── Functions:
│     │     │            ├─ login(req, res)
│     │     │            │   ├─ Validates credentials
│     │     │            │   ├─ Compares password with bcrypt
│     │     │            │   ├─ Generates JWT token
│     │     │            │   └─ Returns token + user data
│     │     │            │
│     │     │            └─ getProfile(req, res)
│     │     │                └─ Returns authenticated admin profile
│     │     │
│     │     ├─[22]─🎯 performerController.js ... Performer CRUD
│     │     │      │                             Dependencies: Performer model, Sequelize Op
│     │     │      │                             Purpose: Manage performers
│     │     │      │
│     │     │      └─── Functions:
│     │     │            ├─ getAllPerformers(req, res)
│     │     │            │   └─ Returns all performers
│     │     │            │
│     │     │            ├─ searchPerformers(req, res)
│     │     │            │   ├─ Filters by: gender, age, height, hair, eyes
│     │     │            │   └─ Returns filtered results
│     │     │            │
│     │     │            ├─ getPerformerById(req, res)
│     │     │            │   └─ Returns single performer
│     │     │            │
│     │     │            ├─ createPerformer(req, res)
│     │     │            │   └─ Creates new performer
│     │     │            │
│     │     │            ├─ updatePerformer(req, res)
│     │     │            │   └─ Updates existing performer
│     │     │            │
│     │     │            └─ deletePerformer(req, res)
│     │     │                └─ Deletes performer by ID
│     │     │
│     │     ├─[23]─🎯 clientController.js ...... Client & casting logic
│     │     │      │                             Dependencies: Client, CastingGroup, CastingOrder, Performer models, uuid
│     │     │      │                             Purpose: Client access & casting operations
│     │     │      │
│     │     │      └─── Functions:
│     │     │            ├─ generateClientLink(req, res)
│     │     │            │   ├─ Creates Client record
│     │     │            │   ├─ Generates unique access code
│     │     │            │   ├─ Sets expiration (24 hours)
│     │     │            │   └─ Returns access URL
│     │     │            │
│     │     │            ├─ validateAccessCode(req, res)
│     │     │            │   ├─ Checks if code exists
│     │     │            │   ├─ Checks if expired
│     │     │            │   └─ Returns client info
│     │     │            │
│     │     │            ├─ addToCastingGroup(req, res)
│     │     │            │   ├─ Finds/creates CastingGroup
│     │     │            │   ├─ Adds performer ID to array
│     │     │            │   └─ Saves group
│     │     │            │
│     │     │            ├─ removeFromCastingGroup(req, res)
│     │     │            │   ├─ Finds CastingGroup
│     │     │            │   ├─ Removes performer ID
│     │     │            │   └─ Saves group
│     │     │            │
│     │     │            ├─ getCastingGroup(req, res)
│     │     │            │   ├─ Finds CastingGroup by clientId
│     │     │            │   ├─ Fetches performer details
│     │     │            │   └─ Returns performers array
│     │     │            │
│     │     │            ├─ finalizeCastingGroup(req, res)
│     │     │            │   ├─ Finds CastingGroup
│     │     │            │   ├─ Creates CastingOrder record
│     │     │            │   ├─ Marks group as finalized
│     │     │            │   └─ Returns order
│     │     │            │
│     │     │            ├─ getAllCastingOrders(req, res)
│     │     │            │   ├─ Fetches all orders
│     │     │            │   ├─ Includes Client & CastingGroup
│     │     │            │   └─ Returns orders array
│     │     │            │
│     │     │            └─ getCastingOrderById(req, res)
│     │     │                ├─ Fetches order by ID
│     │     │                ├─ Includes relations
│     │     │                └─ Returns order details
│     │     │
│     │     └─[24]─🎯 emailController.js ....... Email generation
│     │            │                             Dependencies: aiService, Client, Performer models
│     │            │                             Purpose: AI-powered email generation
│     │            │
│     │            └─── Functions:
│     │                  ├─ generateEmail(req, res)
│     │                  │   ├─ Receives: performerId, clientId, role
│     │                  │   ├─ Fetches performer & client data
│     │                  │   ├─ Calls aiService.generateEmail()
│     │                  │   └─ Returns generated email
│     │                  │
│     │                  └─ sendEmail(req, res)
│     │                      └─ Placeholder for email sending logic
│     │
│     │
│     └─[25]─📂 routes/ ........................ API routes
│           │
│           ├─[26]─🛣️ adminRoutes.js ........... Admin endpoints
│           │      │                             Dependencies: express.Router, adminController, auth middleware
│           │      │                             Purpose: Admin API routes
│           │      │
│           │      └─── Routes:
│           │            ├─ POST   /api/admin/login .............. adminController.login
│           │            └─ GET    /api/admin/profile ............ adminController.getProfile (protected)
│           │
│           ├─[27]─🛣️ performerRoutes.js ....... Performer endpoints
│           │      │                             Dependencies: express.Router, performerController, auth middleware
│           │      │                             Purpose: Performer API routes
│           │      │
│           │      └─── Routes:
│           │            ├─ GET    /api/performers ............... performerController.getAll (protected)
│           │            ├─ GET    /api/performers/search ....... performerController.search
│           │            ├─ GET    /api/performers/:id .......... performerController.getById
│           │            ├─ POST   /api/performers ............... performerController.create (protected)
│           │            ├─ PUT    /api/performers/:id .......... performerController.update (protected)
│           │            └─ DELETE /api/performers/:id .......... performerController.delete (protected)
│           │
│           ├─[28]─🛣️ clientRoutes.js .......... Client endpoints
│           │      │                             Dependencies: express.Router, clientController, auth middleware
│           │      │                             Purpose: Client & casting API routes
│           │      │
│           │      └─── Routes:
│           │            ├─ POST   /api/client/generate-link ................ clientController.generateClientLink (protected)
│           │            ├─ GET    /api/client/validate/:accessCode ......... clientController.validateAccessCode
│           │            ├─ POST   /api/client/casting-group/add ............ clientController.addToCastingGroup
│           │            ├─ POST   /api/client/casting-group/remove ......... clientController.removeFromCastingGroup
│           │            ├─ GET    /api/client/casting-group/:clientId ...... clientController.getCastingGroup
│           │            ├─ POST   /api/client/casting-group/finalize ....... clientController.finalizeCastingGroup
│           │            ├─ GET    /api/client/casting-orders ................ clientController.getAllCastingOrders (protected)
│           │            └─ GET    /api/client/casting-orders/:id ............ clientController.getCastingOrderById (protected)
│           │
│           └─[29]─🛣️ emailRoutes.js ........... Email endpoints
│                  │                             Dependencies: express.Router, emailController, auth middleware
│                  │                             Purpose: Email generation API routes
│                  │
│                  └─── Routes:
│                        ├─ POST   /api/email/generate ............ emailController.generateEmail (protected)
│                        └─ POST   /api/email/send ................ emailController.sendEmail (protected)
│
│
├─[30]─⚙️ server.js ................................ Express server entry point
│     │                                            Dependencies: express, cors, dotenv, all routes, models
│     │                                            Purpose: Initialize and start server
│     │
│     └─── Logic Flow:
│           ├─ [1] Load environment variables (dotenv.config())
│           ├─ [2] Initialize Express app
│           ├─ [3] Configure middleware
│           │      ├─ cors()
│           │      └─ express.json()
│           ├─ [4] Sync database (models.sequelize.sync())
│           ├─ [5] Mount routes
│           │      ├─ /api/admin → adminRoutes
│           │      ├─ /api/performers → performerRoutes
│           │      ├─ /api/client → clientRoutes
│           │      └─ /api/email → emailRoutes
│           └─ [6] Start server (app.listen(PORT))
│
│
├─[31]─📂 scripts/ ............................ Utility scripts
│     │
│     └─[32]─🔧 generatePerformers.js ......... Test data generator
│           │                                    Dependencies: models/Performer, faker-like logic
│           │                                    Purpose: Generate 10 random performers
│           │
│           └─── Process:
│                 ├─ Generates random names, birthdates
│                 ├─ Creates email, phone, physical attributes
│                 ├─ Fetches random images from randomuser.me API
│                 └─ Inserts 10 performers into database
│
│
│
└─[33]─📂 client/ ............................. Frontend React application
      │
      ├─[34]─📦 package.json .................... Frontend dependencies
      │     │                                      Dependencies: none
      │     │                                      Creates: React app foundation
      │     └─── Defines: react, react-router-dom, axios, vite
      │
      ├─[35]─⚙️ vite.config.js .................. Vite configuration
      │     │                                      Dependencies: @vitejs/plugin-react
      │     │                                      Purpose: Build configuration
      │     └─── Configures: React plugin, dev server
      │
      ├─[36]─⚙️ .env.example .................... Frontend env template
      │     │                                      Dependencies: none
      │     └─── Documents: VITE_API_URL
      │
      ├─[37]─📄 index.html ...................... HTML entry point
      │     │                                      Dependencies: none
      │     │                                      Purpose: Root HTML file
      │     └─── Imports: /src/main.jsx, Google Fonts (Orbitron, Inter)
      │
      │
      └─[38]─📂 src/ ............................ Frontend source
            │
            ├─[39]─📂 styles/ ................... Global styles
            │     │
            │     ├─[40]─🎨 index.css ........... CSS reset
            │     │     │                          Dependencies: none
            │     │     └─── Contains: Basic resets
            │     │
            │     └─[41]─🎨 lumos.css ........... Design system
            │           │                          Dependencies: none
            │           │                          Purpose: Design tokens, component styles
            │           │
            │           └─── Contains:
            │                 ├─ CSS Variables (colors, spacing, transitions)
            │                 ├─ Dark & Light theme tokens
            │                 ├─ Button styles (primary, secondary, normal, danger)
            │                 ├─ Card styles (default, clickable)
            │                 ├─ Form styles (input, textarea, select)
            │                 ├─ Animations (fadeIn, fadeInUp, pulse, shimmer)
            │                 ├─ Grid layouts (grid-2, grid-3, grid-4)
            │                 └─ Utility classes (text-gradient, glow, no-select)
            │
            │
            ├─[42]─🎨 App.css ..................... App-specific styles
            │     │                                  Dependencies: lumos.css
            │     │                                  Purpose: App-level component styles
            │     │
            │     └─── Contains:
            │           └─ .back-button (fixed position navigation)
            │
            │
            ├─[43]─📂 services/ ................... API communication
            │     │
            │     └─[44]─🌐 api.js ................ Axios API client
            │           │                            Dependencies: axios
            │           │                            Purpose: Centralized API calls
            │           │
            │           ├─── Setup:
            │           │     ├─ Create axios instance with baseURL
            │           │     ├─ Request interceptor (add JWT token)
            │           │     └─ Response interceptor (handle 401)
            │           │
            │           └─── API Methods:
            │                 ├─ authAPI
            │                 │   ├─ login(credentials)
            │                 │   └─ getProfile()
            │                 │
            │                 ├─ performerAPI
            │                 │   ├─ getAll()
            │                 │   ├─ search(params)
            │                 │   ├─ getById(id)
            │                 │   ├─ create(data)
            │                 │   ├─ update(id, data)
            │                 │   └─ delete(id)
            │                 │
            │                 ├─ clientAPI
            │                 │   ├─ generateLink(data)
            │                 │   ├─ validate(accessCode)
            │                 │   ├─ addToCastingGroup(data)
            │                 │   ├─ removeFromCastingGroup(data)
            │                 │   ├─ getCastingGroup(clientId)
            │                 │   ├─ finalizeCastingGroup(data)
            │                 │   ├─ getCastingOrders()
            │                 │   └─ getCastingOrderById(id)
            │                 │
            │                 └─ emailAPI
            │                     ├─ generate(data)
            │                     └─ send(data)
            │
            │
            ├─[45]─📂 contexts/ ................... Global state management
            │     │
            │     ├─[46]─⚛️ AuthContext.jsx ....... Authentication state
            │     │      │                           Dependencies: react, api.js
            │     │      │                           Purpose: Manage user session
            │     │      │
            │     │      ├─── State:
            │     │      │     ├─ user (admin object or null)
            │     │      │     └─ isAuthenticated (boolean)
            │     │      │
            │     │      ├─── Functions:
            │     │      │     ├─ login(username, password)
            │     │      │     │   ├─ Calls authAPI.login()
            │     │      │     │   ├─ Stores token in localStorage
            │     │      │     │   └─ Updates user state
            │     │      │     │
            │     │      │     ├─ logout()
            │     │      │     │   ├─ Removes token from localStorage
            │     │      │     │   └─ Clears user state
            │     │      │     │
            │     │      │     └─ checkAuth()
            │     │      │         ├─ Runs on mount
            │     │      │         ├─ Checks localStorage for token
            │     │      │         └─ Validates with authAPI.getProfile()
            │     │      │
            │     │      └─── Provides: { user, isAuthenticated, login, logout }
            │     │
            │     └─[47]─⚛️ ToastContext.jsx ...... Toast notifications
            │            │                           Dependencies: react, Toast component
            │            │                           Purpose: Global notification system
            │            │
            │            ├─── State:
            │            │     └─ toasts (array of toast objects)
            │            │
            │            ├─── Functions:
            │            │     ├─ showToast(message, type, options)
            │            │     │   ├─ Adds toast to array
            │            │     │   └─ Generates unique ID
            │            │     │
            │            │     ├─ showSuccess(message)
            │            │     │   └─ Shows green success toast
            │            │     │
            │            │     ├─ showError(message)
            │            │     │   └─ Shows red error toast
            │            │     │
            │            │     ├─ showDelete(message, undoAction)
            │            │     │   └─ Shows red delete toast with undo button
            │            │     │
            │            │     └─ removeToast(id)
            │            │         └─ Removes toast from array
            │            │
            │            └─── Provides: { showToast, showSuccess, showError, showDelete }
            │
            │
            ├─[48]─📂 components/ ................. Reusable UI components
            │     │
            │     ├─[49]─📂 common/ ............... Shared components
            │     │     │
            │     │     ├─[50]─⚛️ Toast.jsx ....... Toast notification component
            │     │     │      │                     Dependencies: react
            │     │     │      │                     Purpose: Display notifications
            │     │     │      │
            │     │     │      ├─── Props:
            │     │     │      │     ├─ message (string)
            │     │     │      │     ├─ type ('success' | 'error' | 'delete')
            │     │     │      │     ├─ onClose (function)
            │     │     │      │     ├─ duration (number, default 3000ms)
            │     │     │      │     ├─ undoAction (function, optional)
            │     │     │      │     └─ undoText (string, default 'Undo')
            │     │     │      │
            │     │     │      ├─── Behavior:
            │     │     │      │     ├─ Auto-dismiss after duration (if no undoAction)
            │     │     │      │     ├─ Manual close button
            │     │     │      │     ├─ Undo button (if undoAction provided)
            │     │     │      │     └─ Icon based on type (checkmark/error/trash)
            │     │     │      │
            │     │     │      └─── Styling:
            │     │     │            ├─ .toast-success (green gradient)
            │     │     │            ├─ .toast-error (red gradient)
            │     │     │            ├─ .toast-delete (dark red gradient)
            │     │     │            └─ slideDown animation
            │     │     │
            │     │     ├─[51]─🎨 Toast.css ........ Toast styles
            │     │     │      │                     Dependencies: lumos.css variables
            │     │     │      └─── Defines: Toast positioning, colors, animations
            │     │     │
            │     │     ├─[52]─⚛️ ConfirmModal.jsx  Confirmation dialog
            │     │     │      │                     Dependencies: react
            │     │     │      │                     Purpose: Confirm/cancel dialogs
            │     │     │      │
            │     │     │      ├─── Props:
            │     │     │      │     ├─ isOpen (boolean)
            │     │     │      │     ├─ title (string)
            │     │     │      │     ├─ message (string)
            │     │     │      │     ├─ confirmText (string, default 'Yes')
            │     │     │      │     ├─ cancelText (string, default 'No')
            │     │     │      │     ├─ onConfirm (function)
            │     │     │      │     ├─ onCancel (function)
            │     │     │      │     └─ danger (boolean, default false)
            │     │     │      │
            │     │     │      ├─── Behavior:
            │     │     │      │     ├─ Modal overlay (click to close)
            │     │     │      │     ├─ Warning icon
            │     │     │      │     ├─ Confirm/Cancel buttons
            │     │     │      │     └─ Danger styling for delete actions
            │     │     │      │
            │     │     │      └─── Styling:
            │     │     │            ├─ Centered modal
            │     │     │            ├─ Dark overlay (75% opacity)
            │     │     │            ├─ slideUp animation
            │     │     │            └─ Responsive (mobile adapts)
            │     │     │
            │     │     ├─[53]─🎨 ConfirmModal.css  Modal styles
            │     │     │      │                     Dependencies: lumos.css variables
            │     │     │      └─── Defines: Modal layout, overlay, animations
            │     │     │
            │     │     ├─[54]─⚛️ ImageUpload.jsx   Image upload widget
            │     │     │      │                     Dependencies: react, ToastContext
            │     │     │      │                     Purpose: Upload and manage images
            │     │     │      │
            │     │     │      ├─── Props:
            │     │     │      │     ├─ images (array of URLs)
            │     │     │      │     ├─ onImagesChange (function)
            │     │     │      │     └─ maxImages (number, default 10)
            │     │     │      │
            │     │     │      ├─── Features:
            │     │     │      │     ├─ Multiple image upload
            │     │     │      │     ├─ Preview with thumbnails
            │     │     │      │     ├─ Remove individual images
            │     │     │      │     ├─ Set profile image
            │     │     │      │     ├─ Validation (file type, size)
            │     │     │      │     └─ Base64 encoding
            │     │     │      │
            │     │     │      └─── Validation:
            │     │     │            ├─ Max 10 images
            │     │     │            ├─ Max 5MB per image
            │     │     │            └─ Only image files
            │     │     │
            │     │     ├─[55]─🎨 ImageUpload.css   Image upload styles
            │     │     │      │                     Dependencies: lumos.css variables
            │     │     │      └─── Defines: Upload area, preview grid, thumbnails
            │     │     │
            │     │     ├─[56]─⚛️ ProtectedRoute.jsx Route guard
            │     │     │      │                     Dependencies: react, react-router-dom, AuthContext
            │     │     │      │                     Purpose: Protect admin routes
            │     │     │      │
            │     │     │      ├─── Logic:
            │     │     │      │     ├─ Checks isAuthenticated from AuthContext
            │     │     │      │     ├─ If authenticated: render children
            │     │     │      │     └─ If not: redirect to /admin/login
            │     │     │      │
            │     │     │      └─── Usage:
            │     │     │            └─ Wraps admin routes in App.jsx
            │     │     │
            │     │     ├─[57]─⚛️ Navbar.jsx ....... Navigation bar
            │     │     │      │                     Dependencies: react, react-router-dom, AuthContext
            │     │     │      │                     Purpose: Main navigation
            │     │     │      │
            │     │     │      ├─── Features:
            │     │     │      │     ├─ Logo (links to home)
            │     │     │      │     ├─ Navigation links (Home, About, Contact)
            │     │     │      │     ├─ Admin link (if authenticated)
            │     │     │      │     ├─ Logout button (if authenticated)
            │     │     │      │     └─ Theme toggle (dark/light)
            │     │     │      │
            │     │     │      ├─── Behavior:
            │     │     │      │     ├─ Fixed to top
            │     │     │      │     ├─ Theme persists in localStorage
            │     │     │      │     ├─ Conditional rendering based on auth
            │     │     │      │     └─ Hover effects on links
            │     │     │      │
            │     │     │      └─── Styling:
            │     │     │            ├─ Backdrop blur
            │     │     │            ├─ Gradient underline on hover
            │     │     │            ├─ Theme toggle icon rotation
            │     │     │            └─ Responsive (adapts to mobile)
            │     │     │
            │     │     └─[58]─🎨 Navbar.css ....... Navigation styles
            │     │            │                     Dependencies: lumos.css variables
            │     │            └─── Defines: Navbar layout, links, theme toggle
            │     │
            │     │
            │     ├─[59]─📂 admin/ ................ Admin components
            │     │     │
            │     │     ├─[60]─⚛️ PerformerForm.jsx  Performer add/edit form
            │     │     │      │                      Dependencies: react, ImageUpload, ToastContext, performerAPI
            │     │     │      │                      Purpose: Create/update performers
            │     │     │      │
            │     │     │      ├─── Props:
            │     │     │      │     ├─ performer (object, null for create)
            │     │     │      │     ├─ onSubmit (function)
            │     │     │      │     └─ onCancel (function)
            │     │     │      │
            │     │     │      ├─── Form Fields:
            │     │     │      │     ├─ Personal: firstName, lastName, birthday, email, phone
            │     │     │      │     ├─ Physical: gender, height, hairColor, eyeColor, skinTone, faceShape
            │     │     │      │     ├─ Other: distinctiveMarks
            │     │     │      │     └─ Images: via ImageUpload component
            │     │     │      │
            │     │     │      ├─── Behavior:
            │     │     │      │     ├─ Controlled form (useState for formData)
            │     │     │      │     ├─ Pre-fills for edit mode
            │     │     │      │     ├─ Validation (required fields)
            │     │     │      │     ├─ Submit calls onSubmit prop
            │     │     │      │     └─ Cancel calls onCancel prop
            │     │     │      │
            │     │     │      └─── Styling:
            │     │     │            ├─ Two-column grid layout
            │     │     │            ├─ Form groups with labels
            │     │     │            └─ Action buttons at bottom
            │     │     │
            │     │     ├─[61]─🎨 PerformerForm.css  Form styles
            │     │     │      │                      Dependencies: lumos.css variables
            │     │     │      └─── Defines: Form layout, grid, buttons
            │     │     │
            │     │     ├─[62]─⚛️ PerformersList.jsx Performer list/modal (legacy)
            │     │     │      │                      Dependencies: react, PerformerForm, ConfirmModal, ToastContext, performerAPI
            │     │     │      │                      Purpose: Manage performers in modal (removed from dashboard)
            │     │     │      │
            │     │     │      └─── Note: This component was removed from dashboard but code remains
            │     │     │
            │     │     ├─[63]─🎨 PerformersList.css List styles
            │     │     │      └─── Defines: Modal list layout
            │     │     │
            │     │     ├─[64]─⚛️ ClientLinkGenerator.jsx Generate client links
            │     │     │      │                      Dependencies: react, ToastContext, clientAPI
            │     │     │      │                      Purpose: Create access links for clients
            │     │     │      │
            │     │     │      ├─── Form Fields:
            │     │     │      │     ├─ companyName
            │     │     │      │     └─ commercialDescription
            │     │     │      │
            │     │     │      ├─── Features:
            │     │     │      │     ├─ Generate unique access code
            │     │     │      │     ├─ Create client URL
            │     │     │      │     ├─ Copy to clipboard
            │     │     │      │     ├─ Show success toast
            │     │     │      │     └─ Display generated link
            │     │     │      │
            │     │     │      └─── Process:
            │     │     │            ├─ Submit form → clientAPI.generateLink()
            │     │     │            ├─ Receive: accessCode, URL
            │     │     │            ├─ Display link with copy button
            │     │     │            └─ Reset form after success
            │     │     │
            │     │     └─[65]─🎨 ClientLinkGenerator.css Generator styles
            │     │            │                      Dependencies: lumos.css variables
            │     │            └─── Defines: Form and link display layout
            │     │
            │     │
            │     └─[66]─📂 client/ ............... Client components
            │           │
            │           ├─[67]─⚛️ PerformerCard.jsx  Performer grid card
            │           │      │                      Dependencies: react
            │           │      │                      Purpose: Display performer in grid
            │           │      │
            │           │      ├─── Props:
            │           │      │     ├─ performer (object)
            │           │      │     ├─ isSelected (boolean)
            │           │      │     ├─ onToggleSelect (function)
            │           │      │     ├─ onViewDetails (function)
            │           │      │     └─ showSelectButton (boolean)
            │           │      │
            │           │      ├─── Display:
            │           │      │     ├─ Performer image (3:4 aspect ratio)
            │           │      │     ├─ Selected badge (if selected)
            │           │      │     ├─ Name, gender, age, height
            │           │      │     ├─ Hair color, eye color
            │           │      │     └─ Action buttons (View Details, Select/Remove)
            │           │      │
            │           │      ├─── States:
            │           │      │     ├─ Default: border with hover effect
            │           │      │     ├─ Selected: accent border with glow
            │           │      │     └─ Hover: lift up with shadow
            │           │      │
            │           │      └─── Animation:
            │           │            ├─ selectPulse on selection
            │           │            ├─ Image scale on hover
            │           │            └─ Smooth transitions (0.5s)
            │           │
            │           ├─[68]─🎨 PerformerCard.css  Card styles
            │           │      │                      Dependencies: lumos.css variables
            │           │      └─── Defines: Card layout, image, selected state, animations
            │           │
            │           ├─[69]─⚛️ PerformerModal.jsx  Performer detail modal
            │           │      │                      Dependencies: react
            │           │      │                      Purpose: Show full performer details
            │           │      │
            │           │      ├─── Props:
            │           │      │     ├─ performer (object)
            │           │      │     ├─ isSelected (boolean)
            │           │      │     ├─ onToggleSelect (function)
            │           │      │     ├─ onClose (function)
            │           │      │     └─ showSelectButton (boolean)
            │           │      │
            │           │      ├─── Display:
            │           │      │     ├─ Full-screen modal overlay
            │           │      │     ├─ Image gallery (all images)
            │           │      │     ├─ Full profile details
            │           │      │     ├─ Contact information
            │           │      │     └─ Select/Remove button
            │           │      │
            │           │      └─── Behavior:
            │           │            ├─ Click overlay to close
            │           │            ├─ Close button (X)
            │           │            └─ Prevent body scroll when open
            │           │
            │           └─[70]─🎨 PerformerModal.css  Modal styles
            │                  │                      Dependencies: lumos.css variables
            │                  └─── Defines: Modal overlay, content, gallery
            │
            │
            ├─[71]─📂 pages/ ...................... Page components
            │     │
            │     ├─[72]─📄 Home.jsx ............... Landing page
            │     │     │                            Dependencies: react
            │     │     │                            Purpose: Home/hero page
            │     │     │
            │     │     ├─── Content:
            │     │     │     ├─ Hero section
            │     │     │     ├─ LUMOS title
            │     │     │     ├─ Subtitle
            │     │     │     └─ CTA button
            │     │     │
            │     │     └─── Styling:
            │     │           ├─ Centered layout
            │     │           ├─ Gradient text
            │     │           └─ Animated entrance
            │     │
            │     ├─[73]─🎨 Home.css ............... Home page styles
            │     │     │                            Dependencies: lumos.css variables
            │     │     └─── Defines: Hero layout, title, animations
            │     │
            │     ├─[74]─📄 About.jsx .............. About page
            │     │     │                            Dependencies: react
            │     │     │                            Purpose: About/info page
            │     │     └─── Content: Company information
            │     │
            │     ├─[75]─📄 Contact.jsx ............ Contact page
            │     │     │                            Dependencies: react
            │     │     │                            Purpose: Contact form
            │     │     └─── Content: Contact form/info
            │     │
            │     │
            │     ├─[76]─📂 admin/ ................ Admin pages
            │     │     │
            │     │     ├─[77]─📄 Login.jsx ........ Admin login page
            │     │     │      │                     Dependencies: react, react-router-dom, AuthContext, authAPI
            │     │     │      │                     Purpose: Admin authentication
            │     │     │      │
            │     │     │      ├─── Form Fields:
            │     │     │      │     ├─ username
            │     │     │      │     └─ password
            │     │     │      │
            │     │     │      ├─── Logic:
            │     │     │      │     ├─ Submit → AuthContext.login()
            │     │     │      │     ├─ Success → redirect to /admin
            │     │     │      │     └─ Error → show error message
            │     │     │      │
            │     │     │      └─── Styling:
            │     │     │            ├─ Centered card
            │     │     │            ├─ Form layout
            │     │     │            └─ Error display
            │     │     │
            │     │     ├─[78]─🎨 Login.css ........ Login page styles
            │     │     │      │                     Dependencies: lumos.css variables
            │     │     │      └─── Defines: Login card, form layout
            │     │     │
            │     │     ├─[79]─📄 Dashboard.jsx .... Admin dashboard
            │     │     │      │                     Dependencies: react, react-router-dom, AuthContext
            │     │     │      │                     Purpose: Admin home/menu
            │     │     │      │
            │     │     │      ├─── Cards:
            │     │     │      │     ├─ Performers Gallery → /admin/performers
            │     │     │      │     ├─ Generate Client Link → modal
            │     │     │      │     ├─ Casting Orders → /admin/casting-orders
            │     │     │      │     ├─ Email Management → (future)
            │     │     │      │     └─ Preview Client View → /client
            │     │     │      │
            │     │     │      ├─── Features:
            │     │     │      │     ├─ Welcome message with username
            │     │     │      │     ├─ Grid of action cards
            │     │     │      │     ├─ Card icons and descriptions
            │     │     │      │     └─ Navigation on click
            │     │     │      │
            │     │     │      └─── Removed:
            │     │     │            └─ "Quick Manage Performers" (per user request)
            │     │     │
            │     │     ├─[80]─🎨 Dashboard.css .... Dashboard styles
            │     │     │      │                     Dependencies: lumos.css variables
            │     │     │      └─── Defines: Dashboard grid, cards
            │     │     │
            │     │     ├─[81]─📄 Performers.jsx ... Performer management page
            │     │     │      │                     Dependencies: react, react-router-dom, PerformerForm, ConfirmModal, ToastContext, performerAPI
            │     │     │      │                     Purpose: Main performer CRUD interface
            │     │     │      │
            │     │     │      ├─── State:
            │     │     │      │     ├─ performers[] (list)
            │     │     │      │     ├─ showForm (boolean)
            │     │     │      │     ├─ selectedPerformer (object or null)
            │     │     │      │     ├─ deleteConfirm (modal state with step)
            │     │     │      │     └─ deletedPerformer (for undo)
            │     │     │      │
            │     │     │      ├─── Features:
            │     │     │      │     ├─ Back button to dashboard
            │     │     │      │     ├─ Add Performer button
            │     │     │      │     ├─ Grid view of performers
            │     │     │      │     ├─ Edit performer (opens form)
            │     │     │      │     ├─ Delete performer (two-step confirmation)
            │     │     │      │     └─ Undo delete (via toast)
            │     │     │      │
            │     │     │      ├─── Delete Flow:
            │     │     │      │     ├─ [1] Click Delete
            │     │     │      │     ├─ [2] First confirmation: "Are you sure?"
            │     │     │      │     ├─ [3] Second confirmation: "This is permanent..."
            │     │     │      │     ├─ [4] Delete performer
            │     │     │      │     ├─ [5] Show red delete toast with Undo button
            │     │     │      │     └─ [6] If Undo clicked, restore performer
            │     │     │      │
            │     │     │      ├─── Views:
            │     │     │      │     ├─ Grid view (default)
            │     │     │      │     └─ Form view (add/edit)
            │     │     │      │
            │     │     │      └─── API Calls:
            │     │     │            ├─ fetchPerformers() → performerAPI.getAll()
            │     │     │            ├─ handleSubmit() → performerAPI.create() or update()
            │     │     │            ├─ handleDelete() → performerAPI.delete()
            │     │     │            └─ Undo → performerAPI.create() (restore)
            │     │     │
            │     │     ├─[82]─🎨 Performers.css ... Performers page styles
            │     │     │      │                     Dependencies: lumos.css variables
            │     │     │      └─── Defines: Grid layout, cards, header
            │     │     │
            │     │     ├─[83]─📄 CastingOrders.jsx  Casting orders list
            │     │     │      │                     Dependencies: react, react-router-dom, clientAPI
            │     │     │      │                     Purpose: View finalized orders
            │     │     │      │
            │     │     │      ├─── Features:
            │     │     │      │     ├─ Back button to dashboard
            │     │     │      │     ├─ Grid of order cards
            │     │     │      │     ├─ Each card shows:
            │     │     │      │     │   ├─ Company name
            │     │     │      │     │   ├─ Commercial description
            │     │     │      │     │   ├─ Performer count
            │     │     │      │     │   └─ Finalized date/time
            │     │     │      │     └─ Click to view details
            │     │     │      │
            │     │     │      ├─── Navigation:
            │     │     │      │     └─ Click card → /admin/casting-orders/:id
            │     │     │      │
            │     │     │      └─── API Call:
            │     │     │            └─ fetchOrders() → clientAPI.getCastingOrders()
            │     │     │
            │     │     ├─[84]─📄 CastingOrderDetail.jsx Order detail page
            │     │     │      │                     Dependencies: react, react-router-dom, clientAPI
            │     │     │      │                     Purpose: View single order details
            │     │     │      │
            │     │     │      ├─── Features:
            │     │     │      │     ├─ Back button to orders list
            │     │     │      │     ├─ Company name as title
            │     │     │      │     ├─ Finalized date/time
            │     │     │      │     ├─ Commercial description
            │     │     │      │     ├─ Selected performers count
            │     │     │      │     └─ Grid of selected performers
            │     │     │      │
            │     │     │      ├─── Performer Display:
            │     │     │      │     ├─ Image (3:4 aspect ratio)
            │     │     │      │     ├─ Full name
            │     │     │      │     ├─ Gender, age, height
            │     │     │      │     ├─ Hair color, eye color
            │     │     │      │     └─ Contact info (email, phone)
            │     │     │      │
            │     │     │      └─── API Call:
            │     │     │            └─ fetchOrderDetails() → clientAPI.getCastingOrderById(id)
            │     │     │
            │     │     └─[85]─🎨 CastingOrderDetail.css Detail page styles
            │     │            │                     Dependencies: lumos.css variables
            │     │            └─── Defines: Detail layout, performer grid
            │     │
            │     │
            │     └─[86]─📂 client/ ............... Client pages
            │           │
            │           └─[87]─📄 ClientPortal.jsx .. Client casting interface
            │                  │                      Dependencies: react, react-router-dom, PerformerCard, PerformerModal, ConfirmModal, ToastContext, performerAPI, clientAPI
            │                  │                      Purpose: Main client experience
            │                  │
            │                  ├─── URL Parameter:
            │                  │     └─ ?code=XXXXXXXX (access code)
            │                  │
            │                  ├─── State:
            │                  │     ├─ performers[] (all performers)
            │                  │     ├─ filteredPerformers[] (after filters)
            │                  │     ├─ castingGroup[] (selected performers)
            │                  │     ├─ selectedPerformer (for modal)
            │                  │     ├─ clientInfo (company data)
            │                  │     ├─ finalizeConfirm (modal state)
            │                  │     └─ filters (search, gender, age, height, hair, eyes)
            │                  │
            │                  ├─── Features:
            │                  │     ├─ Validate access code
            │                  │     ├─ Display client info (company, description)
            │                  │     ├─ Casting counter badge
            │                  │     ├─ Filter performers (search, attributes)
            │                  │     ├─ View performer grid
            │                  │     ├─ Select/deselect performers
            │                  │     ├─ Dynamic reordering (selected first)
            │                  │     ├─ View performer details (modal)
            │                  │     ├─ Finalize casting
            │                  │     └─ Results count
            │                  │
            │                  ├─── Filters:
            │                  │     ├─ Search by name
            │                  │     ├─ Gender (Male/Female)
            │                  │     ├─ Age range (min/max)
            │                  │     ├─ Hair color
            │                  │     ├─ Eye color
            │                  │     ├─ Height range (min/max)
            │                  │     └─ Clear filters button
            │                  │
            │                  ├─── Dynamic Reordering:
            │                  │     ├─ When performer is selected:
            │                  │     │   ├─ Moves to beginning of grid
            │                  │     │   ├─ Smooth transition (0.5s)
            │                  │     │   └─ selectPulse animation
            │                  │     │
            │                  │     └─ When deselected:
            │                  │         ├─ Returns to original position
            │                  │         └─ Smooth transition
            │                  │
            │                  ├─── API Calls:
            │                  │     ├─ validateAndLoadClient() → clientAPI.validate(code)
            │                  │     ├─ loadAllPerformers() → performerAPI.search({})
            │                  │     ├─ loadCastingGroup() → clientAPI.getCastingGroup(clientId)
            │                  │     ├─ handleToggleCastingGroup() → clientAPI.addToCastingGroup() or removeFromCastingGroup()
            │                  │     └─ confirmFinalize() → clientAPI.finalizeCastingGroup()
            │                  │
            │                  └─── Finalize Flow:
            │                        ├─ [1] Click "Finalize Casting" button
            │                        ├─ [2] Confirmation modal appears
            │                        ├─ [3] Confirm → create CastingOrder
            │                        ├─ [4] Show success toast
            │                        └─ [5] Order appears in admin panel
            │
            └─[88]─🎨 ClientPortal.css ............ Client portal styles
                   │                               Dependencies: lumos.css variables
                   └─── Defines: Portal layout, filters, grid, reordering animations
            │
            │
            ├─[89]─⚛️ App.jsx ........................ Application root
            │     │                                  Dependencies: react-router-dom, all pages, all contexts, Navbar, ProtectedRoute
            │     │                                  Purpose: Route definitions and provider setup
            │     │
            │     ├─── Provider Hierarchy (outer to inner):
            │     │     ├─ ToastProvider (outermost)
            │     │     │   └─ AuthProvider
            │     │     │       └─ Router
            │     │     │           └─ Navbar (on all routes)
            │     │     │               └─ Routes
            │     │     │
            │     │     └─── Why this order:
            │     │           ├─ ToastProvider first: Allows auth errors to show toasts
            │     │           └─ AuthProvider inside: Can use toast notifications
            │     │
            │     └─── Routes:
            │           ├─ Public Routes:
            │           │   ├─ / → Home
            │           │   ├─ /about → About
            │           │   ├─ /contact → Contact
            │           │   ├─ /admin/login → Login
            │           │   └─ /client → ClientPortal (with ?code param)
            │           │
            │           └─ Protected Routes (wrapped with ProtectedRoute):
            │               ├─ /admin → Dashboard
            │               ├─ /admin/performers → Performers
            │               ├─ /admin/casting-orders → CastingOrders
            │               └─ /admin/casting-orders/:id → CastingOrderDetail
            │
            │
            └─[90]─⚛️ main.jsx ........................ React entry point
                  │                                    Dependencies: react, react-dom, App
                  │                                    Purpose: Render app to DOM
                  │
                  └─── Logic:
                        ├─ Import global styles (index.css, lumos.css, App.css)
                        ├─ ReactDOM.createRoot(document.getElementById('root'))
                        └─ Render <App />


═══════════════════════════════════════════════════════════════════════════════

## CRITICAL DEPENDENCY CHAINS

### 1. Authentication Flow
```
Login.jsx
  └─→ AuthContext.login()
       └─→ api.js → authAPI.login()
            └─→ Backend: /api/admin/login
                 └─→ adminRoutes.js
                      └─→ adminController.login()
                           └─→ Admin.js (model)
                                └─→ database.js (connection)
```

### 2. Performer CRUD Flow
```
Performers.jsx
  └─→ PerformerForm.jsx
       └─→ ImageUpload.jsx
            └─→ ToastContext (for errors)
  └─→ handleSubmit()
       └─→ api.js → performerAPI.create/update()
            └─→ Backend: /api/performers
                 └─→ performerRoutes.js
                      └─→ auth.js (middleware)
                           └─→ performerController.create/update()
                                └─→ Performer.js (model)
                                     └─→ database.js (connection)
```

### 3. Client Casting Flow
```
ClientPortal.jsx
  └─→ Validate code
       └─→ api.js → clientAPI.validate(code)
            └─→ Backend: /api/client/validate/:code
                 └─→ clientRoutes.js
                      └─→ clientController.validateAccessCode()
                           └─→ Client.js (model)
  └─→ Select performer
       └─→ PerformerCard.jsx
            └─→ api.js → clientAPI.addToCastingGroup()
                 └─→ Backend: /api/client/casting-group/add
                      └─→ clientController.addToCastingGroup()
                           └─→ CastingGroup.js (model)
  └─→ Finalize
       └─→ api.js → clientAPI.finalizeCastingGroup()
            └─→ Backend: /api/client/casting-group/finalize
                 └─→ clientController.finalizeCastingGroup()
                      └─→ Creates CastingOrder.js (model)
                           └─→ Marks CastingGroup as finalized
```

### 4. Casting Order View Flow
```
CastingOrders.jsx
  └─→ api.js → clientAPI.getCastingOrders()
       └─→ Backend: /api/client/casting-orders
            └─→ clientRoutes.js
                 └─→ auth.js (middleware)
                      └─→ clientController.getAllCastingOrders()
                           └─→ CastingOrder.js (includes Client, CastingGroup)
  └─→ Click order
       └─→ Navigate to /admin/casting-orders/:id
            └─→ CastingOrderDetail.jsx
                 └─→ api.js → clientAPI.getCastingOrderById(id)
                      └─→ Backend: /api/client/casting-orders/:id
                           └─→ clientController.getCastingOrderById()
                                └─→ Returns full order with performers
```

### 5. Toast Notification Flow
```
Any Component
  └─→ useToast() hook
       └─→ ToastContext
            └─→ showSuccess/showError/showDelete()
                 └─→ Adds toast to array
                      └─→ Toast.jsx renders
                           ├─→ Auto-dismiss timer (if no undo)
                           ├─→ Manual close button
                           └─→ Undo button (if provided)
                                └─→ Calls undoAction()
                                     └─→ Component-specific restore logic
```

### 6. Delete with Undo Flow
```
Performers.jsx
  └─→ handleDelete(id)
       └─→ First ConfirmModal: "Are you sure?"
            └─→ handleFirstConfirm()
                 └─→ Second ConfirmModal: "This is permanent..."
                      └─→ handleFinalConfirm()
                           ├─→ Store performer in deletedPerformer state
                           ├─→ api.js → performerAPI.delete(id)
                           │    └─→ Backend deletes from database
                           ├─→ Remove from UI (optimistic update)
                           └─→ showDelete() with undoAction
                                └─→ Toast.jsx shows Undo button
                                     └─→ If clicked:
                                          └─→ api.js → performerAPI.create(deletedPerformer)
                                               └─→ Restores to database
                                               └─→ Shows success toast
```

═══════════════════════════════════════════════════════════════════════════════

## BUILD ORDER SUMMARY

**Phase 1: Foundation** (Files 1-4)
- package.json, .env files, .gitignore

**Phase 2: Database** (Files 5-15)
- Database config, all models, relationships

**Phase 3: Backend Services** (Files 16-19)
- AI service, authentication middleware

**Phase 4: Backend Logic** (Files 20-24)
- All controllers (admin, performer, client, email)

**Phase 5: Backend API** (Files 25-29)
- All route definitions

**Phase 6: Backend Server** (File 30)
- server.js (ties everything together)

**Phase 7: Backend Utilities** (Files 31-32)
- Scripts folder, data generator

**Phase 8: Frontend Foundation** (Files 33-44)
- Frontend package.json, config, styles, API service

**Phase 9: Frontend State** (Files 45-47)
- AuthContext, ToastContext

**Phase 10: Common Components** (Files 48-58)
- Toast, ConfirmModal, ImageUpload, ProtectedRoute, Navbar

**Phase 11: Domain Components** (Files 59-70)
- Admin components (PerformerForm, etc.)
- Client components (PerformerCard, PerformerModal)

**Phase 12: Pages** (Files 71-87)
- All pages (Home, About, Admin pages, Client portal)

**Phase 13: Frontend Root** (Files 88-90)
- App.jsx, main.jsx

═══════════════════════════════════════════════════════════════════════════════

## KEY FILES TO START READING

**Backend Understanding (5 files)**:
1. server.js [30] - Entry point, understand how everything connects
2. src/models/index.js [10] - Data relationships
3. src/routes/*.js [26-29] - API endpoints map
4. src/middleware/auth.js [19] - Security layer
5. src/controllers/clientController.js [23] - Core business logic

**Frontend Understanding (5 files)**:
1. client/src/App.jsx [89] - Routing and provider structure
2. client/src/services/api.js [44] - Backend communication
3. client/src/contexts/AuthContext.jsx [46] - Auth flow
4. client/src/pages/admin/Performers.jsx [81] - CRUD example
5. client/src/pages/client/ClientPortal.jsx [87] - Main client feature

═══════════════════════════════════════════════════════════════════════════════

Total Files: 90
Total Lines: 8,388
JS/JSX Lines: 4,138
Build Complexity: Medium-High
Estimated Build Time: 2-3 weeks (experienced developer)

═══════════════════════════════════════════════════════════════════════════════
