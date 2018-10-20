const path = require("../../configs/path.json")

/**
 * @description Содержит список комманд необходимых для создания интерфейса при разных размерах экрановй
 * @property { string } открытие новой вкладки в консоли ( для OC Linux Mint xfce)
 * @property { string } старт selenium  сервера
 * @property { string } исполнение файла с тестами
 * @deprecated - не запускаеться тесты в открытом окне консоли
 */

const guiTestsCommand = [
  // 'xfce4-terminal --tab',
  // 'java -jar -Dwebdriver.gecko.driver=./configs/geckodriver/geckodriver ./configs/geckodriver/selenium_server.jar &',
  `node ${path.tests.screenshots}`
];

module.exports = guiTestsCommand;
