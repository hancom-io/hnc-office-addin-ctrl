// Copyright (c) Hancom. All rights reserved. 
// Licensed under the MIT License. See License.txt in the project root for license information. 

// 키보드 이벤트 및 expander 추가
function hncInitSubmenu() {
    hncInitSubmenuButton();
    hncAddSubmenuItemExpander();
}

// 키보드 이벤트와 submenu-button들의 아래쪽 Expander 추가
function hncInitSubmenuButton() {
    let buttons = document.querySelectorAll('.hnc-submenu-button');

    // 하위 depth 부터 넣어야 모두 보임. 0부터 삽입하면 하위 depth 의 expander가 안보임
    for (let i = buttons.length; 0 < i ; i--) {
        buttons[i - 1].innerHTML += '<div class="hnc-expander-down"><svg width="7" height="4"><g><path class="hnc-expander-path" d="M0,0 L7,0 L3.5,4z"/></g></svg></div>';
    }

    hncInitSubmenuButtonKeyboardEvent(buttons);
}
// submenuButton 에서의 키보드 이벤트 
function hncInitSubmenuButtonKeyboardEvent(buttons) {
    if (buttons == null) {
        return;
    }
    Array.prototype.forEach.call(buttons, function(button, i)  {

        // 각 submenu 이벤트 초기화
        let submenu = button.querySelector('.hnc-submenu');
        hncInitSubmenuKeyboardEvent(submenu);

        // button Keydown
        button.addEventListener('keydown', function(e) {
            switch (e.key) {
                case 'ArrowDown': // 메뉴를 연다.
                {
                    hncShowSubmenu(submenu);
                    e.preventDefault(); // 이벤트 전파를 중단하여 스크롤이 되지 않게 함
                    break;
                }
            }
        });
    });
}

// submenu에서의 키보드 이벤트
function hncInitSubmenuKeyboardEvent(submenu) {
    if (submenu == undefined) {
        return;
    }

    let menuItemCount = hncGetMenuItemCount(submenu);

    // submenu Keydown
    submenu.addEventListener('keydown', function(e) {
        switch (e.key) { 
            case 'ArrowUp': // 메뉴를 닫는다.
            case 'Escape': // 메뉴를 닫는다.
            { 
                if (hncIsVisibleSubmenu(submenu) == true) { // 열려진 상태에서 1회만 처리하고 이벤트 중단. 따라서 계속 up 키를 누르면 스크롤 될 것임
                    hncHideSubmenu(submenu);
                    e.preventDefault(); // 이벤트 전파를 중단
                }
                break;
            }
            case 'Tab': // shift+tab도 동일
            { 
                if (hncIsVisibleSubmenu(submenu) == true) { // e.preventDefault(); 를 호출하지 않고 이벤트 전파하여 tab이동시킴
                    hncHideSubmenu(submenu);
                }
                break;
            }         
        }  
    });

    // // 메뉴 하위의 li에 이벤트 핸들러 장착 
    // let lis = submenu.querySelectorAll('li');
    // Array.prototype.forEach.call(lis, function(li, i) {
    //     if (hncIsSubmenuItem(li) == true) { // submenuItem이면 하위 submenu에도 이벤트 등록


    //     }
    //     // 일반 menuItem
    //     else {
    //         li.addEventListener('keydown', function(e) {
    //             // 현재 hover 표시된 위치를 구함
    //             // 전체 갯수를 구함
    //             // 내부에서 rotate
                
    //             switch (e.key) {

    //             }
    //             alert("test");
    //         });

    //     }
    // });
}

function hncGetMenuItemCount(submenu) {
    if (submenu == null) {
        return 0;
    }
    return submenu.childElementCount;
}

function hncIsSubmenuItem(li) {
    if (li == undefined) {
        return false;
    }   
    if (li.className.includes('hnc-submenu-item') == true) {
        return true;
    }
    return false;
}

