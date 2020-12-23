function gesture(el, callback) {
    el.addEventListener('touchstart', function(e) {
        if (e.touches.length >= 2) {
            callback.start(e);
            //修改状态变量的值
            this.hasGestureStartTriggered = true;
        }
    })
    el.addEventListener('touchmove', function(e) {
        if (e.touches.length >= 2) {
            callback.change(e);
        }
    })
    el.addEventListener('touchend', function(e) {
        if (e.touches.length < 2 && this.hasGestureStartTriggered) {
            callback.end(e);
            this.hasGestureStartTriggered = false;
        }
    })
}