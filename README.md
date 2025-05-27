# 🌙 DreamForge

**DreamForge** is a creative web app that interprets dreams using advanced language models through the Sonar API. It provides psychological, spiritual, historical, and rational insights, along with unique symbolic creatures and dream rituals based on user input.

> 🔗 Live demo: [https://dream-production-0355.up.railway.app/](https://dream-production-0355.up.railway.app/)

---

## 🚀 Features

- 🧠 Psychological analysis (Freudian, Jungian, etc.)
- ✨ Spiritual or symbolic interpretation
- 🧾 Rational explanations
- 🕰️ Historical interpretations (Ancient Egypt, Native American, etc.)
- 👁️‍🗨️ Generated symbolic dream creatures
- 🕯️ Suggested dream rituals with meaning
- ⚙️ Fallback demo mode for testing without API key

---

## 🛠️ Built With

- **React + Vite**
- **TypeScript**
- **TailwindCSS**
- **Sonar API** (for dream analysis via LLM)

---

## 📦 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/mlndiaye/dreamforge.git
cd dreamforge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create a `.env` file at the root of the project and add the following:

```env
# Required: Your Sonar API key and endpoint
VITE_SONAR_API_KEY=your_sonar_api_key_here
VITE_SONAR_API_URL=https://api.sonar.perplexity.ai/v1alpha/chat/completions
```

> If no API key is provided, the app will fall back to **demo mode** using static responses.

---

### 4. Run the Development Server

```bash
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🧪 Try It Live

You can access the hosted demo here:

👉 [https://dream-production-0355.up.railway.app/](https://dream-production-0355.up.railway.app/)

---

## 🏗 Build for Production

```bash
npm run build
```

To preview the build:

```bash
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/           # UI components (form, result display, etc.)
├── services/
│   └── dreamService.ts   # Logic to handle API call or fallback demo
├── assets/               # Images and icons
└── App.tsx               # Main app
```

---

## 👀 Demo Mode

If no API key is provided, the app uses static JSON responses based on keyword detection from the dream (e.g. water, flying, animals). This helps during testing or showcasing the app without LLM calls.

---

## ✨ Contributing

Pull requests are welcome. For major changes, please open an issue first.

---


## 🧠 Authors

- Mouhamadou Lamine NDIAYE
- Mouhamadou Diouf Cissé
- Abdoulkarim LY
- Created for the **Perplexity Hackathon 2025**
