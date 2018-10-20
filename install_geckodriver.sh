#!/bin/bash

# for selenium server

SETCOLOR_SUCCESS="echo -en \\033[1;32m"
SETCOLOR_FAILURE="echo -en \\033[1;31m"
SETCOLOR_NORMAL="echo -en \\033[0;39m"

echo -e "\e[31m------------------------ \e[0m"
echo -e "\e[31m  Install java \e[0m"
echo -e "\e[31m------------------------ \e[0m"

sudo add-apt-repository ppa:openjdk-r/ppa ;
sudo apt-get update ;

sudo apt-get install openjdk-8-jdk openjdk-8-source -y ;
apt-cache search jdk ;

export JAVA_HOME=/usr/lib/jvm/java-8-openjdk ;
export PATH=$PATH:/usr/lib/jvm/java-8-openjdk/bin ;

javac -version ;

if [ $? -eq 0 ]; then
    $SETCOLOR_SUCCESS
    echo -n "$(tput hpa $(tput cols))$(tput cub 6)[OK]"
    $SETCOLOR_NORMAL
    echo
else
    $SETCOLOR_FAILURE
    echo -n "$(tput hpa $(tput cols))$(tput cub 6)[fail]"
    $SETCOLOR_NORMAL
    echo
fi

# Webdriver

# SETCOLOR_SUCCESS="echo -en \\033[1;32m"
# SETCOLOR_FAILURE="echo -en \\033[1;31m"
# SETCOLOR_NORMAL="echo -en \\033[0;39m"

# echo -e "\e[31m------------------------ \e[0m"
# echo -e "\e[31m  Download Webdriver & Selenium server \e[0m"
# echo -e "\e[31m------------------------ \e[0m"

# curl -O http://selenium-release.storage.googleapis.com/3.5/selenium-server-standalone-3.5.3.jar ;
# curl -L https://github.com/mozilla/geckodriver/releases/download/v0.16.0/geckodriver-v0.16.0-linux64.tar.gz | tar xz ;

# if [ $? -eq 0 ]; then
#     $SETCOLOR_SUCCESS
#     echo -n "$(tput hpa $(tput cols))$(tput cub 6)[OK]"
#     $SETCOLOR_NORMAL
#     echo
# else
#     $SETCOLOR_FAILURE
#     echo -n "$(tput hpa $(tput cols))$(tput cub 6)[fail]"
#     $SETCOLOR_NORMAL
#     echo
# fi


# SETCOLOR_SUCCESS="echo -en \\033[1;32m"
# SETCOLOR_FAILURE="echo -en \\033[1;31m"
# SETCOLOR_NORMAL="echo -en \\033[0;39m"

# echo -e "\e[31m------------------------ \e[0m"
# echo -e "\e[31m  Move to configs folder Webdriver & Selenium server \e[0m"
# echo -e "\e[31m------------------------ \e[0m"


# mv selenium-server-standalone-3.5.3.jar ./configs/geckodriver/selenium-server.jar;
# mv geckodriver.jar  ./configs/geckodriver/geckodriver.jar ;

# if [ $? -eq 0 ]; then
#     $SETCOLOR_SUCCESS
#     echo -n "$(tput hpa $(tput cols))$(tput cub 6)[OK]"
#     $SETCOLOR_NORMAL
#     echo
# else
#     $SETCOLOR_FAILURE
#     echo -n "$(tput hpa $(tput cols))$(tput cub 6)[fail]"
#     $SETCOLOR_NORMAL
#     echo
# fi
