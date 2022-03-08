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

  game.settings.register("coyote-and-crow", "initial-welcome", {
    name: "Hide Welcome Message",
    hint: "Hide the welcome message for the latest update to the Coyote & Crow system.",
    scope: "user",
    config: !0,
    type: Boolean,
    default: !1
  })

});

Hooks.once("diceSoNiceReady", (dice3d) => {
  registerDiceSoNice(dice3d);
});

Hooks.once("init", () => {
  const debouncedReload = foundry.utils.debounce(() => {
    window.location.reload();
  }, 100);
})

Hooks.once("ready", async () => {
  if (!game.settings.get("coyote-and-crow", "initial-welcome")) {
    new Dialog({
      title: `Welcome to v${game.system.data.version} of Coyote & Crow`,
      content: `
    <h1>Coyote & Crow</h1>
    <h2>WARNING</h3>
    <h4>Changes have been made to the Items that have broken previous functionality.
    Items are now separate item entities and will need to be recreated in their appropriate Item cards</h4>

    <h4>Always update your world files before updating to a new system version of Coyote & Crow. 
    This system is actively in development and may be subject to breaking changes without warning.</h4>

    <h2>System Change log for v${game.system.data.version}</h2>

    <h3><b>Features</b></h3>

    <ul>
    <li>Removed the general Item Card and replaced with separate item cards for Armor/clothing, Items, and Weapons.</li>
    <li>Added the ability to be able to toggle on and off armor/clothing and weapons with the equip checkbox on the character sheet. This will add/remove relevant modifiers from the character sheet stats & rolls.</li>
    <li>A text field has been added to Item cards to give the item a description.</li>
    <li>Weapon Dice Pools are limited by the Skill Ranks in the appropriate weapon skill.</li>
    <li>Added the Primary & Secondary option to the Abilities Activation dropdown.</li>
    <li>Styling has been added to the journal entries.</li>
    <li>Added a Modifier element on chat display roll cards indicating if there is a modifier to apply. Will only be shown if there is a Modifier.</li>
    </ul><br>

    <p>If you encounter any bugs, or have feature suggestions, you can join the Trello board and let us know <a href="https://trello.com/invite/b/jpGljTcv/e6c3e37afda0eb61278d7e432956594c/coyote-crow-bug-reporting">HERE</a>.</p>

    <p>Want to find others who play Coyote & Crow? Join us on <a href="https://discord.gg/Fbm8Uevvny">Discord!</a></p>
    `,
      buttons: {
        dont_show: {
          label: "Don't Show Again",
          callback: async () => {
            await game.settings.set("coyote-and-crow", "initial-welcome", true)
          }
        },
        close: {
          label: "Close"
        }
      }
    }, { width: 600 }).render(true)
  }
})

/*Hooks.on("renderDialog", (dialog, html) => {
  Array.from(html.find("#document-create option")).forEach(i => {
    if (i.value == "weapon" || i.value == "armor") {
      i.remove()
    }
  })
})*/

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