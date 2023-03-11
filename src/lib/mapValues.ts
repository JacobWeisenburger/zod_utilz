type ObjectIterator<Obj, Result> =
    ( value: Obj[ keyof Obj ], key: string, collection: Obj ) => Result

export const mapValues = <Obj extends object, Result>
    ( fn: ObjectIterator<Obj, Result> ) => ( obj?: Obj ) => {
        if ( !obj ) return {}
        const map = Object.keys( obj ).reduce( ( map, key ) => {
            map.set( key, fn( obj[ key ], key, obj ) )
            return map
        }, new Map )
        return Object.fromEntries( map )
    }