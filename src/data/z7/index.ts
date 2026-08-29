import { MCQQuestion } from '../../types';
import { letterEQuestions } from './letterE';
import { letterFQuestions } from './letterF';
import { letterGQuestions } from './letterG';
import { letterHQuestions } from './letterH';
import { letterIQuestions } from './letterI';
import { letterJKQuestions } from './letterJK';

export const z7Questions: MCQQuestion[] = [
  ...letterEQuestions,
  ...letterFQuestions,
  ...letterGQuestions,
  ...letterHQuestions,
  ...letterIQuestions,
  ...letterJKQuestions,
];

export {
  letterEQuestions,
  letterFQuestions,
  letterGQuestions,
  letterHQuestions,
  letterIQuestions,
  letterJKQuestions,
};
