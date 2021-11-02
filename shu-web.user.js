// ==UserScript==
// @name         上海大学网站增强 - 刷课助手
// @namespace    https://github.com/panghaibin/shu-web-js
// @version      2.6
// @description  1.二三轮选课自助刷课，解放双手【人人有课刷，抵制卖课狗】 2.教学评估页面一键赋值 3.选课系统学分完成情况页面的原始成绩换算成绩点，标红压线分数 4.选课排名页面标红排名超过额定人数的课程 5.自动选择选课学期 6.移除教务管理主页企业微X广告
// @author       panghaibin
// @match        *://xk.autoisp.shu.edu.cn/*
// @match        *://cj.shu.edu.cn/*
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

    //--------教学评估配置--------
    // 一键赋值等级 1: 非常清楚  2: 比较清楚  3: 一般  4: 不清楚   默认 1
    let level = 1

    if (location.host === 'xk.autoisp.shu.edu.cn') {
        if (location.pathname === '/CourseSelectionStudent/PlanQuery') {
            score_conversion();
        } else if (location.pathname === '/StudentQuery/QueryEnrollRank') {
            red_rank();
        } else if (location.pathname === '/CourseSelectionStudent/FuzzyQuery'
            && course_id.length === 8 && teacher_id.length === 4 && delay_time > 0) {
            select_course_helper();
        } else if (location.pathname === '/Home/TermIndex' && location.search !== '?auto_select=0') {
            auto_select_term();
        } else if (location.pathname !== '/Home/TermIndex') {
            manual_select_term();
        }
    } else if (location.host === 'cj.shu.edu.cn') {
        if (location.pathname === '/StudentPortal/Evaluate') {
            evaluate_helper();
        } else if (location.pathname === '/Home/StudentIndex' && level > 0 && level < 5) {
            remove_ad();
        }
    }

    function score_conversion() {
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

    function red_rank() {
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

    function select_course_helper() {
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

    function evaluate_helper() {
        let tbllist = document.getElementsByClassName('tbllist');
        let course_count = tbllist[0].children[0].childElementCount - 2;
        let row = tbllist[0].children[0].children;
        let evaluate_btn = document.createElement('input');
        evaluate_btn.type = 'button';
        evaluate_btn.value = '一键赋值';
        evaluate_btn.onclick = function () {
            for (let i = 0; i < course_count; ++i) {
                for (let j = 0; j < 4; ++j) {
                    let evaluate_name = 'classlist[' + i + '].ItemValue[' + j + ']';
                    let select = document.getElementsByName(evaluate_name);
                    select[0].children[level].selected = true;
                }
            }
        }
        let last_row = row[row.length - 1].children[0].children[0];
        let save_btn = last_row.children[0];
        last_row.insertBefore(evaluate_btn, save_btn);
    }

    function remove_ad() {
        document.getElementsByClassName('div_master_content')[0].remove();
    }

    function auto_select_term() {
        let term_list = document.getElementsByName('rowterm');
        document.getElementById('termId').value = term_list[term_list.length - 1].getAttribute('value');
        document.getElementsByTagName('button')[0].click();
    }

    function manual_select_term() {
        let menu = document.querySelector('.term-menu');
        if (menu !== null) {
            let a_tag = menu.getElementsByTagName('a')[0];
            a_tag.href = a_tag.href + '?auto_select=0';
        }
    }
})();
