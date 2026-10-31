// Candidate proposal scenario, not the current government benefit schedule.
const RATES = Object.freeze({birth:20000,priorBirth:12000,nutritionMonthly:3000,e1:1200,e2:2000,e3:6000,e4:50000});
const PROVENANCE = Object.freeze({
 status:'候選人政見情境估算，非現行給付或資格保證',
 sourceDate:'2026-07-01',checkedDate:'2026-11-01',
 sourceURL:'https://newtalk.tw/news/view/2026-07-01/1044470',
 currentURL:'https://yilan.e-land.gov.tw/News_Content.aspx?n=18782&s=406290&sms=16125'
});
const DEFAULT_COUNTS=Object.freeze({baby:1,e1:1,e2:1,e3:0,e4:0});
const MAX_COUNTS=Object.freeze({baby:4,e1:6,e2:6,e3:6,e4:6});
const MAX_MONTHS=24;
function calculateBenefits(counts,months){
 if(!Number.isInteger(months)||months<0||months>MAX_MONTHS)throw new RangeError('months must be an integer from 0 to 24');
 for(const [key,max] of Object.entries(MAX_COUNTS))if(!Number.isInteger(counts?.[key])||counts[key]<0||counts[key]>max)throw new RangeError(`invalid count: ${key}`);
 const birth=counts.baby*RATES.birth;
 const nutrition=counts.baby*months*RATES.nutritionMonthly;
 const annual=['e1','e2','e3','e4'].reduce((sum,key)=>sum+counts[key]*RATES[key],0);
 return {birth,nutrition,annual,total:birth+nutrition+annual,rise:counts.baby*(RATES.birth-RATES.priorBirth)};
}
