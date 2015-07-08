class RobotItemImpl implements RobotItem {
    private worldModel: WorldModel;
    private robot: RobotModel;
    private startPosition: TwoDPosition;
    private startCenter: TwoDPosition = new TwoDPosition();
    private center: TwoDPosition = new TwoDPosition();
    private image;
    private rotateHandle: RaphaelElement;
    private width: number = 50;
    private height: number = 50;
    private angle: number;
    private lastDx: number;
    private lastDy: number;

    private sensors: {string?: SensorItem} = {};

    constructor(worldModel: WorldModel, position: TwoDPosition, imageFileName: string, robot: RobotModel) {
        this.worldModel = worldModel;
        this.robot = robot;
        var paper = worldModel.getPaper();
        this.image = paper.image(imageFileName, 0, 0, this.width, this.height);

        this.center.x = position.x;
        this.center.y = position.y;
        this.startPosition = new TwoDPosition();
        this.startPosition.x = position.x - this.width / 2;
        this.startPosition.y = position.y - this.height / 2;

        this.startCenter.x = this.center.x;
        this.startCenter.y = this.center.y;
        this.angle = 0;

        var handleRadius: number = 10;

        var handleAttrs = {
            fill: "#fff",
            "fill-opacity": 0,
            cursor: "pointer",
            "stroke-width": 1,
            stroke: "black"
        };

        this.rotateHandle = paper.circle(0, 0, handleRadius).attr(handleAttrs);
        this.rotateHandle.attr({cx: this.center.x + this.width / 2 + 20, cy: this.center.y});

        var robotItem = this;

        var startHandle = function () {
                if (!worldModel.getDrawMode()) {
                    this.transformation = robotItem.image.transform();
                    robotItem.updateSensorsTransformations();

                    this.rotation = robotItem.image.matrix.split().rotate;
                    this.cx = this.attr("cx");
                    this.cy = this.attr("cy");
                }
                return this;
            },
            moveHandle = function (dx, dy) {
                if (!worldModel.getDrawMode()) {
                    var newX = this.cx + dx;
                    var newY = this.cy + dy;
                    var offsetX = newX - robotItem.center.x;
                    var offsetY = newY - robotItem.center.y;
                    var tan = offsetY / offsetX;
                    robotItem.angle = Math.atan(tan);

                    if (offsetX < 0) {
                        robotItem.angle += Math.PI;
                    }
                    var angle = robotItem.angle / (Math.PI / 180);

                    robotItem.robot.setAngle(robotItem.angle);

                    angle -= this.rotation;
                    robotItem.image.transform(this.transformation + "R" + angle + "," +
                        robotItem.center.x + "," + robotItem.center.y);

                    robotItem.transformSensorsItems("R" + angle + "," + robotItem.center.x + "," + robotItem.center.y);

                    var newCx = (robotItem.width / 2 + 20) * Math.cos(robotItem.angle) + robotItem.center.x;
                    var newCy = (robotItem.width / 2 + 20) * Math.sin(robotItem.angle) + robotItem.center.y;
                    this.attr({cx: newCx, cy: newCy});
                }
                return this;
            },
            upHandle = function () {
                if (!worldModel.getDrawMode()) {
                    robotItem.updateSensorsTransformations();
                }
                return this;
            };

        robotItem.rotateHandle.drag(moveHandle, startHandle, upHandle);

        var start = function () {
                robotItem.lastDx = 0;
                robotItem.lastDy = 0;
                if (!worldModel.getDrawMode()) {
                    this.transformation = this.transform();
                    robotItem.updateSensorsTransformations();

                    this.handle_cx = robotItem.rotateHandle.attr("cx");
                    this.handle_cy = robotItem.rotateHandle.attr("cy");
                    worldModel.setCurrentElement(robotItem);
                }
                return this;
            }
            ,move = function (dx, dy) {
                if (!worldModel.getDrawMode()) {
                    this.transform(this.transformation + "T" + dx + "," + dy);

                    robotItem.transformSensorsItems("T" + dx + "," + dy);
                    //console.log("dx " + dx + " dy " + dy);

                    robotItem.lastDx = dx;
                    robotItem.lastDy = dy;

                    robotItem.rotateHandle.attr({"cx": this.handle_cx + dx, "cy": this.handle_cy + dy});
                }
                return this;
            }
            ,up = function () {
                if (!worldModel.getDrawMode()) {
                    //robotItem.center.x = this.matrix.x(robotItem.startCenter.x, robotItem.startCenter.y);
                    //robotItem.center.y = this.matrix.y(robotItem.startCenter.x, robotItem.startCenter.y);
                    robotItem.updateSensorsTransformations();
                    robotItem.center.x += robotItem.lastDx;
                    robotItem.center.y += robotItem.lastDy;
                    robotItem.robot.setPosition(robotItem.center);

                }
                return this;
            }
        this.image.drag(move, start, up);
        this.hideHandles();

        this.redraw();
    }

    setStartPosition(position: TwoDPosition, direction: number): void {
        this.startPosition = position;
        this.image.attr({x: position.x, y: position.y});
        this.center.x = position.x + this.width / 2
        this.center.y = position.y + this.height / 2;
        this.startCenter.x = this.center.x
        this.startCenter.y = this.center.y;
        this.image.transform("R" + direction + "," + this.center.x + "," + this.center.y);
        this.rotateHandle.attr({"cx": + position.x + this.width + 20, "cy": position.y + this.height / 2 });
    }

    redraw(): void {
        var newCx = (this.width / 2 + 20) * Math.cos(this.angle) + this.center.x;
        var newCy = (this.width / 2 + 20) * Math.sin(this.angle) + this.center.y;
        this.rotateHandle.attr({cx: newCx, cy: newCy});

        var x = this.center.x - this.width / 2;
        var y = this.center.y - this.height / 2;
        var angle = this.angle * 180 / Math.PI;
    //    console.log("x: " + this.center.x + " y: " + this.center.y);
        this.image.transform("t" + x + "," + y + "r" + angle);

        for (var portName in this.sensors) {
            var sensor = this.sensors[portName];
            sensor.redraw();
        }
    }

    recalculateParamsInSensors(speed1 : number, speed2 : number) : void {
        for (var portName in this.sensors){
            var sensor = this.sensors[portName];
            sensor.recalculateParams(speed1 , speed2);
            this.sensors[portName] = sensor;
        }
    }

    updateRobotLocation(position: TwoDPosition, angle): void {
        this.center.x = position.x;
        this.center.y = position.y;
        this.angle = angle;
    }

    hideHandles(): void {
        this.rotateHandle.hide();
    }

    showHandles(): void {
        this.rotateHandle.toFront();
        this.rotateHandle.show();
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getStartPosition(): TwoDPosition {
        return this.startPosition;
    }

    removeSensorItem(portName: string): void {
        var sensor = this.sensors[portName];
        if (sensor) {
            sensor.remove();
            delete this.sensors[portName];
        }
    }

    addSensorItem(portName: string, sensorType: DeviceInfo, pathToImage: string): void {
        var sensor: SensorItem;
        if (sensorType.isA(RangeSensor)) {
            sensor = new SonarSensorItem(this, this.worldModel, sensorType, pathToImage);
        } else {
            sensor = new SensorItem(this, this.worldModel, sensorType, pathToImage);
        }
        sensor.transform(this.image.transform());
        sensor.updateTransformationString();
        this.sensors[portName] = sensor;
    }

    private updateSensorsTransformations(): void {
        for(var portName in this.sensors) {
            var sensor = this.sensors[portName];
            sensor.updateTransformationString();
        }
    }

    private transformSensorsItems(transformationString: string): void {
        for(var portName in this.sensors) {
            var sensor = this.sensors[portName];
            sensor.transform(transformationString);
        }
    }
}