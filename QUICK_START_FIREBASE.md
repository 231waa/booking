# Firebase Authentication - Quick Start

## Step 1: Install Firebase

```bash
npm install firebase
```

## Step 2: Enable Firebase Services

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **booking-d662a**
3. **Enable Authentication:**
   - Click "Authentication" in left menu
   - Go to "Sign-in method" tab
   - Enable "Email/Password" provider
   - Click Save

4. **Enable Firestore:**
   - Click "Firestore Database" in left menu
   - Click "Create database"
   - Select "Start in production mode"
   - Choose your region
   - Click Enable

5. **Set Firestore Security Rules:**
   - In Firestore, click "Rules" tab
   - Paste this:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
   - Click Publish

## Step 3: Test the Implementation

Add the example component to your routes in `app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { FirebaseAuthExampleComponent } from './examples/firebase-auth-example.component';

export const routes: Routes = [
  {
    path: 'firebase-demo',
    component: FirebaseAuthExampleComponent
  }
  // ... other routes
];
```

Then navigate to `http://localhost:4200/firebase-demo` to test!

## Step 4: Use in Your Components

```typescript
import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService, User } from './core/firebase';

export class MyComponent implements OnInit {
  user: User | null = null;

  constructor(private auth: FirebaseAuthService) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        console.log('Logged in as:', user.name);
      }
    });
  }

  async signUp() {
    const result = await this.auth.signUp({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });

    if (result.success) {
      console.log('Success!', result.user);
    } else {
      console.error(result.error);
    }
  }

  async signIn() {
    const result = await this.auth.signIn({
      email: 'john@example.com',
      password: 'password123'
    });
  }

  async signOut() {
    await this.auth.signOut();
  }
}
```

## Step 5: Protect Routes

```typescript
import { Routes } from '@angular/router';
import { FirebaseAuthGuard } from './core/firebase';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [FirebaseAuthGuard]
  }
];
```

## File Structure Created

```
src/app/core/firebase/
├── config/firebase.config.ts           # Firebase initialization
├── entities/user.entity.ts             # TypeScript interfaces
├── methods/
│   ├── auth.methods.ts                 # Auth functions
│   └── user.methods.ts                 # Firestore functions
├── services/firebase-auth.service.ts   # Angular service
├── guards/firebase-auth.guard.ts       # Route guard
└── index.ts                            # Exports

src/app/examples/
└── firebase-auth-example.component.ts  # Full demo component
```

## Features Available

- Sign up with email/password
- Sign in with email/password
- Sign out
- Update user profile (name, photo)
- Automatic profile creation in Firestore
- Real-time auth state listening
- Route protection with guard
- TypeScript types for all data

That's it! Your Firebase authentication is ready to use.
