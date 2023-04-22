# 上海大学网站增强优化脚本 - 刷课助手

项目主页： https://github.com/panghaibin/shu-web-js

## 功能
### 选课系统
1. 第二、三轮选课自助刷课，解放双手。**【人人有课刷，抵制卖课狗】 【支持多门课程同时刷】**
2. 选课学期自动选择
3. 选课排名页面标红排名超过额定人数的课程
4. 学分完成情况页面，原始成绩换算绩点，增加点击课程号查看课程介绍，选课学期可标红
5. 所有存在显示课程号的页面，支持点击课程号查看课程介绍，右键直接复制课程号

### 教务管理
1. 教学评估页面可一键赋值，支持全部赋值和单行赋值
2. 成绩查询页面在成绩未发布时自动刷新
3. 移除主页企业微X广告

## 安装
在浏览器安装脚本管理器（Tampermonkey等）后，

Greasy Fork 主页: [点击跳转](https://greasyfork.org/zh-CN/scripts/434613-%E4%B8%8A%E6%B5%B7%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA)

GitHub 源：[点击安装](https://github.com/panghaibin/shu-web-js/raw/master/shu-web.user.js)

jsDelivr 源：[点击安装](https://cdn.jsdelivr.net/gh/panghaibin/shu-web-js@master/shu-web.user.js)

## 使用
### 刷课功能简介
此刷课程序仅对“人数已满”的课程有效。

安装脚本后，修改源代码，填入课程号和教师号，可复制粘贴多行，填充多个
```javascript
//--------刷课配置 开始--------
// 是否开启刷课 (true: 开启 false: 关闭)
let START_SELECT = false;

// 课程设置，可设置多个
let COURSE_SETTING = [
    // 格式： ['课程号', '教师号'],
    // 以下两个为示例 记得修改或删除，也可增加更多
    ['0085X078', '1091'],
    ['0085X078', '1331'],
];

// 刷课间隔，默认 8000 ，单位毫秒 一般不需要修改
let SELECT_DELAY = 8000
//--------刷课配置 结束--------
```
然后在浏览器中打开选课系统的“模糊查询”页，脚本会自动查询并判断选课人数是否小于容量人数，小于则执行选课，否则继续查询。

按下F12，打开浏览器的“控制台(Console)”可以查看脚本的运行状态。

运行成功截图

![](https://github.com/panghaibin/shu-web-js/raw/master/img/success.jpg)

## 致谢
本项目的部分功能受到以下项目的启发
- [alfredcai/Rhea-Shanghai-University](https://github.com/alfredcai/Rhea-Shanghai-University/blob/master/scripts/evaluate.js)
- [ZKLlab/SHU-scheduling-helper](https://github.com/ZKLlab/SHU-scheduling-helper/commit/edd939f341dbc6e75200adc2cc403ea815b43907)

## License
[MIT licensed](./LICENSE)
