<h1 align=center>Zod Utilz</h1>
<h3 align=center>
    Framework agnostic utilities for
    <a href=https://github.com/colinhacks/zod rel=nofollow>
        Zod
    </a>
</h3>

<br>

<div align=center>
    <a href=https://github.com/JacobWeisenburger rel=nofollow>
        <img alt='Created by Jacob Weisenburger'
            src=https://img.shields.io/badge/created%20by-Jacob%20Weisenburger-274D82.svg>
    </a>
    <a href=https://github.com/JacobWeisenburger/zod_utilz/stargazers rel=nofollow>
        <img alt=stars src=https://img.shields.io/github/stars/JacobWeisenburger/zod_utilz?color=blue>
    </a>
    <a href=https://www.npmjs.com/package/zod_utilz rel=nofollow>
        <img alt=downloads src=https://img.shields.io/npm/dw/zod_utilz?color=blue>
    </a>
</div>

<div align=center>
    <a href=https://www.npmjs.com/package/zod_utilz rel=nofollow>
        <img alt=npm src=https://img.shields.io/npm/v/zod_utilz?color=blue>
    </a>
    <a href=https://deno.land/x/zod_utilz rel=nofollow>
        <img alt=deno src=https://shield.deno.dev/x/zod_utilz>
    </a>
</div>

## Table of contents
- [Purpose](#purpose)
- [Installation](#installation)
    - [From npm (Node/Bun)](#from-npm-nodebun)
- [Getting Started](#getting-started)
    - [import](#import)
- [Utilz](#api)
    - [SPR (SafeParseResult)](#spr)
    - [makeErrorMap](#makeerrormap)
    - [useTypedParsers](#usetypedparsers)
    - [coerce](#coerce)
- [TODO](#todo)

## Purpose
To fill the gap of features that might be missing in Zod. Always open to suggestions. Feel free to contribute an issue or PR.

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
```ts
// Node/Bun
import { zu } from 'zod_utilz'

// Deno
import { zu } from 'https://deno.land/x/zod_utilz/mod.ts'
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
Treats coercion errors like normal zod errors. Prevents throwing errors when using `safeParse`.
```ts
import { zu } from 'zod_utilz'
const schema = zu.coerce( z.bigint() )
zu.SPR( schema.safeParse( '42' ) ).data
// 42n
zu.SPR( schema.safeParse( 'foo' ) ).error?.issues[ 0 ].message
// 'Expected bigint, received string'
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
) ).error?.format()
// {
//     formErrors: [],
//     fieldErrors: {
//         string: [ 'Expected string, received number' ],
//         number: [ 'Expected number, received boolean' ],
//         boolean: [ 'Expected boolean, received string' ],
//     }
// }
```

## TODO
Always open to suggestions. Feel free to contribute an issue or PR.
- zu.coerce
    - z.date()
    - z.array()
        - recursively do coercion on items
        - z.string().array()
        - z.number().array()
    - z.object()
        - recursively do coercion on props
        - https://github.com/colinhacks/zod/discussions/1910
- FormData
- Partial Safe Parse
    - https://gist.github.com/JacobWeisenburger/d5dbb4d5bcbb287b7661061a78536423
- BaseType (Recursively get the base type of a Zod type)
  - zu.baseType( z.string() ) // z.string
  - zu.baseType( z.string().optional() ) // z.string
  - zu.baseType( z.string().optional().refine() ) // z.string
  - zu.baseType( z.string().array().optional().refine() ) // z.array
- Make process for minifying
- Logo
- GitHub Actions
    - Auto publish to npm