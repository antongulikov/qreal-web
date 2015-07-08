class InitialBlock extends Block {
    static run(node, graph, nodesMap, linksMap, env, timeline): string {
        var output = "Initial" + "\n";
        var nodeId = InterpretManager.getIdByNode(node, nodesMap);
        var links = InterpretManager.getOutboundLinks(graph, nodeId);

        if (links.length == 1) {
            var nextNode = nodesMap[links[0].get('target').id];
            var robotModels = timeline.getRobotModels();
            var robotModel = robotModels[0];
            robotModel.setMotor1(0);
            robotModel.setMotor2(0);
            output += Factory.run(nextNode, graph, nodesMap, linksMap, env, timeline) + "\n";
        }
        else if (links.length > 1) {
            output += "Error: too many links\n"
        }

        return output;
    }
}
