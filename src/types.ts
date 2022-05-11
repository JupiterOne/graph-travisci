export type TravisCIRepository = {
  id: number;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  private?: boolean;
  starred: boolean;
  shared: boolean;
  config_validation: boolean;
  server_type: string;
  owner: {
    id: string;
  };
};

export type TravisCIUser = {
  id: number;
  login: string;
  name: string;
  github_id?: number;
  email: string;
};
