class LineDrawBlock extends Block {
    static run(node, graph, nodesMap, linksMap, env, timeline): string {

        var output : string = "Draw Line\n"
        var models = timeline.getRobotModels();

        var properties = node.getProperties();

        var x1 = 0;
        var y1 = 0;
        var x2 = 0;
        var y2 = 0;

        for (var property  in properties) {
            if (property === "x1") {
                x1 = parseFloat(properties[property].value);
            }
            if (property === "y1") {
                y1 = parseFloat(properties[property].value);
            }
            if (property === "x2") {
                x2 = parseFloat(properties[property].value);
            }
            if (property === "y2") {
                y2 = parseFloat(properties[property].value);
            }
        }

        var models = timeline.getRobotModels();
        var model = models[0];

        model.drawLine(x1, y1, x2, y2);


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
