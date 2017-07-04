(function () {

    angular.module("app").component("modalDialogComponent", {
        templateUrl: "templates/ModalDialog.html",
        bindings: {
            resolve: "<",
            close: "&",
            dismiss: "&"
        },
        controller: function () {
            var controller = this;

            //events
            controller.$onInit = function () {
                controller.person = controller.resolve.person;
                controller.mode = controller.resolve.mode;
            }
            controller.save = function () {
                controller.close({ $value: controller.person });
            }
            controller.cancel = function () {
                controller.dismiss({ $value: "cancel" });
            }

            //toggle
            controller.toggle = function (obj, property, value) {
                obj[property] = value;
            }
            //add
            controller.add = function (obj, objName, properties, values) {
                if (obj === undefined) return;

                var result = { Id: objName !== undefined ? 1 : obj.length + 1, Name: 'NA' };
                for (var i = 0, len = properties.length; i < len; i++) {
                    result[properties[i]] = values[i];
                }
                if (objName === undefined) {
                    obj.push(result);
                    return obj;
                }
                obj[objName] = [];
                obj[objName].push(result);
                return obj[objName];
            }
        }
    });

})()