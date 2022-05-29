import fs from 'fs';
import path from 'path';

import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

import css from 'rollup-plugin-css-only';
import strip from 'rollup-plugin-strip';
import stylus from 'rollup-plugin-stylus-compiler';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const root = __dirname
    , src = path.join(root, 'src')
    , dst = path.join(root, 'dst')
    , mod = path.join(root, 'node_modules')
    ;

const external = [
    'assert'
  , 'buffer'
  , 'crypto'
  , 'events'
  , 'fs'
  , 'http'
  , 'https'
  , 'net'
  , 'os'
  , 'path'
  , 'querystring'
  , 'stream'
  , 'string_decoder'
  , 'tty'
  , 'url'
  , 'util'
  , 'zlib'
];

const development = {
  input: path.join(src, 'index.ts')
, output: {
    file: path.join(dst, 'js', 'index.js')
  , format: 'cjs'
  , sourcemap: true
  }
, external
, plugins: [
    typescript({
      abortOnError: false
    , cacheRoot: '.cache'
    })
  , replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  , resolve({
      browser: false
    , preferBuiltins: true
    , mainFields: ['dev:module', 'module', 'main', 'jsnext:main']
    , extensions: ['.js', '.json', '.ts']
    })
  , commonjs()
  , json()
  , stylus()
  , css({
      output: function(data, _nodes) {
        const file = path.join(dst, 'css', 'index.css');
        fs.mkdir(path.dirname(file), {recursive: true}, (err) => {
          if (err) throw err;
          fs.writeFileSync(file, data);
        });
      }
    })
  , buble({
      objectAssign: 'Object.assign'
    , transforms: {
        asyncAwait: false
      , forOf: false
      , generator: false
      }
    })
  , strip({
      debugger: false
    , functions: []
    , include: [
        path.join(src, '**/*.ts')
      , path.join(mod, '**/*.(ts|js)')
      ]
    , sourceMap: true
    })
  ]
};

const production = {
  input: path.join(src, 'index.ts')
, output: [{
    file: path.join(dst, 'js', 'index.min.js')
  , format: 'cjs'
  , sourcemap: false
  }]
, external
, plugins: [
    typescript({
      abortOnError: true
    , cacheRoot: '.cache'
    })
  , replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  , resolve({
      browser: false
    , preferBuiltins: true
    , mainFields: ['module', 'main', 'jsnext:main']
    , extensions: ['.js', '.json', '.ts']
    })
  , commonjs()
  , json()
  , stylus()
  , css({
      output: function(data, _nodes) {
        const file = path.join(dst, 'css', 'index.css');
        fs.mkdir(path.dirname(file), {recursive: true}, (err) => {
          if (err) throw err;
          fs.writeFileSync(file, data);
        });
      }
    })
  , buble({
      objectAssign: 'Object.assign'
    , transforms: {
        asyncAwait: false
      , forOf: false
      , generator: false
      }
    })
  , strip({
      debugger: true
    , functions: ['console.*', 'assert.*']
    , include: [
        path.join(src, '**/*.ts')
      , path.join(mod, '**/*.(js|ts)')
      ]
    , sourceMap: false
    })
  , terser()
  ]
};

export default (args) => {
  if (args.configBuildDevelopment === true) {
    return development;
  } else if (args.configBuildProduction === true) {
    return production;
  }
  throw new Error("unknown args given :'(");
};
