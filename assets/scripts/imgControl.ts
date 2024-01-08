// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start() {
    }

    onLoad(): void {
        this.node.active = false;
    }

    onClickBtn(Event: Event, customEventData: string) {
        if (customEventData == "start") {
            cc.director.loadScene("class3")
            cc.director.resume()
        }
        if (customEventData == "end") {
            cc.game.end()
        }
    }

    // update (dt) {}
}
