const { expect } = require('chai');
const input = require('../../src/util/input.js');

describe('./src/util/input.js', function() {
  describe('input', function() {
    describe('toNumber()', function() {

      it('should return a number when given a number', function() {
        const result = input.toNumber(10);
        expect(result).to.be.a('number');
      });

      it('should return a number when given a numeric string', function() {
        const result = input.toNumber('10');
        expect(result).to.be.a('number');
      });

      it('should return null when given a non-numeric value', function() {
        const resultA = input.toNumber('10k');
        const resultB = input.toNumber('abc');
        const resultC = input.toNumber('abc123');

        expect(resultA).to.equal(null);
        expect(resultB).to.equal(null);
        expect(resultC).to.equal(null);
      });

    });
  });
});
