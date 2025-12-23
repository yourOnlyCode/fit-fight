# Quick Start Guide

## Immediate Setup (5 minutes)

### 1. Configure Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Go to **SQL Editor** and run both migration files:
   - Copy/paste `supabase/migrations/001_initial_schema.sql`
   - Copy/paste `supabase/migrations/002_seed_data.sql`
4. Go to **Settings > API** and copy:
   - Project URL
   - Anon/Public key

### 2. Configure Environment

```bash
# Create .env file
cp .env.example .env
```

Edit `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run the App

```bash
npm run ios
# or
npm run android
```

## Testing Without Full Setup

The app will work without HealthKit on simulator/web, but you'll need:
- A real iOS device for HealthKit testing
- Supabase configured for authentication

## Next Screen to Build

I recommend building in this order:

### 1. Auth Screen (30 min)
Create `src/screens/AuthScreen.tsx`:
- Email/password sign in
- Sign up flow
- OAuth buttons (can be placeholders)

### 2. Class Selection (45 min)
Create `src/screens/ClassSelectionScreen.tsx`:
- Show 4 classes with descriptions
- Display base stats
- Preview abilities
- Confirm selection

### 3. Character Creator (1 hour)
Create `src/screens/CharacterCreatorScreen.tsx`:
- Color pickers for skin/hair
- Style selectors
- Preview (can be simple for now, Rive later)
- Save to database

### 4. Battle Screen (2 hours)
Create `src/screens/BattleScreen.tsx`:
- Friend selector
- Battle invitation
- Race track UI
- Ability buttons
- Turn submission

## Quick Database Queries

### Create a test user (in Supabase SQL Editor):
```sql
-- First create auth user
INSERT INTO auth.users (id, email) 
VALUES ('test-user-id', 'test@example.com');

-- Then create profile
INSERT INTO users (id, email, username, class, level, xp, sweat_points)
VALUES ('test-user-id', 'test@example.com', 'TestUser', 'sprinter', 5, 1500, 500);

-- Create character
INSERT INTO characters (user_id, skin_color, hair_style, hair_color, outfit)
VALUES ('test-user-id', '#ffdbac', 'short', '#000000', 'default');
```

### Give yourself items:
```sql
INSERT INTO inventory (user_id, item_id, quantity, is_equipped)
SELECT 'test-user-id', id, 1, false
FROM items
LIMIT 5;
```

## Common Issues

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install
```

### "Supabase URL is undefined"
- Check `.env` file exists
- Restart Metro bundler: `npm start -- --reset-cache`

### HealthKit not working
- Must use real iOS device
- Request permissions in app
- Check iOS Settings > Privacy > Health

## Development Tips

1. **Use Supabase Studio** for quick database inspection
2. **Test on real device** for HealthKit features
3. **Use Expo Go** for quick iteration (some features limited)
4. **Check logs** with `npx react-native log-ios` or `log-android`

## File Structure Reference

```
src/
├── screens/          # Add new screens here
│   └── HomeScreen.tsx
├── components/       # Reusable UI components
├── services/         # API calls
│   ├── supabase.ts
│   └── health.ts
├── game/             # Game logic
│   └── battle-engine.ts
├── store/            # State management
│   └── userStore.ts
├── types/            # TypeScript types
├── utils/            # Helper functions
├── constants/        # Config & theme
└── navigation/       # Navigation setup
```

## Recommended VS Code Extensions

- ESLint
- Prettier
- React Native Tools
- TypeScript Hero

## Ready to Code!

Start with the Auth screen, then move to class selection. The foundation is solid, now it's time to build the UI! 🚀
