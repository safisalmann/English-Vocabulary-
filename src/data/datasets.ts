import { MCQQuestion, DatasetMetadata } from '../types';
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
    id: 'Set A',
    name: 'Set A (Q1 - Q45)',
    description: 'Letter A Synonyms & Antonyms from BCS & Top University Admission tests with full Bangla meaning solutions.',
    count: setAQuestions.length,
    letters: ['A'],
    isDefault: true,
  },
  {
    id: 'Set B',
    name: 'Set B (Q46 - Q59)',
    description: 'Letter B Synonyms & Antonyms with full Bangla meaning solutions for words and options.',
    count: setBQuestions.length,
    letters: ['B'],
  },
  {
    id: 'Set C',
    name: 'Set C (Q60 - Q84)',
    description: 'Letter C Synonyms & Antonyms with full Bangla meaning solutions for words and options.',
    count: setCQuestions.length,
    letters: ['C'],
  },
  {
    id: 'Set D',
    name: 'Set D (Q85 - Q110)',
    description: 'Letter D Synonyms & Antonyms with full Bangla meaning solutions for words and options.',
    count: setDQuestions.length,
    letters: ['D'],
  },
  {
    id: 'Set E',
    name: 'Set E (Q111 - Q137)',
    description: 'Letter E Synonyms & Antonyms with full Bangla meaning solutions for words and options.',
    count: setEQuestions.length,
    letters: ['E'],
  },
  {
    id: 'Set F',
    name: 'Set F (Q138 - Q150)',
    description: 'Letter F Synonyms & Antonyms with full Bangla meaning solutions for words and options.',
    count: setFQuestions.length,
    letters: ['F'],
  },
  {
    id: 'Set G',
    name: 'Set G (Q151 - Q155)',
    description: 'Letter G Synonyms & Antonyms with full Bangla meaning solutions for words and options.',
    count: setGQuestions.length,
    letters: ['G'],
  },
  {
    id: 'Set H',
    name: 'Set H (Q156 - Q169)',
    description: 'Letter H Synonyms & Antonyms with full Bangla meaning solutions for words and options.',
    count: setHQuestions.length,
    letters: ['H'],
  },
  {
    id: 'Set I',
    name: 'Set I (Q170 - Q207)',
    description: 'Letter I Synonyms & Antonyms with full Bangla meaning solutions for words and options.',
    count: setIQuestions.length,
    letters: ['I'],
  }
];

export const INITIAL_QUESTIONS: MCQQuestion[] = [
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
