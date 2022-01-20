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
        }

        const actorData = data.item.parent.data
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
            console.log(itemData)
            itemData.data.statName = convertStatName(itemData.data.stat)
            console.log(itemData.data.statName);
            switch (itemData.data.stat) {
                case "agi":
                    itemData.data.statRank = actorData.data.stats.agi.value;
                    break;
                case "cha":
                    itemData.data.statRank = actorData.data.stats.cha.value;
                    break;
                case "end":
                    itemData.data.statRank = actorData.data.stats.end.value;
                    break;
                case "int":
                    itemData.data.statRank = actorData.data.stats.int.value;
                    break;
                case "per":
                    itemData.data.statRank = actorData.data.stats.per.value;
                    break;
                case "spi":
                    itemData.data.statRank = actorData.data.stats.spi.value;
                    break;
                case "str":
                    itemData.data.statRank = actorData.data.stats.str.value;
                    break;
                case "wis":
                    itemData.data.statRank = actorData.data.stats.wis.value;
                    break;
                case "wll":
                    itemData.data.statRank = actorData.data.stats.wll.value;
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

            itemData.data.total = itemData.data.statRank + itemData.data.skillRank + itemData.data.rank;
            //this.actor.updateEmbeddedDocuments("Item", [itemData])
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