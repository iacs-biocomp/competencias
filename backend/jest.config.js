module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'^sharedInterfaces/(.*)$': '<rootDir>/../../sharedCode/interfaces/$1',
		'^sharedCode/(.*)$': '<rootDir>/../../sharedCode/$1',
		'^src/(.*)$': '<rootDir>/$1',
	},
};
