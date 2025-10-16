# Firebase Authentication Setup Guide

## Installation

First, install Firebase:

```bash
npm install firebase
```

## Project Structure

The Firebase integration is organized in a clean, modular structure:

```
src/app/core/firebase/
├── config/
│   └── firebase.config.ts          # Firebase initialization
├── entities/
│   └── user.entity.ts              # User interfaces and types
├── methods/
│   ├── auth.methods.ts             # Authentication methods
│   └── user.methods.ts             # Firestore user operations
├── services/
│   └── firebase-auth.service.ts    # Angular service wrapper
├── guards/
│   └── firebase-auth.guard.ts      # Route protection
└── index.ts                        # Public API exports
```

## Features

### 1. Authentication Methods

The `FirebaseAuthService` provides:
- **signUp(data)** - Create new user with email/password
- **signIn(data)** - Sign in existing user
- **signOut()** - Sign out current user
- **updateProfile(data)** - Update user profile
- **currentUser$** - Observable of current user state
- **isAuthenticated$** - Observable of authentication state

### 2. User Profile Management

After signup, user data is automatically saved to Firestore in the `users` collection:
- UID
- Email
- Name
- Photo URL (optional)
- Creation timestamp
- Update timestamp

### 3. Real-time Auth State

The service automatically listens to authentication state changes and updates observables.

## Usage Examples

### Basic Setup in Component

```typescript
import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService, User, SignUpData, SignInData } from './core/firebase';

@Component({
  selector: 'app-my-component',
  template: `
    <div *ngIf="currentUser">
      <h2>Welcome {{ currentUser.name }}!</h2>
      <button (click)="signOut()">Sign Out</button>
    </div>
  `
})
export class MyComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: FirebaseAuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  async signOut() {
    await this.authService.signOut();
  }
}
```

### Sign Up New User

```typescript
const signUpData: SignUpData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123'
};

const result = await this.authService.signUp(signUpData);

if (result.success) {
  console.log('User created:', result.user);
} else {
  console.error('Error:', result.error);
}
```

### Sign In User

```typescript
const signInData: SignInData = {
  email: 'john@example.com',
  password: 'securePassword123'
};

const result = await this.authService.signIn(signInData);

if (result.success) {
  console.log('Signed in:', result.user);
}
```

### Update User Profile

```typescript
await this.authService.updateProfile({
  name: 'John Updated',
  photoURL: 'https://example.com/photo.jpg'
});
```

### Protect Routes

Use the `FirebaseAuthGuard` to protect routes:

```typescript
import { Routes } from '@angular/router';
import { FirebaseAuthGuard } from './core/firebase';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [FirebaseAuthGuard]
  }
];
```

## Example Component

A complete example component is provided at:
`src/app/examples/firebase-auth-example.component.ts`

To use it, add it to your routes:

```typescript
import { FirebaseAuthExampleComponent } from './examples/firebase-auth-example.component';

export const routes: Routes = [
  {
    path: 'firebase-example',
    component: FirebaseAuthExampleComponent
  }
];
```

## Firestore Security Rules

Set up these security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Firebase Console Setup

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project (booking-d662a)
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
4. Create Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (then apply security rules above)
   - Select your region

## Direct Method Usage (Without Service)

If you prefer to use Firebase methods directly:

```typescript
import { signUp, signIn, signOut } from './core/firebase/methods/auth.methods';
import { createUserProfile, getUserProfile, updateUserProfile } from './core/firebase/methods/user.methods';

// Sign up
const userCredential = await signUp('email@example.com', 'password');
await createUserProfile(userCredential.user.uid, 'email@example.com', 'John Doe');

// Get profile
const profile = await getUserProfile(uid);

// Update profile
await updateUserProfile(uid, { name: 'New Name' });
```

## TypeScript Types

All types are exported from `src/app/core/firebase/entities/user.entity.ts`:

- `User` - Complete user profile
- `UserProfile` - Partial profile for updates
- `SignUpData` - Sign up form data
- `SignInData` - Sign in form data
- `AuthResult` - Authentication result with success/error

## Notes

- The service uses RxJS observables for reactive state management
- Authentication state persists across page reloads
- User profiles are automatically synced with Firestore
- All timestamps use Firebase server timestamps for consistency
