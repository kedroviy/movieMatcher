module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
			"module-resolver",
			{
				root: ["./src"],
				extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
				alias: {
					"@pages": "./src/pages/index.ts",
          "@shared": "./src/shared",
				},
			},
		],
    'react-native-reanimated/plugin',
  ],
};
