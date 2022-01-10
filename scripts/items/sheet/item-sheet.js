/**
 * Override and extend the core ItemSheet implementation to handle specific item types.
 * @extends {ItemSheet}
 */

export class cncItemSheet extends ItemSheet {
    constructor(...args) {
        super(...args)

    }  

    get template() {
        const path = "systems/coyote-and-crow/templates/sheet"
        return `${path}/${this.item.data.type}-sheet.html`;
    }

    async getData(options) {
        const data = super.getData(options);
        const itemData = data.data;
        console.log(data)
 

        console.log(itemData)
        return itemData;
    }
}