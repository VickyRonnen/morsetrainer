import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Nav} from './nav/nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'morsetrainer';

  ngOnInit(): void {
    globalThis.document.body.dataset['bsTheme'] = (localStorage.getItem('darkMode') || 'true') === 'true' ? 'dark' : 'light';
  }

}

