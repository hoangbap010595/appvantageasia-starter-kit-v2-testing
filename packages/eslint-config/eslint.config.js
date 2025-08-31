import createFlatConfig from './build/index.js';

export default [{ ignores: ['build/**'] }, ...createFlatConfig()];
