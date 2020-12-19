/**
 *
 * 函数名
 *  Touchview
 *
 * 使用示例
    new Touchview('#el');

    new Touchview('img');

    new Touchview('div');

    依赖
    gesture.js


 */

function Touchview(selector) {
    const el = document.querySelector(selector);
    gesture(el, {
        start: function(e) {
            //获取初始缩放后的大小
            this.initSacle = transformCSS(el, 'scale');
            this.initRotation = transformCSS(el, 'rotate');
        },
        change: function(e) {
            //元素缩放
            transformCSS(el, 'scale', e.scale * this.initSacle);
            //元素旋转
            transformCSS(el, 'rotate', this.initRotation + e.rotation)
        },
        end: function(e) {

        },
    })
}