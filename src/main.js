/* { filename: 'main.js' } */

/*


направил присвоение значения из метода red в свойства:
colorNameOnPage
 exampleTextOnPage
*/

import App from "./App.html"
import { Store } from "svelte/store.js"

const store = new Store({
  colorNameOnPage: "red",
  exampleTextOnPage: "", //this.exampleTextEn
  exampleTextEn: "",
  exampleTextRu: "",
  exampleTextBy: "",
  classColorText: "color-text__method-red",
  classSection: "red-command",
  exampleHeadline: "",
  exampleSpan: "",
  methodName: "",
  hiddenAl: "true",
  hiddenAllMethods: true,
  hiddenInfoForMethod: false,
  // change the language version
  exampleHeadline: "",
  exampleSpan: "",
  exampleToUseHeadlineOnPage: "Text output in the console in", // translate on other languages
  exampleToUseHeadlineEn: "",
  exampleToUseHeadlineRu: "",
  exampleToUseHeadlineBy: "",
  // language versions
  logoHeadline: "The main task of color is to serve expressiveness"
})

const app = new App({
  target: document.querySelector("body"),
  store
})

window.store = store

// colorNameEn: allData.methodGreEn.colorName,
// colorNameBy: allData.methodGreBy.colorName,
// colorNameRu: allData.methodGreRu.colorName,
// exampleTextEn: allData.methodGreEn.exampleText,
// exampleTextRu: allData.methodGreRu.exampleText,
// exampleTextBy: allData.methodGreBy.exampleText,
// exampleHeadlineEn: allData.methodsDataEn.exampleHeadline,
// exampleHeadlineRu: allData.methodsDataRu.exampleHeadline,
// exampleHeadlineBy: allData.methodsDataBy.exampleHeadline,
// exampleSpanEn:  allData.methodsDataEn.exampleSpan,
// exampleSpanRu:  allData.methodsDataRu.exampleSpan,
// exampleSpanBy:  allData.methodsDataBy.exampleSpan,
// exampleToUseHeadlineEn: allData.methodsDataEn.exampleToUseHeadline,
// exampleToUseHeadlineRu: allData.methodsDataRu.exampleToUseHeadline,
// exampleToUseHeadlineBy: allData.methodsDataBy.exampleToUseHeadline,
// exampleCommandTextUseMethodEn: allData.methodsDataEn.exampleCommandTextUseMethod,
// exampleCommandTextUseMethodRu: allData.methodsDataRu.exampleCommandTextUseMethod,
// exampleCommandTextUseMethodBy: allData.methodsDataBy.exampleCommandTextUseMethod,
// resultTextUseMethodEn:  allData.methodsDataEn.resultTextUseMethod,
// resultTextUseMethodRu:  allData.methodsDataRu.resultTextUseMethod,
// resultTextUseMethodBy:  allData.methodsDataBy.resultTextUseMethod,
