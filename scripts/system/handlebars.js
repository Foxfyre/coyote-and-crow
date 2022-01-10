export const initializeHandlebars = () => {
    preloadHandlebarsTemplates();
}

function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/coyote-and-crow/templates/sheet/partial/player-stats.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-skills.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-abilities.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-summary.html",
        "systems/coyote-and-crow/templates/sheet/partial/player-belongings.html"
    ];
    return loadTemplates(templatePaths);
}