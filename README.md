# Portfolio AI Assistant 🤖

An interactive portfolio assistant featuring text and voice interactions, combining a retro-styled UI with advanced AI capabilities. Built with Next.js, TypeScript, and modern animation libraries.

is continue building....

## Live Demo 🌐

- **Production**: [https://anuidev.vercel.app/](https://anuidev.vercel.app/)
- **Development**: [http://localhost:3000](http://localhost:3000)

## 🚀 Features

### Core Features
- Text & Voice chat modes with seamless switching
- AI-powered voice responses via ElevenLabs
- Real-time chat functionality
- Modern animations with Framer Motion
- Responsive design (mobile & desktop)
- Retro-styled UI with modern touches

### Technical Features
- Text-to-Speech using ElevenLabs API
- Real-time audio visualization
- TypeScript for type safety
- Efficient state management
- Smooth transitions and animations

## 🛠️ Tech Stack

- **Frontend:**
  - Next.js 13 (App Router)
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Lucide Icons

- **APIs:**
  - ElevenLabs API


```bash
📁 Project Structure

portfolio-assistant/
├── components/
│   ├── assistant/
│   │   ├── ChatInterface.tsx    # Main chat component
│   │   └── AudioResponse.tsx    # Voice interface component
│   └── floatingAssistant/
│       └── FloatingAssistant.tsx
├── pages/
│   └── _app.tsx
└── styles/
    └── globals.css

```
💻 Usage
Text Mode

Click the floating assistant button
Select text mode
Type your question in the input field
Press Enter or click Send
View message history in chat format

Voice Mode

Click the floating assistant button
Select voice mode
Click the microphone icon
Speak your question
Receive audio responses with visual feedback

## 📦 Installation & Setup

1. **Clone the repository**
```bash
git clone hhttps://github.com/anuidev8/AI-DevPortfolio-Showcase-with-Chatbot
cd portfolio-assistant 

```
2. **Install Dependencies**
 ```bash
npm install
# or using yarn
yarn install

```

3. **Environment Configuration Create a .env.local file in the root directory:**
 ```bash
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key_here

```

4. **Available Scripts Development server:**
 ```bash
npm run dev
# or
yarn dev

```

Verifying Installation

The development server will start at http://localhost:3000
You should see the portfolio assistant interface
Test the chat functionality
Verify voice interactions if using ElevenLabs API

Troubleshooting Installation

If you encounter issues:
Node Modules Issues

 ```bash
rm -rf node_modules
rm package-lock.json
npm install

```

Environment Variables

Double-check .env.local is in the root directory
Verify API key format
Restart development server after changes

📝 Additional Notes

Uses ElevenLabs for high-quality voice synthesis
State is managed locally with useState
All animations implemented using Framer Motion
TypeScript ensures type safety throughout
Mobile-first responsive design

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
📞 Contact
Name - @anuidev8
Project Link: https://github.com/anuidev8/AI-DevPortfolio-Showcase-with-Chatbot
Prerequisites
Before you begin, ensure you have:

Node.js (v16 or higher)
npm or yarn
An ElevenLabs API key