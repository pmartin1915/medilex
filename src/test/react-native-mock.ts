// Shim that re-exports react-native-web as react-native.
// This file exists because react-native/index.js contains Flow syntax
// (import typeof) that Vite/esbuild cannot parse. By aliasing to this
// shim, we bypass the Flow-typed entry point entirely.
export * from 'react-native-web';
