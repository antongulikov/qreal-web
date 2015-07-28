class ClearBlock extends Block {
    static run(node, graph, nodesMap, linksMap, env, timeline): string {

        var output : string = "Smile\n"
        var models = timeline.getRobotModels();
        var model = models[0];
        model.clearScreen();

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
