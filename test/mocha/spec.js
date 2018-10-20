const assert = require('assert'),	// необходима для mocha
	  path = '../../build/js/';		// путь до файла
Object.freeze(assert);

const testFile = require(`${path}index`);	// импортируем модуль

describe('First ', () => {
  it('1', () => {
    const count = testFile(1);				// экземпляр модуля для этого теста
    assert.equal(count, 3);					// сам тест
  });
});