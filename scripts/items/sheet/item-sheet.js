/**
 * Override and extend the core ItemSheet implementation to handle specific item types.
 * @extends {ItemSheet}
 */

import { convertStatName } from "../../system/utility.js";

export class cncItemSheet extends foundry.appv1.sheets.ItemSheet {
    constructor(...args) {
        super(...args)

    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["item"],
            height: 500,
            tabs: [{ navSelector: ".item-tabs", contentSelector: ".item-modifier" }],
            dragDrop: [
                { dragSelector: ".item-list .item", dropSelector: null }
            ]
        });
    }

    get template() {
        let type = this.item.type;
        return `systems/coyote-and-crow/templates/sheet/${type}-sheet.html`;
    }
 
    get itemData() {
        return this.item.data;
    }

    async getData(options) {
        const itemData = super.getData(options);
        itemData.system = itemData.item._source.system;
        itemData._id = itemData.data._id;
        itemData.system.dropDowns = CONFIG.COYOTE;
        console.log(itemData);
        //const data = super.getData(options);
        //console.log(data);
        //console.log(this.actor);
        itemData.system.name = itemData.data.name;
        let pathStats
        itemData.system.enrichment = await this._enrichItem();
        itemData.system.dropDowns.physicalDefense = itemData.system.dropDowns.physicalDefense || [];
        itemData.system.dropDowns.modifierSN = itemData.system.dropDowns.modifierSN || [];
        itemData.system.dropDowns.dropdownSkills = itemData.system.dropDowns.dropdownSkills || [];

        if (this.item.isOwned === null || this.item.isOwned === false) {
            itemData.system.owned = false;
            return itemData;
        } else {
            itemData.system.owned = true;
        }
        const actorData = this.actor;
        itemData.actorData = actorData;

        pathStats = {
            [`${itemData.actorData.system.info.path.stats.stat1.value}`]: itemData.actorData.system.info.path.stats.stat1.name,
            [`${itemData.actorData.system.info.path.stats.stat2.value}`]: itemData.actorData.system.info.path.stats.stat2.name
        }

        if (itemData.actorData.type === "npc") {
            pathStats = {
                [`${itemData.actorData.system.info.path.stats.stat1.value}`]: itemData.actorData.system.info.path.stats.stat1.name,
                [`${itemData.actorData.system.info.path.stats.stat2.value}`]: itemData.actorData.system.info.path.stats.stat2.name,
                [`${itemData.actorData.system.info.path.stats.stat3.value}`]: itemData.actorData.system.info.path.stats.stat3.name,
                [`${itemData.actorData.system.info.path.stats.stat4.value}`]: itemData.actorData.system.info.path.stats.stat4.name,
                [`${itemData.actorData.system.info.path.stats.stat5.value}`]: itemData.actorData.system.info.path.stats.stat5.name,
                [`${itemData.actorData.system.info.path.stats.stat6.value}`]: itemData.actorData.system.info.path.stats.stat6.name,
                [`${itemData.actorData.system.info.path.stats.stat7.value}`]: itemData.actorData.system.info.path.stats.stat7.name,
                [`${itemData.actorData.system.info.path.stats.stat8.value}`]: itemData.actorData.system.info.path.stats.stat8.name,
                [`${itemData.actorData.system.info.path.stats.stat9.value}`]: itemData.actorData.system.info.path.stats.stat9.name
            }
        }
        itemData.system.allowStats = pathStats;
        //itemData.system.owned = true;

        if (itemData.item.type === "specialization") {
            // get the name of the skill used in specialization, and force lowercase
            let genSkillNameArr = itemData.system.skill.split(' ');
            let genSkillName = genSkillNameArr[0].toLowerCase();
            //console.log(genSkillName);

            // get the specific named skill data from the actor
            let specSkillObj = foundry.utils.deepClone(itemData.actorData.system.skills[genSkillName], { strict: true })
            //console.log(specSkillObj);

            // make a copy of the item to mutate. Note to self: find some turtles.
            let itemObj = foundry.utils.deepClone(itemData.system);
            //console.log(itemObj)

            // assign the stat name used on the skill to the item.
            itemObj.stat = specSkillObj.stat
            //console.log(itemObj.stat);

            // get the skill rank of the general skill used in the specialized skill
            itemObj.skillRank = itemData.actorData.system.skills[genSkillName].skillRank; /**** THIS NEEDS TO UPDATE THE ITEM. */
            let skillRank = itemObj.skillRank;
            //console.log(itemObj.skillRank)

            // get stat name of stat the general skill is using to support
            let statName = itemData.actorData.system.skills[genSkillName].stat;
            //console.log(statName);

            // get addDice value from skill. Values assigned from  items and only relevant if using combat skill (melee, ranged, unarmed)
            let addDice = specSkillObj.addDice ? specSkillObj.addDice : 0;
            //console.log(addDice)

            // get the specialized skill rank from the item
            let specRank = itemData.system.specRank;

            itemObj.statName = statName.capitalize(); // roll into itemData update clone

            let statRank = 0;

            switch (itemObj.stat) {
                case "agility":
                    statRank = itemData.actorData.system.stats.agility.value;
                    break;
                case "charisma":
                    statRank = itemData.actorData.system.stats.charisma.value;
                    break;
                case "endurance":
                    statRank = itemData.actorData.system.stats.endurance.value;
                    break;
                case "intelligence":
                    statRank = itemData.actorData.system.stats.intelligence.value;
                    break;
                case "perception":
                    statRank = itemData.actorData.system.stats.perception.value;
                    break;
                case "spirit":
                    statRank = itemData.actorData.system.stats.spirit.value;
                    break;
                case "strength":
                    statRank = itemData.actorData.system.stats.strength.value;
                    break;
                case "wisdom":
                    statRank = itemData.actorData.system.stats.wisdom.value;
                    break;
                case "will":
                    statRank = itemData.actorData.system.stats.will.value;
                    break;
                default:
                    console.log("ItemData.data.statRank not set")
                    break;
            }

            itemObj.statRank = statRank;
            itemObj.total = statRank + specRank + addDice;
            itemData.system = itemObj;
            //this.actor.updateEmbeddedDocuments("Item", [itemData])
        }
        //console.log(itemData);
        this.actor.updateEmbeddedDocuments("Item", [itemData])
        console.log(itemData);
        return itemData;
    }

    async _enrichItem() {
        //console.log("Enrichment processing");
        let enrichment = {};
        enrichment['system.notes'] = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.notes, {async: true, relativeTo: this.item});
        enrichment[`system.description`] = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.description, {async: true, relativeTo: this.item});

        return foundry.utils.expandObject(enrichment);
    }

    activateListeners(html) {
        super.activateListeners(html)

        html.find(".toggle-on-click").on("click", (event) => {
            const elmt = $(event.currentTarget).data("toggle");
            const tgt = html.find("." + elmt);
            tgt.toggleClass("toggle-active");
            if (event.target.classList.contains("fa-angle-double-down")) {
                event.target.classList.remove("fa-angle-double-down")
                event.target.classList.add("fa-angle-double-up")
            } else {
                event.target.classList.remove("fa-angle-double-up")
                event.target.classList.add("fa-angle-double-down")
            }
        });
    }


}