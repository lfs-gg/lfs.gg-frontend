import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router';
import auth, * as fromAuth from './auth.js'
import echo, * as fromEcho from "./echo";
import calendar, * as fromCalendar from "./calendar";
import userInfo, * as fromUserInfo from './userInfo';
import teamView, * as teamViewInfo from './teamView';
import teamScrims from "./teamScrims";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const userInfoPersistConfig = {
  key: 'userInfo',
  storage: storage,
  blacklist: ['loading']
}

export default (history) => combineReducers({
  router: connectRouter(history),
  auth: auth,
  echo: echo,
  calendar: calendar,
  teamScrims: teamScrims,
  teamView: teamView,
  userInfo: persistReducer(userInfoPersistConfig, userInfo),
})

export const isAuthenticated = state => fromAuth.isAuthenticated(state.auth)
export const accessToken = state => fromAuth.accessToken(state.auth)
export const isAccessTokenExpired = state => fromAuth.isAccessTokenExpired(state.auth)
export const refreshToken = state => fromAuth.refreshToken(state.auth)
export const isRefreshTokenExpired = state => fromAuth.isRefreshTokenExpired(state.auth)
export const authErrors = state => fromAuth.errors(state.auth)
export const registerErrors = state => fromAuth.registerErrors(state.auth)
export const serverMessage = state => fromEcho.serverMessage(state.echo)
export const activeTeam = state => fromUserInfo.activeTeam(state.userInfo);

export function withAuth(headers={}) {
  return (state) => ({
    ...headers,
    'Authorization': `Bearer ${accessToken(state)}`
  })
}

export function withTeam(url) {
  return (state) => (url.replace("<IDENTIFIER>", activeTeam(state)));
}

export function getActiveTeam(){
  return (state) => activeTeam(state);
}
export function asViewer(url, append=false) {
  if(append){
    return (state) => `${url}&viewer=${activeTeam(state)}`
  }else{
    return (state) => `${url}?viewer=${activeTeam(state)}`
  }
}