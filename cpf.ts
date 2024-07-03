// Exporting to use 
export const cpf = require("validation-br/dist/cpf");
export const { fake, mask, validate } = require("validation-br/dist/cpf");
export const fakeCpf = cpf.fake();
console.log(fakeCpf);
console.log(cpf.mask(fakeCpf));
console.log(cpf.validate(fakeCpf));
