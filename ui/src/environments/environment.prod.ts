import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'https://mri-predictive-analytics.onrender.com/mri'
};
