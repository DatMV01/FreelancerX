import { TransformFnParams } from 'class-transformer/types/interfaces';
import { MaybeUndefined } from '../types/maybe.type';

export const lowerCaseTransformer = (
  params: TransformFnParams,
): MaybeUndefined<string> => params.value?.toLowerCase().trim();
