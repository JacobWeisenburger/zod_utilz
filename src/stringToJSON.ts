import { z } from 'zod'
import type { json } from './json.ts'

const stringToJSONSchema = z.string()
    .transform( ( str, ctx ): z.infer<ReturnType<typeof json>> => {
        try {
            return JSON.parse( str )
        } catch ( e ) {
            ctx.addIssue( { code: 'custom', message: 'Invalid JSON' } )
            return z.NEVER
        }
    } )

/**
zu.stringToJSON() is a schema that validates JSON encoded as a string, then returns the parsed value

@example
import { zu } from 'zod_utilz'
const schema = zu.stringToJSON()
schema.parse( 'true' ) // true
schema.parse( 'null' ) // null
schema.parse( '["one", "two", "three"]' ) // ['one', 'two', 'three']
schema.parse( '<html>not a JSON string</html>' ) // throws
*/
export const stringToJSON = () => stringToJSONSchema