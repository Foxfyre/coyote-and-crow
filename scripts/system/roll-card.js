// rollData arguement comes in with the following information
/***
*   compiledRollData = {
*       type: String
*       specName: String
*       specRank: Number
*       skillName: String
*       skillRank: Number
*       statName: String
*       statRank: Number
*       legendary: Number
*       mind: Number
*       addDice: Number
*       totalDice: Number
*       successNumber: Number
*       physicalDefense: Number
*       physicalDefenseDetail: String
*   }
***/

export default function rollCard(rollResults) {
    let compiledRollData = rollResults.data
    
    let diceSection = '';
    let buttons = '';
    console.log("Roll Results")
    console.log(rollResults);
    console.log("Compiled Roll Data")
    console.log(compiledRollData);

    /*** 
    * Flavour text (Subject Line)
    * ***/
    let sNumber = (compiledRollData.successNumber !== 0) ? `<b>Modifier:</b> Apply ${compiledRollData.successNumber} to the Success Number` : ``;

    const flavorText = compiledRollData.type === "stat" ? `Rolling <b>${compiledRollData.statName.toUpperCase()}</b><br>` :
        compiledRollData.type === "skill" ? `Rolling <b>${compiledRollData.statName.toUpperCase()} & ${compiledRollData.skillName.toUpperCase()}</b><br>` :
            compiledRollData.type === "specialization" ? `Rolling <b>${compiledRollData.statName.toUpperCase()} & ${compiledRollData.specName.toUpperCase()}</b><br>` : `BOOPs!`;


    let results = []
    switch(rollResults.type) {
        case "Base":
            results = rollResults.terms[0].results;
            let rollMods = `Spend Focus (${compiledRollData.mind})`
            if (compiledRollData.legendary > 0) {
                rollMods = `Use Legendary Status (${compiledRollData.legendary}) or<br>` + rollMods
            }
            diceSection+=`<div class="rolls">`
            // Object.entries(compiledRollData).forEach(([key, value]) => {
            //     diceSection+=` data-${key}="${value}"`
            // })
            // diceSection+=">"
            for (let d = 0; d < results.length; d++) {
                diceSection += `<img class="die" src="systems/coyote-and-crow/ui/dice/chat/w${results[d].result}.png" />`
            }
            diceSection+=`</div>`
            buttons +=`<br><button class="modRoll">${rollMods}</button>` // 
            let count12 = 0;
            results.find(v => {
                if (v.result === 12) {
                    count12++;
                }
            })
            if (count12){
                buttons += `<br><button class="critRoll"" data-crits=${count12}>Roll Crits (${count12})</button>`;
            }
            break;
        case "Modded":
            diceSection+=`<div class="rolls">`
            for (let d = 0; d < rollResults.rolls[0].terms[0].results.length; d++) {
                diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/w${rollResults.rolls[0].terms[0].results[d].result}.png" />`
            }
            for (let e = 0; e < rollResults.rolls[1].terms[0].results.length; e++) {
                diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/c${rollResults.rolls[1].terms[0].results[e].result}.png" />`
            }
            diceSection+=`</div>`
            break;
        case "Critical":
            results = rollResults.terms[0].results;
            diceSection+=`<div class="rolls">`
            for (let d = 0; d < results.length; d++) {
                diceSection += `<img class="die" src="systems/coyote-and-crow/ui/dice/chat/c${results[d].result}.png" />`
            }
            diceSection+=`</div>`
            break;
    }

    let rollTitle = '';

    rollTitle = `${flavorText}${sNumber}`;

    let rollCardInfo = {
        title: rollTitle,
        dice: `${diceSection}
            ${buttons}`
    }

    //console.log(diceSection)

    return rollCardInfo;
}