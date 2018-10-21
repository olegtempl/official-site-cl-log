/* 
                                     good generator 
*/
// import {gName}  from './lib/name.js';
// import {gEmail} from './lib/email.js';
// import {gPhone} from './lib/phone.js';
// import {gText}  from  './lib/text.js';
/* 
                                     bad generator 
*/
/* use for default vocabulary */
import {name}  from './lib/name.js';
import {email} from './lib/email.js';
import {phone} from './lib/phone.js';
import {text}from  './lib/text.js';



/* use for custom vocabulary */
// import {customName}  from './lib/name.js';
// import {customEmail} from './lib/email.js';
// import {customPhone} from './lib/phone.js';
// import {customText} from  './lib/text.js';
/* 
          
                Так выглядит обьект с методами, методы импортировать из других файлов.

*/
/* 
                        Хороший обьект( валидный)
*/
// let goodGen = {
//   gName,
//   gEmail,
//   gPhone,
//   gText
// };
// console.log(goodGen.gName());
// console.log(goodGen.gEmail());
// console.log(goodGen.gPhone);
// console.log(goodGen.gText);
/* 
                        Нехороший обьект(не валидный)
*/
let badGen = {
  /* работают по дефолту */
  name,
  email,
  phone,
  text
  /*  принимают кастомный словарь */
  // customName,
  // customEmail,
  // customPhone,
  // customText
};

// console.log(badGen.name());
// console.log(badGen.email());
// console.log(badGen.phone());
// console.log(badGen.text());

// console.log(badGen.customName());
// console.log(badGen.customEmail());
// console.log(badGen.customPhone());
// console.log(badGen.customText());


export default badGen; 
// export { badGen}; //, goodGen



// ьаги 


/* 
мыло валидное на выходе

*/