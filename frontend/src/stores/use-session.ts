import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { IUser } from '~/api/user/user';

export type TStatusSession = 'authenticated' | 'authenticating' | 'unauthenticated' | 'loading';

export interface ISession {
  user: IUser | undefined;
  status: TStatusSession;
}

export interface ISessionStores {
  session: ISession;
  setSession: (session: ISession) => void;
  setUser: (user: IUser) => void;
  setStatus: (status: TStatusSession) => void;
  setRemoved: () => void;
}

export const useSessionStore = create<ISessionStores>()(
  devtools(
    persist(
      immer(set => ({
        session: {
          status: 'unauthenticated',
          access_token: undefined,
          refresh_token: undefined,
          user: undefined,
        },
        setSession: (session: ISession) => {
          set(s => {
            s.session = session;
          });
        },
        setUser: (user: IUser) => {
          set(s => {
            s.session.user = user;
          });
        },
        setStatus: (status: TStatusSession) => {
          set(s => {
            s.session.status = status;
          });
        },
        setRemoved: () => {
          set(s => {
            s.session = {
              user: undefined,
              status: 'unauthenticated',
            };
          });
        },
      })),
      {
        name: 'SessionState',
        partialize: state => ({
          session: {
            status: state.session.status,
            user: state.session.user,
          },
        }),
      }
    ),
    { name: 'SessionStore' }
  )
);
