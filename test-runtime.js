// Runtime initialization test - checks if modules can be imported
console.log('🧪 Testing critical dependencies...\n');

const tests = [
  {
    name: 'AsyncStorage',
    test: () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      return AsyncStorage.default ? 'OK' : 'FAIL: No default export';
    }
  },
  {
    name: 'Zustand',
    test: () => {
      const { create } = require('zustand');
      return create ? 'OK' : 'FAIL: No create function';
    }
  },
  {
    name: 'React Navigation',
    test: () => {
      const nav = require('@react-navigation/native');
      return nav.NavigationContainer ? 'OK' : 'FAIL: No NavigationContainer';
    }
  },
  {
    name: 'Gesture Handler',
    test: () => {
      const gh = require('react-native-gesture-handler');
      return gh.GestureHandlerRootView ? 'OK' : 'FAIL: No GestureHandlerRootView';
    }
  },
  {
    name: 'Lucide Icons',
    test: () => {
      const icons = require('lucide-react-native');
      return icons.Home ? 'OK' : 'FAIL: No Home icon';
    }
  }
];

let passed = 0;
let failed = 0;

tests.forEach(({ name, test }) => {
  try {
    const result = test();
    if (result === 'OK') {
      console.log(`✅ ${name}: ${result}`);
      passed++;
    } else {
      console.log(`❌ ${name}: ${result}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message.split('\n')[0]}`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n✅ All dependencies OK - Runtime should work');
} else {
  console.log('\n⚠️  Some dependencies failed - May cause runtime errors');
  console.log('Run: npm install');
}

process.exit(failed > 0 ? 1 : 0);
