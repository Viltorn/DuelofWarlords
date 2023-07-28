import { Nala } from './academiaHeroes.js';
import { Zigfrid } from './castleHeroes.js';

export const topSpells = [
  {
    id: '1', player: 'player1', content: [], type: 'topSpell',
  },
  {
    id: '2', player: 'player1', content: [], type: 'topSpell',
  },
  {
    id: '3', player: 'player2', content: [], type: 'topSpell',
  },
  {
    id: '4', player: 'player2', content: [], type: 'topSpell',
  },
];

export const bigSpell = [
  {
    id: '5', content: [], type: 'bigSpell',
  },
];

export const midSpells = [
  {
    id: 'A', player: 'player1', content: [], type: 'midSpell',
  },
  {
    id: 'B', player: 'player1', content: [], type: 'midSpell',
  },
  {
    id: 'C', player: 'player2', content: [], type: 'midSpell',
  },
  {
    id: 'D', player: 'player2', content: [], type: 'midSpell',
  },
];

export const heroes = [
  {
    id: 'hero1', player: 'player1', content: [Zigfrid], type: 'hero',
  },
  {
    id: 'hero2', player: 'player2', content: [Nala], type: 'hero',
  },
];
