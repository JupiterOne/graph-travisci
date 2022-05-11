import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { TravisCIRepository } from '../../types';

export function getCodeRepoKey(id: number): string {
  return `travisci_coderepo:${id.toString()}`;
}

export function createCodeRepoEntity(coderepo: TravisCIRepository): Entity {
  return createIntegrationEntity({
    entityData: {
      source: coderepo,
      assign: {
        _key: getCodeRepoKey(coderepo.id),
        _type: Entities.CODEREPO._type,
        _class: Entities.CODEREPO._class,
        id: coderepo.id.toString(),
        name: coderepo.name,
        description: coderepo.description || undefined,
        active: coderepo.active,
        slug: coderepo.slug,
        public: !coderepo.private,
        starred: coderepo.starred,
        shared: coderepo.shared,
        configValidation: coderepo.config_validation,
        serverType: coderepo.server_type,
      },
    },
  });
}
