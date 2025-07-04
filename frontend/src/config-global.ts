import packageJson from '../package.json';

export type ConfigValue = {
  appName: string;
  appVersion: string;
};

export const CONFIG: ConfigValue = {
  appName: 'Fitness Management System',
  appVersion: packageJson.version,
};
