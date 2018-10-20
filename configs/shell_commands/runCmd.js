const exec = require('child_process').exec,
  cl = require('node-cl-log');
/**
 * @description - функция выполнения комманд в операционной системе
 * @param { array } - комманда для выполнения в операционной системе
 * @returns - выполняет переданную ей комманду
 */
function runcmd(command) {
  for (let lenArrayCoomands = command.length, i = 0; i < lenArrayCoomands; i++) {
    exec(command[i],
    (error, stdout, stderr) => {
        cl.log(`${stdout}`);
        cl.log(`${stderr}`);
        if (error !== null) {
            cl.red(`exec error: ${error}`);
          };
    });
  };
};


module.exports = runcmd;
