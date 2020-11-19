// Copyright (c) Hancom. All rights reserved. 
// Licensed under the MIT License. See License.txt in the project root for license information. 


// select 된 Tab을 표시
function hncTab_Init() {
    let tabs = document.querySelectorAll('.hnc-tab');
    if (tabs == undefined) {
        return;
    }

    let tabHeaders = document.querySelectorAll('.hnc-tab-header');
    if (tabHeaders == undefined) {
        return;
    }   
    //상위 Container를 만듬
    for (let i = tabHeaders.length; 0 < i ; i--) {

        //상위 Container를 만들고, input 추가
        let tabHeaderContainer = '<div class="hnc-control hnc-tab-header-container">';
        tabHeaderContainer += tabHeaders[i - 1].outerHTML;
        tabHeaderContainer += '</div>';

        tabHeaders[i - 1].outerHTML =  tabHeaderContainer;
    }


    for (let i = 0; i < tabs.length ; ++i) {
        hncTab_Update(tabs[i]);
    }
    // tab-radio
    let tabRadios = document.querySelectorAll('.hnc-tab-radio');
    for (let tabRadio of tabRadios) {
        tabRadio.addEventListener("change", hncTabRadio_OnChange);
    }
}

function hncTabRadio_OnChange(e) {
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
   
       
    hncTab_Update(this.parentElement.parentElement.parentElement);
}

// tab에 선택된 body를 표시한다.
function hncTab_Update(tab) {
    if (tab == null) {
        return;
    }
    for (let tabHeaders of tab.children) {
        if (tabHeaders.className.includes(' hnc-tab-headers') == true) {
            for (let i = 0; i < tabHeaders.childElementCount; ++i) {
                if (hncTab_IsActive(tabHeaders.children[i]) == true) {
                    hncTab_SelectBody(tab, i);
                    break;
                }
            }
            break;
        }  
    }
}
// 주어진 li가 선택된 tab이면 true
function hncTab_IsActive(li) {
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
function hncTab_SelectBody(tab, index) {
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