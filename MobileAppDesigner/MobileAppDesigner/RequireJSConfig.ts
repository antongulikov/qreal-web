/// <reference path="src/modules/require.d.ts" />

import Main = require('src/designer/AppMain');

require([], function () {
    //alert("config");
    Main.Main();
});