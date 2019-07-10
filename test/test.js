var assert = require('assert');
const Ajv = require("ajv")
const convert = require("../index");

describe('json2schema转换测试', function () {
  it('object type test', () => {
    const data = {
      id: 1,
      name: "how2js",
      booleanTrue: true,
      booleanFalse: false,
      nullType: null,
      listEmpty: [],
      listNumber: [1],
      listString: ["1"],
      listObject: [
        { listId: 1, listName: "mind" }
      ],
      object: {
        userId: 1,
        child: {
          id: 1,
          name: "mind",
          listEmpty: [],
          listNumber: [1],
          listString: ["1"],
          listObject: [
            { listId: 1, listName: "mind" }
          ],
        }
      }
    }
    const schema = convert(data)
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const valid = validate(data)
    assert.equal(valid, true)
  });

  it('empty array type test', () => {
    const data = []
    const schema = convert(data)
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const valid = validate(data)
    assert.equal(valid, true)
  });


  it('base array type test', () => {
    const data = [1]
    const schema = convert(data)
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const valid = validate(data)
    assert.equal(valid, true)
  });

  it('obj array type test', () => {
    const data = [{ id: 1, name: "mind" }]
    const schema = convert(data)
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const valid = validate(data)
    assert.equal(valid, true)
  });

  it('object with comment test', () => {
    const dataWithComment = `{
      /** 
       * comment
      */
      "name": "how2js" // comment
    }`
    const data = {
      "name": "how2js"
    }
    const schema = convert(dataWithComment, { isJsonString: true })
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const valid = validate(data)
    assert.equal(valid, true)
  })
});