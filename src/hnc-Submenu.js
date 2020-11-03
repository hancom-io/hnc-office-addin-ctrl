// Copyright (c) Hancom. All rights reserved. 
// Licensed under the MIT License. See License.txt in the project root for license information. 

// submenu-button들의 아래쪽 Expander 추가
function hncAddSubmenuButtonExpander() {
    let buttons = document.querySelectorAll('.hnc-submenu-button');

    // 하위 depth 부터 넣어야 모두 보임. 0부터 삽입하면 하위 depth 의 expander가 안보임
    for (let i = buttons.length; 0 < i ; i--) {
        buttons[i - 1].innerHTML += '<div class="hnc-expander-down"><svg width="7" height="4"><g><path class="hnc-expander-path" d="M0,0 L7,0 L3.5,4z"/></g></svg></div>';
    }
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
    let opacity = submenu.style.opacity;
    if (opacity == 1) {
        submenu.style.opacity = 0;
        submenu.style["pointer-events"] = 'none';
        // submenu.stype.pointer-events = none;
    }
    else {
        hncCloseAllSubmenu(); // 모든 서브메뉴를 닫고

        submenu.style.opacity = 1; // 내것만 연다.
        submenu.style["pointer-events"] = 'auto';
    }

    // 이벤트 전파를 중단하여, $("body, html").click 이벤트에서 닫히지 않게 한다.
    e.stopPropagation();
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
}
// body, html 클릭시 모든 submenu 닫음
function onClick_HncDocument(object, e) {
    hncCloseAllSubmenu();
}
function hncCloseAllSubmenu() {
    let others = document.querySelectorAll('.hnc-submenu');

    for (let other of others) {
        other.style.opacity = 0;
        other.style["pointer-events"] = 'none';
    }
}