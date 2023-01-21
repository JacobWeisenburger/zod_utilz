import { z } from 'zod'
import { zu } from "../mod.ts"

function safeParseJSON ( string: string ): any {
    try { return JSON.parse( string ) }
    catch { return string }
}

const formLikeToRecord = ( keys?: string[] ) =>
    ( formLike: FormData | URLSearchParams ): Record<string, any> => {
        return Array.from( keys ?? formLike.keys() ).reduce( ( record, key ) => {
            const values = formLike.getAll( key )
                .map( x => x instanceof File ? x : safeParseJSON( x ) )
            record[ key ] = values.length > 1 ? values : values[ 0 ]
            return record
        }, {} as Record<string, any> )
    }

const useFormLike = ( type: typeof FormData | typeof URLSearchParams ) => <
    Schema extends z.ZodObject<z.ZodRawShape, z.UnknownKeysParam>
> ( schema: Schema ) => {
    const { unknownKeys } = schema._def
    const keys = unknownKeys == 'strip' ? Object.keys( schema.shape ) : undefined

    // console.log(
    //     Object.values( schema.shape ).map( x => x.constructor.name )
    // )

    return z.instanceof( type )
        .transform( formLikeToRecord( keys ) )
        // .pipe( zu.coerce( schema ) )
        .pipe( schema )
}

/**
 * A way to parse URLSearchParams
 * 
 * ### Usage:
 * ```
 * import { zu } from 'zod_utilz'
 * const schema = zu.useURLSearchParams(
 *     z.object( {
 *         string: z.string(),
 *         number: z.number(),
 *         boolean: z.boolean(),
 *     } )
 * )
 * 
 * zu.SPR( schema.safeParse(
 *     new URLSearchParams( {
 *         string: 'foo',
 *         number: '42',
 *         boolean: 'false',
 *     } )
 * ) ).data
 * // { string: 'foo', number: 42, boolean: false }
 * 
 * zu.SPR( schema.safeParse(
 *     new URLSearchParams( {
 *         string: '42',
 *         number: 'false',
 *         boolean: 'foo',
 *     } )
 * ) ).error?.flatten().fieldErrors
 * // {
 * //     string: [ 'Expected string, received number' ],
 * //     number: [ 'Expected number, received boolean' ],
 * //     boolean: [ 'Expected boolean, received string' ],
 * // }
 * ```
 */
export const useURLSearchParams = <Schema extends z.ZodObject<z.ZodRawShape, z.UnknownKeysParam>>
    ( schema: Schema ) => useFormLike( URLSearchParams )( schema )

/**
A way to parse FormData

```
const schema = zu.useFormData(
    z.object( {
        string: z.string(),
        number: z.number(),
        boolean: z.boolean(),
        file: z.instanceof( File ),
    } )
)
```

@example
import { zu } from 'zod_utilz'
const file = new File( [], 'filename.ext' )
const formData = new FormData()
formData.append( 'string', 'foo' )
formData.append( 'number', '42' )
formData.append( 'boolean', 'false' )
formData.append( 'file', file )

zu.SPR( schema.safeParse( formData ) ).data,
// { string: 'foo', number: 42, boolean: false, file }

@example
import { zu } from 'zod_utilz'
const formData = new FormData()
formData.append( 'string', '42' )
formData.append( 'number', 'false' )
formData.append( 'boolean', 'foo' )
formData.append( 'file', 'filename.ext' )

zu.SPR( schema.safeParse( formData ) ).error?.flatten().fieldErrors,
// {
//     string: [ 'Expected string, received number' ],
//     number: [ 'Expected number, received boolean' ],
//     boolean: [ 'Expected boolean, received string' ],
//     file: [ 'Input not instance of File' ],
// }
*/
export const useFormData = <Schema extends z.ZodObject<z.ZodRawShape, z.UnknownKeysParam>>
    ( schema: Schema ) => useFormLike( FormData )( schema )