/* 
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuType = 'menu-default';

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = 'en';
export const localeOptions = [
  { id: 'en', name: 'English - LTR', direction: 'ltr' },
  { id: 'es', name: 'Español', direction: 'ltr' },
  { id: 'enrtl', name: 'English - RTL', direction: 'rtl' },
];

export const firebaseConfig = {
  apiKey: 'AIzaSyAjoGsHhsbWnrNENON_Fu1nihfX2Z76VUs',
  authDomain: 'ptsession-49bf0.firebaseapp.com',
  databaseURL: 'https://ptsession-49bf0.firebaseio.com',
  projectId: 'ptsession-49bf0',
  storageBucket: 'ptsession-49bf0.appspot.com',
  messagingSenderId: '399301975085',
  appId: '1:399301975085:web:af979bc8c2b7158b812ca4',
  measurementId: 'G-JJCR4ETPCL',
};

export const searchPath = '/app/pages/search';
export const servicePath = 'https://api.coloredstrategies.com';

/* 
Color Options:
"light.purple", "light.blue", "light.green", "light.orange", "light.red", "dark.purple", "dark.blue", "dark.green", "dark.orange", "dark.red"
*/
export const isMultiColorActive = true;
export const defaultColor = 'light.purple';
export const defaultDirection = 'ltr';
export const isDarkSwitchActive = true;
export const themeColorStorageKey = '__theme_color';
export const themeRadiusStorageKey = '__theme_radius';
export const isDemo = false;

export const roles = {
  trainer: 1,
  client: 2,
};

export const SESSION_TYPE = {
  PT: 1,
  NON_PT: 2,
  WEIGH_IN: 3,
  BODY_FAT: 4,
  PURCHASE: 5,
};

export const apiUrl = 'https://ptsession.com/api/';
// export const apiUrl = 'http://localhost:5000/api/';
