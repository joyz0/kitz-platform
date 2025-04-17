// https://authjs.dev/guides/pages/error
export enum ErrorType {
  CONFIGURATION = 'Configuration',
  ACCESS_DENIED = 'AccessDenied',
  VERIFICATION = 'Verification',
  CREDENTIALS_SIGNIN = 'CredentialsSignin',
  DEFAULT = 'Default',
}

export enum RoutePath {
  INDEX = '/',
  SIGNIN_URL = '/auth/login',
  SIGNUP_URL = '/auth/register',
  ERROR_URL = '/error',
  SYSTEM_USER = '/system/user',
  SYSTEM_INVITE_CODE = '/system/invite-code',
  DOC_INTRO = '/doc/intro',
  DOC_STARTER = '/doc/starter',
  EXAMPLE_GSAP_FLIP = '/example/gsap/flip',
  EXAMPLE_GSAP_SCROLL_TRIGGER = '/example/gsap/scroll-trigger',
  EXAMPLE_GSAP_CANVAS = '/example/gsap/canvas',
  EXAMPLE_GSAP_MATCH_MEDIA = '/example/gsap/match-media',
  EXAMPLE_GSAP_PARALLAX = '/example/gsap/parallax',
  EXAMPLE_OTHER_RIPPLES = '/example/other/ripples',
  EXAMPLE_GRADIENT = '/example/gradient',
}
