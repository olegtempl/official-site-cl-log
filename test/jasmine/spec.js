const   path = '../../build/js/',		// путь до файла
		testFile = require(`${path}index`);	// импортируем модуль


describe("Jasmine", function() {
  it("makes testing JavaScript awesome!", function() {
    const count = testFile(1);				// экземпляр модуля для этого теста
    expect(count).toBe(2); 				    // сам тест
  });
});