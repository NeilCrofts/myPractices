(function(w) {
    function gesture(el, callback) {
        el.addEventListener('touchstart', function(e) {
            if (e.touches.length >= 2) {
                callback.start(e);
                //修改状态变量的值
                this.hasGestureStartTriggered = true;
                //缩放  计算两个触点的直线距离
                this.initDis = getTouchesDis(e.touches[0], e.touches[1]);
                //旋转 计算两个触点的夹角
                this.initDeg = getTouchesDeg(e.touches[0], e.touches[1]);
            }
        })
        el.addEventListener('touchmove', function(e) {
            if (e.touches.length >= 2) {
                //计算两个触点的直线距离
                this.moveDis = getTouchesDis(e.touches[0], e.touches[1]);
                //计算缩放比例
                e.scale = this.moveDis / this.initDis;
                this.moveDeg = getTouchesDeg(e.touches[0], e.touches[1]);
                //计算角度差
                let deg = this.moveDeg - this.initDeg;
                e.rotation = deg;
                callback.change(e);
            }
        })
        el.addEventListener('touchend', function(e) {
            if (e.touches.length < 2 && this.hasGestureStartTriggered) {
                callback.end(e);
                this.hasGestureStartTriggered = false;
            }
        });
    }

    //计算两个触点的间距
    function getTouchesDis(t1, t2) { //t1:touches[0]
        //两个触点水平和垂直距离
        let disX = t1.clientX - t2.clientX;
        let disY = t1.clientY - t2.clientY;
        return Math.sqrt(disX * disX + disY * disY);
    }

    //计算两个触点的夹角
    function getTouchesDeg(t1, t2) {
        //旋转  计算两个触点形成的夹角 计算tanX
        let disX = t1.clientX - t2.clientX;
        let disY = t1.clientY - t2.clientY;
        //单位为弧度
        let rad = Math.atan2(disY, disX);
        //弧度转为角度  2πR = 周长    1弧度 = 180 / π deg
        return rad * 180 / Math.PI;
    }

    w.gesture = gesture;
}(window));