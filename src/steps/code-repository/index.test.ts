import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('build-user-and-code-repos-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-user-and-code-repos-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.BUILD_USER_AND_CODEREPOS_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
