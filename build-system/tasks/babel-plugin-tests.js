/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const jest = require('@jest/core');
const {isTravisBuild} = require('../common/travis');

/**
 * Entry point for `gulp babel-plugin-tests`. Runs the jest-based tests for
 * AMP's custom babel plugins.
 */
async function babelPluginTests() {
  const projects = ['./build-system/babel-plugins'];
  const options = {
    automock: false,
    coveragePathIgnorePatterns: ['/node_modules/'],
    modulePathIgnorePatterns: ['/test/fixtures/', '<rootDir>/build/'],
    reporters: [isTravisBuild() ? 'jest-silent-reporter' : 'jest-dot-reporter'],
    setupFiles: ['./build-system/babel-plugins/testSetupFile.js'],
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/'],
    testRegex: '/babel-plugins/[^/]+/test/.+\\.m?js$',
    transformIgnorePatterns: ['/node_modules/'],
  };
  await jest.runCLI(options, projects);
}

module.exports = {
  babelPluginTests,
};

babelPluginTests.description =
  "Runs the Jest based tests for AMP's custom babel plugins.";
