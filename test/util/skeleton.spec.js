const { expect } = require('chai');
const skeleton = require('../../src/util/skeleton.js');

describe('./src/util/skeleton.js', function() {

  describe('skeleton()', function() {

    const ModelMock = {
      rawAttributes: {
        id: {},
        createdAt: {},
        updatedAt: {},
        propertyA: {},
        propertyB: {},
      },
    };

    describe('When no options are passed:', function() {

      it(`should exclude 'id', 'createdAt', and 'updatedAt' fields in output`, function() {
        const result = skeleton(ModelMock);

        expect(result).to.not.have.property('id');
        expect(result).to.not.have.property('createdAt');
        expect(result).to.not.have.property('updatedAt');
      });

      it('should include all remaining fields in output', function() {
        const result = skeleton(ModelMock);

        expect(result).to.have.property('propertyA');
        expect(result).to.have.property('propertyB');
      });

      it('should include fields with only null values in output', function() {
        const result = skeleton(ModelMock);

        expect(result).to.have.property('propertyA').that.eql(null);
        expect(result).to.have.property('propertyB').that.eql(null);
      });

    });

    /// TODO Add test cases that accounts for options.

  });

});
