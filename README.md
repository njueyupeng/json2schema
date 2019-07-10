# @yp/json2schema

Transform JSON Object to JSON Schema Version 7, Based on [JSON Schema draft-07](http://json-schema.org/)

将 json 转换成 jsonchema 规则，基于 [jsonSchema 草案 7](http://json-schema.org/)的语法规则

## Installation

```bash
$ npm install @yp/json2schema
```

## Usage

### convert json

```javascript
const convert = require('@yp/json2schema');
const data = {
  name: 'test',
};
let convertResult = convert(data);
```

### convert jsonString (support jsonString with comment)

```javascript
const convert = require('@yp/json2schema');
const jsonString = `{
    // Rainbows
    "unicorn": /* ❤ */ "cake" // comment
}`;
let convertResult = convert(jsonString);
```

## Test

```bash
npm run test
```

## TODO

Take the comments out of jsonString and put it into jsonschema as description of keys

支持从 json 的字符串形式中，取出字段对应的注释，并放在 jsonSchema 的字段描述中
