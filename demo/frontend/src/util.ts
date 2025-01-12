import { RemoteProvider, LocalProvider } from './provider';

export enum Page {
  Simple = 'simple',
  Collaboration = 'collaboration',
  Home = 'home',
}

export function getProvider(callback: (id: string) => void = () => {}) {
  const httpBaseUrl = import.meta.env.VITE_HTTP_BASE_URL;
  const provider = httpBaseUrl
    ? new RemoteProvider(httpBaseUrl, callback)
    : new LocalProvider(callback);
  return provider;
}
