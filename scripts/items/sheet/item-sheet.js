/**
 * Override and extend the core ItemSheet implementation to handle specific item types.
 * @extends {ItemSheet}
 */

import { convertStatName } from "../../system/utility.js";

export class cncItemSheet extends ItemSheet {
    constructor(...args) {
        super(...args)

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

        if (itemData.type === "ability") {
            let pathStats = {
                [`${actorData.data.info.path.stats.stat1}`]: actorData.data.info.path.stats.stat1,
                [`${actorData.data.info.path.stats.stat2}`]: actorData.data.info.path.stats.stat2
            }
            itemData.data.allowStats = pathStats;
            itemData.data.owned = true;
            this.actor.updateEmbeddedDocuments("Item", [itemData])
        }

        if (itemData.type === "specialization") {
            itemData.data.statName = itemData.data.stat.capitalize()
            switch (itemData.data.stat) {
                case "agility":
                    itemData.data.statRank = actorData.data.stats.agility.value;
                    break;
                case "charisma":
                    itemData.data.statRank = actorData.data.stats.charisma.value;
                    break;
                case "endurance":
                    itemData.data.statRank = actorData.data.stats.endurance.value;
                    break;
                case "intelligence":
                    itemData.data.statRank = actorData.data.stats.intelligence.value;
                    break;
                case "perception":
                    itemData.data.statRank = actorData.data.stats.perception.value;
                    break;
                case "spirit":
                    itemData.data.statRank = actorData.data.stats.spirit.value;
                    break;
                case "strength":
                    itemData.data.statRank = actorData.data.stats.strength.value;
                    break;
                case "wisdom":
                    itemData.data.statRank = actorData.data.stats.wisdom.value;
                    break;
                case "will":
                    itemData.data.statRank = actorData.data.stats.will.value;
                    break;
                default:
                    console.log("ItemData.data.statRank not set")
                    break;
            }
            let skillName = itemData.data.skill

            for (let [c, h] of Object.entries(actorData.data.skills)) {
                if (skillName === h.name) {
                    itemData.data.skillRank = h.rank;
                }
            }

            itemData.data.total = itemData.data.statRank + itemData.data.skillRank + itemData.data.specRank;
            this.actor.updateEmbeddedDocuments("Item", [itemData])
        }
        return itemData;
    }

    activateListeners(html) {
        super.activateListeners(html)

        html.find(".toggle-on-click").on("click", (event) => {
            console.log(event)
            console.log(event.target.classList);
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