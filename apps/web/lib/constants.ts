// https://authjs.dev/guides/pages/error
export enum ErrorType {
  CONFIGURATION = 'Configuration',
  ACCESS_DENIED = 'AccessDenied',
  VERIFICATION = 'Verification',
  CREDENTIALS_SIGNIN = 'CredentialsSignin',
  DEFAULT = 'Default',
}

export const TOKEN_STORAGE_KEY = 'authjs.session-token';

export enum EventType {
  REQUEST_ERROR = 'request_error',
}

export enum RoutePath {
  INDEX = '/',
  DASHBOARD = '/dashboard/',
  SIGNIN_URL = '/auth/login',
  SIGNUP_URL = '/auth/register',
  ERROR_URL = '/error',
  SYSTEM_USER = '/dashboard/system/user',
  SYSTEM_INVITE_CODE = '/dashboard/system/invite-code',
  DOC_INTRO = '/dashboard/doc/intro',
  DOC_STARTER = '/dashboard/doc/starter',
  EXAMPLE_GSAP_FLIP = '/dashboard/example/gsap/flip',
  EXAMPLE_GSAP_SCROLL_TRIGGER = '/dashboard/example/gsap/scroll-trigger',
  EXAMPLE_GSAP_CANVAS = '/dashboard/example/gsap/canvas',
  EXAMPLE_GSAP_MATCH_MEDIA = '/dashboard/example/gsap/match-media',
  EXAMPLE_GSAP_PARALLAX = '/dashboard/example/gsap/parallax',
  EXAMPLE_OTHER_RIPPLES = '/dashboard/example/other/ripples',
  EXAMPLE_GRADIENT = '/dashboard/example/gradient',
}
