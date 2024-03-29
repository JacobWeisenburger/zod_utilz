import { z } from 'zod'

/**
flatSafeParseAsync allows you to get the valid fields or throw an error

@example
import { zu } from 'zod_utilz'
const userSchema = z.object( { name: z.string(), age: z.number() } )
const data = await zu.flatSafeParse( userSchema, { name: 'foo', age: 42 } )
// {
//     name: 'foo',
//     age: 42,
// }
await zu.flatSafeParse( userSchema, { name: null, age: 42 } )
// Error: Expected string, received null
*/
export async function flatSafeParseAsync<Input> (
    schema: z.Schema<Input>, input: Partial<Input>
): Promise<Input> {
    const result = await schema.safeParseAsync(input);

    if (!result.success) {
      const { fieldErrors, formErrors } = result.error?.flatten() ?? {}

      const fieldErrorsKeys = Object.keys(fieldErrors ?? {})
      const fieldErrorsMessage = fieldErrorsKeys.length ? `${fieldErrorsKeys[0] ?? ''}: ${fieldErrors?.[fieldErrorsKeys[0] as keyof typeof fieldErrors]?.[0] ?? ''}` : undefined;
      const formErrorsMessage = `${formErrors?.[0] ?? ''}`;

      throw new Error(fieldErrorsMessage ?? formErrorsMessage ?? 'Unexpected error');
    }

    return result.data;
}

