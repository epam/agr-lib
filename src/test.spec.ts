import { Testing } from './index';
import { expect } from 'chai';

describe('Test', () => {
  it(' Test1', () => {
    expect(new Testing().calc()).to.equal(5);
  });
  it(' Test2', () => {
    expect(new Testing().calc()).to.equal(5);
  });
});
