import rollCard from "./roll-card";

export default async function modifyRoll(rolldata, rolls, actorid) {
    let data = {
        rolldata: rolldata,
        rolls: []
    }
    /* rolls structure
     * value: Number
     * fail: Boolean
     */
    data.rolldata.legendary = {
        max: Number(data.rolldata.legendary),
        remaining: Number(data.rolldata.legendary)
    }
    data.rolldata.mind = {
        current: Number(data.rolldata.mind),
        used: 0
    }
    console.log(data.rolldata)


    rolls.forEach((r, i) => {
        let legendmax = Math.min(12 - Number(r), data.rolldata.legendary.max)
        let focusmax = Math.min(12 - Number(r), data.rolldata.mind.current)
        data.rolls.push({
            value: r,
            modified: r,
            fail: (r === '1'),
            crit: (r === '12'),
            moddable: (r != '1' && r != '12'),
            legendmax: legendmax,
            legendmod: 0,
            focusmax: focusmax,
            focusmod: 0
        })
    });

    let compiledRollData = {
        type: rolldata.type,
        successNumber: rolldata.successNumber,
        statName: rolldata.statName,
        skillName: rolldata.skillName,
        specName: rolldata.specName
    }
    
    const modifyTemplate = await renderTemplate("systems/coyote-and-crow/templates/dialog/dice-roll.html", data)
    new Dialog({
        title: "Modify Roll",
        content: modifyTemplate,
        buttons: {
            button1: {
                label: "Modify Roll",
                callback: (html) => {_modifyRoll(html, actorid, compiledRollData)},
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
                    e.path[2].lastElementChild.children[0].src = `systems/coyote-and-crow/ui/dice/chat/w${newdie}.png`;
                    let footer = e.path[4].lastElementChild;
                    let body = e.path[3];
                    let legendused = 0;
                    let spendmind = 0;
                    for (let i = 0; i < body.children.length; i++) {
                        legendused+= Number(body.children[i].dataset.legendmod)
                        spendmind+= Number(body.children[i].dataset.focusmod)
                    }
                    for (let i = 0; i < footer.children.length; i++) {
                        let targetSpan = footer.children[i].lastElementChild.lastElementChild;
                        switch (targetSpan.attributes.name.value) {
                            case "remLegend":
                                let remLegend = Number(targetSpan.dataset.legendmax) - legendused
                                targetSpan.innerHTML = remLegend;
                                e.path[7].lastElementChild.lastElementChild.disabled = remLegend < 0;
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


function _modifyRoll(html, actorid, compiledRollData) {
    console.log("Modify the roll!");
    let actor = game.actors.get(actorid);
    let curmind = actor.data.data.attributes.mind.currentValue;
    let spendmind = Number(html.find('span[name="usedMind"]')[0].innerHTML);
    actor.update({"data.attributes.mind.currentValue": curmind - spendmind})

    let rows = html.find("div.mod-roll-row");
    let results = [];
    let crits = 0;
    for (let i = 0; i < rows.length; i++) {
        results.push(Number(rows[i].dataset.modified))
        if (rows[i].dataset.modified == '12') {
            crits+=1
        }
    };

    


    rollResults = new Roll(`${crits}dbx12`)
    rollResults.evaluate({async: true})
    rollResults.type = "Modded"

    let rolledCard = rollCard(rollResults, compiledRollData);
    
    let chatOptions = {
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: rollResults,
        flavor: rolledCard.title,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        rollMode: game.settings.get("core", "rollMode"),
        content: rolledCard.dice,
        sound: CONFIG.sounds.dice
    };

    ChatMessage.create(chatOptions);
}