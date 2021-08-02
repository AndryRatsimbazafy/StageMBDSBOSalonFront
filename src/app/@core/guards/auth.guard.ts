import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { AuthAPIService } from '../service/auth.api.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthAPIService, public router: Router, public activatedRoute: ActivatedRoute) {
  }

  canActivate(): boolean {
    console.log(window.location.href)
    if (!this.auth.isAuthenticated() && window.location.href.includes('users')) {
      window.location.href = 'https://w3dsalonvituelreno2021.fr/';
      return false;
    } else if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  isActive(): boolean {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
      return true;
    }
    return false;
  }
}
