import { accountSteps } from './account';
import { codeRepoSteps } from './code-repository';

const integrationSteps = [...accountSteps, ...codeRepoSteps];

export { integrationSteps };
