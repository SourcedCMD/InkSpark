# NoteFlow - Personal Notepad Web Application

A modern, feature-rich notepad web application inspired by Hyper Notepad. Create, edit, and share your notes with ease.

## Features

- 🔐 User Authentication (Supabase)
- 📝 Rich Text Editor with formatting tools
- 💾 Auto-save functionality
- 🔗 Share notes with unique links (editable/read-only)
- 📥 Download notes as text files
- 🖨️ Print notes
- 🎨 Multiple themes (Light/Dark)
- 📱 Responsive design
- ☁️ Cloud storage with Supabase
- 🔒 Secure and encrypted data storage

## Tech Stack

- React 18
- Vite
- React Router
- Supabase (Authentication & Database)
- React Quill (Rich Text Editor)
- Tailwind CSS
- Lucide React (Icons)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:
```bash
npm run dev
```

## Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL script in `supabase-setup.sql` in the Supabase SQL Editor:
   - This will create the `notes` table
   - Set up Row Level Security (RLS) policies
   - Create necessary indexes and triggers

For detailed setup instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for a comprehensive deployment guide.

### Quick Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

## License

MIT

