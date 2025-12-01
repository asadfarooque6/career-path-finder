# 🎯 CareerPath AI - Smart Skill & Career Recommender

A full-stack web application that provides intelligent career recommendations based on user skills or career goals. The system uses Firebase Firestore for data storage and OpenAI API for dynamic AI-powered recommendations.

## ✨ Features

- **Dual Input Mode**: 
  - Enter skills → Get matching career paths
  - Enter career goal → Get required skills and resources
  
- **Smart Matching**: Database-first approach with AI fallback
- **Comprehensive Data**: Pre-seeded with 15+ career roles
- **AI Integration**: OpenAI GPT-4 for dynamic recommendations
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js + Express.js
- **Database**: Firebase Firestore (via firebase-admin)
- **AI**: OpenAI API (GPT-4)
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- Firebase project with Firestore enabled
- Firebase service account key (JSON file)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable **Firestore Database** in the Firebase Console

2. **Get Service Account Key:**
   - In Firebase Console, go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file (e.g., `firebase-service-account.json`)
   - Place it in your project root directory

3. **Configure Environment Variables:**

Create a `.env` file in the root directory:

```env
PORT=3000
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
OPENAI_API_KEY=your_actual_openai_api_key_here
```

**Alternative**: Instead of using a file path, you can set the service account key as an environment variable:

```env
PORT=3000
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"..."}
OPENAI_API_KEY=your_actual_openai_api_key_here
```

**Important**: 
- Replace `your_actual_openai_api_key_here` with your actual OpenAI API key
- Make sure `firebase-service-account.json` is in your `.gitignore` file (never commit it!)

### 3. Seed the Database

Populate Firestore with initial career data:

```bash
npm run seed
```

You should see: `✅ Seeded 15 careers successfully!`

### 5. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
CareerPathAI/
├── backend/
│   ├── server.js              # Express server setup
│   ├── routes/
│   │   └── careerRoutes.js    # API route definitions
│   ├── controllers/
│   │   └── careerController.js # Business logic
│   ├── models/
│   │   └── Career.js          # MySQL model
│   ├── config/
│   │   └── database.js        # Firebase Admin SDK configuration
│   ├── utils/
│   │   └── aiHelper.js        # OpenAI integration
│   └── seed.js                # Database seeding script
├── frontend/
│   ├── index.html             # Main HTML file
│   ├── style.css              # Styling
│   └── script.js              # Frontend logic
├── .env                       # Environment variables
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔌 API Endpoints

### POST `/api/recommend`
Main recommendation endpoint. Accepts skills or career goals.

**Request:**
```json
{
  "input": "HTML, CSS, JavaScript"
}
```

**Response:**
```json
[
  {
    "role": "Front-End Developer",
    "required_skills": ["HTML", "CSS", "JavaScript", "Responsive Design"],
    "next_skills": ["React", "Vue.js", "TypeScript"],
    "resources": [
      {"title": "freeCodeCamp", "link": "https://www.freecodecamp.org"},
      {"title": "MDN Web Docs", "link": "https://developer.mozilla.org"}
    ],
    "source": "database"
  }
]
```

### GET `/api/careers`
Get all stored career roles from the database.

### POST `/api/careers/add`
Add a new career role to the database.

**Request:**
```json
{
  "role": "New Role",
  "required_skills": ["Skill1", "Skill2"],
  "next_skills": ["Advanced1", "Advanced2"],
  "resources": [
    {"title": "Resource Name", "link": "https://example.com"}
  ]
}
```

### POST `/api/ai/recommend`
Get AI-powered recommendations directly (bypasses database).

## 🎨 Usage Examples

### Example 1: Skills Input
**Input:** `"HTML, CSS, JavaScript"`

**Output:** Career paths like Front-End Developer, Full-Stack Developer with next skills and resources.

### Example 2: Career Goal Input
**Input:** `"Data Scientist"`

**Output:** Required skills (Python, Pandas, Statistics), next skills (ML, Deep Learning), and learning resources.

### Example 3: Unseen Skills
**Input:** `"Go, Docker, Kubernetes"`

**Output:** AI-generated recommendations for Cloud Engineer, DevOps Engineer, etc.

## 🔍 How It Works

1. **User Input** → Frontend sends input to backend
2. **Database Search** → Checks if input matches a career role
3. **Skill Matching** → If skills provided, finds careers with overlapping skills
4. **AI Fallback** → If no good match found, uses OpenAI API for dynamic recommendations
5. **Response** → Returns structured JSON with career paths, skills, and resources

## 🎯 Pre-seeded Careers

The database comes with 15 career roles:
- Front-End Developer
- Back-End Developer
- Full-Stack Developer
- Software Engineer
- DevOps Engineer
- Cloud Developer
- Data Scientist
- Data Engineer
- Machine Learning Engineer
- Cybersecurity Analyst
- Blockchain Developer
- Mobile App Developer
- Go Developer
- Rust Developer
- Game Developer

## 🐛 Troubleshooting

### Firebase Connection Error
- Ensure Firestore is enabled in your Firebase project
- Verify the service account key file path in `.env` is correct
- Check that the service account JSON file has proper permissions
- Make sure the service account has Firestore access enabled
- Verify your Firebase project ID matches the service account

### OpenAI API Error
- Verify your API key in `.env`
- Check your OpenAI account has credits
- The app will show a fallback message if API is unavailable

### Port Already in Use
- Change `PORT` in `.env` to a different number (e.g., 3001)
- Or stop the process using port 3000

## 📝 License

ISC

## 🤝 Contributing

Feel free to submit issues or pull requests!

---

**Built with ❤️ using Node.js, Express, Firebase Firestore, and OpenAI**