// submenu-item들의 오른쪽 Expander 추가. absolute로 배치됨
function hncAddSubmenuItemExpander() {
    let items = document.querySelectorAll('.hnc-submenu-item');

    // 하위 depth 부터 넣어야 모두 보임. 0부터 삽입하면 하위 depth 의 expander가 안보임. <div>를 앞쪽에 붙임. 뒤에 붙이면, 하위 depth에서 세로 위치가 깨지는 현상 발생
    for (let i = items.length; 0 < i ; i--) {
        items[i - 1].innerHTML = '<div class="hnc-expander-right"><svg width="4" height="7"><g><path class="hnc-expander-path" d="M0,0 L0,7 L4,3.5z"/></g></svg></div>' + items[i - 1].innerHTML;
    }
}

// 버튼 클릭시 하위 메뉴 토글
function onClick_HncSubmenuButton(e) {
    // this : 이벤트를 발생시킨 버튼
    let submenu = this.querySelector('.hnc-submenu');
    if (submenu == undefined) {
        return;
    }
    hncToggleSubmenu(submenu);

    // 이벤트 전파를 중단하여, $("body, html").click 이벤트에서 닫히지 않게 한다.
    e.stopPropagation();
}
// submenu를 토글한다.
function hncToggleSubmenu(submenu) {
    if (submenu == undefined) {
        return;
    }
    
    if (hncIsVisibleSubmenu(submenu) == true) { // 화면에서 보인다면 감춤 */
        hncHideSubmenu(submenu);
    }
    else {
        hncShowSubmenu(submenu);
    }  
}
function hncIsVisibleSubmenu(submenu) {
    if (submenu == undefined) {
        return false;
    }
    let opacity = submenu.style.opacity;
    if (opacity == 1) {
        return true;
    }
    return false;
}
// show시 키보드 포커스 획득
function hncShowSubmenu(submenu) {
    if (submenu == undefined) {
        return;
    }
    hncCloseAllSubmenu(); // 모든 서브메뉴를 닫고

    submenu.style.opacity = 1; // 내것만 연다.
    submenu.style["pointer-events"] = 'auto'; 
    submenu.tabIndex = 0; // 키보드 이벤트를 받을 수 있게 함
    submenu.focus(); 
}
// hide시 키보드 포커스 반환
function hncHideSubmenu(submenu) {
    if (submenu == undefined) {
        return;
    }
    submenu.style.opacity = 0;
    submenu.style["pointer-events"] = 'none';   
    submenu.tabIndex = -1; // 키보드 이벤트를 받을 수 없게 함
    submenu.parentElement.focus();
}

// 하위 메뉴 클릭시 이벤트 전파 중단하여 닫히지 않게 함
function onClick_HncSubmenuItem(e) {
    e.stopPropagation();
}
// mouseover되는 경우 상위 항목의 위치로 부터 left, top 좌표를 계산한다.
function onHover_HncSubmenuItem(e) {
    let submenu = this.querySelector('.hnc-submenu');
    if (submenu == undefined) {
        return;
    }

    let parentRect = this.getBoundingClientRect(); // window.scrollX, window.scrollY 계산 포함해야 함
    let submenuRect = submenu.getBoundingClientRect();
    let parentRight = parentRect.right;
    let parentTop = parentRect.top;

    // window 보다 menu가 더 큰경우 세로좌표 보정
    if (window.innerHeight < parentRect.top + (submenuRect.bottom - submenuRect.top)) {
        parentTop = window.innerHeight - (submenuRect.bottom - submenuRect.top);
    }

    submenu.style.left = String(parentRight) + 'px' ;
    submenu.style.top = String(parentTop) + 'px';

    // hover시 보이는 것은 css에서 해도 되나 focus 처리를 위해 javascript 사용
    //!! hncShowSubmenu(submenu); 자신의 parent라면 닫으면 안된다.
    submenu.style.opacity = 1; // 내것만 연다.
    submenu.style["pointer-events"] = 'auto'; 
    submenu.tabIndex = 0; // 키보드 이벤트를 받을 수 있게 함
    submenu.focus(); 

}
// body, html 클릭시 모든 submenu 닫음
function onClick_HncDocument(object, e) {
    hncCloseAllSubmenu();
}
function hncCloseAllSubmenu() {
    let others = document.querySelectorAll('.hnc-submenu');

    for (let other of others) {
        if (hncIsVisibleSubmenu(other) == true) {
            other.style.opacity = 0;
            other.style["pointer-events"] = 'none';
            other.tabIndex = -1; // 키보드 이벤트를 받을 수 없게 함
            other.parentElement.focus();
        }
    }
}
