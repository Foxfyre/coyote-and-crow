/**
 * Override and extend the core ItemSheet implementation to handle specific item types.
 * @extends {ItemSheet}
 */

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
        

        console.log(data.document.parent === null)

        if (data.document.parent === null) {return itemData;} 

        const actorData = data.item.parent.data
        if (itemData.type === "ability") {
            let pathStats = {
                "stat1": actorData.data.info.path.stats.stat1,
                "stat2": actorData.data.info.path.stats.stat2
            }
            itemData.data.allowStats = pathStats;
            this.actor.updateEmbeddedDocuments("Item", [itemData])
            console.log(itemData)
        }

        if (itemData.type === "specialization") {
            switch (itemData.data.stat) {
                case "agi":
                    itemData.data.statName = "Agility";
                    itemData.data.statRank = actorData.data.stats.agi.value;
                    break;
                case "cha":
                    itemData.data.statName = "Charisma";
                    itemData.data.statRank = actorData.data.stats.cha.value;
                    break;
                case "end":
                    itemData.data.statName = "Endurance";
                    itemData.data.statRank = actorData.data.stats.end.value;
                    break;
                case "int":
                    itemData.data.statName = "Intelligence";
                    itemData.data.statRank = actorData.data.stats.int.value;
                    break;
                case "per":
                    itemData.data.statName = "Perception";
                    itemData.data.statRank = actorData.data.stats.per.value;
                    break;
                case "spi":
                    itemData.data.statName = "Spirit";
                    itemData.data.statRank = actorData.data.stats.spi.value;
                    break;
                case "str":
                    itemData.data.statName = "Strength";
                    itemData.data.statRank = actorData.data.stats.str.value;
                    break;
                case "wis":
                    itemData.data.statName = "Wisdom";
                    itemData.data.statRank = actorData.data.stats.wis.value;
                    break;
                case "wll":
                    itemData.data.statName = "Willpower"
                    itemData.data.statRank = actorData.data.stats.wll.value;
                    break;
            }
            let skillName = itemData.data.skill

            for (let [c, h] of Object.entries(actorData.data.skills)) {
                if (skillName === h.name) {
                    itemData.data.skillRank = h.rank;
                }
            }

            itemData.data.total = itemData.data.statRank + itemData.data.skillRank + itemData.data.rank;
            this.actor.updateEmbeddedDocuments("Item", [itemData])
        }
        console.log(itemData);
        return itemData;
    }
}