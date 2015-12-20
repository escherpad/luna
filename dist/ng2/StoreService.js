var StoreService = (function () {
    function StoreService() {
        this.$ = {};
        this.types = {};
        this.actions = {};
        // # Typical coding patterns in the constructor:
        //
        // 1. Compose the reducer of your dependencies and save it to this.reducer
        // 2. Collect all streams from lower level dependencies to this.$
        // 3. Now initialize your store if this is the root store, or assemble the child states
        //    and assign it to `this.initialState`.
        // 4. It is also convenient to collect actionCreators. They will be dispatched with
        //    `this` keyword bound to the rootStore object.
    }
    StoreService.prototype.onStoreInit = function (store) {
    };
    return StoreService;
})();
exports.StoreService = StoreService;
