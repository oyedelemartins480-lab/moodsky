# 🌤️ MoodSky — Weather with a little feeling

**Live demo:** [moodsky-bay.vercel.app](https://moodsky-bay.vercel.app/)

MoodSky is a colorful, playful weather app with a twist: instead of a generic icon, the weather is shown through a big expressive cloud character whose face and mood change based on the forecast — sunglasses when it's sunny, sleepy eyes when it's cloudy, and more. Swipe through the week ahead on the date strip to see how the cloud's mood shifts day to day.

## ✨ Features

- **Mood-driven hero cloud** — a large animated cloud character with a face that reflects the current weather condition
- **Written forecast summaries** — plain-language, friendly descriptions of the day's weather (not just numbers)
- **7-day forecast strip** — swipeable/scrollable date cards, each with its own mini mood-cloud and high/low temps
- **City search** — look up weather for any city
- **Timezone selector** — check conditions across different timezones (Lagos, New York, London, Tokyo)
- **At-a-glance stats** — wind, humidity, and sunset time
- **Playful, colorful UI** — pastel-to-vibrant gradients, rounded cards, and soft shadows throughout

## 🛠️ Built with

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- Weather data via [OpenWeatherMap API](https://openweathermap.org/api)
- Deployed on [Vercel](https://vercel.com/)

## 🚀 Getting started

Clone the repo and install dependencies:

\`\`\`bash
git clone <your-repo-url>
cd moodsky
npm install
\`\`\`

Add your API key in a `.env.local` file:

\`\`\`bash
OPENWEATHERMAP_API_KEY=your_key_here
\`\`\`

Run the dev server:

\`\`\`bash
npm run dev
\`\`\`

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📌 Roadmap

- [ ] Auto-detect user location on load (browser Geolocation API)
- [ ] More weather-mood expressions (fog, storms, snow)
- [ ] Dark mode
- [ ] Hourly forecast view

## 🙋 Author

Built by Martins.

## 📄 License

MIT
