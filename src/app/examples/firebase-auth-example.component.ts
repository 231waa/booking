import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../core/firebase';
import { User } from '../core/firebase';

@Component({
  selector: 'app-firebase-auth-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-6 mx-auto">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-center mb-4">Firebase Auth Example</h3>

              <div *ngIf="!currentUser">
                <ul class="nav nav-tabs mb-3" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link"
                      [class.active]="activeTab === 'signin'"
                      (click)="activeTab = 'signin'"
                      type="button">
                      Sign In
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link"
                      [class.active]="activeTab === 'signup'"
                      (click)="activeTab = 'signup'"
                      type="button">
                      Sign Up
                    </button>
                  </li>
                </ul>

                <div *ngIf="activeTab === 'signin'">
                  <form (ngSubmit)="handleSignIn()">
                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input
                        type="email"
                        class="form-control"
                        [(ngModel)]="signInData.email"
                        name="email"
                        required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Password</label>
                      <input
                        type="password"
                        class="form-control"
                        [(ngModel)]="signInData.password"
                        name="password"
                        required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
                      {{ loading ? 'Signing In...' : 'Sign In' }}
                    </button>
                  </form>
                </div>

                <div *ngIf="activeTab === 'signup'">
                  <form (ngSubmit)="handleSignUp()">
                    <div class="mb-3">
                      <label class="form-label">Name</label>
                      <input
                        type="text"
                        class="form-control"
                        [(ngModel)]="signUpData.name"
                        name="name"
                        required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input
                        type="email"
                        class="form-control"
                        [(ngModel)]="signUpData.email"
                        name="email"
                        required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Password</label>
                      <input
                        type="password"
                        class="form-control"
                        [(ngModel)]="signUpData.password"
                        name="password"
                        required>
                    </div>
                    <button type="submit" class="btn btn-success w-100" [disabled]="loading">
                      {{ loading ? 'Creating Account...' : 'Sign Up' }}
                    </button>
                  </form>
                </div>
              </div>

              <div *ngIf="currentUser">
                <div class="text-center mb-4">
                  <div *ngIf="currentUser.photoURL" class="mb-3">
                    <img [src]="currentUser.photoURL" alt="Profile" class="rounded-circle" style="width: 100px; height: 100px;">
                  </div>
                  <h4>Welcome, {{ currentUser.name }}!</h4>
                  <p class="text-muted">{{ currentUser.email }}</p>
                  <p class="text-muted small">UID: {{ currentUser.uid }}</p>
                </div>

                <form (ngSubmit)="handleUpdateProfile()">
                  <div class="mb-3">
                    <label class="form-label">Update Name</label>
                    <input
                      type="text"
                      class="form-control"
                      [(ngModel)]="profileData.name"
                      name="profileName">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Photo URL</label>
                    <input
                      type="text"
                      class="form-control"
                      [(ngModel)]="profileData.photoURL"
                      name="photoURL"
                      placeholder="https://example.com/photo.jpg">
                  </div>
                  <button type="submit" class="btn btn-info w-100 mb-2" [disabled]="loading">
                    {{ loading ? 'Updating...' : 'Update Profile' }}
                  </button>
                </form>

                <button (click)="handleSignOut()" class="btn btn-danger w-100">
                  Sign Out
                </button>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>
              <div *ngIf="successMessage" class="alert alert-success mt-3">
                {{ successMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FirebaseAuthExampleComponent implements OnInit {
  currentUser: User | null = null;
  activeTab: 'signin' | 'signup' = 'signin';
  loading = false;
  errorMessage = '';
  successMessage = '';

  signInData = {
    email: '',
    password: ''
  };

  signUpData = {
    name: '',
    email: '',
    password: ''
  };

  profileData = {
    name: '',
    photoURL: ''
  };

  constructor(private authService: FirebaseAuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileData.name = user.name;
        this.profileData.photoURL = user.photoURL || '';
      }
    });
  }

  async handleSignIn(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const result = await this.authService.signIn(this.signInData);

    if (result.success) {
      this.successMessage = 'Signed in successfully!';
      this.signInData = { email: '', password: '' };
    } else {
      this.errorMessage = result.error || 'Sign in failed';
    }

    this.loading = false;
  }

  async handleSignUp(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const result = await this.authService.signUp(this.signUpData);

    if (result.success) {
      this.successMessage = 'Account created successfully!';
      this.signUpData = { name: '', email: '', password: '' };
      this.activeTab = 'signin';
    } else {
      this.errorMessage = result.error || 'Sign up failed';
    }

    this.loading = false;
  }

  async handleSignOut(): Promise<void> {
    try {
      await this.authService.signOut();
      this.successMessage = 'Signed out successfully!';
    } catch (error) {
      this.errorMessage = 'Sign out failed';
    }
  }

  async handleUpdateProfile(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const updateData: any = {};
      if (this.profileData.name) {
        updateData.name = this.profileData.name;
      }
      if (this.profileData.photoURL) {
        updateData.photoURL = this.profileData.photoURL;
      }

      await this.authService.updateProfile(updateData);
      this.successMessage = 'Profile updated successfully!';
    } catch (error: any) {
      this.errorMessage = error.message || 'Update failed';
    }

    this.loading = false;
  }
}
