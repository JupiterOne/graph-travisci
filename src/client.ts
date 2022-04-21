import fetch, { Response } from 'node-fetch';
import { retry } from '@lifeomic/attempt';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { TravisCIRepository } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;
export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private perPage = 100;
  private baseUri = `https://${this.config.hostname}`;
  private withBaseUri = (path: string) => `${this.baseUri}${path}`;

  private checkStatus = (response: Response) => {
    if (response.ok) {
      return response;
    } else {
      throw new IntegrationProviderAPIError(response);
    }
  };

  private async request(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<Response> {
    try {
      const options = {
        method,
        headers: {
          Authorization: `token ${this.config.token}`,
          'Travis-API-Version': 3,
        },
      };

      // Handle rate-limiting
      const response = await retry(
        async () => {
          const res: Response = await fetch(uri, options);
          this.checkStatus(res);
          return res;
        },
        {
          delay: 5000,
          maxAttempts: 10,
          handleError: (err, context) => {
            if (
              err.statusCode !== 429 ||
              ([500, 502, 503].includes(err.statusCode) &&
                context.attemptNum > 1)
            )
              context.abort();
          },
        },
      );
      return response.json();
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async paginatedRequest<T>(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
    iteratee: ResourceIteratee<T>,
    iterateeKey: string,
  ): Promise<any> {
    try {
      let nextUri = null;
      do {
        const response = await this.request(nextUri || uri, method);
        nextUri = response['@pagination'].next
          ? this.withBaseUri(response['@pagination']?.next['@href'])
          : response['@pagination']?.next;
        for (const item of response[iterateeKey]) {
          await iteratee(item);
        }
      } while (nextUri);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: uri,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  /**
   * Verify if the provided credentials are working.
   */
  public async verifyAuthentication(): Promise<void> {
    const uri = this.withBaseUri('/user');
    try {
      await this.request(uri);
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Fetch the user resource in the provider.
   */
  public async fetchUser(): Promise<Response> {
    return this.request(this.withBaseUri(`/user`), 'GET');
  }

  /**
   * Fetch the code repositories in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async fetchCodeRepos(
    iteratee: ResourceIteratee<TravisCIRepository>,
  ): Promise<Response> {
    await this.paginatedRequest<TravisCIRepository>(
      this.withBaseUri(`/repos?limit=${this.perPage}`),
      'GET',
      iteratee,
      'repositories',
    );
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
