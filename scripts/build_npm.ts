// deno run -A scripts/build_npm.ts

// https://github.com/denoland/dnt/
import { build, emptyDir } from 'dnt'

await emptyDir( './npm' )

await build( {
    entryPoints: [ './mod.ts' ],
    outDir: './npm',
    shims: { deno: true },
    package: {
        name: 'your-package',
        version: '0.0.1',
        author: 'JacobWeisenburger',
        description: 'Framework agnostic utilities for Zod',
        license: 'MIT',
        repository: {
            type: 'git',
            url: 'https://github.com/JacobWeisenburger/zod-utilz',
        },
    },
} )

// post build steps
Deno.copyFileSync( 'LICENSE', 'npm/LICENSE' )
// Deno.copyFileSync( 'README.md', 'npm/README.md' )