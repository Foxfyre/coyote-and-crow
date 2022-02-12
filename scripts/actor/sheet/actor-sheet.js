import buildRoll from "../../system/build-roll.js";
import getRoll from "../../system/get-roll.js";
import rollCard from "../../system/roll-card.js";

export class cncActorSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["sheet", "actor"],
            height: 750,
            width: 700,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".content-section", initial: "summary" },
            { navSelector: ".sheet-sec-tabs", contentSelector: ".content-section-sec", initial: "gifts" }],
            dragDrop: [
                { dragSelector: ".item-list .item", dropSelector: null }
            ]
        });
    }

    // Picks between available/listed templates
    get template() {
        return `systems/coyote-and-crow/templates/sheet/character-sheet.html`;
    }

    get actorData() {
        return this.actor.data;
    }

    getData() {
        const sheetData = super.getData();
        const data = {};
        const actorData = this.actor.data.toObject(false);

        data.actor = actorData;
        data.data = actorData.data;
        sheetData.stats = actorData.data.stats;
        sheetData.skills = actorData.data.skills;
        sheetData.derived = actorData.data.derived;
        sheetData.attributes = actorData.data.attributes;
        sheetData.info = actorData.data.info;
        sheetData.gifts = data.actor.items.filter(i => i.type === "gift");
        sheetData.burdens = data.actor.items.filter(i => i.type === "burden");
        sheetData.effects = actorData.data.effects;
        sheetData.states = actorData.data.states;
        sheetData.playerInfo = {}

        let stat1 = data.actor.data.info.path.stats.stat1.value;
        let stat2 = data.actor.data.info.path.stats.stat2.value;
        let abilityStats = [];

        sheetData.abilities = {
            [`${stat1}`]: "",
            [`${stat2}`]: ""
        }
        sheetData.specialization = data.actor.items.filter(i => i.type === "specialization");
        sheetData.abilities[`${stat1}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat1);
        sheetData.abilities[`${stat2}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat2);
        console.log(actorData)
        this._sortSkills(sheetData);
        console.log(sheetData);
        return sheetData;
    }

    activateListeners(html) {
        super.activateListeners(html)
        html.find(".item-create").click(this._itemCreate.bind(this));
        html.find(".item-edit").click(this._onItemEdit.bind(this));
        html.find(".item-delete").click(this._onItemDelete.bind(this));
        html.find(".rollable").click(this._diceRoll.bind(this));
    }

    _itemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;
        let itemData;

        if (type === "specialization") {
            itemData = {
                name: game.i18n.format("ITEM.itemNew", { type: game.i18n.localize(`ITEM.ItemType${type.capitalize()}`) }),
                type: type,
                data: foundry.utils.deepClone(header.dataset),
                data: {
                    skill: "Art",
                    stat: ""
                }
            }
        } else {
            itemData = {
                name: game.i18n.format("ITEM.itemNew", { type: game.i18n.localize(`ITEM.ItemType${type.capitalize()}`) }),
                type: type,
                data: foundry.utils.deepClone(header.dataset)
            };
        }

        console.log(itemData)
        delete itemData.data.type;
        return this.actor.createEmbeddedDocuments("Item", [itemData], { renderSheet: true });
    }

    _onItemEdit(event) {
        event.preventDefault();
        const li = event.currentTarget.closest(".item");
        const item = this.actor.items.get(li.dataset.itemId);
        item.sheet.render(true);
    }

    _onItemDelete(event) {
        event.preventDefault();
        let confirmDel = new Dialog({
            title: game.i18n.localize("DIALOG.ConfirmDelete"),
            content: `<h2>Are you sure you want to delete this item?</h2>`,
            buttons: {
                "yes": {
                    label: "Delete",
                    callback: () => {
                        const li = event.currentTarget.closest(".item");
                        const item = this.actor.items.get(li.dataset.itemId);
                        if (item) return item.delete();
                    }
                },
                "no": {
                    label: "Don't Delete",
                    callback: null
                }
            },
        })
        confirmDel.render(true);
    }

    _sortSkills(data) {
        let midpoint = Object.values(data.skills).length / 2;
        let i = 0;
        for (let skill of Object.values(data.skills)) {
            (i < midpoint) ? skill.colMod = 1 : skill.colMod = 0;
            i++
        }
    }

    async _diceRoll(event) {
        event.preventDefault();
        const data = super.getData()
        console.log(event)
        const rollType = event.currentTarget.closest("[data-rolltype]").dataset.rolltype;
        const rollName = event.currentTarget.closest("[data-rollname]").dataset.rollname;
        const rollSkill = event.currentTarget.closest("[data-rolltype]").dataset.rollskill;
        const rollStat = event.currentTarget.closest("[data-rolltype]").dataset.rollstat;
        let rollData = {};
        console.log(data)
        console.log(rollType)

        /*
            Send data and roll info to buildRoll to collect all relevant data needed for rolls. This will be referred to as the dicePayload.
            when the object returns populated with data, check to see type of roll (skill/stat/ability). Each type will have it's own process.
            For skill tests > Roll the dice based upon stat/skill. Any added modifiers are added to stats and skills already. 
            Once roll is complete, send to chat with results and any relevant options, ie. use legendary, use focus, etc. If 12's are rolled, roll x many more
        */

        /*if (rollType === "specialization") {

            console.log(rollSkill)
            console.log(rollStat)
        }*/



        rollData = {
            type: event.currentTarget.closest("[data-rolltype]").dataset.rolltype,
            specName: rollType === "specialization" ? event.currentTarget.closest("[data-rollname]").dataset.rollname : "",
            specRank: rollType === "specialization" ? Number(event.currentTarget.closest("[data-specrank]").dataset.specrank) : 0,
            skillName: event.currentTarget.closest("[data-skillname]").dataset.skillname,
            skillRank: Number(event.currentTarget.closest("[data-skillrank]").dataset.skillrank),
            statName: event.currentTarget.closest("[data-statname]").dataset.statname,
            statRank: Number(event.currentTarget.closest("[data-statrank]").dataset.statrank),
            legendary: 0,
            mind: 0,
            addDice: Number(event.currentTarget.closest("[data-adddice]").dataset.adddice),
            totalDice: 0,
            successNumber: 0
        }
        console.log(rollData)



        // Send data and roll info to gather all information required for rolls. 
        let compiledRollData = buildRoll(data, rollData);
        //pRollData.rollType = rollType;
        //pRollData.rollName = rollName;

        console.log(compiledRollData)

        //let dicePool = this._diceDisplay(pRollData)

        let rollResults = await getRoll(compiledRollData)

        console.log(rollResults)

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

        /*let rollApp = new Promise((resolve) => {

            new Dialog({
                title: game.i18n.localize("DICE.DicePrepare"),
                content: (dicePool),
                buttons: {
                    roll: {
                        label: game.i18n.localize("DICE.Roll"),
                        callback: (html) => {
                            resolve(getRoll(pRollData, dicePool))
                        }
                    }
                },
                default: "Roll"
            },{width: 700, height: 400}).render(true)
        })
        console.log(rollApp);*/

    }

    // This function was building the popup. Can be deleted later
    /*_diceDisplay(pRollData) {

        let statDiceQty = pRollData.statDice;
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
        }

        let sampleHTML = `
        <form class="{{cssClass}} dice-prep" autocomplete="off">
            <div class="dice-dialog">
                <div class="dice-box">
                    <div class="stat-block-title">
                        <span>${statDiceName}</span>
                    </div>
                    <div class="stat-section">
                        ${statDiv}
                    </div>
                    <div class="stat-block-title">
                        <span>${skillDiceName}</span>
                    </div>
                    <div class="stat-section">
                        ${skillDiv}
                    </div>
                </div>
                <div class="check-info">
                    <span>Create a Dice Pool</span>
                    <span>Determine Success Number</span>
                    <span>Roll Dice Poll</span>
                    <span>Use Legendary Status</span>
                    <span>Use Focus</span>
                    <span>Roll Critical Dice</span>
                    <span>Determine Success or Failure</span>
                </div>
            </div>


        </form>

        <script>
        textContainer = document.querySelectorAll('.app.window-app.dialog');
        length = textContainer.length;
        for (i = 0; i < length; i++) {
            if (textContainer[i].children[1].children[0].children[0].className.includes("dice-prep")) {
            new_red = textContainer[i].id;
            if (document.getElementById(new_red).className.includes("dice-prep-dialog")) {
                continue;
            }
            else {
                document.getElementById(new_red).className += " dice-prep-dialog";
            }
            } else { console.log("uhhhhhhhhhh") }
        }
        </script>
    `;

        return sampleHTML;
    }*/


}