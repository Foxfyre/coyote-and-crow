/**
 * Override and extend the core ItemSheet implementation to handle specific item types.
 * @extends {ItemSheet}
 */

import { convertStatName } from "../../system/utility.js";

export class cncItemSheet extends ItemSheet {
    constructor(...args) {
        super(...args)

    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["item"],
            height: 500,
            tabs: [{ navSelector: ".item-tabs", contentSelector: ".item-modifier" }],
            dragDrop: [
                { dragSelector: ".item-list .item", dropSelector: null }
            ]
        });
    }

    get template() {
        const path = "systems/coyote-and-crow/templates/sheet"
        return `${path}/${this.item.data.type}-sheet.html`;
    }

    async getData(options) {
        const data = super.getData(options);
        const itemData = data.data;

        if (data.document.parent === null) {
            itemData.data.owned = false;
            return itemData;
        } else {
            itemData.data.owned = true;
        }

        const actorData = data.item.parent.data
        itemData.actorData = actorData;

        let pathStats = {
            [`${itemData.actorData.data.info.path.stats.stat1.value}`]: itemData.actorData.data.info.path.stats.stat1.name,
            [`${itemData.actorData.data.info.path.stats.stat2.value}`]: itemData.actorData.data.info.path.stats.stat2.name
        }
        itemData.data.allowStats = pathStats;
        itemData.data.owned = true;

        if (itemData.type === "specialization") {
            // get the name of the skill used in specialization, and force lowercase
            let genSkillNameArr = itemData.data.skill.split(' ');
            let genSkillName = genSkillNameArr[0].toLowerCase();
            //console.log(genSkillName);

            // get the specific named skill data from the actor
            let specSkillObj = foundry.utils.deepClone(itemData.actorData.data.skills[genSkillName], { strict: true })
            //console.log(specSkillObj);

            // make a copy of the item to mutate. Note to self: find some turtles.
            let itemObj = foundry.utils.deepClone(itemData.data);
            //console.log(itemObj)

            // assign the stat name used on the skill to the item.
            itemObj.stat = specSkillObj.stat

            // get the skill rank of the general skill used in the specialized skill
            itemObj.skillRank = actorData.data.skills[genSkillName].skillRank; /**** THIS NEEDS TO UPDATE THE ITEM. */
            let skillRank = itemObj.skillRank;
            //console.log(itemObj.skillRank)

            // get stat name of stat the general skill is using to support
            let statName = itemData.actorData.data.skills[genSkillName].stat;

            // get addDice value from skill. Values assigned from  items and only relevant if using combat skill (melee, ranged, unarmed)
            let addDice = specSkillObj.addDice ? specSkillObj.addDice : 0;
            //console.log(addDice)

            // get the specialized skill rank from the item
            let specRank = itemData.data.specRank;

            itemObj.statName = statName.capitalize(); // roll into itemData update clone

            let statRank = 0;

            switch (itemObj.stat) {
                case "agility":
                    statRank = actorData.data.stats.agility.value;
                    break;
                case "charisma":
                    statRank = actorData.data.stats.charisma.value;
                    break;
                case "endurance":
                    statRank = actorData.data.stats.endurance.value;
                    break;
                case "intelligence":
                    statRank = actorData.data.stats.intelligence.value;
                    break;
                case "perception":
                    statRank = actorData.data.stats.perception.value;
                    break;
                case "spirit":
                    statRank = actorData.data.stats.spirit.value;
                    break;
                case "strength":
                    statRank = actorData.data.stats.strength.value;
                    break;
                case "wisdom":
                    statRank = actorData.data.stats.wisdom.value;
                    break;
                case "will":
                    statRank = actorData.data.stats.will.value;
                    break;
                default:
                    console.log("ItemData.data.statRank not set")
                    break;
            }

            itemObj.statRank = statRank;
            itemObj.total = statRank + specRank + skillRank + addDice;
            itemData.data = itemObj;
        }
        this.actor.updateEmbeddedDocuments("Item", [itemData])
        return itemData;
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