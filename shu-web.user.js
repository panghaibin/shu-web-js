// ==UserScript==
// @name         上海大学网站增强 - 刷课助手
// @namespace    https://github.com/panghaibin/shu-web-js
// @version      2.0
// @description  1.二三轮选课自助刷课，解放双手【人人有课刷，抵制卖课狗】 2.选课系统学分完成情况页面的原始成绩换算成绩点，标红压线分数 2.选课排名页面标红排名超过额定人数的课程
// @author       panghaibin
// @match        *://xk.autoisp.shu.edu.cn/CourseSelectionStudent/PlanQuery
// @match        *://xk.autoisp.shu.edu.cn/StudentQuery/QueryEnrollRank
// @match        *://xk.autoisp.shu.edu.cn/CourseSelectionStudent/FuzzyQuery
// @grant        none
// @license      MIT
// @supportURL   https://github.com/panghaibin/shu-web-js/issues
// ==/UserScript==

(function () {
    'use strict';

    //--------刷课配置--------
    // 任意参数留空将不执行
    // 输入课程号
    let course_id = ''
    // 输入对应的教师号
    let teacher_id = ''
    // 刷课间隔，默认 8000 ，单位毫秒 一般不需要修改
    let delay_time = 8000

    if (location.pathname === '/CourseSelectionStudent/PlanQuery') {
        score_conversion(document);
    } else if (location.pathname === '/StudentQuery/QueryEnrollRank') {
        red_rank(document);
    } else if (location.pathname === '/CourseSelectionStudent/FuzzyQuery'
        && course_id.length === 8 && teacher_id.length === 4) {
        select_course_helper(document);
    }

    function score_conversion(document) {
        let tdscore, tdscorecpass, tdscorecnotpass, elements;
        tdscore = document.getElementsByName('tdscore');
        tdscorecpass = document.getElementsByName('tdscorecpass');
        tdscorecnotpass = document.getElementsByName('tdscorecnotpass');
        elements = [tdscorecnotpass, tdscore, tdscorecpass]
        for (let i = 0; i < elements.length; ++i) {
            let element = elements[i];
            for (let j = 0; j < element.length; ++j) {
                let item = element[j];
                //console.log(item);
                let score_num = item.innerText * 1;
                let score_raw = item.innerText;
                if (score_raw.length > 0) {
                    if (score_num >= 90 && score_num <= 100 || score_raw === "A") {
                        item.innerText = score_raw + ' / 4.0';
                    } else if (score_num >= 85 && score_num <= 89.9 || score_raw === "A-") {
                        item.innerText = score_raw + ' / 3.7';
                    } else if (score_num >= 82 && score_num <= 84.9 || score_raw === "B+") {
                        item.innerText = score_raw + ' / 3.3';
                    } else if (score_num >= 78 && score_num <= 81.9 || score_raw === "B") {
                        item.innerText = score_raw + ' / 3.0';
                    } else if (score_num >= 75 && score_num <= 77.9 || score_raw === "B-") {
                        item.innerText = score_raw + ' / 2.7';
                    } else if (score_num >= 72 && score_num <= 74.9 || score_raw === "C+") {
                        item.innerText = score_raw + ' / 2.3';
                    } else if (score_num >= 68 && score_num <= 71.9 || score_raw === "C") {
                        item.innerText = score_raw + ' / 2.0';
                    } else if (score_num >= 66 && score_num <= 67.9 || score_raw === "C-") {
                        item.innerText = score_raw + ' / 1.7';
                    } else if (score_num >= 64 && score_num <= 65.9 || score_raw === "D") {
                        item.innerText = score_raw + ' / 1.5';
                    } else if (score_num >= 60 && score_num <= 63.9 || score_raw === "D-") {
                        item.innerText = score_raw + ' / 1.0';
                    } else if ((score_num >= 0 && score_num <= 59.9 || score_raw === "F")) {
                        item.innerText = score_raw + ' / 0.0';
                    } else if (score_raw === "P" || score_raw === "L") {
                        item.innerText = score_raw + ' / 不计';
                    }
                    // 标红压线绩点
                    if (score_num === 89 || score_num === 84 || score_num === 81 || score_num === 77 || score_num === 74 ||
                        score_num === 71 || score_num === 67 || score_num === 65 || score_num === 63 || score_num === 59) {
                        item.style.color = 'red';
                    }
                }
            }
        }
    }

    function red_rank(document) {
        let elements;
        elements = document.getElementsByName('rowclass');
        for (let i = 0; i < elements.length; ++i) {
            let row = elements[i];
            let room = row.children[4].innerText * 1;
            let _rank = row.children[6].innerText.split('-');
            let rank = _rank[_rank.length - 1] * 1;
            if (rank > room) {
                for (let j = 0; j < row.children.length; ++j) {
                    elements[i].children[j].style.color = 'red';
                    elements[i].children[j].style.fontWeight = 'bold';
                }
            }
        }
    }

    function select_course_helper(document) {
        document.getElementsByName('CID')[0].defaultValue = course_id;
        document.getElementsByName('TeachNo')[0].defaultValue = teacher_id;
        let i = 0;
        let select_id = setInterval(function () {
            document.getElementById('QueryAction').click();
            setTimeout(function () {
                let tbllist = document.getElementsByClassName('tbllist');
                let room = tbllist[0].children[0].children[1].children[8].innerText * 1;
                let num = tbllist[0].children[0].children[1].children[9].innerText * 1;
                console.log('第' + ++i + '次 课程号' + course_id + ' 教师号' + teacher_id + ' 容量' + room + ' 人数' + num);
                if (room > num) {
                    tbllist[0].children[0].children[1].children[0].children[0].checked = true;
                    document.getElementById('CourseCheckAction').click();
                    let across_campus = document.getElementById('NotCollegeAction');
                    if (across_campus != null) {
                        setTimeout(function () {
                                across_campus.click();
                        }, 1000);
                    }
                    tbllist = document.getElementsByClassName('tbllist');
                    let callback_msg = tbllist[1].children[0].children[1].children[5].innerText
                    if (callback_msg.includes('成功')) {
                        clearInterval(select_id);
                    } else {
                        // 关闭选课失败的窗口
                        CloseDialog('divOperationResult');
                    }
                    console.log(callback_msg);
                }
            }, 1000);
        }, delay_time);
    }
})();
