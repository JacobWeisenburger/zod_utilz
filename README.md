<div align='center'>
    <img src='logo.svg' width='200px' alt='Zod Utilz logo' />
    <h1>Zod Utilz</h1>
    <h3>
        Framework agnostic utilities for
        <a href='https://github.com/colinhacks/zod' rel='nofollow'>
            Zod
        </a>
    </h3>
</div>

<br>

<div align='center'>
    <a href='https://github.com/JacobWeisenburger' rel='nofollow'>
        <img alt='Created by Jacob Weisenburger'
            src='https://img.shields.io/badge/created%20by-Jacob%20Weisenburger-274D82.svg'>
    </a>
    <a href='https://github.com/JacobWeisenburger/zod_utilz/stargazers' rel='nofollow'>
        <img alt='stars' src='https://img.shields.io/github/stars/JacobWeisenburger/zod_utilz?color=blue'>
    </a>
    <a href='https://www.npmjs.com/package/zod_utilz' rel='nofollow'>
        <img alt='downloads' src='https://img.shields.io/npm/dw/zod_utilz?color=blue'>
    </a>
</div>

<div align='center'>
    <a href='https://www.npmjs.com/package/zod_utilz' rel='nofollow'>
        <img alt='npm' src='https://img.shields.io/npm/v/zod_utilz?color=blue'>
    </a>
    <a href='https://deno.land/x/zod_utilz' rel='nofollow'>
        <img alt='deno' src='https://shield.deno.dev/x/zod_utilz'>
    </a>
</div>

