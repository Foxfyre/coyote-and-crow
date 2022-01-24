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

    _diceRoll(event) {
        event.preventDefault();
        const data = super.getData()
        console.log(event)
        const rollType = event.currentTarget.closest("[data-rolltype]").dataset.rolltype;
        const rollName = event.currentTarget.closest("[data-rollname]").dataset.rollname;
        console.log(data)

        let rollObj = buildRoll(data, rollType, rollName);

        console.log(rollObj)

        /*let dMod = new Promise((resolve) => {
            renderTemplate("/systems/coyote-and-crow/templates/dialog/dice-roll.html").then(dlg => {
                new Dialog({
                    title: game.i18n.localize("EXPANSE.DamageModifier"),
                    content: dlg,
                    buttons: {
                        roll: {
                            label: game.i18n.localize("EXPANSE.Roll"),
                            callback: (html) => {
                                resolve([
                                    Number(html.find(`[name="add1D6"]`).val()),
                                    Number(html.find(`[name="addDamage"]`).val())
                                ])
                            }
                        }
                    },
                    default: "Roll"
                }).render(true)
            });
        })
        return dMod;*/

    }

}