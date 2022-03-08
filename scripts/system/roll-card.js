export default function rollCard(rollResults, compiledRollData) {
    let diceSection = '';
    //console.log(rollResults);
    console.log(compiledRollData);

    //console.log(rollResults.terms)

    let sn = compiledRollData.successNumber;
    /*if (sn !== 0) {
        snCardInfo = `</br><b>Modifier:</b> Apply ${sn} to the Success Number`;
    }*/

    const rollStatSkill = `Rolling ${compiledRollData.skillName} & ${compiledRollData.statName}<br>`;
    let snCardInfo = (sn !== 0) ? `<b>Modifier:</b> Apply ${sn} to the Success Number` : ``;

    if (rollResults.type == "PoolTerm") {
        console.log(rollResults.terms[0].rolls)
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

    let rollDesignate = '';

    rollDesignate = `${rollStatSkill}${snCardInfo}`;

    let rollCardInfo = {
        title: rollDesignate,
        dice: `<div style="display: flex; flex-direction: row; justify-content: space-around; flex-wrap: wrap;">${diceSection}</div></br>`
    }

    //console.log(diceSection)

    return rollCardInfo;
} 