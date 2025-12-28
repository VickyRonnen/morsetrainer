import {Lesson} from './lesson';

export class Punctuation {
  static readonly lessons: Lesson[] = [
    {
      number: 1,
      letters: [
        '.',
        ','
      ],
      heading: 'Lesson 1',
      label: '. ,',
      ariaLabel: 'punctuation lesson 1, period and comma'
    },
    {
      number: 2,
      letters: [
        '!',
        '?'
      ],
      heading: 'Lesson 2',
      label: '! ?',
      ariaLabel: 'punctuation-lesson 2, exclamation mark and question mark'
    },
    {
      number: 3,
      letters: [
        '&',
        '@'
      ],
      heading: 'Lesson 3',
      label: '& @',
      ariaLabel: 'punctuation-lesson 3, ampersand and commercial at'
    },
    {
      number: 4,
      letters: [
        '\'',
        '"'
      ],
      heading: 'Lesson 4',
      label: '\' "',
      ariaLabel: 'punctuation-lesson 4, single quote and double quote'
    },
    {
      number: 5,
      letters: [
        '(',
        ')'
      ],
      heading: 'Lesson 5',
      label: '( )',
      ariaLabel: 'punctuation-lesson 5, left parenthesis and right parenthesis'
    },
    {
      number: 6,
      letters: [
        ':',
        ';'
      ],
      heading: 'Lesson 6',
      label: ': ;',
      ariaLabel: 'punctuation-lesson 6, colon and semicolon'
    },
    {
      number: 7,
      letters: [
        '=',
        '/'
      ],
      heading: 'Lesson 7',
      label: '= /',
      ariaLabel: 'punctuation-lesson 7, equals and slash'
    },
    {
      number: 8,
      letters: [
        '-',
        '+'
      ],
      heading: 'Lesson 8',
      label: '- +',
      ariaLabel: 'punctuation-lesson 8, minus and plus'
    }
  ];
}
