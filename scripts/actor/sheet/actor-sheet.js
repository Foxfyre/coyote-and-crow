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
        const path = "systems/coyote-and-crow/templates/sheet";
        return `${path}/${this.actor.data.type}-sheet.html`;
    }


    /*get template() {
        const path = "systems/expanse/templates/sheet"
        return `${path}/${this.actor.data.type}-sheet.html`;
    }*/


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

        // This block allows for the NPC to have access to all of the abilities.
        if (actorData.type === "npc") {
            let stat3 = data.actor.data.info.path.stats.stat3.value;
            let stat4 = data.actor.data.info.path.stats.stat4.value;
            let stat5 = data.actor.data.info.path.stats.stat5.value;
            let stat6 = data.actor.data.info.path.stats.stat6.value;
            let stat7 = data.actor.data.info.path.stats.stat7.value;
            let stat8 = data.actor.data.info.path.stats.stat8.value;
            let stat9 = data.actor.data.info.path.stats.stat9.value;
            sheetData.abilities = {
                [`${stat1}`]: "",
                [`${stat2}`]: "",
                [`${stat3}`]: "",
                [`${stat4}`]: "",
                [`${stat5}`]: "",
                [`${stat6}`]: "",
                [`${stat7}`]: "",
                [`${stat8}`]: "",
                [`${stat9}`]: ""
            }
            sheetData.abilities[`${stat1}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat1);
            sheetData.abilities[`${stat2}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat2);
            sheetData.abilities[`${stat3}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat3);
            sheetData.abilities[`${stat4}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat4);
            sheetData.abilities[`${stat5}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat5);
            sheetData.abilities[`${stat6}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat6);
            sheetData.abilities[`${stat7}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat7);
            sheetData.abilities[`${stat8}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat8);
            sheetData.abilities[`${stat9}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat9);

        } else if (actorData.type === "character") {
            sheetData.abilities = {
                [`${stat1}`]: "",
                [`${stat2}`]: ""
            }
            sheetData.abilities[`${stat1}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat1);
            sheetData.abilities[`${stat2}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === stat2);
        }

        sheetData.specialization = data.actor.items.filter(i => i.type === "specialization");
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

        //console.log(itemData)
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

    /*  Click rollable button
    *   \/
    *   Build Roll - Collect all relevant values for a roll - return
    *   \/
    *   Get roll results - Send relevant roll data through the dice roll process - return
    *       If player has legendary or mind points - pop up roll modifier
    *           In roll modifier screen - see current roll - decide to modify any dice by the relevant meta values
    *       Else roll normally
    *   \/
    *   Send Results into roll card 
    */ 

    async _diceRoll(event) {
        event.preventDefault();
        const data = super.getData()
        const rollType = event.currentTarget.closest("[data-rolltype]").dataset.rolltype;
        let rollData = {};

        rollData = {
            type: event.currentTarget.closest("[data-rolltype]").dataset.rolltype,
            specName: rollType === "specialization" ? event.currentTarget.closest("[data-rollname]").dataset.rollname : "",
            specRank: rollType === "specialization" ? Number(event.currentTarget.closest("[data-specrank]").dataset.specrank) : 0,
            skillName: (rollType === "skill" || rollType === "specialization") ? event.currentTarget.closest("[data-skillname]").dataset.skillname : "",
            skillRank: (rollType === "skill" || rollType === "specialization") ? Number(event.currentTarget.closest("[data-skillrank]").dataset.skillrank) : 0,
            statName: rollType === "stat" ? event.currentTarget.closest("[data-rollname").dataset.rollname : event.currentTarget.closest("[data-statname]").dataset.statname,
            statRank: Number(event.currentTarget.closest("[data-statrank]").dataset.statrank),
            legendary: 0,
            mind: 0,
            addDice: rollType === "skill" ? Number(event.currentTarget.closest("[data-adddice]").dataset.adddice) : 0,
            totalDice: 0,
            successNumber: 0,
            statSuccessNumber: 0,
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

        //console.log(compiledRollData)

        let rollResults = await getRoll(compiledRollData)

        //console.log(rollResults)

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
}