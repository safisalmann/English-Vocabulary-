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
import { setPQuestions } from './sets/setP';
import { setQQuestions } from './sets/setQ';
import { setRQuestions } from './sets/setR';
import { setSQuestions } from './sets/setS';
import { setTQuestions } from './sets/setT';
import { setUQuestions } from './sets/setU';
import { setVQuestions } from './sets/setV';
import { setWZQuestions } from './sets/setWZ';
import { groupVerbQuestions } from './sets/groupVerbs';
import { groupVerbMeaningQuestions } from './sets/groupVerbMeaningQuestions';

export const allGroupVerbQuestions: MCQQuestion[] = [
  ...groupVerbQuestions,
  ...groupVerbMeaningQuestions
];

export const INITIAL_DATASETS: DatasetMetadata[] = [
  {
    id: 'Group Verbs',
    name: 'Group Verbs (Phrasal Verbs)',
    description: 'Complete 282 Group Verb & Phrasal Verb MCQs (54 BCS/University questions + 228 Meaning & Sentence MCQs from A to W) with full Bengali solutions, example sentences & meanings of all 4 options.',
    count: allGroupVerbQuestions.length,
    letters: ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'K', 'L', 'M', 'P', 'R', 'S', 'T', 'W'],
  },
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
  },
  {
    id: 'Set P',
    name: 'Set P (Vocabulary P)',
    description: 'Letter P Synonyms & Antonyms (Q257-271) from BCS & Top Universities.',
    count: setPQuestions.length,
    letters: ['P'],
  },
  {
    id: 'Set Q',
    name: 'Set Q (Vocabulary Q)',
    description: 'Letter Q Synonyms & Antonyms (Q272-274) from BCS & Top Universities.',
    count: setQQuestions.length,
    letters: ['Q'],
  },
  {
    id: 'Set R',
    name: 'Set R (Vocabulary R)',
    description: 'Letter R Synonyms & Antonyms (Q275-284) from BCS & Top Universities.',
    count: setRQuestions.length,
    letters: ['R'],
  },
  {
    id: 'Set S',
    name: 'Set S (Vocabulary S)',
    description: 'Letter S Synonyms & Antonyms (Q285-314) from BCS & Top Universities.',
    count: setSQuestions.length,
    letters: ['S'],
  },
  {
    id: 'Set T',
    name: 'Set T (Vocabulary T)',
    description: 'Letter T Synonyms & Antonyms (Q315-327) from BCS & Top Universities.',
    count: setTQuestions.length,
    letters: ['T'],
  },
  {
    id: 'Set U',
    name: 'Set U (Vocabulary U)',
    description: 'Letter U Synonyms & Antonyms (Q328-333) from BCS & Top Universities.',
    count: setUQuestions.length,
    letters: ['U'],
  },
  {
    id: 'Set V',
    name: 'Set V (Vocabulary V)',
    description: 'Letter V Synonyms & Antonyms (Q334-340) from BCS & Top Universities.',
    count: setVQuestions.length,
    letters: ['V'],
  },
  {
    id: 'Set W-Z',
    name: 'Set W-Z (Vocabulary W-Z)',
    description: 'Letters W to Z Synonyms & Antonyms (Q341-349) from BCS & Top Universities.',
    count: setWZQuestions.length,
    letters: ['W', 'Z'],
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
  ...setIQuestions,
  ...setPQuestions,
  ...setQQuestions,
  ...setRQuestions,
  ...setSQuestions,
  ...setTQuestions,
  ...setUQuestions,
  ...setVQuestions,
  ...setWZQuestions,
  ...allGroupVerbQuestions
];
