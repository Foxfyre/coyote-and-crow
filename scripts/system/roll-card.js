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
    //console.log(rollResults);
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
            type === "specialization" ? `Rolling <b>${compiledRollData.statName.toUpperCase()} & ${compiledRollData.skillName.toUpperCase()} & ${compiledRollData.specName.toUpperCase()}</b><br>` : `BOOPs!`;

    if (rollResults.type == "PoolTerm") {
        for (let d = 0; d < rollResults.terms[0].rolls[0].terms[0].results.length; d++) {
            diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/w${rollResults.terms[0].rolls[0].terms[0].results[d].result}.png" />`
        }
        for (let e = 0; e < rollResults.terms[0].rolls[1].terms[0].results.length; e++) {
            diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/c${rollResults.terms[0].rolls[1].terms[0].results[e].result}.png" />`
        }
    } else {
        let results = rollResults.terms[0].results;
        for (let d = 0; d < results.length; d++) {
            diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/w${results[d].result}.png" />`
        }
    }
    let modifiedResults;

    /*if (compiledRollData.legendary > 0 || compiledRollData.mind > 0) {
        modifiedResults =  _modifyRoll(compiledRollData, rollResults, diceSection);
    }*/
 
    let modifyButton;

    let legendary = compiledRollData.legendary > 0 ? true : false;
    let mind = compiledRollData.mind > 0 ? true : false;

    let rollTitle = '';

    rollTitle = `${flavorText}${sNumber}`;

    let rollCardInfo = {
        title: rollTitle,
        dice: `<div style="display: flex; flex-direction: row; justify-content: space-around; flex-wrap: wrap;">
            ${diceSection}
            </div>
            </br>`
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