## Table of contents
- [Purpose](#purpose)
- [Contribute](#contribute)
- [Yet another library](#yet-another-library)
- [Installation](#installation)
    - [From npm (Node/Bun)](#from-npm-nodebun)
- [Getting Started](#getting-started)
    - [import](#import)
- [Utilz](#utilz)
    - [SPR (SafeParseResult)](#spr)
    - [makeErrorMap](#makeerrormap)
    - [useTypedParsers](#usetypedparsers)
    - [coerce](#coerce)
    - [useURLSearchParams](#useurlsearchparams)
    - [useFormData](#useformdata)
- [TODO](#todo)

## Purpose
- Simplify common tasks in [Zod](https://github.com/colinhacks/zod)
- Fill the gap of features that might be missing in [Zod](https://github.com/colinhacks/zod)
- Provide implementations for potential new features in [Zod](https://github.com/colinhacks/zod)

## Contribute
Always open to ideas. Positive or negative, all are welcome. Feel free to contribute an [issue](https://github.com/JacobWeisenburger/zod_utilz/issues) or [PR](https://github.com/JacobWeisenburger/zod_utilz/pulls).

## Yet another library
You might not want to install yet another library only to get access to that one [Util](#utilz) you need. No worries. Feel free to copy and paste the code you need into your project. It won't get updated when this library gets updated, but it will reduce your bundle size. :D

Perhaps in the future there will be a way to install only the [Utilz](#utilz) you need. If you know how to do this, please [let me know](https://github.com/JacobWeisenburger/zod_utilz/issues).

## Installation

### From npm (Node/Bun)
```sh
npm install zod_utilz
yarn add zod_utilz
pnpm add zod_utilz
bun add zod_utilz
```

## Getting Started

### import
#### [Node/Bun](https://www.npmjs.com/package/zod_utilz)
```ts
import { zu } from 'zod_utilz'
```

#### [Deno](https://deno.land/x/zod_utilz)
```ts
import { zu } from 'https://deno.land/x/zod_utilz/mod.ts'
// or
import { zu } from 'npm:zod_utilz'
```

## Utilz

### SPR
SPR stands for SafeParseResult

This enables [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) or [nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) for `z.SafeParseReturnType`.

```ts
import { zu } from 'zod_utilz'
const schema = z.object( { foo: z.string() } )
const result = zu.SPR( schema.safeParse( { foo: 42 } ) )
const fooDataOrErrors = result.data?.foo ?? result.error?.format().foo?._errors
```

### makeErrorMap
Simplifies the process of making a `ZodErrorMap`
```ts
import { zu } from 'zod_utilz'

const errorMap = zu.makeErrorMap( {
    required: 'Custom required message',
    invalid_type: ( { data } ) => `${ data } is an invalid type`,
    too_big: ( { maximum } ) => `Maximum length is ${ maximum }`,
    invalid_enum_value: ( { data, options } ) =>
        `${ data } is not a valid enum value. Valid options: ${ options?.join( ' | ' ) } `,
} )

const stringSchema = z.string( { errorMap } ).max( 32 )

zu.SPR( stringSchema.safeParse( undefined ) ).error?.issues[ 0 ].message
// Custom required message

zu.SPR( stringSchema.safeParse( 42 ) ).error?.issues[ 0 ].message
// 42 is an invalid type

zu.SPR( stringSchema.safeParse( 'this string is over the maximum length' ) ).error?.issues[ 0 ].message
// Maximum length is 32

const enumSchema = z.enum( [ 'foo', 'bar' ], { errorMap } )

zu.SPR( enumSchema.safeParse( 'baz' ) ).error?.issues[ 0 ].message
// baz is not a valid enum value. Valid options: foo | bar
```

### useTypedParsers
Enables compile time type checking for zod parsers.
```ts
import { zu } from 'zod_utilz'
const schemaWithTypedParsers = zu.useTypedParsers( z.literal( 'foo' ) )

schemaWithTypedParsers.parse( 'foo' )
// no ts errors

schemaWithTypedParsers.parse( 'bar' )
//                            ^^^^^
// Argument of type '"bar"' is not assignable to parameter of type '"foo"'
```

### coerce
Coercion that treats errors like normal zod errors. Prevents throwing errors when using `safeParse`.

#### z.bigint()
```ts
import { zu } from 'zod_utilz'
const bigintSchema = zu.coerce( z.bigint() )
bigintSchema.parse( '42' ) // 42n
bigintSchema.parse( '42n' ) // 42n
zu.SPR( bigintSchema.safeParse( 'foo' ) ).error?.issues[ 0 ].message
// 'Expected bigint, received string'
```

#### z.boolean()
```ts
import { zu } from 'zod_utilz'
const booleanSchema = zu.coerce( z.boolean() )

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
// only exception to normal boolean coercion rules
booleanSchema.parse( 'false' ) // false

// https://developer.mozilla.org/en-US/docs/Glossary/Falsy
// falsy => false
booleanSchema.parse( false ) // false
booleanSchema.parse( 0 ) // false
booleanSchema.parse( -0 ) // false
booleanSchema.parse( 0n ) // false
booleanSchema.parse( '' ) // false
booleanSchema.parse( null ) // false
booleanSchema.parse( undefined ) // false
booleanSchema.parse( NaN ) // false

// truthy => true
booleanSchema.parse( 'foo' ) // true
booleanSchema.parse( 42 ) // true
booleanSchema.parse( [] ) // true
booleanSchema.parse( {} ) // true
```

#### z.number().array()
```ts
import { zu } from 'zod_utilz'
const numberArraySchema = zu.coerce( z.number().array() )

// if the value is not an array, it is coerced to an array with one coerced item
numberArraySchema.parse( 42 ) // [ 42 ]
numberArraySchema.parse( '42' ) // [ 42 ]

// if the value is an array, it coerces each item in the array
numberArraySchema.parse( [] ) // []
numberArraySchema.parse( [ '42', 42 ] ) // [ 42, 42 ]

zu.SPR( numberArraySchema.safeParse( 'foo' ) ).error?.issues[ 0 ].message
// 'Expected number, received nan'
```

### useURLSearchParams
A way to parse URLSearchParams
```ts
import { zu } from 'zod_utilz'
const schema = zu.useURLSearchParams(
    z.object( {
        string: z.string(),
        number: z.number(),
        boolean: z.boolean(),
    } )
)

zu.SPR( schema.safeParse(
    new URLSearchParams( {
        string: 'foo',
        number: '42',
        boolean: 'false',
    } )
) ).data
// { string: 'foo', number: 42, boolean: false }

zu.SPR( schema.safeParse(
    new URLSearchParams( {
        string: '42',
        number: 'false',
        boolean: 'foo',
    } )
) ).error?.flatten().fieldErrors
// {
//     string: [ 'Expected string, received number' ],
//     number: [ 'Expected number, received boolean' ],
//     boolean: [ 'Expected boolean, received string' ],
// }
```

### useFormData
A way to parse FormData
```ts
import { zu } from 'zod_utilz'
const schema = zu.useFormData(
    z.object( {
        string: z.string(),
        number: z.number(),
        boolean: z.boolean(),
        file: z.instanceof( File ),
        manyStrings: zu.coerce( z.string().array().min( 2 ) ),
        manyNumbers: zu.coerce( z.number().array().min( 2 ) ),
        oneStringInArray: zu.coerce( z.string().array().length( 1 ) ),
        oneNumberInArray: zu.coerce( z.number().array().length( 1 ) ),
    } )
)
```
```ts
const file = new File( [], 'filename.ext' )
const formData = new FormData()
formData.append( 'string', 'foo' )
formData.append( 'number', '42' )
formData.append( 'boolean', 'false' )
formData.append( 'file', file )
formData.append( 'oneStringInArray', 'Leeeeeeeeeroyyyyyyy Jenkiiiiiins!' )
formData.append( 'oneNumberInArray', '42' )
formData.append( 'manyStrings', 'hello' )
formData.append( 'manyStrings', 'world' )
formData.append( 'manyNumbers', '123' )
formData.append( 'manyNumbers', '456' )

zu.SPR( schema.safeParse( formData ) ).data,
// {
//     string: 'foo',
//     number: 42,
//     boolean: false,
//     file,
//     manyStrings: [ 'hello', 'world' ],
//     manyNumbers: [ 123, 456 ],
//     oneStringInArray: [ 'Leeeeeeeeeroyyyyyyy Jenkiiiiiins!' ],
//     oneNumberInArray: [ 42 ],
// }
```
```ts
const formData = new FormData()
formData.append( 'string', '42' )
formData.append( 'number', 'false' )
formData.append( 'boolean', 'foo' )
formData.append( 'file', 'filename.ext' )
formData.append( 'oneStringInArray', 'Leeeeeeeeeroyyyyyyy' )
formData.append( 'oneStringInArray', 'Jenkiiiiiins!' )
formData.append( 'oneNumberInArray', 'foo' )
formData.append( 'manyStrings', '123' )
formData.append( 'manyNumbers', 'hello' )

zu.SPR( schema.safeParse( formData ) ).error?.flatten().fieldErrors,
// {
//     string: [ 'Expected string, received number' ],
//     number: [ 'Expected number, received boolean' ],
//     boolean: [ 'Expected boolean, received string' ],
//     file: [ 'Input not instance of File' ],
//     manyStrings: [ 'Array must contain at least 2 element(s)' ],
//     manyNumbers: [
//         'Array must contain at least 2 element(s)',
//         'Expected number, received nan',
//     ],
//     oneStringInArray: [ 'Array must contain exactly 1 element(s)' ],
//     oneNumberInArray: [ 'Expected number, received nan' ],
// }
```

## TODO
Always open to ideas. Positive or negative, all are welcome. Feel free to contribute an [issue](https://github.com/JacobWeisenburger/zod_utilz/issues) or [PR](https://github.com/JacobWeisenburger/zod_utilz/pulls).
- zu.coerce
    - z.date()
    - z.object()
        - recursively coerce props
        - https://github.com/colinhacks/zod/discussions/1910
- Partial Safe Parse
    - https://gist.github.com/JacobWeisenburger/d5dbb4d5bcbb287b7661061a78536423
- BaseType (Recursively get the base type of a Zod type)
  - zu.baseType( z.string() ) => z.string()
  - zu.baseType( z.string().optional() ) => z.string()
  - zu.baseType( z.string().optional().refine() ) => z.string()
  - zu.baseType( z.string().array().optional().refine() ) => z.string().array()
- Make process for minifying
- GitHub Actions
    - Auto publish to npm