export class cncActorSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["sheet", "actor"],
            height: 750,
            width: 700,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".content-section", initial: "abilities" },
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

        sheetData.specialization = data.actor.items.filter(i => i.type === "specialization");
        sheetData.abilities = data.actor.items.filter(i => i.type === "ability");

        for (let [k, v] of Object.entries(sheetData.specialization)) {
            console.log(v.data);
            switch (v.data.stat) {
                case "agi":
                    v.data.statName = "Agility";
                    v.data.statRank = sheetData.stats.agi.value;
                    break;
                case "cha":
                    v.data.statName = "Charisma";
                    v.data.statRank = sheetData.stats.cha.value;
                    break;
                case "end":
                    v.data.statName = "Endurance";
                    v.data.statRank = sheetData.stats.end.value;
                    break;
                case "int":
                    v.data.statName = "Intelligence";
                    v.data.statRank = sheetData.stats.int.value;
                    break;
                case "per":
                    v.data.statName = "Perception";
                    v.data.statRank = sheetData.stats.per.value;
                    break;
                case "spi":
                    v.data.statName = "Spirit";
                    v.data.statRank = sheetData.stats.spi.value;
                    break;
                case "str":
                    v.data.statName = "Strength";
                    v.data.statRank = sheetData.stats.str.value;
                    break;
                case "wis":
                    v.data.statName = "Wisdom";
                    v.data.statRank = sheetData.stats.wis.value;
                    break;
                case "wll":
                    v.data.statName = "Willpower"
                    v.data.statRank = sheetData.stats.wll.value;
                    break;
            }
            console.log(v)
            let skillName = v.data.skill

            for (let [c, h] of Object.entries(sheetData.skills)) {
                console.log(h)
                if (skillName === h.name) {
                    v.data.skillRank = h.rank;
                    console.log(v.data.skillRank);
                }
            }

            v.data.total = v.data.statRank + v.data.skillRank + v.data.rank;

            this.actor.updateEmbeddedDocuments("Item", [v])
        }

        console.log(sheetData)
        this._sortSkills(sheetData);
        return sheetData;
    }

    activateListeners(html) {
        super.activateListeners(html)
        html.find(".item-create").click(this._itemCreate.bind(this));
        html.find(".item-edit").click(this._onItemEdit.bind(this));
        html.find(".item-delete").click(this._onItemDelete.bind(this));
    }

    _itemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;
        const itemData = {
            name: game.i18n.format("ITEM.itemNew", { type: game.i18n.localize(`ITEM.ItemType${type.capitalize()}`) }),
            type: type,
            data: foundry.utils.deepClone(header.dataset)
        };
        delete itemData.data.type;
        return this.actor.createEmbeddedDocuments("Item", [itemData], { renderSheet: true });
    }

    _onItemEdit(event) {
        event.preventDefault();
        const li = event.currentTarget.closest(".item");
        console.log(li.dataset)
        const item = this.actor.items.get(li.dataset.itemId);
        console.log(item)
        item.sheet.render(true);
    }

    _onItemDelete(event) {
        event.preventDefault();
        const li = event.currentTarget.closest(".item");
        const item = this.actor.items.get(li.dataset.itemId);
        if (item) return item.delete();
    }

    _sortSkills(data) {
        let midpoint = Object.values(data.skills).length / 2;
        let i = 0;
        for (let skill of Object.values(data.skills)) {
            (i < midpoint) ? skill.colMod = 1 : skill.colMod = 0;
            i++
        }
    }

}