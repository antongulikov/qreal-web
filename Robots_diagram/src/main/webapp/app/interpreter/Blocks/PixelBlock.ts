class PixelBlock extends Block {
    static run(node, graph, nodesMap, linksMap, env, timeline): string {

        var output : string = "Pixel\n"
        var models = timeline.getRobotModels();

        var properties = node.getProperties();

        var pixelX = 0;
        var pixelY = 0;

        for (var property  in properties) {
            if (property === "X") {
                pixelX = parseFloat(properties[property].value);
            }
            if (property === "Y") {
                pixelY = parseFloat(properties[property].value);
            }
        }

        var models = timeline.getRobotModels();
        var model = models[0];

        model.drawPixel(pixelX, pixelY);


        var nodeId = InterpretManager.getIdByNode(node, nodesMap);
        var links = InterpretManager.getOutboundLinks(graph, nodeId);

        if (links.length == 1) {
            var link = links[0];
            var nextNode = nodesMap[link.get('target').id];
            output += Factory.run(nextNode, graph, nodesMap, linksMap, env, timeline);
        }

        return output;
    }
}
