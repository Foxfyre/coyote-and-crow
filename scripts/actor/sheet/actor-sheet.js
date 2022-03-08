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
        html.find(".equip").click(this._equipItem.bind(this));
    }

    /* ITEM EQUIP */

    _equipItem(event) {
        event.preventDefault();
        const li = event.currentTarget.closest(".item");
        const itemId = li.dataset.itemId;
        const item = duplicate(this.actor.getEmbeddedDocument("Item", itemId))
        let isEquipped = item.data.equipped;
        isEquipped = !isEquipped;
        item.data.equipped = isEquipped;
        return this.actor.updateEmbeddedDocuments("Item", [item]);
    }

    /*
            html.find(".item-equip").click(async e => {
            const data = super.getData()
            const items = data.items;

            let itemId = e.currentTarget.getAttribute("data-item-id");
            const armor = duplicate(this.actor.getEmbeddedDocument("Item", itemId));

            for (let [k, v] of Object.entries(items)) {
                // Confirming only one armour equipped
                if ((v.type === "armor" || v.type === "shield") && v.data.equip === true && v._id !== itemId) {
                    Dialog.prompt({
                        title: "Cannot Equip",
                        content: "<p>You can only have one piece of armour and shield equipped at one time. Please remove your current armor before continuing",
                        label: "OK",
                        callback: () => console.log("denied!")
                    });
                    return;
                }
                // If targeting same armor, cycle on off;
                if (v.type === "armor" && v._id === itemId) {
                    armor.data.equip = !armor.data.equip;
                } else if (v.type === "shield" && v._id === itemId) {
                    armor.data.equip = !armor.data.equip;
                }
                this.actor.updateEmbeddedDocuments("Item", [armor])
            }
        });
    */

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
        const rollType = event.currentTarget.closest("[data-rolltype]").dataset.rolltype;
        let rollData = {};
 
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
            successNumber: 0,
            physicalDefense: 0,
            physicalDefenseDetail: ""
        }

        const skilledTests = ["Ceremony", "Cybernetics", "Herbalism", "Language", "Medicine", "Science"];

        if (skilledTests.includes(rollData.skillName) === true && rollData.skillRank === 0) {
            ui.notifications.warn(game.i18n.format("WARN.SkillRequired", { name: this.name }))
            return;
        }

        // Send data and roll info to gather all information required for rolls. 
        let compiledRollData = buildRoll(data, rollData);

        console.log(compiledRollData)

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
}