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
        used: 2
    }
    
    rolls.forEach((r, i) => {
        let legendmax = Math.min(12 - Number(r), data.rolldata.legendary.max)
        let focusmax = Math.min(12 - Number(r), data.rolldata.mind.current)
        data.rolls.push({
            value: r,
            value_number: Number(r),
            modified: r,
            modified_number: Number(r),
            fail: (r === '1'),
            crit: (r === '12'),
            moddable: (r != '1' && r != '12'),
            legendmax: legendmax,
            focusmax: focusmax
        })
    });
    
    const modifyTemplate = await renderTemplate("systems/coyote-and-crow/templates/dialog/dice-roll.html", data)
    new Dialog({
        title: "Modify Roll",
        content: modifyTemplate,
        buttons: {
            button1: {
                label: "Modify Roll",
                callback: (html) => {_modifyRoll(html, actorid)},
                icon: `<i class="fas fa-check"></i>`
            }
        },
        default: "button1",
        render: (html) => {
            /* TODO: Bind the following
             * 1) Result die display
             * 2) Remaining Legend
             * 3) Expended Mind
             */

            html.find('input[name="focusmod"').each(function(){
                // Validates which row we are in
                console.log(this.parentNode.parentNode.dataset.rowcount)
            })
            console.log(html)
        }
    }).render(true);
}

function _modifyRoll(html, actorid) {
    console.log("Modify the roll!");
    let actor = game.actors.get(actorid);
    let curmind = actor.data.data.attributes.mind.currentValue;
    let spendmind = Number(html.find('span[name="usedMind"]')[0].dataset.value);
    console.log(spendmind);
    actor.update({"data.attributes.mind.currentValue": curmind - spendmind})

    // Now just need to execute a roll here...
}