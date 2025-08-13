# Pokémon Vue 3 Web App

A beautiful, responsive web application built with Vue 3, Bootstrap 5.3, and Pinia for managing Pokémon data from the PokéAPI.

## 🚀 Features

- **Data Fetching**: Retrieves 100 Pokémon from PokéAPI
- **Beautiful Display**: Card-based grid layout with Pokémon images and info
- **Search & Filter**: Real-time search functionality
- **Detailed View**: Dedicated pages for each Pokémon with comprehensive details
- **Responsive Design**: Mobile-first approach, works on all devices
- **Loading States**: Elegant loaders for better UX
- **State Management**: Pinia store for global state management
- **Edit Functionality**: Edit Pokémon information with persistent storage

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **JavaScript** - No TypeScript required
- **Bootstrap 5.3.x** - CSS framework for responsive design
- **Pinia** - State management for Vue
- **Vue Router** - Client-side routing

## 📁 Project Structure

```
pokemon-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── PokemonCard.vue
│   │   ├── SearchBar.vue
│   │   └── LoadingSpinner.vue
│   ├── views/
│   │   ├── HomeView.vue
│   │   └── PokemonDetailView.vue
│   ├── stores/
│   │   └── pokemonStore.js
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd pokemon-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📱 Responsive Design

The application is built with a mobile-first approach and is fully responsive across:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1200px+)

## 🎯 API Usage

This app uses the [PokéAPI](https://pokeapi.co/) with the following endpoints:
- `https://pokeapi.co/api/v2/pokemon?limit=100` - List of 100 Pokémon
- `https://pokeapi.co/api/v2/pokemon/{id}` - Detailed Pokémon information

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🌐 Deployment

### Azure Static Web Apps

1. Build the project:
```bash
npm run build
```

2. The `dist` folder contains the production build ready for deployment

3. Deploy to Azure Static Web Apps following their documentation

### Alternative Deployment Options

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Use GitHub Actions for automatic deployment

## 🎨 Features Implemented

### ✅ Core Requirements
-  Vue 3 with JavaScript
-  Bootstrap 5.3.x for styling
-  Pinia for state management
-  Fetch 100 Pokémon from PokéAPI
-  Beautiful card-based display
-  Search/filter functionality
-  Detailed Pokémon pages
-  Responsive design
-  Loading indicators
-  Edit functionality with state persistence

### 🎯 Additional Features
- Smooth animations and transitions
- Error handling for API calls
- Pokémon type badges with colors
- Stats visualization
- Image fallbacks
- Accessible design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ for the JAZRO Frontend Coding Challenge**