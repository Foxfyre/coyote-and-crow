import { cncActorSheet } from "./scripts/actor/sheet/actor-sheet.js";
import { cncActor } from "./scripts/actor/actor.js";
import { cncItemSheet } from "./scripts/items/sheet/item-sheet.js";
import { cncItem } from "./scripts/items/item.js";
//import { cncScene } from "./scripts/scenes/scene.js";
import { registerDiceSoNice } from "./scripts/hooks/dice-so-nice.js";

import { initializeHandlebars } from "./scripts/system/handlebars.js";

import { CoyoteDiceBlack } from "./module/cnc-dice-black.js";
import { CoyoteDiceWhite } from "./module/cnc-dice-white.js";
import getRoll from "./scripts/system/get-roll.js";
import rollCard from "./scripts/system/roll-card.js";
// import modifyRoll from "./scripts/system/modify-roll.js";

Hooks.once("init", async function () {
  console.log(`Initializing A Template`);

  // Define custom Entity classes
  CONFIG.Actor.documentClass = cncActor;
  CONFIG.Item.documentClass = cncItem;
  //CONFIG.Scene.documentClass = cncScene;
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
    <h2>0.1.7 Update</h2>

    <h4>Always update your world files before updating to a new system version of Coyote & Crow. 
    This system is actively in development and may be subject to breaking changes without warning.</h4>

    <h3><b>Functionality</b></h3>
    <ul>
    <li>None this time! </li>
    </ul><br>

    <h3>Bug Fixes</h3>
    <li>Fixed an issue where tiles weren't showing.</li>


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

Hooks.on("renderChatMessage", (message, html, data) => {
  console.log("Here's the Message")
  console.log(message);
  console.log("Here's the raw html")
  console.log(html);
  console.log("Here's the data");
  console.log(data);
  if (!message.isAuthor) {
    html.find("button").remove();
  }
  if (message.isRoll){
    if (Object.keys(message.data.flags["coyote-and-crow"]).length > 0) {
      const actor = game.actors.get(data.message.speaker.actor);
      const rolldata = message.data.flags["coyote-and-crow"];
      console.log(rolldata);
      if (html.find("button.modRoll")[0]){
        html.find("button.modRoll")[0].addEventListener("click", ev => {
          console.log("Modify Roll!")
          // let rolls = rawdata.rolls.split(',')
          // modifyRoll(rolldata, rolls, data.message.speaker.actor)
          // new modifyRollDialog('example').render(true);
        })
      }
      if (html.find("button.critRoll")[0]){
        console.log("The crit roll button was found")
        html.find("button.critRoll")[0].addEventListener("click", ev => {
          console.log("Crit Roll!")
          rolldata.totalDice = html.find("button.critRoll")[0].dataset.crits
          rolldata.critical = true;

          // We've got some kind of issue here
          const rollResults = getRoll(rolldata)
          const rolledCard = rollCard(rollResults);
    
          let chatOptions = {
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll: roll,
            flavor: rolledCard.title,
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            rollMode: game.settings.get("core", "rollMode"),
            content: rolledCard.dice,
            sound: CONFIG.sounds.dice,
            flags: {"coyote-and-crow": rolldata}
          };
    
          ChatMessage.create(chatOptions);
    
        })
      }
    }
  }
})

/*Hooks.on("renderDialog", (dialog, html) => {
  Array.from(html.find("#document-create option")).forEach(i => {
    console.log(i)
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