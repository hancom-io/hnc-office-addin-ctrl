// Copyright (c) Hancom. All rights reserved. 
// Licensed under the MIT License. See License.txt in the project root for license information. 


// select 된 Tab을 표시
function hncInitTab() {
    let tabs = document.querySelectorAll('.hnc-tab');

    for (let i = 0; i < tabs.length ; ++i) {
        hncUpdateTab(tabs[i]);
    }
}

function onChange_HncTabRadio(e) {
    // this : 이벤트를 발생시킨 radio.

    if (this.parentElement == null) { // parentElement : 태그만 찾음
        return;
    }
    if (this.parentElement.tagName != 'LI') {
        alert('hnc-tab-radio는 li 하위에 작성해야 함');
        return;
    }
    if (this.parentElement.parentElement.tagName != 'UL') {
        alert('ul > li 로 작성해야 함');
        return;
    }
    if (this.parentElement.parentElement.parentElement.className.includes('hnc-tab') == false) {
        alert('hnc-tab 하위에 hnc-tab-radio를 작성해야 함');
        return;
    }
   
       
    hncUpdateTab(this.parentElement.parentElement.parentElement);
}

// tab에 선택된 body를 표시한다.
function hncUpdateTab(tab) {
    if (tab == null) {
        return;
    }
    for (let tabHeaders of tab.children) {
        if (tabHeaders.className.includes(' hnc-tab-headers') == true) {
            for (let i = 0; i < tabHeaders.childElementCount; ++i) {
                if (hncIsActiveTab(tabHeaders.children[i]) == true) {
                    hncSelectTabBody(tab, i);
                    break;
                }
            }
            break;
        }  
    }
}
// 주어진 li가 선택된 tab이면 true
function hncIsActiveTab(li) {
    if (li == null) {
        return false;
    }
    for (let radio of li.children) {
        if (radio.className.includes('hnc-tab-radio') == true) {
           if (radio.checked == true) {
               return true;
           } 
        }
    }
    return false;
}

// tabBody의 index를 선택하여 표시하고 나머지는 hide 함. -1이면 모두 hide
function hncSelectTabBody(tab, index) {
    if (tab == null) {
        return;
    }

    for (let tabBodies of tab.children) {
        if (tabBodies.className.includes('hnc-tab-bodies') == true) {
            // 모두 숨김
            for (let tabBody of tabBodies.children) {
                tabBody.style.display = 'none';
            }
            // 주어진 index만 표시
            if (index != -1) {
                tabBodies.children[index].style.display = 'block';
            }
            
            return;
        }
    }
}