const path = require('path');
console.log(__dirname);
const srcDir = path.join(path.resolve(__dirname, '..'), "/src");
console.log(path.join(srcDir, "components/stubs/jquery-stub.js"));