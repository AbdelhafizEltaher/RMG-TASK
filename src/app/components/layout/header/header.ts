import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
