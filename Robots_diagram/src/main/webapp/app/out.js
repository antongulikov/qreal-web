angular.module('diagram', ['controllers']);
var Controllers;
(function (Controllers) {
    var DiagramController = (function () {
        function DiagramController($scope, $compile) {
            this.graph = new joint.dia.Graph;
            this.paper = new DiagramPaper(this.graph);
            this.nodeTypesMap = {};
            this.nodesList = {};
            this.nodeIndex = -1;
            var controller = this;
            $scope.vm = controller;
            controller.nodeTypesMap = XmlManager.loadElementsFromXml("configs/elements.xml", $scope, $compile);
            this.paper.on('cell:pointerdown', function (cellView, evt, x, y) {
                console.log('cell view ' + cellView.model.id + ' was clicked');
                var node = controller.nodesList[cellView.model.id];
                if (node) {
                    controller.currentNode = node;
                    controller.setNodeProperties(node);
                }
                else {
                    controller.currentNode = undefined;
                }
            });
            this.paper.on('blank:pointerdown', function (evt, x, y) {
                console.log('blank was clicked');
                $(".property").remove();
                controller.currentNode = undefined;
            });
            this.setInputStringListener(controller);
            this.setCheckboxListener(controller);
            this.setDropdownListener(controller);
            this.setSpinnerListener(controller);
            this.initDragAndDrop(controller);
        }
        DiagramController.prototype.setInputStringListener = function (controller) {
            $(document).on('change', '.form-control', function () {
                var tr = $(this).closest('tr');
                var name = tr.find('td:first').html();
                var value = $(this).val();
                var property = controller.currentNode.getProperties()[name];
                property.value = value;
                controller.currentNode.setProperty(name, property);
            });
        };
        DiagramController.prototype.setCheckboxListener = function (controller) {
            $(document).on('change', '.checkbox', function () {
                var tr = $(this).closest('tr');
                var name = tr.find('td:first').html();
                var label = tr.find('label');
                var value = label.contents().last()[0].textContent;
                if (value === "True") {
                    value = "False";
                    label.contents().last()[0].textContent = value;
                }
                else {
                    value = "True";
                    label.contents().last()[0].textContent = value;
                }
                var property = controller.currentNode.getProperties()[name];
                property.value = value;
                controller.currentNode.setProperty(name, property);
            });
        };
        DiagramController.prototype.setDropdownListener = function (controller) {
            $(document).on('change', '.mydropdown', function () {
                var tr = $(this).closest('tr');
                var name = tr.find('td:first').html();
                var value = $(this).val();
                var property = controller.currentNode.getProperties()[name];
                property.value = value;
                controller.currentNode.setProperty(name, property);
            });
        };
        DiagramController.prototype.setSpinnerListener = function (controller) {
            $(document).on('change', '.spinner', function () {
                var tr = $(this).closest('tr');
                var name = tr.find('td:first').html();
                var value = $(this).val();
                if (value !== "" && !isNaN(value)) {
                    var property = controller.currentNode.getProperties()[name];
                    property.value = value;
                    controller.currentNode.setProperty(name, property);
                }
            });
        };
        DiagramController.prototype.initDragAndDrop = function (controller) {
            $(".tree_element").draggable({
                helper: function () {
                    return $(this).find('.elementImg').clone();
                },
                revert: "invalid"
            });
            $("#paper").droppable({
                drop: function (event, ui) {
                    var paperPos = $("#paper").position();
                    var topElementPos = ui.position.top - paperPos.top;
                    var leftElementPos = ui.position.left - paperPos.left;
                    var gridSize = controller.paper.getGridSizeValue();
                    topElementPos -= topElementPos % gridSize;
                    leftElementPos -= leftElementPos % gridSize;
                    var type = $(ui.draggable.context).text();
                    var image = controller.nodeTypesMap[type].image;
                    var properties = controller.nodeTypesMap[type].properties;
                    controller.createDefaultNode(type, leftElementPos, topElementPos, properties, image);
                }
            });
        };
        DiagramController.prototype.setNodeProperties = function (node) {
            var properties = node.getProperties();
            var content = '';
            for (var property in properties) {
                content += this.getPropertyHtml(node.getType(), property, properties[property]);
            }
            $('#property_table tbody').html(content);
        };
        DiagramController.prototype.getPropertyHtml = function (typeName, propertyName, property) {
            return PropertyManager.getPropertyHtml(typeName, propertyName, property);
        };
        DiagramController.prototype.createDefaultNode = function (type, x, y, properties, image) {
            this.nodeIndex++;
            var name = "Node" + this.nodeIndex;
            var node = new DefaultDiagramNode(name, type, x, y, properties, image);
            this.nodesList[node.getElement().id] = node;
            this.graph.addCell(node.getElement());
        };
        DiagramController.prototype.clear = function () {
            this.graph.clear();
            this.nodeIndex = -1;
            this.nodesList = {};
            $(".property").remove();
            this.currentNode = undefined;
        };
        DiagramController.prototype.removeCurrentElement = function () {
            if (this.currentNode) {
                console.log("Node was deleted");
                delete this.nodesList[this.currentNode.getElement().id];
                this.currentNode.getElement().remove();
                $(".property").remove();
                this.currentNode = undefined;
            }
        };
        DiagramController.prototype.saveDiagram = function () {
            var name = prompt("input name");
            console.log(ExportManager.exportDiagramStateToJSON(this.graph, name, this.nodeIndex, this.nodesList));
            $.ajax({
                type: 'POST',
                url: 'save',
                dataType: 'json',
                contentType: 'application/json',
                data: (ExportManager.exportDiagramStateToJSON(this.graph, name, this.nodeIndex, this.nodesList)),
                success: function (response) {
                    console.log(response.message);
                },
                error: function (response, status, error) {
                    console.log("error: " + status + " " + error);
                }
            });
        };
        DiagramController.prototype.openDiagram = function () {
            var controller = this;
            var name = prompt("input diagram name");
            $.ajax({
                type: 'POST',
                url: 'open',
                dataType: 'json',
                contentType: 'application/json',
                data: (JSON.stringify({ name: name })),
                success: function (response) {
                    controller.clear();
                    controller.nodeIndex = ImportManager.import(response, controller.graph, controller.nodesList);
                    console.log(response.nodeIndex);
                },
                error: function (response, status, error) {
                    console.log("error: " + status + " " + error);
                }
            });
        };
        return DiagramController;
    })();
    Controllers.DiagramController = DiagramController;
})(Controllers || (Controllers = {}));
var Controllers;
(function (Controllers) {
    var TwoDModelController = (function () {
        function TwoDModelController($scope, $compile) {
            $scope.vm = this;
            $(document).ready(function () {
                var stage = new PIXI.Stage(0xFFFFFF);
                var renderer = PIXI.autoDetectRenderer($("#stage").width(), $("#stage").height());
                $("#stage").append(renderer.view);
                requestAnimFrame(animate);
                function animate() {
                    requestAnimFrame(animate);
                    renderer.render(stage);
                }
            });
        }
        return TwoDModelController;
    })();
    Controllers.TwoDModelController = TwoDModelController;
})(Controllers || (Controllers = {}));
angular.module('controllers', []).controller(Controllers);
var DropdownListManager = (function () {
    function DropdownListManager() {
    }
    DropdownListManager.addDropdownList = function (typeName, propertyName, list) {
        if (!this.nodeDropdowns[typeName]) {
            this.nodeDropdowns[typeName] = {};
        }
        this.nodeDropdowns[typeName][propertyName] = list;
    };
    DropdownListManager.getDropdownList = function (typeName, propertyName) {
        return this.nodeDropdowns[typeName][propertyName];
    };
    DropdownListManager.nodeDropdowns = {};
    return DropdownListManager;
})();
var ExportManager = (function () {
    function ExportManager() {
    }
    ExportManager.exportVertices = function (vertices) {
        var count = 1;
        var newVertices = [];
        vertices.forEach(function (vertex) {
            newVertices.push({
                x: vertex.x,
                y: vertex.y,
                number: count
            });
            count++;
        });
        return newVertices;
    };
    ExportManager.exportDiagramStateToJSON = function (graph, name, nodeIndex, nodesList) {
        var json = {
            'name': name,
            'nodeIndex': nodeIndex,
            'nodes': [],
            'links': []
        };
        for (var id in nodesList) {
            if (nodesList.hasOwnProperty(id)) {
                var node = nodesList[id];
                var newNode = {
                    'name': node.getName(),
                    'type': node.getType(),
                    'x': node.getX(),
                    'y': node.getY(),
                    'image': node.getImagePath(),
                    'properties': []
                };
                var properties = node.getProperties();
                var position = 1;
                for (var propertyName in properties) {
                    var property = {
                        'name': propertyName,
                        'value': properties[propertyName].value,
                        'type': properties[propertyName].type,
                        'position': position
                    };
                    newNode.properties.push(property);
                    position++;
                }
                json.nodes.push(newNode);
            }
        }
        graph.getLinks().forEach(function (link) {
            console.log(link.get('target'));
            var src = nodesList[link.get('source').id].getName();
            var target = nodesList[link.get('target').id].getName();
            var vertices;
            if (link.get('vertices')) {
                vertices = ExportManager.exportVertices(link.get('vertices'));
            }
            var newLink = {
                'source': src,
                'target': target,
                'vertices': vertices
            };
            json.links.push(newLink);
        });
        return JSON.stringify(json);
    };
    return ExportManager;
})();
var ImportManager = (function () {
    function ImportManager() {
    }
    ImportManager.import = function (response, graph, nodesList) {
        console.log("import diagram");
        for (var i = 0; i < response.nodes.length; i++) {
            var nodeObject = response.nodes[i];
            var properties = {};
            var propertiesObject = nodeObject.properties;
            for (var j = 0; j < propertiesObject.length; j++) {
                var property = new Property(propertiesObject[j].value, propertiesObject[j].type);
                properties[propertiesObject[j].name] = property;
            }
            this.importNode(graph, nodesList, nodeObject.name, nodeObject.type, nodeObject.x, nodeObject.y, properties, nodeObject.image);
        }
        for (var i = 0; i < response.links.length; i++) {
            var linkObject = response.links[i];
            this.importLink(graph, nodesList, linkObject.source, linkObject.target, linkObject.vertices);
        }
        return response.nodeIndex;
    };
    ImportManager.importNode = function (graph, nodesList, name, type, x, y, properties, image) {
        var node = new DefaultDiagramNode(name, type, x, y, properties, image);
        nodesList[node.getElement().id] = node;
        graph.addCell(node.getElement());
    };
    ImportManager.importLink = function (graph, nodesList, sourceNodeId, targetNodeId, vertices) {
        var sourceId = this.getElementIdByNodeId(nodesList, sourceNodeId);
        var targetId = this.getElementIdByNodeId(nodesList, targetNodeId);
        var newVertices = this.importVertices(vertices);
        var link = new joint.dia.Link({
            attrs: {
                '.connection': { stroke: 'black' },
                '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
            },
            source: { id: sourceId },
            target: { id: targetId },
            vertices: newVertices
        });
        graph.addCell(link);
    };
    ImportManager.importVertices = function (vertices) {
        var newVertices = [];
        vertices.forEach(function (vertex) {
            newVertices.push({
                x: vertex.x,
                y: vertex.y
            });
        });
        return newVertices;
    };
    ImportManager.getElementIdByNodeId = function (nodesList, nodeId) {
        for (var id in nodesList) {
            if (nodesList.hasOwnProperty(id)) {
                var node = nodesList[id];
                if (node.getName() === nodeId) {
                    return id;
                }
            }
        }
        return undefined;
    };
    return ImportManager;
})();
var PropertyManager = (function () {
    function PropertyManager() {
    }
    PropertyManager.getPropertyHtml = function (typeName, propertyName, property) {
        switch (property.type) {
            case "string":
                return this.getHtmlForString(propertyName, property);
            case "checkbox":
                return this.getHtmlForCheckBox(propertyName, property);
            case "dropdown":
                return this.getHtmlForDropdown(typeName, propertyName, property);
            case "spinner":
                return this.getHtmlForSpinner(propertyName, property);
            default:
                return undefined;
        }
    };
    PropertyManager.getHtmlForString = function (propertyName, property) {
        var content = '<tr class="property">';
        content += '<td class="vert-align">' + propertyName + '</td>';
        content += '<td class="vert-align"><div class="input-group">';
        content += '<input type="text" class="form-control" value="' + property.value + '">';
        content += '</div></td></tr>';
        return content;
    };
    PropertyManager.getHtmlForCheckBox = function (propertyName, property) {
        var content = '<tr class="property">';
        content += '<td class="vert-align">' + propertyName + '</td>';
        content += '<td class="vert-align"><div class="checkbox">';
        var state = "";
        if (property.value === "True") {
            state = "checked";
        }
        content += '<label class="active"><input type="checkbox" ' + state + ' >' + property.value + '</label>';
        content += '</div></td></tr>';
        return content;
    };
    PropertyManager.getHtmlForDropdown = function (typeName, propertyName, property) {
        var content = '<tr class="property">';
        content += '<td class="vert-align">' + propertyName + '</td>';
        content += '<td class="vert-align"><select class="mydropdown">';
        var dropdownList = DropdownListManager.getDropdownList(typeName, propertyName);
        for (var i in dropdownList) {
            var variant = dropdownList[i];
            var selected = "";
            if (variant === property.value) {
                selected = 'selected = "selected" ';
            }
            content += '<option ' + selected + 'value="' + variant + '">' + variant + '</option>';
        }
        content += '</select></td></tr>';
        return content;
    };
    PropertyManager.getHtmlForSpinner = function (propertyName, property) {
        var content = '<tr class="property">';
        content += '<td class="vert-align">' + propertyName + '</td>';
        content += '<td class="vert-align"><input type="number" class="spinner" value="' + property.value + '">';
        content += '</td></tr>';
        return content;
    };
    return PropertyManager;
})();
var XmlManager = (function () {
    function XmlManager() {
    }
    XmlManager.loadXMLDoc = function (name) {
        var xmlDoc;
        if (XMLHttpRequest) {
            xmlDoc = new XMLHttpRequest();
            xmlDoc.open("GET", name, false);
            xmlDoc.send("");
            return xmlDoc.responseXML;
        }
        else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.load(name);
            return xmlDoc;
        }
        alert("Error loading document!");
        return null;
    };
    XmlManager.addDropdownList = function (typeName, propertyName, variants) {
        var list = [];
        for (var i = 0; i < variants.length; i++) {
            list.push(variants[i].childNodes[0].nodeValue);
        }
        DropdownListManager.addDropdownList(typeName, propertyName, list);
    };
    XmlManager.loadElementsFromXml = function (pathToXML, $scope, $compile) {
        var xmlDoc = this.loadXMLDoc(pathToXML);
        var nodeTypesMap = {};
        var content = '';
        var categories = xmlDoc.getElementsByTagName("Category");
        for (var k = 0; k < categories.length; k++) {
            content += '<li><p>' + categories[k].getAttribute('name') + '</p><ul>';
            var elements = categories[k].getElementsByTagName("Element");
            for (var i = 0; i < elements.length; i++) {
                var typeName = elements[i].getAttribute('name');
                nodeTypesMap[typeName] = new NodeType();
                content += '<li><div class="tree_element">';
                var elementProperties = elements[i].getElementsByTagName("Property");
                var properties = {};
                for (var j = 0; j < elementProperties.length; j++) {
                    var propertyName = elementProperties[j].getAttribute('name');
                    var propertyType = elementProperties[j].getAttribute('type');
                    if (propertyType === "dropdown") {
                        this.addDropdownList(typeName, propertyName, elementProperties[j].getElementsByTagName("Variants")[0].getElementsByTagName("variant"));
                    }
                    var propertyValue;
                    var valueElement = elementProperties[j].getElementsByTagName("value")[0];
                    if (valueElement.childNodes[0]) {
                        propertyValue = valueElement.childNodes[0].nodeValue;
                    }
                    else {
                        propertyValue = '';
                    }
                    var property = new Property(propertyValue, propertyType);
                    properties[propertyName] = property;
                }
                var image = elements[i].getElementsByTagName("Image")[0].getAttribute('src');
                nodeTypesMap[typeName].image = image;
                nodeTypesMap[typeName].properties = properties;
                content += '<img class="elementImg" src="' + image + '" width="30" height="30"' + '/>';
                content += typeName;
                content += '</div></li>';
            }
            content += '</ul></li>';
        }
        $('#navigation').append($compile(content)($scope));
        return nodeTypesMap;
    };
    return XmlManager;
})();
var DefaultDiagramNode = (function () {
    function DefaultDiagramNode(name, type, x, y, properties, image) {
        this.name = name;
        this.text = 'Default';
        this.type = type;
        this.element = new joint.shapes.devs.ImageWithPorts({
            position: { x: x, y: y },
            size: { width: 50, height: 50 },
            outPorts: [''],
            attrs: {
                image: {
                    'xlink:href': image
                }
            }
        });
        this.properties = properties;
        this.image = image;
    }
    DefaultDiagramNode.prototype.setText = function (text) {
        this.text = text;
    };
    DefaultDiagramNode.prototype.getName = function () {
        return this.name;
    };
    DefaultDiagramNode.prototype.getType = function () {
        return this.type;
    };
    DefaultDiagramNode.prototype.getX = function () {
        return (this.element.get("position"))['x'];
    };
    DefaultDiagramNode.prototype.getY = function () {
        return (this.element.get("position"))['y'];
    };
    DefaultDiagramNode.prototype.getImagePath = function () {
        return this.image;
    };
    DefaultDiagramNode.prototype.getElement = function () {
        return this.element;
    };
    DefaultDiagramNode.prototype.setProperty = function (name, property) {
        this.properties[name] = property;
    };
    DefaultDiagramNode.prototype.getProperties = function () {
        return this.properties;
    };
    return DefaultDiagramNode;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DiagramPaper = (function (_super) {
    __extends(DiagramPaper, _super);
    function DiagramPaper(graph) {
        this.gridSizeValue = 25;
        _super.call(this, {
            el: $('#paper'),
            width: $('#paper').width(),
            height: $('#paper').height(),
            model: graph,
            gridSize: this.gridSizeValue,
            defaultLink: new joint.dia.Link({
                attrs: {
                    '.connection': { stroke: 'black' },
                    '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
                }
            }),
            validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                return (!(magnetT && magnetT.getAttribute('type') === 'output') && !(cellViewT && cellViewT.model.get('type') === 'link'));
            },
            validateMagnet: function (cellView, magnet) {
                return magnet.getAttribute('magnet') !== 'passive';
            }
        });
    }
    DiagramPaper.prototype.getGridSizeValue = function () {
        return this.gridSizeValue;
    };
    return DiagramPaper;
})(joint.dia.Paper);
var ModelImp = (function () {
    function ModelImp() {
    }
    ModelImp.prototype.getWorldModel = function () {
        return null;
    };
    ModelImp.prototype.getTimeline = function () {
        return null;
    };
    ModelImp.prototype.getRobotMode = function () {
        return null;
    };
    ModelImp.prototype.getSetting = function () {
        return null;
    };
    return ModelImp;
})();
var NodeType = (function () {
    function NodeType() {
    }
    return NodeType;
})();
var Property = (function () {
    function Property(value, type) {
        this.value = value;
        this.type = type;
    }
    return Property;
})();
//# sourceMappingURL=out.js.map