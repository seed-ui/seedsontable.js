import {SeedsonData} from '../src/seedsondata';

import assert from 'power-assert';

/** @test {SeedsonData} */
describe('SeedsonData', function() {
  lazy('instance', function() { return new SeedsonData([], []) });
  /** @test {SeedsonData#constructor} */
  context('constructor', function() {
    it('basic', function() { assert(this.instance instanceof SeedsonData) });
  });
});
