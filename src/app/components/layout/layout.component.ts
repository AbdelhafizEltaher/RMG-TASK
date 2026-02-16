import { Component } from '@angular/core';
import { Header } from '@components/layout/header/header';
import { Main } from '@components/layout/main/main';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Header, Main],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {}
