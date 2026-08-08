/** @type {import('jest').Config} */
export default {
  transform: {},
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'app/js/**/*.js',
    '!app/js/main.js'
  ]
};