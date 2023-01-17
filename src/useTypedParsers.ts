import { z } from 'zod'

export type TypedParsersSchema<Schema extends z.ZodSchema> =
    Omit<Schema,
        | 'parse'
        | 'parseAsync'
        | 'safeParse'
        | 'safeParseAsync'
    > & {
        parse ( data: z.infer<Schema> ): ReturnType<Schema[ 'parse' ]>
        parseAsync ( data: z.infer<Schema> ): ReturnType<Schema[ 'parseAsync' ]>
        safeParse ( data: z.infer<Schema> ): ReturnType<Schema[ 'safeParse' ]>
        safeParseAsync ( data: z.infer<Schema> ): ReturnType<Schema[ 'safeParseAsync' ]>
    }

export const useTypedParsers = <Schema extends z.ZodSchema>
    ( schema: Schema ): TypedParsersSchema<Schema> => schema as any



// const schemaWithTypedParse = useTypedParsers( z.object( {
//     foo: z.literal( 'foo' ),
// } ) )

// schemaWithTypedParse.safeParse( { foo: 'foo' } )
// schemaWithTypedParse.parseAsync( 'hello' )
// schemaWithTypedParse.safeParseAsync( 'hello' )
// schemaWithTypedParse.parse( 'hello' )
// //                          ^^^^^^^
// // Argument of type 'string' is not assignable to parameter of type '{ email: string; }'.