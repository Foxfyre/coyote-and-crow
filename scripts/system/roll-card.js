export default function rollCard(rollResults, pRollData) {
    let diceSection = '';
    console.log(rollResults);
    console.log(pRollData);

    console.log(rollResults.terms)

    if (rollResults.type == "PoolTerm") {
        console.log(rollResults.terms[0].rolls)
        for (let d = 0; d < rollResults.terms[0].rolls[0].terms[0].results.length; d++) {
            diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/w${rollResults.terms[0].rolls[0].terms[0].results[d].result}.png" />`
        }
        for (let e = 0; e < rollResults.terms[0].rolls[1].terms[0].results.length; e++) {
            diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/c${rollResults.terms[0].rolls[0].terms[0].results[e].result}.png" />`
        }
    } else {
        let results = rollResults.terms[0].results;
        for (let d = 0; d < results.length; d++) {
            diceSection += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/w${results[d].result}.png" />`
        }
    }


    

    let rollDesignate = '';




    rollDesignate = `Rolling ${pRollData.skillName} & ${pRollData.statName}`;

    let rollCardInfo = {
        title: rollDesignate,
        dice: `<div style="display: flex; flex-direction: row; justify-content: space-around; flex-wrap: wrap;">${diceSection}</div></br>`
    }

    console.log(diceSection)
    /*let statDiceQty = pRollData.statDice;
    let statDiceName = pRollData.statName;
    let skillDiceQty = pRollData.skillDice;
    let skillDiceName = pRollData.skillName;

    let statDiv = "";
    let skillDiv = "";

    console.log(statDiceQty)

    if (statDiceQty > 0) {
        for (let s = 0; s < statDiceQty; s++) {
            statDiv += `<img height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/wq.png" />`
        }
    }

    if (skillDiceQty > 0) {
        for (let t = 0; t < skillDiceQty; t++) {
            skillDiv += `<img class="" height="50px" width="50px" src="systems/coyote-and-crow/ui/dice/chat/wq.png" />`
        }
    }*/

    return rollCardInfo;
}