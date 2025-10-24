# 🎬 Casting Management Platform — Full Specification

## 🧩 Overview

This project is a **Casting Management Web Platform** for a company that manages **commercial performers (actors/models)**.  
It is built with an **MVC architecture** using **Express.js**, **PostgreSQL**, and a modern **frontend framework** (React preferred for interactivity).

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (with TailwindCSS for styling) |
| **Backend** | Node.js + Express.js (MVC architecture) |
| **Database** | PostgreSQL |
| **ORM** | Sequelize or Prisma |
| **Authentication** | JWT or encrypted URL tokens |
| **Email Service** | Nodemailer + Claude AI (Anthropic) API integration |
| **Deployment** | Vercel / Render / Railway |
| **Environment Variables** | Managed via `.env` |

---

## 🧍 Performer Entity

Each performer represents a person available for commercial roles.

### Performer Attributes

| Field | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier |
| `firstName` | String | Performer’s first name |
| `lastName` | String | Performer’s last name |
| `birthday` | Date | Birth date |
| `email` | String | Contact email |
| `phone` | String | Phone number |
| `gender` | String | Male / Female / Other |
| `height` | Number | Height in cm |
| `hairColor` | String | e.g. Blonde, Brown, Black |
| `eyeColor` | String | Eye color |
| `skinTone` | String | Light, Tan, Dark, etc. |
| `faceShape` | String | Oval, Round, Square, etc. |
| `distinctiveMarks` | String | Tattoos, scars, freckles |
| `images` | Array of 9 image URLs | Performer’s portfolio images |
| `createdAt` | Date | Auto timestamp |
| `updatedAt` | Date | Auto timestamp |

---

## 🧮 Database Models

- **Performer**
- **CastingGroup**
- **CastingOrder**
- **Admin**
- **Client**

**CastingGroup** holds selected performers for a specific client session.  
**CastingOrder** stores finalized casting group details and associated metadata.

---

## 🧰 Core Functionalities

### 🧍‍♂️ Performers Management (Admin Panel)
- Add new performer
- Update existing performer details
- Delete performer with 3-step confirmation flow:
  1. Press "Delete"
  2. Confirm "Are you sure?"
  3. Type "YES" to finalize deletion

---

### 🧑‍💼 Client View
- View performers in a **grid layout** (similar to an e-commerce product grid)
- Filter by:
  - Gender
  - Age range
  - Hair color
  - Height range
  - Eye color
  - Keywords (facial features, marks, etc.)
- Search bar for performer names
- Select performers → Add to **Casting Group**
- Finalize group → Creates a `CastingOrder` in database

---

### 🧑‍💻 Admin Features

#### Performer CRUD
- Add / Edit / Delete performers
- Bulk import/export via CSV (optional)

#### Casting Orders View
- View finalized casting groups in a dashboard table
- Sort and filter by company, client, or date

#### Generate Client Link
- Admin inputs:
  - Company name
  - Commercial description
- On "Generate", a **unique URL** is created (valid for 24h).

##### 🔐 URL Security Options:
1. **Encrypted Parameters (JWT)**:  
   Encode company name, expiration time, and session ID.
2. **Auth Code Method**:  
   Generate a random unique access code stored in DB, valid for 24h.  
   URL example:  
   ```
   https://casting-platform.com/client?accessCode=XYZ123
   ```

---

### 🤖 AI Email Assistant (Admin Side)
- When a client finalizes a casting order:
  - Admin can review description text from the client.
  - Admin presses **"Generate Email"** → Calls **OpenAI API** to draft an email.
  - Email includes personalized variables (e.g., performer’s name).
  - Email is displayed in a text area for review.
  - Admin can **edit before sending**.
  - On confirmation, email is sent via **Nodemailer**.

---

## 🧱 Suggested Directory Structure

```
project-root/
├── src/
│   ├── controllers/
│   │   ├── performerController.js
│   │   ├── adminController.js
│   │   ├── clientController.js
│   ├── models/
│   │   ├── Performer.js
│   │   ├── CastingGroup.js
│   │   ├── CastingOrder.js
│   │   ├── Admin.js
│   │   ├── Client.js
│   ├── routes/
│   │   ├── performerRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── clientRoutes.js
│   ├── views/
│   │   ├── admin/
│   │   ├── client/
│   │   ├── partials/
│   ├── services/
│   │   ├── emailService.js
│   │   ├── aiService.js
│   ├── config/
│   │   ├── db.js
│   │   ├── aiClient.js
│   ├── public/
│   │   ├── css/
│   │   ├── js/
│   │   ├── images/
│   ├── app.js
│   ├── server.js
├── .env
├── package.json
├── README.md
```

---

## 🔐 Example `.env` File

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/castingdb
JWT_SECRET=your_jwt_secret_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourpassword
BASE_URL=https://casting-platform.com
```

---

## 🪄 Example Flow

1. Admin logs into dashboard.  
2. Adds performers and uploads 9 images each.  
3. Generates a client link with company info and description.  
4. Client opens the link, browses performers, adds them to a casting group.  
5. Client finalizes selection → Stored as `CastingOrder`.  
6. Admin views CastingOrder in dashboard.  
7. Admin uses AI assistant to generate personalized emails for each performer.  
8. Admin reviews → edits → sends emails.

---

## 🚀 Suggested Enhancements
- Add image optimization and lazy loading for faster grids.
- Add pagination and infinite scroll for large performer databases.
- Enable casting group sharing or multi-user selection.
- Add analytics dashboard for admin (view most-selected performers, client activity).

---

## ✅ Deliverables for Claude AI

Claude should generate:
- Backend models, routes, controllers (Express + PostgreSQL)
- React frontend (Admin + Client)
- Email service integration (Nodemailer)
- AI integration using OpenAI API
- Secure URL system for 24h client links
- MVC structure and RESTful endpoints
- Configurable `.env` usage

