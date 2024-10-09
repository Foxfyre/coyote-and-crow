import rollCard from "./roll-card.js";
import getRoll from "./get-roll.js";

export default async function modifyRoll(rolldata, roll, actorid) {
    const data = {
        legendary: {
            max: Number(rolldata.legendary),
            remaining: Number(rolldata.legendary)
        },
        mind: {
            current: Number(rolldata.mind),
            used: 0
        },
        rolls: []
    }
    console.log(data)
    console.log(roll);

    roll.terms[0].results.forEach((r, i) => {
        let legendmax = Math.min(12 - Number(r.result), data.legendary.max)
        let focusmax = Math.min(12 - Number(r.result), data.mind.current)
        let value = r.result;
        data.rolls.push({
            value: value,
            modified: value,
            fail: (value === 1),
            crit: (value === 12),
            moddable: (value != 1 && value != 12),
            legendmax: legendmax,
            legendmod: 0,
            focusmax: focusmax,
            focusmod: 0
        })
    });
    
    const modifyTemplate = await renderTemplate("systems/coyote-and-crow/templates/dialog/dice-roll.html", data)
    new Dialog({
        title: "Modify Roll",
        content: modifyTemplate,
        buttons: {
            button1: {
                label: "Modify Roll",
                callback: (html) => {_modifyRoll(html, actorid, rolldata, roll)},
                icon: `<i class="fas fa-check"></i>`
            }
        },
        default: "button1",
        render: (html) => {
            html.find('input').each(function(){
                // Validates which row we are in
                let data = this.parentNode.parentNode.dataset;
                let key = this.name;
                this.addEventListener('input', (e) => {
                    data[key] = e.target.value;
                    data.modified = Number(data.value) + Number(data.legendmod) + Number(data.focusmod);
                    let newdie = Math.min(12, data.modified)
                    e.srcElement.parentNode.parentNode.lastElementChild.firstElementChild.src = `systems/coyote-and-crow/ui/dice/chat/w${newdie}.png`;
                    const footer = e.srcElement.parentNode.parentNode.parentNode.parentNode.children[2];
                    let body = e.srcElement.parentNode.parentNode.parentNode;
                    let legendused = 0;
                    let spendmind = 0;
                    for (let i = 0; i < body.children.length; i++) {
                        legendused+= Number(body.children[i].dataset.legendmod)
                        spendmind+= Number(body.children[i].dataset.focusmod)
                    }
                    for (let i = 0; i < footer.children.length; i++) {
                        let targetSpan = footer.children[i].children[0].children[1];
                        switch (targetSpan.attributes.name.value) {
                            case "remLegend":
                                let remLegend = Number(targetSpan.dataset.legendmax) - legendused;
                                targetSpan.innerHTML = remLegend;
                                break;
                            case "usedMind":
                                targetSpan.innerHTML = spendmind;
                                break;
                        }
                    }
                })
            })
            // console.log(html)
        }
    }).render(true);
}


function _modifyRoll(html, actorid, compiledRollData, originalRoll) {
    console.log("Modify the roll!");
    const actor = game.actors.get(actorid);
    console.log(actor);
    const curmind = actor.system.attributes.mind.currentValue;
    console.log(curmind);
    const spendmind = Number(html.find('span[name="usedMind"]')[0].innerHTML);
    console.log(spendmind);
    actor.updateSource({"system.attributes.mind.currentValue": curmind - spendmind})


    const baseRoll = originalRoll;
    console.log(baseRoll);
    let crits = 0;
    const rows = html.find("div.mod-roll-row");
    console.log(baseRoll);
    baseRoll.terms[0]._total = 0;
    // baseRoll.terms[0].values = JSON.parse(JSON.stringify(originalRoll.terms[0].values));
    baseRoll.terms[0].results.forEach(function(v,i){
        let modResult = Number(rows[i].dataset.modified)
        baseRoll.terms[0]._total += modResult;
        baseRoll.terms[0].results[i] = {
            result: modResult,
            active: true
        }
        if (modResult == 12) {
            crits+=1
        }
    })

    compiledRollData.critical = true;
    compiledRollData.totalDice = crits;

    getRoll(compiledRollData).then(function(critRoll){
        console.log(baseRoll)
        console.log(critRoll)
    
        const rollResults = foundry.dice.terms.PoolTerm.fromRolls([baseRoll, critRoll])
    
        rollResults.type = "Modded";
        rollResults.data = compiledRollData;

        const rolledCard = rollCard(rollResults);

        baseRoll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            flavor: rolledCard.title,
            rollMode: game.settings.get("core", "rollMode"),
            flags: { "coyote-and-crow": compiledRollData },
            content: rolledCard.dice,
            sound: CONFIG.sounds.dice
        });
    })
}