export const initializeHandlebars = () => {
    preloadHandlebarsTemplates();
}

function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/coyote-and-crow/templates/sheet/partial/player-stats.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-skills.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-abilities.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-summary.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-belongings.html",
        "systems/coyote-and-crow/templates/sheet/partial/item-item.html",
        "systems/coyote-and-crow/templates/sheet/partial/item-armor.html",
        "systems/coyote-and-crow/templates/sheet/partial/item-weapon.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-bio.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-biography.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-gifts.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-notes.html"
    ];
    return loadTemplates(templatePaths);
}