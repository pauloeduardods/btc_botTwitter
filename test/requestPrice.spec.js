const requestPrice = require('../src/requestPrice');

describe('objParams test', () => {
  describe('test if return correct value given', () => {
    const obj = { a: 1, b: { ba: 6, bb: { bba: 1000, bbc: 2000 } }, c: 3 };
    it('test if works', () => {
      expect(requestPrice.objParams(obj, 'a')).toBe('1');
      expect(requestPrice.objParams(obj, 'b')).toEqual({ba: 6, bb:102});
      expect(requestPrice.objParams(obj, 'b', 'ba')).toBe('6');
      expect(requestPrice.objParams(obj, 'b', 'bb', 'bba')).toBe('1000');
      expect(requestPrice.objParams(obj, 'b', 'bb', 'bbb')).toBe('2000');
      expect(requestPrice.objParams(obj, 'c')).toBe('3'); 
      expect(obj).toEqual({ a: 1, b: { ba: 6, bb: { bba: 1000, bbc: 2000 } }, c: 3 })
    });
    it('test if fails', () => {
      expect(requestPrice.objParams(obj, 10, 20)).toBeNull();
      expect(requestPrice.objParams(obj, 'node', 'js')).toBeNull();
    });
  });
});