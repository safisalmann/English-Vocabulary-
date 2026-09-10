import { MCQQuestion, DatasetMetadata } from '../types';
import { prepositionAHQuestions } from './sets/prepositionAH';
import { prepositionIZQuestions } from './sets/prepositionIZ';
import { setAQuestions } from './sets/setA';
import { setBQuestions } from './sets/setB';
import { setCQuestions } from './sets/setC';
import { setDQuestions } from './sets/setD';
import { setEQuestions } from './sets/setE';
import { setFQuestions } from './sets/setF';
import { setGQuestions } from './sets/setG';
import { setHQuestions } from './sets/setH';
import { setIQuestions } from './sets/setI';

export const INITIAL_DATASETS: DatasetMetadata[] = [
  {
    id: '1st A-H',
    name: '1st Dataset: Preposition (A-H)',
    description: 'Appropriate Prepositions 01-59 (Letters A to H) from BCS & Top Universities with Bengali meaning of the correct answer only.',
    count: prepositionAHQuestions.length,
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    isDefault: true,
  },
  {
    id: '2nd I-Z',
    name: '2nd Dataset: Preposition (I-Z)',
    description: 'Appropriate Prepositions 60-116 (Letters I to Z) from BCS & Top Universities with Bengali meaning of the correct answer only.',
    count: prepositionIZQuestions.length,
    letters: ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'Z'],
  },
  {
    id: 'Set A',
    name: 'Set A (Vocabulary A)',
    description: 'Letter A Synonyms & Antonyms from BCS & Top University Admission tests.',
    count: setAQuestions.length,
    letters: ['A'],
  },
  {
    id: 'Set B',
    name: 'Set B (Vocabulary B)',
    description: 'Letter B Synonyms & Antonyms from BCS & Top University tests.',
    count: setBQuestions.length,
    letters: ['B'],
  },
  {
    id: 'Set C',
    name: 'Set C (Vocabulary C)',
    description: 'Letter C Synonyms & Antonyms from BCS & Top University tests.',
    count: setCQuestions.length,
    letters: ['C'],
  },
  {
    id: 'Set D',
    name: 'Set D (Vocabulary D)',
    description: 'Letter D Synonyms & Antonyms from BCS & Top University tests.',
    count: setDQuestions.length,
    letters: ['D'],
  },
  {
    id: 'Set E',
    name: 'Set E (Vocabulary E)',
    description: 'Letter E Synonyms & Antonyms from BCS & Top University tests.',
    count: setEQuestions.length,
    letters: ['E'],
  },
  {
    id: 'Set F',
    name: 'Set F (Vocabulary F)',
    description: 'Letter F Synonyms & Antonyms from BCS & Top University tests.',
    count: setFQuestions.length,
    letters: ['F'],
  },
  {
    id: 'Set G',
    name: 'Set G (Vocabulary G)',
    description: 'Letter G Synonyms & Antonyms from BCS & Top University tests.',
    count: setGQuestions.length,
    letters: ['G'],
  },
  {
    id: 'Set H',
    name: 'Set H (Vocabulary H)',
    description: 'Letter H Synonyms & Antonyms from BCS & Top University tests.',
    count: setHQuestions.length,
    letters: ['H'],
  },
  {
    id: 'Set I',
    name: 'Set I (Vocabulary I)',
    description: 'Letter I Synonyms & Antonyms from BCS & Top University tests.',
    count: setIQuestions.length,
    letters: ['I'],
  }
];

export const INITIAL_QUESTIONS: MCQQuestion[] = [
  ...prepositionAHQuestions,
  ...prepositionIZQuestions,
  ...setAQuestions,
  ...setBQuestions,
  ...setCQuestions,
  ...setDQuestions,
  ...setEQuestions,
  ...setFQuestions,
  ...setGQuestions,
  ...setHQuestions,
  ...setIQuestions
];
