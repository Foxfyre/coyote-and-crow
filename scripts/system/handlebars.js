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
        "systems/coyote-and-crow/templates/sheet/partial/player-bio.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-biography.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-gifts.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-burdens.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-notes.html",
        "systems/coyote-and-crow/templates/sheet/partial/fragment/skill-sn.html",
        "systems/coyote-and-crow/templates/sheet/partial/fragment/stat-sn.html",
        "systems/coyote-and-crow/templates/sheet/partial/fragment/pdefense.html",
        "systems/coyote-and-crow/templates/sheet/partial/fragment/stats.html",
        "systems/coyote-and-crow/templates/sheet/partial/fragment/success.html",
        "systems/coyote-and-crow/templates/sheet/partial/fragment/dice-pool.html",
        "systems/coyote-and-crow/templates/sheet/partial/fragment/dstat-mod.html",
        "systems/coyote-and-crow/templates/sheet/partial/fragment/stat-mod.html"
    ];
    return loadTemplates(templatePaths);
}