/* 

                            PHONES

*/

import badPattern   from '../data/bad_pattern';     // bad(non-valid symbols)
/* 
                good phone generator
*/
// let gPhone = (codeCountry = 375, howNumberAfter = 8 ) => {
//   let telephoneNumber = [],
//       getRandomInRange = (min, max) => {
//         return Math.floor(Math.random() * (max - min + 1)) + min;
//       };

//   telephoneNumber.push(codeCountry);

//   for (let index = 0; index < howNumberAfter; index++) {
//       telephoneNumber.push(getRandomInRange(0, 9))
//    }
  
//    return telephoneNumber.join('');
// }
/* 
                bad email generator
*/
/* 
                use default vocabulary
*/
let phone = (codeCountry = 375, howNumberAfter = 8 , badSymbols = badPattern ) => {
  let telephoneNumber = [],
      getRandomInRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
  telephoneNumber.push(codeCountry);

  for (let index = 0; index < howNumberAfter; index++) {
      telephoneNumber.push(getRandomInRange(0, 9))
   }
  
  telephoneNumber = telephoneNumber.join('');     

  return telephoneNumber.replace(telephoneNumber.charAt(getRandomInRange(0, telephoneNumber.length)), 
          badSymbols.charAt(getRandomInRange(0, badSymbols.length)))
}
/* 
              use custom vocabulary
*/
// let phone = (codeCountry = 375, howNumberAfter = 8 ) => {


// }
export  { phone , gPhone }; //, customPhone