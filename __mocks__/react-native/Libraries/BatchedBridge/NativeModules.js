/**
 * Mock for react-native/Libraries/BatchedBridge/NativeModules
 * This fixes compatibility with RN 0.76+ and jest-expo
 */

const mockNativeModules = {
  UIManager: {},
  PlatformConstants: {
    forceTouchAvailable: false,
  },
  Networking: {},
  NativeUnimoduleProxy: {
    viewManagersMetadata: {},
  },
};

module.exports = mockNativeModules;
module.exports.default = mockNativeModules;
