export const omit = <Obj extends Record<string, unknown>>
    ( obj: Obj, keys: ( keyof Obj | string )[] ) => {
    if ( keys.length === 0 ) return obj
    const entries = Object.entries( obj ) as [ keyof Obj, unknown ][]
    return Object.fromEntries(
        entries.filter( ( [ key ] ) => !keys.includes( key ) )
    )
}