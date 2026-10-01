# Commit Battle Analyzer

An interactive, retro synthwave arcade web application that lets two developers pit their GitHub profiles against each other in a head-to-head "versus" showdown!

![Commit Battle Arcade](https://img.shields.io/badge/Style-Retro%20Synthwave-ff69b4?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?style=for-the-badge&logo=tailwind-css)
![Lucide Icons](https://img.shields.io/badge/Icons-Lucide-f59e0b?style=for-the-badge)

---

## Features

- **Arcade Fighter Cards:** Retro arcade-styled character cards featuring avatar portraits, power ratings, and achievement badges.
- **Dynamic Power Rating Algorithm:** Computes an overall power score index based on weighted commit metrics, streaks, night owl percentage, and repository activity.
- **Night Owl Index:** Calculates late-night coding habits (commits made between 10 PM – 4 AM).
- **Head-to-Head Visual Breakdown:** Side-by-side animated stat comparison bars highlighting the leader in each category.
- **Web Audio API Sound Effects:** Synthesizer-based arcade audio feedback for fight triggers, button clicks, and victory announcements.
- **GitHub REST API Integration:** Fetches real profile info, repositories, and follower stats, with fallback mock generator algorithms for offline/unauthenticated testing.
- **Featured Matchups:** One-click preset battles (e.g., Linus Torvalds vs. Dan Abramov, Evan You vs. Rich Harris).

---

## Quick Start

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v16 or higher).

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mryeminaung/commit-battle-analyzer.git
   cd commit-battle-analyzer
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000` (or the URL printed in your terminal).

---

## Tech Stack

- **Frontend Framework:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icon Library:** [Lucide React](https://lucide.dev/)
- **Audio:** Web Audio API (native browser synthesizer)
- **API Source:** [GitHub REST API](https://docs.github.com/en/rest)

---

## Achievement Badges Matrix

| Badge                | Criteria                                           |
| :------------------- | :------------------------------------------------- |
| **Night Owl Master** | 70%+ commits made between 10 PM and 4 AM           |
| **Streak Legend**    | Active contribution streak of 50+ consecutive days |
| **Velocity Demon**   | High weekly commit velocity score                  |
| **Repo Warlord**     | 50+ public repositories in portfolio               |
| **S-Rank Fighter**   | Overall power score rating of 90 or higher         |

---

## Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check out the issues page or submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).
