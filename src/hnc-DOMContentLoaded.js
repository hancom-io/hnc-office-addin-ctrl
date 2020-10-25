// Copyright (c) Hancom. All rights reserved. 
// Licensed under the MIT License. See License.txt in the project root for license information. 

// html에서 hnc 계열 컨트롤들을 초기화 하고, 이벤트핸들러 장착
document.addEventListener('DOMContentLoaded', function() {
    // expander 추가
    hncAddSubmenuButtonExpander();
    hncAddSubmenuItemExpander();

    // 버튼 클릭시 하위 메뉴 확장
    let buttons = document.querySelectorAll('.hnc-submenu-button');
    for (let button of buttons) {
        button.addEventListener('click', onClick_HncSubmenuButton);
    }

    // submenuitem을 클릭하면 하위 메뉴가 열린 상태로 있어야 함. 닫히면 안됨.
    // 일반 menuitem을 클릭하면 body, html 까지 전파되어 결국 닫힘
    let items = document.querySelectorAll('.hnc-submenu-item');
    for (let item of items) {
        item.addEventListener('click', onClick_HncSubmenuItem);
        item.addEventListener('mouseover', onHover_HncSubmenuItem);
    }
    // 빈 영역을 클릭하면 모든 submenu를 닫는다.
    document.addEventListener('click', onClick_HncDocument);

});