function setRem() {
    // 基准大小
    const baseSize = 64;
    const baseScale = baseSize / 1920; // 1920的设计图
    let widthScale = window.innerWidth; // 当前窗口的宽度
    const heightScale = window.innerHeight; // 当前窗口的高度
    // 尺寸换算
    const comparedHeight = (widthScale * 1080) / 1920;
    if (heightScale < comparedHeight) {
        widthScale = (heightScale * 1920) / 1080;
    }
    // 计算实际的rem值,得到该宽度下的相应font-size值,并赋予给html的font-size,
    const rem = widthScale * baseScale;
    document.documentElement.style.fontSize = rem + 'px';
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = () => {
    setRem();
};