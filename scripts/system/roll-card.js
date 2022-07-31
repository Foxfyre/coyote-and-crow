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
*       statSuccessNumber: Number
*       physicalDefense: Number
*       physicalDefenseDetail: String
*   }
***/

export default function rollCard(rollResults, compiledRollData) {
    let diceSection = '';
    let buttons = '';
    console.log("Roll Results")
    console.log(rollResults);
    console.log("Compiled Roll Data")
    console.log(compiledRollData);
    let type = compiledRollData.type;




    let sn = (type === "skill" || type === "specialization") ? compiledRollData.successNumber : type === "stat" ? compiledRollData.statSuccessNumber : 0;

    /*** 
    * Flavour text (Subject Line)
    * ***/
    let sNumber = (type === "stat" && sn !== 0) ? `<b>Modifier:</b> Apply ${compiledRollData.statSuccessNumber} to the Success Number` :
        (type === "skill" && sn !== 0) ? `<b>Modifier:</b> Apply ${compiledRollData.successNumber} to the Success Number` :
            (type === "specialization" && sn !== 0) ? `<b>Modifier:</b> Apply ${compiledRollData.successNumber} to the Success Number` : ``;

    const flavorText = type === "stat" ? `Rolling <b>${compiledRollData.statName.toUpperCase()}</b><br>` :
        type === "skill" ? `Rolling <b>${compiledRollData.statName.toUpperCase()} & ${compiledRollData.skillName.toUpperCase()}</b><br>` :
            type === "specialization" ? `Rolling <b>${compiledRollData.statName.toUpperCase()} & ${compiledRollData.specName.toUpperCase()}</b><br>` : `BOOPs!`;


    



    // New design is to just print the white dice, then offer modify & roll criticals
    
    let results = rollResults.terms[0].results;
    switch(rollResults.type) {
        case "Base":
            let legendary = compiledRollData.legendary > 0 ? true : false;
            // let mind = compiledRollData.mind > 0 ? true : false;
            let rollMods = `Spend Focus (${compiledRollData.mind})`
            if (legendary) {
                rollMods = `Use Legendary Status (${compiledRollData.legendary}) or<br>` + rollMods
            }
            let resultArray = [];
            results.forEach(i => {resultArray.push(i.result)});
            let resultString = resultArray.toString()
            diceSection+=`<div class="rolls" data-rolls="${resultString}">`
            for (let d = 0; d < results.length; d++) {
                diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/w${results[d].result}.png" />`
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
        // case "Modded":
        //     // might need to think about structure about how dicemods[d] is handled
        //     let moddedTotal = 0;
        //     for (let d = 0; d < results.length; d++) {
        //         moddedTotal = results[d].result + dicemods[d]//
        //         diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/w${moddedTotal}.png" />`
        //     }
        //     break;
        case "Critical":
            for (let d = 0; d < results.length; d++) {
                diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/c${results[d].result}.png" />`
            }
            break;
    }
    

    

    let modifiedResults;

    /*if (compiledRollData.legendary > 0 || compiledRollData.mind > 0) {
        modifiedResults =  _modifyRoll(compiledRollData, rollResults, diceSection);
    }*/
 
    let modifyButton;


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

async function _modifyRoll(rollData, rollResults, diceSection) {

    console.log(rollData)
    console.log(rollResults)

    const dialogTemplate = await renderTemplate("/systems/coyote-and-crow/templates/dialog/dice-roll.html", { data: rollData, results: rollResults, diceSection: diceSection });

    return new Promise(resolve => {
        const dialogContent = {
            title: game.i18n.localize("COYOTE.DIALOG.ModifyRoll"),
            content: dialogTemplate,
            buttons: {
                roll: {
                    label: game.i18n.localize("COYOTE.BUTTON.Roll"),
                    callback: html => {
                        resolve(console.log("RETURN MODIFIED ROLL"))
                    }
                }
            },
            default: "Roll"
        }

        new Dialog(dialogContent, { width: 600, height: 400 }).render(true)
    })
}
//return modifyDialog;


/*
    console.log(roll)

    const dialogTemplate = await renderTemplate("/systems/coyote-and-crow/templates/dialog/dice-roll.html", { data: roll });

    let modifyDialog = new Promise((resolve) => {
        renderTemplate("/systems/coyote-and-crow/templates/dialog/dice-roll.html", { data: roll }).then(dialog => {
            return new Dialog({ roll }, {
                title: game.i18n.localize("COYOTE.DIALOG.ModifyRoll"),
                content: dialog,
                render: data,
                buttons: {
                    roll: {
                        label: game.i18n.localize("COYOTE.BUTTON.Roll"),
                        callback: html => {
                            resolve(console.log("RETURN MODIFIED ROLL"))
                        }
                    }
                },
                default: "Roll"
            }, { width: 600, height: 400 }).render(true)
        })
    })
    return modifyDialog;*/


        // if (rollResults.type == "PoolTerm") {
    //     for (let d = 0; d < rollResults.terms[0].rolls[0].terms[0].results.length; d++) {
    //         diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/w${rollResults.terms[0].rolls[0].terms[0].results[d].result}.png" />`
    //     }
    //     for (let e = 0; e < rollResults.terms[0].rolls[1].terms[0].results.length; e++) {
    //         diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/c${rollResults.terms[0].rolls[1].terms[0].results[e].result}.png" />`
    //     }
    // } else {
    //     let results = rollResults.terms[0].results;
    //     for (let d = 0; d < results.length; d++) {
    //         diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/w${results[d].result}.png" />`
    //     }
    // }