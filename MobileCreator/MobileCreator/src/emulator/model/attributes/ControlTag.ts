export class ControlTag {

    // Id
    private id: string;
    get Id() { return this.id }
    set Id(value: string) { this.id = value }

    // layout width & height
    public static WrapContent: number = -2;
    public static MatchParrent: number = -1;
    private width: number = ControlTag.WrapContent;
    private height: number = ControlTag.WrapContent;
    get Width() { return this.width }
    get Height() { return this.height }
    set Width(value: number) { this.width = value }
    set Height(value: number) { this.height = value }

    // background
    private background: string = "#ffffff";
    get Background() { return this.background }
    set Background(value: string) { this.background = value }

    private marginLeft: number;
    private marginTop: number;
    private marginRight: number;
    private marginBottom: number;
    //get MarginLeft() { return this.marginLeft }

    constructor() {
    }
}