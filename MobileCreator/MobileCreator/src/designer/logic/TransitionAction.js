var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "designer/logic/Action", "designer/Designer"], function(require, exports, __mAction__, __mDesigner__) {
    var mAction = __mAction__;

    var mDesigner = __mDesigner__;

    var TransitionAction = (function (_super) {
        __extends(TransitionAction, _super);
        function TransitionAction(formId) {
                _super.call(this);
            this.formId = formId;
        }
        Object.defineProperty(TransitionAction.prototype, "FormId", {
            get: function () {
                return this.formId;
            },
            set: function (formId) {
                this.formId = formId;
            },
            enumerable: true,
            configurable: true
        });
        TransitionAction.prototype.toXML = function () {
            var xml = "<transition form-id='" + this.formId + "' />\n";
            return xml;
        };
        TransitionAction.prototype.show = function (domElement) {
            var saveSessionBlock = $("<a href='#' data-role='button' data-inline='true' data-mini='true'>Go to form </a>");
            var formNames = mDesigner.Designer.formNames;
            var select = $("<select data-mini='true' data-inline='true'></select>");
            domElement.append(saveSessionBlock);
            domElement.append(select);
            saveSessionBlock.button();
            select.selectmenu();
            var _select = select;
            select.mouseover(function () {
                _select.empty();
                for(var i = 0; i < formNames.length; i++) {
                    var option = $("<option value='" + formNames[i] + "'>" + formNames[i] + "</option>");
                    _select.append(option);
                }
                _select.selectmenu("refresh", true);
            });
        };
        return TransitionAction;
    })(mAction.Action);
    exports.TransitionAction = TransitionAction;    
})
//@ sourceMappingURL=TransitionAction.js.map