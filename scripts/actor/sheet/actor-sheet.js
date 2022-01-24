import buildRoll from "../../system/rolling.js";

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

        sheetData.abilities = {
            [`${actorData.data.info.path.stats.stat1}`]: "",
            [`${actorData.data.info.path.stats.stat2}`]: ""
        }
        sheetData.specialization = data.actor.items.filter(i => i.type === "specialization");
        sheetData.abilities[`${actorData.data.info.path.stats.stat1}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === actorData.data.info.path.stats.stat1);
        sheetData.abilities[`${actorData.data.info.path.stats.stat2}`] = data.actor.items.filter(i => i.type === "ability" && i.data.relStat === actorData.data.info.path.stats.stat2);

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
                    stat: "Strength"
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
        console.log(li.dataset)
        const item = this.actor.items.get(li.dataset.itemId);
        console.log(item)
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

    _setPath(actorData) {
        switch (actorData.data.info.path.value) {
            case "badger":
                actorData.data.info.path.name = "Badger";
                actorData.data.info.path.stats = {
                    "stat1": "intelligence",
                    "stat2": "will"
                }
                return actorData;
            case "bear":
                actorData.data.info.path.name = "Bear";
                actorData.data.info.path.stats = {
                    "stat1": "charisma",
                    "stat2": "strength"
                }
                return actorData;
            case "beaver":
                actorData.data.info.path.name = "Beaver";
                actorData.data.info.path.stats = {
                    "stat1": "endurance",
                    "stat2": "perception"
                }
                return actorData;
            case "bison":
                actorData.data.info.path.name = "Bison";
                actorData.data.info.path.stats = {
                    "stat1": "strength",
                    "stat2": "will"
                }
                return actorData;
            case "coyote":
                actorData.data.info.path.name = "Coyote";
                actorData.data.info.path.stats = {
                    "stat1": "agility",
                    "stat2": "intelligence"
                }
                return actorData;
            case "crow":
                actorData.data.info.path.name = "Crow";
                actorData.data.info.path.stats = {
                    "stat1": "spirit",
                    "stat2": "wisdom"
                }
                return actorData;
            case "deer":
                actorData.data.info.path.name = "Deer";
                actorData.data.info.path.stats = {
                    "stat1": "wisdom",
                    "stat2": "charisma"
                }
                return actorData;
            case "eagle":
                actorData.data.info.path.name = "Eagle";
                actorData.data.info.path.stats = {
                    "stat1": "strength",
                    "stat2": "wisdom"
                }
                return actorData;
            case "falcon":
                actorData.data.info.path.name = "Falcon";
                actorData.data.info.path.stats = {
                    "stat1": "perception",
                    "stat2": "spirit"
                }
                return actorData;
            case "fox":
                actorData.data.info.path.name = "Fox";
                actorData.data.info.path.stats = {
                    "stat1": "agility",
                    "stat2": "spirit"
                };
                return actorData;
            case "owl":
                actorData.data.info.path.name = "Owl";
                actorData.data.info.path.stats = {
                    "stat1": "endurance",
                    "stat2": "intelligence"
                }
                return actorData;
            case "raccoon":
                actorData.data.info.path.name = "Raccoon";
                actorData.data.info.path.stats = {
                    "stat1": "charisma",
                    "stat2": "intelligence"
                }
                return actorData;
            case "salmon":
                actorData.data.info.path.name = "Salmon";
                actorData.data.info.path.stats = {
                    "stat1": "will",
                    "stat2": "agility"
                }
                return actorData;
            case "snake":
                actorData.data.info.path.name = "Snake";
                actorData.data.info.path.stats = {
                    "stat1": "spirit",
                    "stat2": "endurance"
                }
                return actorData;
            case "spider":
                actorData.data.info.path.name = "Spider";
                actorData.data.info.path.stats = {
                    "stat1": "perception",
                    "stat2": "strength"
                }
                return actorData;
        }

    }

}