export const pick = <Obj extends Record<string, unknown>>
    ( obj: Obj, keys: ( keyof Obj )[] ) => {
    if ( keys.length === 0 ) return {}
    const entries = Object.entries( obj ) as [ keyof Obj, unknown ][]
    return Object.fromEntries(
        entries.filter( ( [ key ] ) => keys.includes( key ) )
    )
}