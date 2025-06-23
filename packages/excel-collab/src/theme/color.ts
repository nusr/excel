import { convertColorToDark } from './convert';

export const lightColor = Object.freeze({
  primaryColor: '#217346',
  buttonActiveColor: '#c6c6c6',
  selectionColor: 'rgba(198,198,198,0.3)',
  backgroundColor: '#e6e6e6',
  hoverColor: 'rgba(0, 0, 0, 0.04)',
  scrollbarColor: 'rgba(0, 0, 0, 0.1)',
  scrollbarHoveColor: 'rgba(0, 0, 0, 0.2)',
  dialogBackground: 'rgba(0, 0, 0, 0.6)',
  white: '#ffffff',
  black: '#000000',
  triangleFillColor: '#dddddd',
  contentColor: '#333333',
  borderColor: '#cccccc',
  activeBorderColor: '#808080',
  errorFormulaColor: '#ff0000',
});

export const darkColor = Object.freeze(
  Object.fromEntries(
    Object.entries(lightColor).map(([k, v]) => [k, convertColorToDark(v)]),
  ),
);
