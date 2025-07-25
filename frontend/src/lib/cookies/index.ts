import Cookies from 'js-cookie';

export const SessionToken = {
  get: (name: string) => Cookies.get(name),
  set: (name: string, values: string) => Cookies.set(name, values),
  remove: (name: string) => Cookies.remove(name),
};
