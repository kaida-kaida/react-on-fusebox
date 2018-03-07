const {
    FuseBox,
    BabelPlugin,
    EnvPlugin,
    WebIndexPlugin,
    QuantumPlugin,
    Sparky,
} = require('fuse-box');
const { src, task, watch, context, fuse } = require('fuse-box/sparky');

context(class {
    getConfig() {
        return FuseBox.init({
            homeDir: 'src',
            output: 'build/$name.js',
            target: 'browser@es6',
            debug: true,
            cache: !this.isProduction,
            sourceMaps: !this.isProduction,
            // hash: this.isProduction,
            useTypescriptCompiler : true,
            // allowSyntheticDefaultImports : true,
            plugins: [
                // WebIndexPlugin({
                //     template : 'index.html'
                // }),
                EnvPlugin({ NODE_ENV: this.isProduction ? 'production' : 'dev' }),
                this.isProduction && BabelPlugin({
                    'presets': [['env', 'react']]
                }),
                this.isProduction && QuantumPlugin({
                    bakeApiIntoBundle: 'bundle',
                    polyfills : ['Promise'],
                    uglify : { es6: true },
                    treeshake : true,
                    css : true,
                }),
            ]
        })
    }
    createBundle(fuse) {
        const app = fuse.bundle('bundle');
        if (!this.isProduction) {
            app.watch();
            app.hmr();
        }
        app.instructions('> App.js');
        return app;
    }
});

task('clean', () => src('build').clean('build').exec());
// task('reload', context => async context => {
//     const fuse = cotext.getConfig();
//     await fuse.sendPageReload();
// });

task('default', ['clean'], async context => {
    const fuse = context.getConfig();
    fuse.dev({
        root: '',
        open: true,
        port: 3334,
        httpServer: true,
    });

    context.createBundle(fuse);
    // await watch('src').exec('reload');
    await fuse.run();
});

task('release', ['clean'], async context => {
    context.isProduction = true;
    const fuse = await context.getConfig();
    context.createBundle(fuse);
    await fuse.run();
});
