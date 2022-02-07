import { cncActorSheet } from "./scripts/actor/sheet/actor-sheet.js";
import { cncActor } from "./scripts/actor/actor.js";
import { cncItemSheet } from "./scripts/items/sheet/item-sheet.js";
import { cncItem } from "./scripts/items/item.js";

/*import { coyote-and-crowNPCSheet } from "./npc-sheet.js";
import { coyote-and-crowShipSheet } from "./ship-sheet.js";*/
import { registerDiceSoNice } from "./scripts/hooks/dice-so-nice.js";

import { initializeHandlebars } from "./scripts/system/handlebars.js";

import { CoyoteDiceBlack } from "./module/cnc-dice-black.js";
import { CoyoteDiceWhite } from "./module/cnc-dice-white.js";

Hooks.once("init", async function () {
  console.log(`Initializing A Template`);

  // Define custom Entity classes
  CONFIG.Actor.documentClass = cncActor;
  CONFIG.Item.documentClass = cncItem;
  CONFIG.Combat.initiative = {
    formula: "1d12",
    decimals: 2
  }

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("coyote-and-crow", cncActorSheet, {
    types: ["character"],
    makeDefault: true
  });
  /*Actors.registerSheet("coyote-and-crow", cncNPCSheet, {
    types: ["npc"],
    makeDefault: true
  });*/
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("coyote-and-crow", cncItemSheet, {
    makeDefault: true
  });

  initializeHandlebars();

  Handlebars.registerHelper('concat', function () {
    let arg = Array.prototype.slice.call(arguments, 0);
    arg.pop();
    return arg.join('');
  })

  Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case "&&":
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case "||":
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }

  });

  CONFIG.Dice.terms["a"] = CoyoteDiceWhite;
  CONFIG.Dice.terms["b"] = CoyoteDiceBlack;

});

Hooks.once("diceSoNiceReady", (dice3d) => {
  registerDiceSoNice(dice3d);
});

Hooks.once("init", () => {
  const debouncedReload = foundry.utils.debounce(() => {
    window.location.reload();
  }, 100);

  /*game.settings.register("coyote-and-crow", "diceStyle", {
    name: "SETTINGS.DiceChoice",
    hint: "SETTINGS.DiceChoiceHint",
    scope: "client",
    config: true,
    default: 0,
    type: String,
    choices: {
      "0": "SETTINGS.EarthDark",
      "1": "SETTINGS.EarthLight",
      "2": "SETTINGS.MarsDark",
      "3": "SETTINGS.MarsLight",
      "4": "SETTINGS.BeltDark",
      "5": "SETTINGS.BeltLight",
      "6": "SETTINGS.ProtoDark",
      "7": "SETTINGS.ProtoLight"
    },
    onChange: debouncedReload
  });*/
})

/*Hooks.on("ready", async () => {
  new Dialog({
    title: "Coyote And Crow",
    content: `This system is for Coyote and Crow. All features are currently in progress.`,
    buttons: {
      ok: {
        label: "Proceed!",
      }
    }
  }).render(true)
})*/

Hooks.on("renderDialog", (dialog, html) => {
  Array.from(html.find("#document-create option")).forEach(i => {
    if (i.value == "weapon" || i.value == "armor") {
      i.remove()
    }
  })
})

/*Hooks.on("preCreateActor", (actor, createData, options, userId) => {
  const additionalItems = [
    new Item({name: "category", type: 'gift'}, {parent: actor}),
    new Item({name: "category", type: 'burden'}, {parent: actor})
  ];
  actor.data.update({
    items: additionalItems.map(i => i.toObject())
  });
});*/