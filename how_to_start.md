1. First instal the java on your machine.

```bash
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update

sudo apt-get install openjdk-8-jdk
sudo apt-get install openjdk-8-source
apt-cache search jdk
```

```bash
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk
export PATH=$PATH:/usr/lib/jvm/java-8-openjdk/bin

javac -version
```
2. Create new tab in your terminal and open selenium server in new tab:

```bash
java -jar -Dwebdriver.gecko.driver=./configs/geckodriver/geckodriver ./configs/geckodriver/selenium_server.jar ;
```

If you use the OS Linux Debian, useful the script `install_for_linux.sh`
1. Clone this repository.
2. Add grant the right to execute the script.

```bash
chmod -x install_for_linux.sh
```

3. Run the script.
```bash
./install_for_linux.sh
```

## WARNING
*first* start the selenium.
*second* run the tests.

Thats all, run the comand:

`npm run test:g` -> and see the result "Title was: Google".
