import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User as FirebaseUser } from 'firebase/auth';
import {
  signUp as authSignUp,
  signIn as authSignIn,
  signOut as authSignOut,
  onAuthStateChange,
  getCurrentUser
} from '../methods/auth.methods';
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile
} from '../methods/user.methods';
import { User, SignUpData, SignInData, UserProfile, AuthResult } from '../entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.initAuthStateListener();
  }

  private initAuthStateListener(): void {
    onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid);
        if (userProfile) {
          this.currentUserSubject.next(userProfile);
          this.isAuthenticatedSubject.next(true);
        }
      } else {
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }
    });
  }

  async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      const userCredential = await authSignUp(data.email, data.password);
      await createUserProfile(
        userCredential.user.uid,
        data.email,
        data.name
      );
      const userProfile = await getUserProfile(userCredential.user.uid);

      return {
        success: true,
        user: userProfile || undefined
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign up failed'
      };
    }
  }

  async signIn(data: SignInData): Promise<AuthResult> {
    try {
      const userCredential = await authSignIn(data.email, data.password);
      const userProfile = await getUserProfile(userCredential.user.uid);

      return {
        success: true,
        user: userProfile || undefined
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign in failed'
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      await authSignOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<void> {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    await updateUserProfile(currentUser.uid, profileData);
    const updatedProfile = await getUserProfile(currentUser.uid);
    if (updatedProfile) {
      this.currentUserSubject.next(updatedProfile);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
