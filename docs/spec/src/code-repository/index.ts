import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const codeRepoSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://<portal>.travis-ci.com/repo
     * PATTERN: Fetch Entities
     */
    id: 'fetch-coderepos',
    name: 'Fetch Repositories',
    entities: [
      {
        resourceName: 'CodeRepo',
        _type: 'travisci_coderepo',
        _class: ['CodeRepo'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://<portal>.travis-ci.com/repo
     * PATTERN: Build Relationships
     */
    id: 'build-user-and-code-repos-relationships',
    name: 'Build User And CodeRepos Relationship',
    entities: [],
    relationships: [
      {
        _type: 'travisci_user_created_coderepo',
        sourceType: 'travisci_user',
        _class: RelationshipClass.CREATED,
        targetType: 'travisci_coderepo',
      },
      {
        _type: 'travisci_user_uses_coderepo',
        sourceType: 'travisci_user',
        _class: RelationshipClass.USES,
        targetType: 'travisci_coderepo',
      },
    ],
    dependsOn: ['fetch-coderepos', 'fetch-account'],
    implemented: true,
  },
];
