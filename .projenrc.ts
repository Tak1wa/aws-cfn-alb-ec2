import { ProjenBlueprint } from '@amazon-codecatalyst/blueprint-util.projen-blueprint';

const project = new ProjenBlueprint({
  "authorName": "hoge-iwasa",
  "publishingOrganization": "hoge-iwasa",
  "packageName": "@amazon-codecatalyst/hoge-iwasa.my-amazing-blueprint",
  "name": "my-amazing-blueprint",
  "displayName": "My Amazing Blueprint",
  "defaultReleaseBranch": "main",
  "license": "Apache-2.0",
  "projenrcTs": true,
  "sampleCode": false,
  "github": false,
  "eslint": true,
  "jest": false,
  "npmignoreEnabled": true,
  "tsconfig": {
    "compilerOptions": {
      "esModuleInterop": true,
      "noImplicitAny": false
    }
  },
  "copyrightOwner": "hoge-iwasa",
  "deps": [
    "projen",
    "@amazon-codecatalyst/blueprints.blueprint",
    "@amazon-codecatalyst/blueprint-component.workflows",
    "@amazon-codecatalyst/blueprint-component.source-repositories",
    "@amazon-codecatalyst/blueprint-component.dev-environments",
    "@amazon-codecatalyst/blueprint-component.environments",
    "@amazon-codecatalyst/blueprint-component.issues"
  ],
  "description": "This blueprint creates an empty application.",
  "devDeps": [
    "ts-node@^10",
    "typescript",
    "@amazon-codecatalyst/blueprint-util.projen-blueprint",
    "@amazon-codecatalyst/blueprint-util.cli",
    "fast-xml-parser"
  ],
  "keywords": [
    "first-label",
    "second-label"
  ],
  "homepage": ""
});

project.synth();