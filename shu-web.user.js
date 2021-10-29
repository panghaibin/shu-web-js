// ==UserScript==
// @name         上海大学网站增强
// @namespace    https://github.com/panghaibin/shu-web-js
// @version      1.0
// @description  1.将上海大学选课系统学分完成情况页面的原始成绩换算成绩点，标红压线分数 2.标红选课排名页面排名超过额定人数的课程
// @author       panghaibin
// @match        *://xk.autoisp.shu.edu.cn/CourseSelectionStudent/PlanQuery
// @match        *://xk.autoisp.shu.edu.cn/StudentQuery/QueryEnrollRank
// @grant        none
// @license      MIT
// @supportURL   https://github.com/panghaibin/shu-web-js/issues
// ==/UserScript==

(function() {
    'use strict';
    if (location.pathname === '/CourseSelectionStudent/PlanQuery') {
        score_conversion(document)
    } else if (location.pathname === '/StudentQuery/QueryEnrollRank') {
        red_rank(document)
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
                for (let j = 0; j < row.children.length; ++j){
                    elements[i].children[j].style.color = 'red';
                    elements[i].children[j].style.fontWeight = 'bold';
                }
            }
        }
    }

})();
