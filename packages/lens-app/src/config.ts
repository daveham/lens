export interface IConfig {
  dataHost: string;
}

declare var process : {
  env: {
    REACT_APP_REST_SERVER: string
  }
};

const config: IConfig = {
  dataHost: process.env.REACT_APP_REST_SERVER
};

export default function getConfig(): IConfig {
  return config;
}
