// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ESLint } = require('eslint')

const removeIgnoredFiles = async (files) => {
    const eslint = new ESLint()
    const isIgnored = await Promise.all(
        files.map((file) => {
            return eslint.isPathIgnored(file)
        }),
    )
    const filteredFiles = files.filter((_, i) => !isIgnored[i])
    return filteredFiles.join(' ')
}

module.exports = {
    '**/*.{js,jsx,ts,tsx,md,html,css,yml}': async (files) => {
        const filesToLint = await removeIgnoredFiles(files)
        return [`eslint --max-warnings=0 ${filesToLint}`, 'tsc --noEmit']
    },
}
