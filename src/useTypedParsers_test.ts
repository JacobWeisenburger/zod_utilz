import { z } from 'zod'
import { zu } from '../mod.ts'
import { assertObjectMatch } from 'std/testing/asserts.ts'
import { Equal, Expect, NotEqual } from '@type-challenges/utils'

Deno.test( 'useTypedParsers type tests', () => {
    const schemaWithTypedParse = zu.useTypedParsers( z.object( {
        foo: z.literal( 'foo' ),
    } ) )

    type parseTest = Expect<Equal<
        Parameters<typeof schemaWithTypedParse.parse>[ 0 ],
        z.infer<typeof schemaWithTypedParse>
    >>
    type safeParseTest = Expect<Equal<
        Parameters<typeof schemaWithTypedParse.safeParse>[ 0 ],
        z.infer<typeof schemaWithTypedParse>
    >>
    type parseAsyncTest = Expect<Equal<
        Parameters<typeof schemaWithTypedParse.parseAsync>[ 0 ],
        z.infer<typeof schemaWithTypedParse>
    >>
    type safeParseAsyncTest = Expect<Equal<
        Parameters<typeof schemaWithTypedParse.safeParseAsync>[ 0 ],
        z.infer<typeof schemaWithTypedParse>
    >>

    type parseTestError = Expect<NotEqual<
        Parameters<typeof schemaWithTypedParse.parse>[ 0 ],
        'hello'
    >>
    type safeParseTestError = Expect<NotEqual<
        Parameters<typeof schemaWithTypedParse.safeParse>[ 0 ],
        'hello'
    >>
    type parseAsyncTestError = Expect<NotEqual<
        Parameters<typeof schemaWithTypedParse.parseAsync>[ 0 ],
        'hello'
    >>
    type safeParseAsyncTestError = Expect<NotEqual<
        Parameters<typeof schemaWithTypedParse.safeParseAsync>[ 0 ],
        'hello'
    >>
} )

Deno.test( 'README Example', () => {
    const schemaWithTypedParsers = zu.useTypedParsers( z.literal( 'foo' ) )

    schemaWithTypedParsers.parse( 'foo' )
    // no ts errors

    // @ts-expect-error
    schemaWithTypedParsers.parse( 'bar' )
    //                            ^^^^^
    // Argument of type '"bar"' is not assignable to parameter of type '"foo"'
} )