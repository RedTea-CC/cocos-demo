// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    audioState: boolean = false
    gameOverImg: cc.Node = null

    bgMusic: cc.AudioSource = null // 背景音乐
    @property(cc.Slider)         // 声音滑动组件
    audioSlider: cc.Slider = null
    @property(cc.AudioClip)         // 音效
    gameOverMusic: cc.AudioClip = null
    @property(cc.AudioClip)         // 敌机音效1
    soundEffect1: cc.AudioClip = null
    @property(cc.AudioClip)         // 敌机音效2
    soundEffect2: cc.AudioClip = null

    start() {
        // bgm
        this.bgMusic = this.getComponent(cc.AudioSource)
        this.gameOverImg = cc.find("Canvas/gameImg");
    }

    // 音效按钮
    audioCLick(Event: Event, customEventData: string) {
        // console.log('@', customEventData)
        if (customEventData == 'stop') {
            this.audioState = false
            this.bgMusic.pause()
        } else {
            this.audioState = true
            this.bgMusic.play()
        }
    }

    gameOver() {
        cc.audioEngine.playEffect(this.gameOverMusic, false);// 机毁音效
        this.gameOverImg.active = true; // 显示游戏结束图片
        // cc.director.pause();    // 游戏暂停
        this.bgMusic.pause()    // 背景音乐暂停
    }

    destroySound(type: string) {
        let soundEffect = type == "enemy1" ? this.soundEffect1 : this.soundEffect2
        cc.audioEngine.playEffect(soundEffect, false);
    }

    updateVolume() {
        this.bgMusic.volume = this.audioSlider.progress
    }
}
