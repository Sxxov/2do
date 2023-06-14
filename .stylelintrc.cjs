module.exports = {
	indent: 'tab',
	extends: 'stylelint-config-standard',
	defaultSeverity: 'warning',
	rules: {
		'string-quotes': 'single',
		indentation: 'tab',
		'declaration-empty-line-before': [
			'always',
			{ ignore: ['after-declaration', 'first-nested'] },
		],
	},
};
