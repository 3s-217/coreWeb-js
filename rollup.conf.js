const { rollup } = require("rollup");
const { writeFileSync } = require("fs");
const path = require("path");
const terser = require('@rollup/plugin-terser');
//const strip = require('@rollup/plugin-strip');
const stripBlock = require('rollup-plugin-strip-blocks');
//const stripCode = require('rollup-plugin-strip-code');
//const alias = require('@rollup/plugin-alias');
const replace = require('@rollup/plugin-replace');
//const commonjs = require('rollup-plugin-commonjs');
//const resolve = require('rollup-plugin-node-resolve');
const src = i => path.join(__dirname, 'src', i);
const dest = i => path.join(__dirname, 'build', i);
const _js = i => (i + '.js');
//======================================================
const forms = ['umd', 'iife', 'cjs', 'es'];
const mod = ['cjs', 'es'];
const web = ['iife'];
const min = () => (terser({ format: { comments: false } }));
const parts = i => (buildLib(i, 'parts/' + i));
/**
 * Generates the output configuration for Rollup based on the provided input parameters.
 *
 * @param {...any} i - The input parameters for generating the output configuration.
 * @returns {Object} - The output configuration object.
 */
const outs = (...i) => {
    let file = _js(`${i[0]}${i[1] == 'iife' ? '' : '.' + i[1]}`);
    if (/-min/.test(file)) file = minName(file.replace(/-min/, ''));
    return {
        //dir: "build/jsl/",
        file: dest(file),
        format: i[1],
        //name: 'core',
        exports: i[3] ?? 'named',
        generatedCode: { constBindings: true },
        compact: true,
        plugins: i[2] ?? []
    };
};
function me() {
    const groups = [
        ...buildLib("core"),
        inOut(
            {
                input: src(_js("core")),
                plugins: [
                    ...(['VDOM', 'minimal'].map(removeCode)),
                    exp_Win('utils.js'),
                ]
            },
            [
                ...(web.map(v => outs('core_lite', v, []))),
                ...(web.map(v => outs('core_lite-min', v, [min()]))),
            ]
        ),
    ].concat(...['ws', 'wa'].map(v => parts(v)));
    //console.log(groups);
    //process.exit(0);
    (async () => {
        for (const group of groups) {
            await build(group);
        }
    })();
}
/**
 * Asynchronously builds a bundle using Rollup.
 *
 * @param {Object} options - An object containing the inputs and outputs for the build.
 * @param {Object[]} options.inputs - An array of input options for Rollup.
 * @param {Object[]} [options.outputs=[]] - An array of output options for Rollup.
 * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating whether the build was successful.
 */
async function build({ inputs, outputs = [] }) {
    let bundle;
    let buildFailed = false;
    try {
        bundle = await rollup(inputs);
        //console.log(bundle.watchFiles);
        for (const out of outputs) {
            console.log(path.basename(out.file), out.format);
            await bundle.write(out);
        }
    } catch (error) {
        buildFailed = true;
        console.error(error);
    }
    if (bundle) {
        await bundle.close();
    }
    return !(buildFailed);
}
function inOut(inputs, outputs) { return { inputs, outputs }; }
/**
 * Removes code blocks from the input string.
 *
 * @param {string} s - The string identifier for the code block to remove.
 * @return {object} The result of the stripBlock operation.
 */
function removeCode(s) {
    return stripBlock({ start: s + "_start", end: s + "_end" });
}
/**
 * Returns the file name with '-min' appended before the file extension.
 *
 * @param {string} filePath - the file path to modify
 * @return {string} the modified file name
 */
function minName(filePath) {
    const ext = path.extname(filePath);
    return path.join(
        path.dirname(filePath),
        path.basename(filePath, ext) + '-min' + ext
    );
}
/**
 * Creates a Rollup plugin that replaces occurrences of 'exports.' with 'window.' in the code.
 *
 * @param {Array<string>|string} exclude - An array of strings or a single string representing the files to exclude from the replacement.
 * @param {Object} [values={}] - An object containing key-value pairs to replace in the code.
 * @return {Object} - A Rollup plugin object.
 */
function exp_Win(exclude, values = {}) {
    return replace({
        preventAssignment: true,
        exclude,
        values: {
            'exports.': 'window.',
            'function(exports)': 'function()',
            ...values
        },
    });
}
/**
 * Builds a library by generating bundles using Rollup.
 *
 * @param {string} i - The input file name.
 * @param {string} [a] - The output file name.
 * @param {Array} [p=[]] - An array of Rollup plugins.
 * @return {Array} An array of objects containing input and output options for Rollup.
 */
function buildLib(i, a, p = []) {
    return [
        inOut(
            {
                input: src(_js(i)),
                plugins: [...p, exp_Win()]
            },
            [
                ...(mod.map(v => outs((a ?? i), v))),
                outs((a ?? i) + '-min', 'es', [min()]),
            ]
        ),
        inOut(
            {
                input: src(_js(i)),
                plugins: [...p, exp_Win()]
            },
            [
                ...(web.map(v => outs((a ?? i), v))),
                ...(web.map(v => outs((a ?? i) + '-min', v, [min()]))),
            ]
        )];
}
module.exports = { inOut, parts, exp_Win, buildLib, removeCode, outs, build, minName };
//me();