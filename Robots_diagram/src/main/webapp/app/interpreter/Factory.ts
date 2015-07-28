class Factory {
    static run(node, graph, nodesMap, linksMap, env, timeline): string {
        var output = "";
        switch (node.type) {
            case "Initial Node":
                output += InitialBlock.run(node, graph, nodesMap, linksMap, env, timeline);
                break;

            case "Final Node":
                output += FinalBlock.run(node, graph, timeline);
                break;

            case "Condition":
                output += IfBlock.run(node, graph, nodesMap, linksMap, env, timeline);
                break;

            case "Function":
                output += FunctionBlock.run(node, graph, nodesMap, linksMap, env, timeline);
                break;

            case "Motors Forward":
                output += Motors.run(node, graph, nodesMap, linksMap, true, env, timeline);
                break;

            case "Motors Backward":
                output += Motors.run(node, graph, nodesMap, linksMap, false, env, timeline);
                break;

            case "Stop Motors":
                output += MotorsStop.run(node, graph, nodesMap, linksMap, env, timeline);
                break;

            case "Timer":
                output += Timer.run(node, graph, nodesMap, linksMap, env, timeline);
                break;

            case "Switch":
                output += SwitchBlock.run(node, graph, nodesMap, linksMap, env, timeline);
                break;

            case "Marker Up":
                output += MarkerBlock.run(node, graph, nodesMap, linksMap, env, timeline, false);
                break;

            case "Marker Down":
                output += MarkerBlock.run(node, graph, nodesMap, linksMap, env, timeline, true);
                break;

            case "Smile":
                output += SmileBlock.run(node, graph, nodesMap, linksMap, env, timeline);
                break;

            case "Draw Pixel":
                output += PixelBlock.run(node, graph, nodesMap, linksMap, env, timeline);
                break;

            case "Clear Screen":
                output += ClearBlock.run(node, graph, nodesMap, linksMap, env, timeline);
                break;

            case "Sad Smile":
                output += SadSmileBlock.run(node, graph, nodesMap, linksMap, env, timeline);
                break;

            case "Draw Line":
                output += LineDrawBlock.run(node, graph, nodesMap, linksMap, env, timeline);
                break;

            
            default:
                output += "Not yet";
        }
        return output;
    }
}