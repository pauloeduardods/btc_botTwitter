let {requestPrices, objParams, request} = require('../src/requestPrice');
// import * as requestPrice from '../src/requestPrice';

describe('objParams test', () => {
  const obj = { a: 1, b: { ba: 'ola', bb: { bba: 1000, bbb: [1, 2, 3] } }, c: 3 };
  it('test if works', () => {
    expect(objParams(obj, 'a')).toBe(1);
    expect(objParams(obj, 'b')).toEqual({ ba: 'ola', bb: { bba: 1000, bbb: [1, 2, 3] } });
    expect(objParams(obj, 'b', 'ba')).toBe('ola');
    expect(objParams(obj, 'b', 'bb', 'bba')).toBe(1000);
    expect(objParams(obj, 'b', 'bb', 'bbb')).toEqual([1, 2, 3]);
    expect(objParams(obj, 'c')).toBe(3);
    expect(obj).toEqual({ a: 1, b: { ba: 'ola', bb: { bba: 1000, bbb: [1, 2, 3] } }, c: 3 })
  });
  it('test if fails', () => {
    expect(objParams(obj, 10, 20)).toBeUndefined();
    expect(objParams(obj, 'node', 'js')).toBeUndefined();
  });
});

describe('requestPrice test', () => {
  it('test if works', () => {
    const expected = ["INSERT INTO price (name, price, datetime) VALUES(\"biscoint\", \"34083.40\""];
    const param = {
      "message": "",
      "data": {
        "base": "BTC",
        "quote": "BRL",
        "vol": 2.706313,
        "low": 33284,
        "high": 34587,
        "last": 34083.4,
        "ask": 34084.08,
      }
    };
    return expect(requestPrices(param).then(((res) => {
      return res.some(cur => cur.includes(expected));
    }))).resolves.toBeTruthy();
  });
  it('test if it fails', () => {
    const param = {
      "message": "",
      "data": {
        "base": "BTC",
        "quote": "BRL",
        "vol": 2.706313,
        "low": 33284,
        "high": 34587,
        "ask": 34084.08,
      }
    };
    return expect(requestPrices(param).then((res) => res.length === 0)).resolves.toBeTruthy();
  })

});