import 'jest';

declare module 'jest-mock' {
  import { mocked as originalMocked } from 'jest-mock';
  export function mocked<T>(item: T, deep?: boolean): T;
}
