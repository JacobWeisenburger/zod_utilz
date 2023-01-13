# Zod Utilz
Framework agnostic utilities for Zod

## Table of contents
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [import](#import)
  - [getErrorMessage](#geterrormessage)
  - [makeErrorMap](#makeerrormap)
  <!-- - [URLSearchParams](#urlsearchparams) -->
  <!-- - [FormData](#formdata) -->
  <!-- - [Partial Safe Parse](#partial-safe-parse) -->

## Installation

### From npm (Node/Bun)
```ts
npm install zod_utilz zod       # npm
yarn add zod_utilz zod          # yarn
bun add zod_utilz zod           # bun
pnpm add zod_utilz zod          # pnpm
```

## Getting Started

### import
```ts
import {} from 'npm:zod_utilz'  # Deno
import {} from 'zod_utilz'      # Node/Bun
```

### getErrorMessage
```ts
import { getErrorMessage } from 'zod_utilz'
const schema = z.string()
zUtilz.getErrorMessage( schema.safeParse( undefined ) )
// Required
```

### makeErrorMap
```ts
import { makeErrorMap, getErrorMessage } from 'zod_utilz'

const { errorMap } = zUtilz.makeErrorMap( {
    required: 'Custom required message',
    invalid_type: ( { data } ) => `${ data } is an invalid type`,
    invalid_enum_value: ( { data, options } ) =>
        `${ data } is not a valid enum value. Valid options: ${ options?.join( ' | ' ) } `,
} )

const stringSchema = z.string( { errorMap } )
zUtilz.getErrorMessage( stringSchema.safeParse( undefined ) )
// Custom required message
zUtilz.getErrorMessage( stringSchema.safeParse( 42 ) )
// 42 is an invalid type

const enumSchema = z.enum( [ 'foo', 'bar' ], { errorMap } )
zUtilz.getErrorMessage( enumSchema.safeParse( 'baz' ) )
// baz is not a valid enum value. Valid options: foo | bar
```

<!-- ### URLSearchParams -->
<!-- https://gist.github.com/JacobWeisenburger/9256eae415f6b0a04b718d633266a4e0 -->

<!-- ### FormData -->

<!-- ### Partial Safe Parse -->
<!-- https://gist.github.com/JacobWeisenburger/d5dbb4d5bcbb287b7661061a78536423 -->
