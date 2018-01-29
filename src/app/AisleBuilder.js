import Aisle from './elements/Aisle';

export default class AisleBuilder {

    static newAisle(properties) {
        const aisle = new Aisle();

        aisle.set(properties);
        aisle.assemble();

        return aisle;
    }

}
