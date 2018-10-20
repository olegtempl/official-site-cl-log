/**
 * @description Содержит список комманд необходимых для запуска сервера selenium
 * @property { string } открытие новой вкладки в консоли ( для OC Linux Mint xfce)
 * @property { string } старт selenium  сервера
 */
const seleniumServerCommand = [
  'xfce4-terminal --tab ',
  'java -jar -Dwebdriver.gecko.driver=./configs/geckodriver/geckodriver ./configs/geckodriver/selenium_server.jar ;'
];

module.exports = seleniumServerCommand;
