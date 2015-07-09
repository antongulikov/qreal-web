class TimelineImpl implements Timeline {
    private timeInterval: number = 10;
    private fps: number = 60;
    private defaultFrameLength: number = 1000 / this.fps;

    private slowSpeedFactor: number = 2;
    private normalSpeedFactor: number = 5;
    private fastSpeedFactor: number = 10;
    private immediateSpeedFactor: number = 100000000;

    private defaultRealTimeInterval: number = 0;
    private ticksPerCycle: number = 3;
    private speedFactor: number = 1;
    private cyclesCount: number;
    private frameLength: number = this.defaultFrameLength;

    private intervalId: number;
    private isActive : boolean;

    private robotModels: RobotModel[] = [];

    constructor() {

        this.setActive(false);
    }

    setActive(value : boolean) : void{
        this.isActive = value;
    }

       start(): void {
        if (this.isActive)
            return;
        this.setActive(true);

        var timeline = this;
        this.cyclesCount = 0;
        this.intervalId = setInterval(function() { timeline.onTimer(timeline); }, this.defaultFrameLength);
    }

    stop(): void {

        this.setActive(false);

        clearInterval(this.intervalId);
    }

    onTimer(timeline: Timeline): void {
        if (!this.isActive)
            return;
        timeline.getRobotModels().forEach(function(model) {
            model.recalculateParams();
        });
        this.cyclesCount++;

        if (this.cyclesCount >= this.speedFactor) {

            timeline.getRobotModels().forEach(function(model) {
                model.nextFragment();
            });
            this.cyclesCount = 0;
        }
    }

    setSpeedFactor(factor: number): void {
        this.speedFactor = factor;
    }

    getSpeedFactor(): number {
        return this.speedFactor;
    }

    getRobotModels(): RobotModel[] {
        return this.robotModels;
    }

    addRobotModel(robotModel: RobotModel): void {
        this.robotModels.push(robotModel);
    }
}