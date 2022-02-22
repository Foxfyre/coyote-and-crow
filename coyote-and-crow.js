import { cncActorSheet } from "./scripts/actor/sheet/actor-sheet.js";
import { cncActor } from "./scripts/actor/actor.js";
import { cncItemSheet } from "./scripts/items/sheet/item-sheet.js";
import { cncItem } from "./scripts/items/item.js";
import { cncScene } from "./scripts/scenes/scene.js";
import { registerDiceSoNice } from "./scripts/hooks/dice-so-nice.js";

import { initializeHandlebars } from "./scripts/system/handlebars.js";

import { CoyoteDiceBlack } from "./module/cnc-dice-black.js";
import { CoyoteDiceWhite } from "./module/cnc-dice-white.js";

Hooks.once("init", async function () {
  console.log(`Initializing A Template`);

  // Define custom Entity classes
  CONFIG.Actor.documentClass = cncActor;
  CONFIG.Item.documentClass = cncItem;
  CONFIG.Scene.documentClass = cncScene;
  CONFIG.Combat.initiative = {
    formula: "1d12",
    decimals: 2
  }

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("coyote-and-crow", cncActorSheet, {
    types: ["character", "npc"],
    makeDefault: true
  });

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
})

Hooks.on("ready", async () => {
  new Dialog({
    title: "Coyote And Crow",
    content: `All features are currently in progress and may change regularly. Not all features may be available currently and are subject to change.<br>
    It is recommended that you back up your world before installing an update to the game system.<br><br>
    Would you like to provide feedback on the Coyote and Crow Foundry System?<br><br>
    Join us on Discord! <a href="https://discord.gg/Fbm8Uevvny">https://discord.gg/Fbm8Uevvny</a><br><br>
    `,
    buttons: {
      ok: {
        label: "Proceed!",
      }
    }
  }).render(true)
})

Hooks.on("renderDialog", (dialog, html) => {
  Array.from(html.find("#document-create option")).forEach(i => {
    if (i.value == "weapon" || i.value == "armor") {
      i.remove()
    }
  })
})

/*Hooks.on("canvasReady", () => {
  console.log(canvas.scene.data.drawings.document.img)
  canvas.scene.data.drawings.document.img = 'systems/coyote-and-crow/ui/background-image.jpg';

  const renderer = PIXI.autoDetectRenderer()
  console.log(renderer)
  renderer.backgroundColor = 0x550055;
  renderer.options.backgroundAlpha = 0.5;
  renderer.options.useContextAlpha = false;
  
  document.body.appendChild(renderer.view)

  const stage = new PIXI.Container();

  let texture = PIXI.Texture.from('systems/coyote-and-crow/ui/background-image.jpg');
  let newBackground = new PIXI.Sprite(texture);

  stage.addChild(newBackground)

  renderer.render(stage)
})*/

/*Hooks.on("preCreateActor", (actor, createData, options, userId) => {
  const additionalItems = [
    new Item({name: "category", type: 'gift'}, {parent: actor}),
    new Item({name: "category", type: 'burden'}, {parent: actor})
  ];
  actor.data.update({
    items: additionalItems.map(i => i.toObject())
  });
});*/