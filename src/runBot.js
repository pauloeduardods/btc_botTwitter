const { requestPrices } = require('./requestPrice');
const { tweetBR, tweetUSA } = require('./twitter');
const sleep = require('./utils/sleep');

async function main(){
  let last_min = (new Date).getMinutes();
  while(true){
    await sleep(3000);
    let date = new Date();
    let min = date.getMinutes();
    if (min != last_min) { 
      let result = await requestPrices();
      if (result == true && min % 30 == 0) {
        await tweetBR();
        await tweetUSA();
      }
      last_min = min;
    }
  }
}

main();