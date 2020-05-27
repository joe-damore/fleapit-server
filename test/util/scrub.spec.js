const { expect } = require('chai');
const scrub = require('../../src/util/scrub.js');

describe('./src/util/scrub.js', function() {
  describe('scrub()', function() {

    it('should remove specified properties from given object', function() {
      const scrubbedProperties = [
        'propertyA',
        'propertyB',
        'propertyC',
      ];

      const result = scrub({
        propertyA: true,
        propertyB: "hello",
        propertyC: {},
        propertyD: [],
        propertyE: 100,
      }, scrubbedProperties);

      expect(result).to.have.property('propertyA').that.eql(undefined);
      expect(result).to.have.property('propertyB').that.eql(undefined);
      expect(result).to.have.property('propertyC').that.eql(undefined);
    });

    it('should not remove unspecified properties from given object', function() {
      const scrubbedProperties = [
        'propertyA',
        'propertyB',
        'propertyC',
      ];

      const result = scrub({
        propertyA: true,
        propertyB: "hello",
        propertyC: {},
        propertyD: [],
        propertyE: 100,
      }, scrubbedProperties);

      expect(result).to.have.property('propertyD').that.eql([]);
      expect(result).to.have.property('propertyE').that.eql(100);
    });

    it('should not modify given object when no properties are specified', function() {
      const scrubbedProperties = [];

      const input = {
        propertyA: true,
        propertyB: "hello",
        propertyC: {},
        propertyD: [],
        propertyE: 100,
      };

      const result = scrub(input);

      expect(result).to.equal(input);
    });

  });
});
