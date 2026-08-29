import { MCQQuestion, DatasetMetadata } from '../types';
import { z7Questions } from './z7';

export const INITIAL_DATASETS: DatasetMetadata[] = [
  {
    id: 'Z7',
    name: 'Dataset Z7',
    description: 'Letters E to K vocabulary with Synonyms, Antonyms, Bengali meanings & rule-based MCQ options.',
    count: z7Questions.length,
    letters: ['E', 'F', 'G', 'H', 'I', 'J', 'K'],
    isDefault: true,
  },
  {
    id: 'Z6',
    name: 'Dataset Z6 (Ready for Data)',
    description: 'Upcoming vocabulary dataset slot (Letters A-D or custom)',
    count: 0,
    letters: [],
  },
  {
    id: 'Z5',
    name: 'Dataset Z5 (Ready for Data)',
    description: 'Upcoming vocabulary dataset slot',
    count: 0,
    letters: [],
  },
  {
    id: 'P4',
    name: 'Dataset P4 (Ready for Data)',
    description: 'Upcoming vocabulary dataset slot (Special practice set)',
    count: 0,
    letters: [],
  }
];

export const INITIAL_QUESTIONS: MCQQuestion[] = [...z7Questions];
