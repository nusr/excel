import { buildTree } from './util';

describe('invalid expressions', () => {
  it('SUM(', () => {
    expect(() => {
      buildTree('SUM(');
    }).toThrow();
  });
  it('+', () => {
    expect(() => {
      buildTree('+');
    }).toThrow();
  });
  it('SUM(,,', () => {
    expect(() => {
      buildTree('SUM(,,');
    }).toThrow();
  });
  it('>', () => {
    expect(() => {
      buildTree('>');
    }).toThrow();
  });
  it('a >', () => {
    expect(() => {
      buildTree('a >');
    }).toThrow();
  });
  it('> b', () => {
    expect(() => {
      buildTree('> b');
    }).toThrow();
  });
});
