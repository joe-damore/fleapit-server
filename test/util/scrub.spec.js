const { expect } = require('chai');
const scrub = require('../../src/util/scrub.js');

describe('./src/util/scrub.js', function() {

  /*
   * The scrub function's purpose is to remove unnecessary or sensitive fields
   * from an object, typically so that it can then safely be served to the
   * client.
   *
   * These tests ensure that this function behaves as expected.
   */
  describe('scrub()', function() {

    /*
     * Ensures that all of the specified properties are scrubbed from the
     * input object.
     */
    it('should remove specified properties from given object', function() {

      // These properties should be scrubbed from the input object.
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


    /*
     * Ensures that unspecified properties do not get scrubbed from the input
     * object.
     */
    it('should not remove unspecified properties from given object', function() {

      // These properties should be scrubbed from the input object.
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

    /*
     * Ensures that the input object is unmodified when no properties are
     * specified to scrub.
     */
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
