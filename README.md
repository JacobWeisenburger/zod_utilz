# Zod Utilz
Framework agnostic utilities for Zod

## Table of contents
- [Purpose](#purpose)
- [Installation](#installation)
    - [From npm (Node/Bun)](#from-npm-nodebun)
- [Getting Started](#getting-started)
    - [import](#import)
- [Utilz](#api)
    - [SPR (SafeParseResult)](#spr)
    - [makeErrorMap](#makeerrormap)
    - Partial Safe Parse (Coming Soon)
  <!-- - [Partial Safe Parse](#partial-safe-parse) -->
    - URLSearchParams (Coming Soon)
  <!-- - [URLSearchParams](#urlsearchparams) -->
    - FormData (Coming Soon)
  <!-- - [FormData](#formdata) -->
- [TODO](#todo)

## Purpose
To fill the gap of features that might be missing in Zod. Always open to suggestions. Feel free to open an issue or PR.

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
console.log( result.data?.foo ?? result.error?.format().foo?._errors )
```

### makeErrorMap
Simplifies the process of making a `ZodErrorMap`
```ts
import { zu } from 'zod_utilz'

const { errorMap } = zu.makeErrorMap( {
    required: 'Custom required message',
    invalid_type: ( { data } ) => `${ data } is an invalid type`,
    invalid_enum_value: ( { data, options } ) =>
        `${ data } is not a valid enum value. Valid options: ${ options?.join( ' | ' ) } `,
} )

const stringSchema = z.string( { errorMap } )
zu.SPR( stringSchema.safeParse( undefined ) ).error?.issues[ 0 ].message,
// Custom required message
zu.SPR( stringSchema.safeParse( 42 ) ).error?.issues[ 0 ].message,
// 42 is an invalid type

const enumSchema = z.enum( [ 'foo', 'bar' ], { errorMap } )
zu.SPR( enumSchema.safeParse( 'baz' ) ).error?.issues[ 0 ].message,
// baz is not a valid enum value. Valid options: foo | bar
```

<!-- ### Partial Safe Parse -->
<!-- https://gist.github.com/JacobWeisenburger/d5dbb4d5bcbb287b7661061a78536423 -->

<!-- ### URLSearchParams -->
<!-- https://gist.github.com/JacobWeisenburger/9256eae415f6b0a04b718d633266a4e0 -->

<!-- ### FormData -->

## TODO
- Partial Safe Parse
- URLSearchParams
- FormData