/**
 构造函数
 Touchscroll

 封装的作用
 触摸滑动

 调用实例
 <div id="container">
 <div class="wrapper"></div>
 </div>

 new Touchscroll('#container', '.wrapper');
 */

function Touchscroll(container, content, option) {
    var bg = option && option.bg ? option.bg : 'rgba(0, 0, 0, 0.8)';
    var scrollBarWidth = option && option.width ? option.width : 5;
    //回调函数 定义并传给tweenAnimation函数，为了能在惯性移动后图片也能自己加载
    var moveCallback = option && option.move ? option.move : null;
    var app = document.querySelector(container);
    var content = app.querySelector(content);
    //动态创建滚动条 将创建滚动条放在init外面，放在回调函数调用init()重复创建 或者用isFirst标识
    var scrollBar = document.createElement('div');
    //绑定触摸开始事件
    app.addEventListener('touchstart', function(e) {
        // content.style.transition = 'none';
        this.y = e.touches[0].clientY;
        this.t = transformCSS(content, 'translateY');
        this.timeStart = Date.now();
        // console.log(content.timer);
        if (content.timer && content.timer.translateY) { //顺序不能变，container.timer为underfied，等于false,就不会执行第二项，第二项会报错
            //上面这样写防止第一次执行报错，(不过不影响效果，因为点第二次才让屏幕即时停止)，
            //因为第一次点还没执行到tweenAnimatin.js，不存在container.timer/translateY，点第二次有
            clearInterval(content.timer.translateY);
        };
        if (scrollBar.timer && scrollBar.timer.translateY) {
            clearInterval(scrollBar.timer.translateY);
        };
    });

    app.addEventListener('touchmove', function(e) {
        this._y = e.touches[0].clientY;
        this.translateY = this._y - this.y + this.t;
        //设置
        transformCSS(content, 'translateY', this.translateY);
        //滚动条移动逻辑
        var scrollY = -(this.translateY / content.offsetHeight * app.offsetHeight);
        transformCSS(scrollBar, 'translateY', scrollY);
        //触发回调函数
        if (option.move) {
            option.move();
        }
    });

    app.addEventListener('touchend', function(e) {
            //添加过渡
            // content.style.transition = 'all 0.3s';
            this._y = e.changedTouches[0].clientY;
            this.timeEnd = Date.now();
            var currentTranslateY = transformCSS(content, 'translateY');
            //惯性移动
            var disY = this._y - this.y;
            var disT = this.timeEnd - this.timeStart;
            var v = disY / disT;
            var s = v * 120;
            var translateY = currentTranslateY + s;
            //声明动画效果类型
            var type = 'easeOut';
            //越界判断
            if (translateY > 0) {
                translateY = 0;
                type = 'backEaseOut';
            }
            var minTranslateY = app.offsetHeight - content.offsetHeight;
            if (translateY < minTranslateY) {
                translateY = minTranslateY;
                type = 'backEaseOut';
            }
            // transformCSS(content, 'translateY', translateY);
            //不用transform来实现惯性滑动，是因为不能做到即点即停的效果
            //该方法只需清除定时器就可以做到即点即停
            tweenAnimation(content, 'translateY', currentTranslateY, translateY, 500, 10, type, moveCallback);
            //滚动条应该到的距离
            var scrollY = -(translateY / content.offsetHeight * app.offsetHeight);
            var scrollCurrentTranslateY = transformCSS(scrollBar, 'translateY');
            tweenAnimation(scrollBar, 'translateY', scrollCurrentTranslateY, scrollY, 500, 10, type);
            //方法二（未实现）：只开屏幕的定时器，让滚动条跟着屏幕滑动，而不是分别开两个定时器
            // tweenAnimation(content, 'translateY', currentTranslateY, translateY, 500, 10, type, function() {
            //     //不断修改滚动条的位置
            //     //...                    
            // });
            //触发回调函数
            if (option.end) {
                option.end();
            }
        })
        //初始化
    app.init = function() {
        app.style.position = 'relative';
        scrollBar.className = 'scroll-bar';
        app.appendChild(scrollBar);
        //给滚动条添加基础样式
        /**
         * position: absolute;
            right: 0;
            top: 0;
            width: 6px;
            border-radius: 3px;
            height: 100px;
            background: rgba(0, 0, 0, 0.8);
         */
        scrollBar.style.position = 'absolute';
        scrollBar.style.right = 0;
        scrollBar.style.top = 0;
        scrollBar.style.width = scrollBarWidth + 'px';
        scrollBar.style.borderRadius = scrollBarWidth / 2 + 'px';
        scrollBar.style.backgroundColor = bg;
        //设置滚动条的长度
        var h = app.offsetHeight * app.offsetHeight / content.offsetHeight;
        // console.log(app.offsetHeight, content.offsetHeight);
        scrollBar.style.height = h + 'px';
        // console.log(scrollBar.style.height);
    }
    app.init();
    //向外的暴露的方式处理把init()赋给app，也可以付给this
    this.app = app;
    //或修改app.init=..为 this.init..;
}