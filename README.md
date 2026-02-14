# Storyboard Connect V2 - React TypeScript

A modern platform connecting storyboard artists with filmmakers, built with React, TypeScript, and Vite.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 📖 About

Storyboard Connect is a platform for connecting artists. You can upload projects along with a pitch deck if you need help with a project. Additionally as an artist you can upload your portfolio and look at existing projects to work on.

## 🛠️ Tech Stack

- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4 with custom cinema theme
- **HTTP Client**: Axios 1.7
- **State Management**: React Context + Hooks
- **Icons**: Font Awesome 6.0

## 📁 Project Structure

```
storyboardConnect/
├── public/images/              # Image assets
├── src/
│   ├── components/
│   │   ├── cards/             # ArtistCard, ProjectCard (reusable, data-driven)
│   │   ├── filters/           # Filter components
│   │   ├── layout/            # Navbar, Sidebar, Layout
│   │   ├── modals/            # Artist & Project detail modals
│   │   ├── pages/             # Landing, Grid, Community, News, Events
│   │   └── ui/                # Base UI components (Button, Badge, etc.)
│   ├── contexts/              # React Context providers
│   ├── hooks/                 # Custom hooks
│   ├── services/              # API service layer (Axios)
│   ├── types/                 # TypeScript interfaces
│   ├── utils/                 # Constants, mock data
│   └── styles/                # Tailwind CSS + custom styles
└── vite.config.ts
```

## 🔌 Backend Integration

The app is **ready for backend integration**. Currently using mock data for development.

### To Connect Your Backend:

1. **Set Backend URL** in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

2. **Disable Mock Data** in:
   - `src/services/artistService.ts` - Set `USE_MOCK_DATA = false`
   - `src/services/projectService.ts` - Set `USE_MOCK_DATA = false`

### Expected API Endpoints:

#### Artists
- `GET /api/artists` - List artists (supports filter query params)
- `GET /api/artists/:id` - Get artist by ID

#### Projects
- `GET /api/projects` - List projects (supports filter query params)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects/:id/apply` - Apply to project

See `src/types/` for complete TypeScript data models.

## 🎨 Key Features

- ✅ **Reusable Card Components** - ArtistCard and ProjectCard are data-driven blocks
- ✅ **Type-Safe** - Full TypeScript support with strict typing
- ✅ **Filter System** - Dynamic filters based on view mode
- ✅ **Modal System** - Artist profiles and project details
- ✅ **Context State Management** - App, Filter, and Modal contexts
- ✅ **API Service Layer** - Centralized Axios client with interceptors
- ✅ **Dark Cinema Theme** - Custom Tailwind theme with glass-morphism

## 📝 Adding Mock Data

Edit `src/utils/mockData.ts` to add test artists/projects:

```typescript
export const mockArtists: Artist[] = [
  {
    id: '2',
    name: 'New Artist',
    avatar: '/images/avatar.jpg',
    // ... see types/artist.types.ts for full structure
  }
];
```

## 🚀 Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📚 Documentation

- **Types**: See `src/types/` for all TypeScript interfaces
- **Components**: All components are in `src/components/` organized by category
- **API Services**: Backend integration logic in `src/services/`

---

**Built with** React + TypeScript + Vite • **Ready for** Backend Integration
