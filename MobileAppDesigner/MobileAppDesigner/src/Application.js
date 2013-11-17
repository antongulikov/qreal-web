define(["require", "exports", "src/designer/Controller"], function(require, exports, __DesignerController__) {
    
    var DesignerController = __DesignerController__;

    var Application = (function () {
        function Application() {
        }
        Object.defineProperty(Application, "DeviceController", {
            get: function () {
                return this.deviceController;
            },
            set: function (value) {
                this.deviceController = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Application, "DesignerController", {
            get: function () {
                return this.designerController;
            },
            set: function (value) {
                this.designerController = value;
            },
            enumerable: true,
            configurable: true
        });

        Application.deviceController = null;

        Application.designerController = null;
        return Application;
    })();
    
    return Application;
});
//# sourceMappingURL=Application.js.map