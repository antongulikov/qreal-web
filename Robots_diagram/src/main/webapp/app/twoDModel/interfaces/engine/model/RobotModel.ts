interface RobotModel {
    info(): TwoDRobotModel;
    recalculateParams(): void;
    nextFragment(): void;
    removeSensorItem(portName: string): void;
    addSensorItem(portName: string, deviceType: DeviceInfo): void;
    getSensorsConfiguration(): SensorsConfiguration;
    setAngle(angle: number): void;
    getAngle(): number;
    setPosition(position: TwoDPosition): void;
    setDrawingState(newState : boolean): void;
    drawSmile() : void;
    drawSadSmile() : void;
    drawPixel(x : number, y : number) : void;
    clearScreen() : void;
    drawLine(x1 : number, y1 : number, x2 : number, y2 : number) : void;
}