var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "src/properties/Property"], function(require, exports, __Property__) {
    var Property = __Property__;

    var ButtonProperty = (function (_super) {
        __extends(ButtonProperty, _super);
        function ButtonProperty() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(ButtonProperty.prototype, "Id", {
            get: function () {
                return this.id;
            },
            set: function (value) {
                this.id = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(ButtonProperty.prototype, "Text", {
            get: function () {
                return this.text;
            },
            set: function (value) {
                this.text = value;
            },
            enumerable: true,
            configurable: true
        });

        return ButtonProperty;
    })(Property);

    
    return ButtonProperty;
});
//# sourceMappingURL=ButtonProperty.js.map