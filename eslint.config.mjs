import nextVitals from 'eslint-config-next/core-web-vitals'

const config = [
    ...nextVitals,
    {
        ignores: ['.next/**', 'node_modules/**', 'pipeline/**'],
    },
    {
        rules: {
            // Pre-existing "reset state when inputs change" effects. They work;
            // flag them rather than fail the build until they are refactored.
            'react-hooks/set-state-in-effect': 'warn',
        },
    },
]

export default config
