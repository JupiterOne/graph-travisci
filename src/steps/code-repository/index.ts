import {
  createDirectRelationship,
  Entity,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { TravisCIRepository } from '../../types';
import { getUserKey } from '../account/converter';
import {
  ACCOUNT_ENTITY_KEY,
  Steps,
  Entities,
  Relationships,
} from '../constants';
import { createCodeRepoEntity } from './converter';

export async function fetchCodeRepos({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.fetchCodeRepos(async (repository) => {
    const codeRepoEntity = createCodeRepoEntity(repository);
    await jobState.addEntity(codeRepoEntity);
  });
}

export async function buildUserAndCodeReposRelationship({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;
  const userEntity = (await jobState.findEntity(
    getUserKey(Number(accountEntity.id)),
  )) as Entity;

  await jobState.iterateEntities(
    {
      _type: Entities.CODEREPO._type,
    },
    async (codeRepoEntity) => {
      const coderepo = getRawData<TravisCIRepository>(codeRepoEntity);
      if (!coderepo) {
        logger.warn(
          { _key: codeRepoEntity._key },
          'Could not get raw data for coderepo entity',
        );
        return;
      }

      if (
        coderepo.owner['@type'] === 'user' &&
        coderepo.owner.id.toString() === userEntity.id
      ) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.CREATED,
            from: userEntity,
            to: codeRepoEntity,
          }),
        );
      } else {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.USES,
            from: userEntity,
            to: codeRepoEntity,
          }),
        );
      }
    },
  );
}

export const codeRepoSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.CODEREPOS,
    name: 'Fetch Repositories',
    entities: [Entities.CODEREPO],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchCodeRepos,
  },
  {
    id: Steps.BUILD_USER_AND_CODEREPOS_RELATIONSHIPS,
    name: 'Build User And CodeRepos Relationship',
    entities: [],
    relationships: [
      Relationships.USER_CREATED_CODEREPO,
      Relationships.USER_USES_CODEREPO,
    ],
    dependsOn: [Steps.CODEREPOS, Steps.ACCOUNT],
    executionHandler: buildUserAndCodeReposRelationship,
  },
];
