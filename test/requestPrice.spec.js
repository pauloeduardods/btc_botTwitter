const requestPrice = require('../src/requestPrice');

describe('objParams test', () => {
  const obj = { a: 1, b: { ba: 'ola', bb: { bba: 1000, bbb: [1, 2, 3] } }, c: 3 };
  it('test if works', () => {
    expect(requestPrice.objParams(obj, 'a')).toBe(1);
    expect(requestPrice.objParams(obj, 'b')).toEqual({ ba: 'ola', bb: { bba: 1000, bbb: [1, 2, 3] } });
    expect(requestPrice.objParams(obj, 'b', 'ba')).toBe('ola');
    expect(requestPrice.objParams(obj, 'b', 'bb', 'bba')).toBe(1000);
    expect(requestPrice.objParams(obj, 'b', 'bb', 'bbb')).toEqual([1, 2, 3]);
    expect(requestPrice.objParams(obj, 'c')).toBe(3);
    expect(obj).toEqual({ a: 1, b: { ba: 'ola', bb: { bba: 1000, bbb: [1, 2, 3] } }, c: 3 })
  });
  it('test if fails', () => {
    expect(requestPrice.objParams(obj, 10, 20)).toBeUndefined();
    expect(requestPrice.objParams(obj, 'node', 'js')).toBeUndefined();
  });
});

describe('requestPrice test', () => {
  it('test if works', () => {
    expect(requestPrice.requestPrice()).toEqual();
  });
});

