# HelpHunt - Domestic Workers Marketplace

A complete end-to-end web application for connecting domestic workers with employers. Built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

## Features

- **Phone OTP Authentication** - Secure login using Supabase Auth
- **Worker Registration** - Complete profile creation with verification documents
- **Employer Matching** - Smart algorithm to find the best workers
- **Admin Panel** - Manage verifications and profiles
- **Real-time Updates** - Live status updates and notifications
- **Mobile Responsive** - Works perfectly on all devices

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth with Phone OTP
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd helphunt
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Enable phone authentication in Authentication > Settings
4. Run the SQL scripts in the `supabase/` folder:

```sql
-- Run schema.sql first
-- Then run seed.sql for sample data
```

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_SECRET=your_admin_secret_key
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- **profiles** - Worker profiles with verification status
- **employer_requests** - Employer job requirements
- **hire_intents** - Contact/hire requests

See `supabase/schema.sql` for the complete schema.

## API Endpoints

- `POST /api/profile` - Create worker profile
- `GET /api/profile/[id]` - Get profile details
- `POST /api/employer-request` - Create employer request
- `GET /api/matching` - Get matching profiles
- `POST /api/hire-intent` - Create hire intent
- `GET /api/admin/profiles` - Get all profiles (admin)
- `POST /api/admin/update-profile` - Update profile status (admin)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ADMIN_SECRET`

## Project Structure

```
helphunt/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── hire/              # Employer request page
│   ├── register/          # Worker registration page
│   ├── results/           # Search results page
│   ├── profile/[id]/      # Profile detail page
│   ├── admin/             # Admin panel
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── CategoryCard.tsx
│   ├── ProfileCard.tsx
│   ├── ContactModal.tsx
│   └── OTPForm.tsx
├── lib/                   # Utilities and configurations
│   └── supabase.ts       # Supabase client and types
├── supabase/              # Database files
│   ├── schema.sql
│   └── seed.sql
└── public/                # Static assets
```

## Key Features Explained

### Phone OTP Authentication
- Uses Supabase Auth for secure phone verification
- OTP sent via SMS
- Session management across the app

### Worker Registration
- Multi-step form with file uploads
- Camera integration for selfie capture
- Audio recording for voice introduction
- Document verification (ID proof)

### Smart Matching Algorithm
- Matches by service type, location, and budget
- Considers skill level and availability
- Prioritizes verified and pro workers
- Real-time filtering and sorting

### Admin Panel
- Review and approve worker profiles
- View verification documents
- Manage pro status
- Bulk operations

## Security Notes

- All file uploads are stored securely in Supabase Storage
- Phone numbers are masked in public views
- Admin access is protected by environment variables
- No sensitive data is exposed in client-side code

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@helphunt.com or create an issue in the repository.

---

Built with ❤️ for connecting families with trusted domestic workers.