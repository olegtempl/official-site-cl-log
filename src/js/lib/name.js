/* 

                        NAMES

*/

import badPattern   from '../data/bad_pattern';     // bad(non-valid symbols)
import firstName  from '../data/first_name';    // data-array 
import secondName from '../data/second_name';   // data-array

//index = (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min // calback function( return Nan)
/* 
                good name generator
*/
// const gName = ( ) => 
// {
//     let getRandomInRange = (min, max) => {
//       return Math.floor(Math.random() * (max - min + 1)) + min;
//     }
  
//   // let nr = getRandomInRange(0, 100);  // random number in range at 0 for 100
//   return firstName[getRandomInRange(0, 100)] + secondName[getRandomInRange(0, 100)]
// }
/* 
                bad email generator
*/
/* 
                use default vocabulary
*/
const name = ( badSymbols = badPattern) => {
    let fullName = '',
        getRandomInRange = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    fullName = firstName[getRandomInRange(0, 100)] + secondName[getRandomInRange(0, 100)];   
    
    return fullName.replace(fullName.charAt(getRandomInRange(0, fullName.length)), 
            badSymbols.charAt(getRandomInRange(0, badSymbols.length)))
}
/* 
              use custom vocabulary
*/
// const customName  = ( ) =>  {
  
// }
  
export {name, gName }; //, customName



