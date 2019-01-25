const fs = require('fs')
const in_invoices = JSON.parse(fs.readFileSync('./invoices.json'))
const in_plays = JSON.parse(fs.readFileSync('./plays.json')) 

function statement (invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
                        {style:"currency", currency:"USD",
                         minimumFractionDigits:2}).format;
    
    for (let pref of invoice.performances) {
        const play = plays[pref.playID]
        let thisAmount = amountFor(pref,play);
   
        //add volume credit
        volumeCredits += Math.max(pref.audience -30, 0);
        // add extra credit for every ten comedy attendees
        if ( "comedy" === play.type ) 
            volumeCredits += Math.floor(pref.audience/5);
        
        //print line for this order
        result += ` ${play.name}: ${format(thisAmount/100)} (${pref.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits`;
    return result;
}

function amountFor(pref, play) {
   let thisAmount = 0; 
    switch (play.type) {
    case "tragedy":
        thisAmount = 40000;
        if (pref.audience > 30) {
            thisAmount += 1000 * (pref.audience-30);
        }
        break;
    case "comedy":
        thisAmount = 30000;
        if (pref.audience > 20) {
            thisAmount += 10000 + 500 * (pref.audience -20 )
        }
        thisAmount += 300 * pref.audience;
        break;
    default:
        throw new Error(`unknown type: ${payl.type}`);
    }
    return thisAmount;
}

function main(){
    console.log(statement(in_invoices[0], in_plays))
}

main()    

