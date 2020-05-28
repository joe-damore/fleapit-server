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

    describe('When options are not passed:', function() {

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

    describe('When options are passed:', function() {

      it(`should hide fields when 'includeHiddenFields' is false`, function() {
        const options = {
          includeHiddenFields: false,
        };

        const result = skeleton(ModelMock, options);

        expect(result).to.not.have.property('id');
        expect(result).to.not.have.property('createdAt');
        expect(result).to.not.have.property('updatedAt');
      });

      it(`should not hide fields when 'includeHiddenFields' is true`, function() {
        const options = {
          includeHiddenFields: true,
        };

        const result = skeleton(ModelMock, options);

        expect(result).to.have.property('id');
        expect(result).to.have.property('createdAt');
        expect(result).to.have.property('updatedAt');
      });

      it(`should only hide given fields when 'hiddenFields' is specified`, function() {
        const options = {
          includeHiddenFields: false,
          hiddenFields: [
            'propertyA',
            'propertyB',
          ],
        };

        const result = skeleton(ModelMock, options);

        expect(result).to.not.have.property('propertyA');
        expect(result).to.not.have.property('propertyB');
        expect(result).to.have.property('id');
        expect(result).to.have.property('createdAt');
        expect(result).to.have.property('updatedAt');
      });

    });

  });

});
