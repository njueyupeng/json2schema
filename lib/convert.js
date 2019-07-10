const isBoolean = require("./type/isboolean")
const isEmpty = require("./type/isempty")
const isInteger = require("./type/isinteger")
const isNull = require("./type/isnull")
const isNumber = require("./type/isnumber")
const isObject = require("./type/isobject")
const isString = require("./type/isstring")
const isArray = require("./type/isArray")
const stripJsonComments = require('strip-json-comments');

let _option = {
  $id: "http://example.com/root.json",
  $schema: "http://json-schema.org/draft-07/schema#",
  isJsonString: false //  是否是json字符串
}
let _object = null

/**
 * @description entry
 * @param {*} objectStr 
 * @param {*} option 
 */
function convert(objectStr, option = {}) {
  let object = objectStr;
  if (option.isJsonString) {
    if (!isString(objectStr)) {
      throw new TypeError('被转换的值必须是json字符串');
    }
    try {
      object = JSON.parse(stripJsonComments(objectStr));
    } catch (error) {
      throw new TypeError('被转换的值必须是json字符串');
    }
  }
  return format(object, option)
}

function format(object, option = {}) {

  if (!isObject(object)) {
    throw new TypeError('被转换的值必须是对象或者数组')
  }
  _option = Object.assign(_option, option)
  _object = object;
  let convertResult = {};
  convertResult["$schema"] = _option.$schema;
  if (isArray(object)) {
    // 转换数组
    convertResult = Object.assign(convertResult, _arrayToSchema(object));
  } else {
    // 转换对象
    convertResult = Object.assign(convertResult, _objectToSchema(object));
  }
  convertResult["title"] = 'The Root Schema';
  _object = null;

  return convertResult;
}



function _arrayToSchema(value) {
  let result = _value2object(value, _option.$id, "");
  if (value.length > 0) {
    let objectItem = value[0];
    result['items'] = _value2object(objectItem, '#/items', 'items')
    if (isObject(objectItem) && !isEmpty(objectItem)) {
      // 递归遍历
      let objectItemSchema = _json2schema(objectItem, `#/items`)
      // 合并对象
      result["items"] = Object.assign(result["items"], objectItemSchema)
    }
  }
  return result
}

function _objectToSchema(value) {
  let result = _value2object(value, _option.$id, "")
  let objectSchema = _json2schema(value)
  result = Object.assign(result, objectSchema);
  return result

}

/**
* 递归函数，转换object对象为json schmea 格式
* @param {*} object 需要转换对象
* @param {*} name $id值
*/
function _json2schema(object, id = "") {
  if (!isObject(object)) {
    return {};
  }
  if (id === '' || id == undefined) {
    id = "#"
  }
  let result = {};
  if (isArray(object)) {
    result.items = {};
  } else {
    result.properties = {};
  }
  // 遍历传入的对象
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const element = object[key];
      if (element === undefined) {
        continue;
      }
      let $id = `${id}/properties/${key}`
      // 判断当前 element 的值 是否也是对象，如果是就继续递归，不是就赋值给result
      if (isObject(element)) {
        // 创建当前属性的基本信息
        result['properties'][key] = _value2object(element, $id, key)
        if (isArray(element)) {
          // 针对空数组和有值的数组做不同处理
          if (element.length > 0) {
            // 如果是数组，那么就取第一项
            let elementItem = element[0]
            result['properties'][key]["items"] = _value2object(elementItem, `${$id}/items`, key, 'items')
            // 判断第一项是否是对象,且对象属性不为空
            if (isObject(elementItem) && !isEmpty(elementItem)) {
              // 新增的properties才合并进来
              result["properties"][key]["items"] = Object.assign(result["properties"][key]["items"], _json2schema(elementItem, `${$id}/items`))
            }
          }
        } else {
          // 不是数组，递归遍历获取，然后合并对象属性
          result["properties"][key] = Object.assign(result["properties"][key], _json2schema(element, $id))
        }
      } else {
        // 一般属性直接获取基本信息
        result["properties"][key] = _value2object(element, $id, key)
      }
    }
  }
  return result;
}

/**
 * @param {*} value 
 * @param {*} id 
 * @param {*} key 
 * @description 将目标转换为jsonSChema对象模板
 */
function _value2object(value, id, key = '') {
  let objectTemplate = {
    $id: id,
    title: `The ${key} Schema`
  }

  if (isInteger(value)) {
    objectTemplate.type = "integer"
  } else if (isNumber(value)) {
    objectTemplate.type = "number"
  } else if (isString(value)) {
    objectTemplate.type = "string"
  } else if (isBoolean(value)) {
    objectTemplate.type = "boolean"
  } else if (isNull(value)) {
    objectTemplate.type = "null"
  } else if (isArray(value)) {
    objectTemplate.type = "array"
  } else if (isObject(value)) {
    objectTemplate.type = "object"
  }

  return objectTemplate
}



module.exports = convert

