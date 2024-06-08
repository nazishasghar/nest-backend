// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ESLint } = require('eslint')

const cli = new ESLint({})

const filterAsync = async (array, callback) => {
    const results = await Promise.all(array.map((value, index) => callback(value, index)))
    return array.filter((_, i) => results[i])
}

const removeIgnoredFiles = async (files) => {
    const filteredFiles = await filterAsync(files, async (file) => {
        const isIgnored = await cli.isPathIgnored(file)
        return !isIgnored
    })
    return filteredFiles.join(' ')
}

module.exports = {
    '*.{js,json,vue,ts,jsx,tsx}': async (files) => [
        'eslint --ext .ts,.js,.vue,.jsx,.tsx,.mjs,.mts --ignore-path .eslintignore --max-warnings 0 --fix ' +
            (await removeIgnoredFiles(files)),
        'prettier --config .prettierrc --ignore-path .eslintignore --write ' + files.join(' '),
        'npx tsc',
    ],
    '*.{html,htm}': 'prettier --config .prettierrc --ignore-path .eslintignore --write ',
    '*.{css,styl,scss,vue}': 'stylelint --fix',
}
