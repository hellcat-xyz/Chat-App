const token_gen = require('crypto')
function gen() {
    const value = token_gen.randomBytes(64).toString('hex')
    console.log(value)
}
gen()


