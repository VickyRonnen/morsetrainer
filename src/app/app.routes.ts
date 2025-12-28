import {Routes} from '@angular/router';
import {Home} from './home/home';
import {Settings} from './settings/settings';
import {About} from './about/about';
import {WordLesson} from './words/word-lesson';
import {PageNotFound} from './page-not-found/page-not-found';
import {Overview} from './overview/overview';
import {LetterLesson} from './letter-lesson/letter-lesson';
import {PunctuationLessons} from './punctuation-lessons/punctuation-lessons';
import {LetterLessons} from './letter-lessons/letter-lessons';
import {PunctuationLesson} from './punctuation-lesson/punctuation-lesson';
import {MyDebug} from './my-debug/my-debug';

export const routes: Routes = [
  {path: 'home', component: Home, title: 'Home'},
  {path: 'letters', component: LetterLessons, title: 'Letters'},
  {path: 'letters/:id', component: LetterLesson, title: (route) => `Letter lesson ${route.paramMap.get('id') ?? ''}`},
  {path: 'punctuations', component: PunctuationLessons, title: 'Punctuations'},
  {path: 'punctuations/:id', component: PunctuationLesson, title: (route) => `Punctuation lesson ${route.paramMap.get('id') ?? ''}`},
  {path: 'words', component: WordLesson, title: 'Words'},
  {path: 'settings', component: Settings, title: 'Settings'},
  {path: 'overview', component: Overview, title: 'Overview'},
  {path: 'about', component: About, title: 'About'},
  {path: 'd', component: MyDebug, title: 'Debug'},
  {path: '', component: Home, pathMatch: 'full'},
  {path: '**', component: PageNotFound}
];
