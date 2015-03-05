<%@ include file="include.jsp" %>
<html>
<head>
    <title>2d Model</title>
    <jsp:include page="scripts.jsp" flush="true"/>
    <link rel="stylesheet" href="<c:url value='/resources/bootstrap/css/bootstrap.min.css' />" />
    <link rel="stylesheet" href="<c:url value='/resources/css/2dmodel.css' />" />
<body ng-app="diagram" ng-controller="TwoDModelController">
<div id="container" >
    <div id="left-menu">
        <div class="tabbable">
            <ul class="nav nav-tabs">
                <li class="active"><a href="#lA" data-toggle="tab">Tools</a></li>
                <li><a href="#lB" data-toggle="tab">Ports</a></li>
                <li><a href="#lC" data-toggle="tab">Model settings</a></li>
            </ul>
            <div id="palette">
                <div class="tab-content">
                    <div class="tab-pane active" id="lA">
                        <table>
                            <tr>
                                <td>
                                    <button class="palette_button">
                                        <img src="images/2dmodel/2d_ruler.png"
                                             style="width: 20px; height: 20px; vertical-align: middle"/>
                                    </button>
                                </td>
                                <td>
                                    <button class="palette_button_right">
                                        <img src="images/2dmodel/2d_wall.png"
                                             style="width: 20px; height: 20px; vertical-align: middle"/>
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <button class="palette_button">
                                        <img src="images/2dmodel/2d_pencil.png"
                                             style="width: 20px; height: 20px; vertical-align: middle"/>
                                    </button>
                                </td>
                                <td>
                                    <button class="palette_button_right">
                                        <img src="images/2dmodel/2d_ellipse.png"
                                             style="width: 20px; height: 20px; vertical-align: middle"/>
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <button class="palette_button">
                                        <img src="images/2dmodel/2d_clear.png"
                                             style="width: 20px; height: 20px; vertical-align: middle"/>
                                    </button>
                                </td>
                                <td>
                                    <button class="palette_button_right">
                                        <img src="images/2dmodel/2d_none.png"
                                             style="width: 13px; height: 20px; vertical-align: middle"/>
                                    </button>
                                </td>
                            </tr>
                        </table>

                        <p style="margin-top: 10px;">Pen</p>

                        <div id="pen_settings">
                            <p><b>Width</b></p>
                            <p><input type="number" class="spinner" value="6"></p>
                            <p><b>Color</b></p>
                            <p>
                                <select class="mydropdown">
                                    <option selected="selected" value="black">black</option>
                                    <option value="blue">blue</option>
                                    <option value="green">green</option>
                                    <option value="yellow">yellow</option>
                                    <option value="red">red</option>
                                </select>
                            </p>
                        </div>
                    </div>
                    <div class="tab-pane" id="lB">
                        <p>Ports</p>
                    </div>
                    <div class="tab-pane" id="lC">
                        <p>Model settings</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="controll_buttons_container">
            <table>
                <tr>
                    <td>
                        <button style="width: 100px; height: 45px;">
                            <img src="images/2dmodel/2d_save.png"
                                 style="width: 25px; height: 25px; vertical-align: middle"/>
                        </button>
                    </td>
                    <td>
                        <button style="width: 100px; height: 45px;">
                            <img src="images/2dmodel/2d_open.png"
                                 style="width: 25px; height: 25px; vertical-align: middle"/>
                        </button>
                    </td>
                </tr>

                <tr>
                    <td colspan="2">
                        <button style="width: 204px; height: 70px;">
                            <img src="images/2dmodel/2d_run.png"
                                 style="width: 40px; height: 40px; vertical-align: middle"/>
                        </button>
                    </td>
                </tr>

                <tr>
                    <td colspan="2">
                        <div class="btn-group" data-toggle="buttons">

                            <label class="btn btn-default active" style="width: 104px; height: 30px;">
                                <input type="radio" name="selection_modes" id="hand_mode" autocomplete="off" checked>
                                <img src="images/2dmodel/2d_hand.png"
                                     style="width: 20px; height: 20px; vertical-align: middle"/>
                            </label>


                            <label class="btn btn-default" style="width: 104px; height: 30px;">
                                <input type="radio" name="selection_modes" id="multiselection_mode" autocomplete="off">
                                <img src="images/2dmodel/2d_multiselection.png"
                                     style="width: 20px; height: 20px; vertical-align: middle"/>
                            </label>

                        </div>
                    </td>
                </tr>

                <tr>
                    <td>
                        <button class="btn btn-default" data-toggle="button" aria-pressed="false" style="width: 100px; height: 30px;">
                            <img src="images/2dmodel/2d_target.png"
                                 style="width: 20px; height: 20px; vertical-align: middle"/>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-default" style="width: 100px; height: 30px;">
                            <img src="images/2dmodel/2d_robot_back.png"
                                 style="width: 20px; height: 20px; vertical-align: middle"/>
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <div id="stage">
    </div>

    <div id="right-menu">
    </div>
</div>
</body>
</html>
