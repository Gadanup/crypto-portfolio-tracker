# React Portfolio Coding Standards & Best Practices

## Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [TypeScript Standards](#typescript-standards)
- [React Patterns](#react-patterns)
- [Styling & Theme](#styling--theme)
- [Data Fetching & State Management](#data-fetching--state-management)
- [API & Endpoints](#api--endpoints)
- [Code Quality](#code-quality)
- [Import Organization](#import-organization)
- [Testing](#testing)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Git & Version Control](#git--version-control)
- [Deployment](#deployment)

---

## Technology Stack

| Category | Tool | Notes |
|----------|------|-------|
| Framework | React 18+ | With TypeScript |
| Routing | React Router v6+ | File-based or config-based |
| Data Fetching | TanStack Query (React Query) | All async data |
| Forms | React Hook Form + Zod | Validation schemas |
| Styling | Tailwind CSS or MUI | Pick one per project, be consistent |
| Backend | Supabase / Free APIs | Auth, DB, storage via Supabase |
| Build Tool | Vite | Fast dev server and builds |
| Package Manager | pnpm | Faster, disk efficient |
| Linting | ESLint + Prettier | Enforce standards automatically |

---

## Project Structure

```
src/
├── api/
│   ├── endpoints/          # All API endpoint definitions
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   └── index.ts        # Re-export all endpoints
│   ├── hooks/              # TanStack Query hooks
│   │   ├── useUsers.ts
│   │   └── useAuth.ts
│   └── client.ts           # API client setup (Supabase or fetch wrapper)
├── components/
│   ├── ui/                 # Reusable/shared UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── index.ts        # Barrel export
│   └── layout/             # Layout components (Header, Sidebar, etc.)
├── features/               # Feature-based modules
│   ├── dashboard/
│   │   ├── components/     # Feature-specific components
│   │   ├── hooks/          # Feature-specific hooks
│   │   ├── types/          # Feature-specific types
│   │   └── index.ts
│   └── auth/
├── helpers/
│   ├── constants/          # Enums, constants, UI text
│   │   ├── textContent.ts  # All UI strings
│   │   ├── routes.ts       # Route path constants
│   │   └── index.ts
│   └── utils/              # Pure utility functions
├── hooks/                  # Global shared hooks
├── types/                  # Global shared types/interfaces
│   ├── api.types.ts
│   ├── common.types.ts
│   └── index.ts
├── styles/                 # Global styles, theme config
├── App.tsx
└── main.tsx
```

### Key Principles

- **Feature-based organization**: Group related code by feature, not by type
- **Barrel exports**: Every folder has an `index.ts` that re-exports its public API
- **Colocation**: Keep tests, types, and hooks close to where they're used
- **Separation of concerns**: API logic, business logic, and UI logic in different layers

---

## TypeScript Standards

### No `any` Types — Ever

```tsx
// ❌ BAD
const handleData = (data: any) => { ... }

// ✅ GOOD
interface UserData {
  userId: string;
  email: string;
  displayName: string;
}
const handleData = (data: UserData) => { ... }
```

### Types Live in Dedicated Files

```tsx
// ❌ BAD — type defined inside a hook or component
const useUsers = () => {
  interface User { name: string; }  // Don't do this
}

// ✅ GOOD — types in a separate file
// types/user.types.ts
export interface User {
  userId: string;
  email: string;
  displayName: string;
  createdAt: string;
}

// hooks/useUsers.ts
import { User } from '@/types/user.types';
```

### Prefer `interface` for Objects, `type` for Unions/Intersections

```tsx
// Objects → interface (extendable)
interface ButtonProps {
  variant: ButtonVariant;
  label: string;
  onClick: () => void;
}

// Unions/Computed → type
type ButtonVariant = 'primary' | 'secondary' | 'danger';
type AsyncState = 'idle' | 'loading' | 'success' | 'error';
```

### Utility Patterns

```tsx
// Generic API response wrapper
interface ApiResponse<TData> {
  data: TData;
  status: number;
  message: string;
}

// Component props with children
interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

// Discriminated unions for state
type RequestState<TData> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TData }
  | { status: 'error'; error: Error };
```

---

## React Patterns

### Functional Components Only

```tsx
// ✅ Always use arrow function components with explicit return types
const UserCard = ({ user, onSelect }: UserCardProps): React.JSX.Element => {
  return (
    <div>
      <h3>{user.displayName}</h3>
    </div>
  );
};

export default UserCard;
```

### Custom Hooks — Extract Logic Out of Components

```tsx
// ✅ Keep components thin, move logic to hooks
const useFilteredUsers = (searchTerm: string) => {
  const { data: users, isLoading } = useUsers();

  const filteredUsers = useMemo(() => {
    if (!users || !searchTerm) return users ?? [];
    return users.filter((user) =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return { filteredUsers, isLoading };
};
```

### Composition Over Configuration

```tsx
// ❌ BAD — prop-heavy, hard to extend
<Card
  title="User"
  subtitle="Details"
  showAvatar
  avatarSize="lg"
  showBadge
  badgeColor="green"
/>

// ✅ GOOD — composable, flexible
<Card>
  <Card.Header>
    <Avatar size="lg" />
    <Card.Title>User</Card.Title>
    <Badge color="green" />
  </Card.Header>
  <Card.Body>Details</Card.Body>
</Card>
```

### Memoization — Use Intentionally, Not Everywhere

```tsx
// Only memoize when:
// 1. Expensive computations
const sortedData = useMemo(() =>
  data.sort((first, second) => second.score - first.score),
  [data]
);

// 2. Referential equality matters (passing to memoized children)
const handleSubmit = useCallback((formData: FormData) => {
  mutation.mutate(formData);
}, [mutation]);

// 3. Components that receive complex props and re-render often
const MemoizedList = memo(UserList);
```

### Error Boundaries

```tsx
// Every feature should have error boundary wrapping
<ErrorBoundary fallback={<ErrorFallback />}>
  <DashboardFeature />
</ErrorBoundary>
```

---

## Styling & Theme

### Use Design Tokens — No Hardcoded Values

```tsx
// ❌ BAD
<p style={{ color: '#333', fontSize: '14px' }}>Text</p>

// ✅ GOOD (Tailwind)
<p className="text-gray-700 text-sm">Text</p>

// ✅ GOOD (MUI)
<Typography variant="body2" color="text.secondary">Text</Typography>
```

### Typography Variants — Use Constants

```tsx
// helpers/constants/typography.ts
export const TYPOGRAPHY_VARIANTS = {
  PAGE_TITLE: 'h4',
  SECTION_TITLE: 'h6',
  BODY: 'body1',
  CAPTION: 'caption',
  LABEL: 'subtitle2',
} as const;
```

### Responsive Design — Mobile First

```tsx
// Always design mobile-first, enhance for larger screens
// Tailwind approach:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## Data Fetching & State Management

### TanStack Query for ALL Server State

```tsx
// api/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersEndpoints } from '@/api/endpoints';
import { User } from '@/types';

export const USERS_QUERY_KEY = ['users'] as const;

export const useUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: UsersEndpoints.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UsersEndpoints.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};
```

### Query Key Conventions

```tsx
// helpers/constants/queryKeys.ts
export const QUERY_KEYS = {
  USERS: ['users'] as const,
  USER_DETAIL: (userId: string) => ['users', userId] as const,
  USER_POSTS: (userId: string) => ['users', userId, 'posts'] as const,
  DASHBOARD_STATS: ['dashboard', 'stats'] as const,
} as const;
```

### Client State — Keep It Minimal

```tsx
// Use React's built-in state for UI state
const [isModalOpen, setIsModalOpen] = useState(false);
const [activeTab, setActiveTab] = useState<TabType>(TabType.OVERVIEW);

// Use URL state for shareable/bookmarkable state
const [searchParams, setSearchParams] = useSearchParams();

// Only reach for Zustand/Context for truly global UI state (theme, auth user)
```

### Supabase Integration Pattern

```tsx
// api/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// api/endpoints/users.ts
import { supabase } from '@/api/client';

export const UsersEndpoints = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getById: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },
};
```

---

## API & Endpoints

### Endpoints Live in Dedicated Files

```
src/api/
├── endpoints/
│   ├── auth.endpoints.ts
│   ├── users.endpoints.ts
│   ├── posts.endpoints.ts
│   └── index.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useUsers.ts
│   └── usePosts.ts
└── client.ts
```

### Never Hardcode URLs

```tsx
// ❌ BAD
const response = await fetch('https://api.example.com/users');

// ✅ GOOD
// helpers/constants/apiConfig.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
} as const;

// Or for external APIs
export const EXTERNAL_APIS = {
  WEATHER: {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    ENDPOINTS: {
      CURRENT: '/weather',
      FORECAST: '/forecast',
    },
  },
} as const;
```

---

## Code Quality

### No Comments — Self-Documenting Code

```tsx
// ❌ BAD
// Check if user is admin
if (user.role === 'admin') { ... }

// ✅ GOOD
const isAdmin = user.role === UserRole.ADMIN;
if (isAdmin) { ... }
```

### No Hardcoded Strings — Use Constants/Enums

```tsx
// ❌ BAD
<Button>Submit</Button>
if (status === 'active') { ... }

// ✅ GOOD
// helpers/constants/textContent.ts
export const TEXT_CONTENT = {
  BUTTONS: {
    SUBMIT: 'Submit',
    CANCEL: 'Cancel',
    SAVE: 'Save Changes',
  },
  MESSAGES: {
    SUCCESS: 'Operation completed successfully',
    ERROR: 'Something went wrong. Please try again.',
    LOADING: 'Loading...',
  },
} as const;

// helpers/constants/enums.ts
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

<Button>{TEXT_CONTENT.BUTTONS.SUBMIT}</Button>
if (status === UserStatus.ACTIVE) { ... }
```

### Descriptive Variable Names — No Single Letters

```tsx
// ❌ BAD
users.map((u, i) => <UserCard key={i} user={u} />)
const e = new Error('Failed');

// ✅ GOOD
users.map((user) => <UserCard key={user.userId} user={user} />)
const fetchError = new Error('Failed to fetch users');
```

### Consistent Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `UserDashboard.tsx` |
| Hooks | camelCase with `use` prefix | `useUsers.ts` |
| Utils | camelCase | `formatDate.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Enums | PascalCase + UPPER_SNAKE values | `UserRole.ADMIN` |
| Types/Interfaces | PascalCase | `UserProfile` |
| Files | PascalCase (components), camelCase (utils) | varies |
| CSS classes | kebab-case or Tailwind utilities | `user-card` |
| Boolean vars | `is/has/should` prefix | `isLoading`, `hasPermission` |

### Empty Line at End of Every File

Every file must end with a single empty line.

---

## Import Organization

Follow this exact order with blank lines between groups:

```tsx
// 1. React core
import { useState, useEffect, useMemo } from 'react';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 3. Internal shared components
import { Button, Card, DataTable } from '@/components/ui';
import { MainLayout } from '@/components/layout';

// 4. Feature-relative imports
import { UserCard } from './components/UserCard';
import { useFilteredUsers } from './hooks/useFilteredUsers';

// 5. Types and interfaces
import type { User, UserFormData } from '@/types';

// 6. Constants and helpers
import { TEXT_CONTENT, QUERY_KEYS } from '@/helpers/constants';
import { formatDate } from '@/helpers/utils';

// 7. Styles/assets (if any)
import './Dashboard.css';
```

---

## Testing

### Test What Matters

```tsx
// Focus on:
// 1. User interactions and behavior
// 2. Conditional rendering
// 3. Integration between components
// 4. Custom hooks

// tools: Vitest + React Testing Library
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('UserSearch', () => {
  it('should filter users when typing in search input', async () => {
    const user = userEvent.setup();
    render(<UserSearch />);

    const searchInput = screen.getByPlaceholderText(
      TEXT_CONTENT.PLACEHOLDERS.SEARCH_USERS
    );
    await user.type(searchInput, 'John');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });
});
```

### Test File Naming

```
Component.tsx       → Component.test.tsx
useCustomHook.ts    → useCustomHook.test.ts
utils.ts            → utils.test.ts
```

---

## Performance

### Lazy Load Routes

```tsx
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui';

const Dashboard = lazy(() => import('@/features/dashboard'));
const Settings = lazy(() => import('@/features/settings'));

const AppRouter = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </Suspense>
);
```

### Image Optimization

- Use `loading="lazy"` on images below the fold
- Serve WebP format where possible
- Define explicit `width` and `height` to prevent layout shift

### Bundle Size Awareness

- Import only what you need: `import { debounce } from 'lodash-es'` not `import _ from 'lodash'`
- Monitor bundle size with `npx vite-bundle-visualizer`
- Keep dependencies minimal — question every `npm install`

---

## Accessibility

### Minimum A11y Standards for Every Project

```tsx
// Semantic HTML
<nav>, <main>, <section>, <article>, <aside>, <header>, <footer>

// Interactive elements need labels
<button aria-label="Close modal">✕</button>
<input aria-label="Search users" placeholder="Search..." />

// Focus management
<Dialog onOpenAutoFocus={(event) => event.preventDefault()} />

// Color contrast — minimum 4.5:1 for normal text
// Keyboard navigation — all interactive elements reachable via Tab
// Screen reader testing — test with VoiceOver or NVDA at least once per project
```

---

## Git & Version Control

### Branch Naming

```
feature/user-dashboard
fix/login-redirect
refactor/api-layer
```

### Commit Messages

```
feat: add user search with filtering
fix: resolve infinite re-render in dashboard
refactor: extract useAuth hook from LoginPage
chore: update dependencies
style: fix button alignment on mobile
```

### PR Checklist

- [ ] No `any` types
- [ ] No hardcoded strings
- [ ] Types in dedicated files
- [ ] Tests pass
- [ ] No console.logs
- [ ] Empty line at end of files
- [ ] Responsive on mobile
- [ ] Basic keyboard navigation works

---

## Deployment

### Environment Variables

```env
# .env.local (never commit)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Always prefix with VITE_ for client-side access
```

### Recommended Hosting

| Platform | Best For | Free Tier |
|----------|----------|-----------|
| Vercel | React/Next.js apps | Generous |
| Netlify | Static sites, SPAs | Generous |
| Supabase | Backend + DB | 2 free projects |
| Railway | Full-stack if needed | Trial credits |

### Pre-Deploy Checklist

- [ ] `pnpm build` succeeds with zero errors
- [ ] Environment variables configured
- [ ] SEO meta tags set (title, description, og:image)
- [ ] Lighthouse score > 90 for Performance, Accessibility
- [ ] Favicon and app icon set
- [ ] 404 page exists
- [ ] README with setup instructions

---

**This is a living document. Update as your standards evolve.**
