# CotNeo - Personal Portfolio Website

This is my personal portfolio website built with modern web technologies. The project showcases my skills, projects, and experience in web development.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber
- **UI/UX**: Modern design with smooth animations and responsive layout
- **Performance**: Optimized with next/font and sharp for image processing
- **AI Integration**: OpenAI GPT-3.5 Turbo for chatbot
- **Caching**: Vercel KV for rate limiting and response caching
- **Analytics**: Custom visitor tracking system

## Features

- 🎨 Modern and minimalist design
- 🌟 Interactive 3D background
- 💼 Project showcase
- 🛠️ Tech stack display
- 💬 AI-powered chatbot with natural conversation
- 📱 Fully responsive layout
- 📊 Real-time visitor analytics
- 🔒 Cookie consent management
- ⚡ Performance optimized
- 🔄 Rate limiting and caching

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, create a `.env` file with the following variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Vercel KV Configuration
KV_REST_API_URL=https://your-kv-rest-api-url.vercel.app
KV_REST_API_TOKEN=your_kv_rest_api_token_here
KV_REST_API_READ_ONLY_TOKEN=your_kv_rest_api_read_only_token_here
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
cotneo/
├── src/
│   ├── app/                # Next.js app router
│   │   ├── api/           # API routes
│   │   │   ├── chat/      # Chatbot API
│   │   │   └── visitors/  # Visitor tracking API
│   │   └── page.tsx       # Main page
│   ├── components/        # React components
│   │   ├── ChatBot/      # AI Chatbot component
│   │   ├── VisitorCounter/ # Visitor tracking
│   │   └── ...           # Other components
│   └── styles/           # Global styles
├── public/               # Static assets
└── package.json         # Dependencies and scripts
```

## API Endpoints

### Chat API
- **Endpoint**: `/api/chat`
- **Method**: POST
- **Body**: `{ message: string }`
- **Features**: 
  - Rate limiting (100 requests/hour)
  - Response caching
  - Fallback responses
  - Natural conversation flow

### Visitor API
- **Endpoint**: `/api/visitors`
- **Method**: GET
- **Features**:
  - Real-time visitor tracking
  - Cookie-based consent management
  - Analytics data collection

## Deployment

The site is deployed on Vercel. Every push to the main branch triggers an automatic deployment.

### Environment Setup
1. Add required environment variables in Vercel dashboard
2. Configure KV database
3. Set up OpenAI API key

## Performance Optimization

- Image optimization with next/image
- Font optimization with next/font
- Code splitting and lazy loading
- Caching strategies
- Rate limiting implementation

## Contact

- Website: [cotneo.com](https://cotneo.com)
- GitHub: [@cotneo](https://github.com/cotneo)

## License

This project is licensed under the MIT License.
