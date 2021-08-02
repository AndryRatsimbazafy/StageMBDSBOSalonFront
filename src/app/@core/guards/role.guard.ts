import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthAPIService } from '../service/auth.api.service';
import decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthAPIService, public router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.role;
    const token = localStorage.getItem('access-token');
    // decode the token to get its payload
    const tokenPayload: any = token && decode(token);
    if ( token && (!this.auth.isAuthenticated() || !expectedRole.includes(tokenPayload.role))
    ) {
      if (tokenPayload && (tokenPayload.role === "commercial" || tokenPayload.role === "coach")) {
        this.router.navigate(['chat']);
      } else {
        if (!this.getResolvedUrl(route).match('configurator')) {
          this.router.navigate(['configurator']);
        }
      }
      return false;
    }
    return true;
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map(v => v.url.map(segment => segment.toString()).join('/'))
      .join('/');
  }
}
