// Copyright (c) Hancom. All rights reserved. 
// Licensed under the MIT License. See License.txt in the project root for license information. 

var hncKeys = {
    esc: 27,
    space: 32,
    left: 37,
    up: 38,
    right: 39,
    down: 40
};
// html에서 hnc 계열 컨트롤들을 초기화 하고, 이벤트핸들러 장착
document.addEventListener('DOMContentLoaded', function() {
    
    //submenuButton에 expander 추가, 키보드 이벤트 장착
    hncSubmenuButton_Init();

    // spin-container로 감싸고 spin의 upDown 추가
    hncSpin_Init();

    // slider-container로 감싸고 배경색 update
    hncSlider_Init();

    // select 된 tab-body 표시
    hncTab_Init();

    // 버튼 클릭시 하위 메뉴 확장
    let buttons = document.querySelectorAll('.hnc-submenu-button');
    for (let button of buttons) {
        button.addEventListener('click', hncSubmenuButton_OnClick);
    }

    // 빈 영역을 클릭하면 모든 submenu를 닫는다.
    document.addEventListener('click', hncDocument_OnClick);

    // spin의 up/down
    let spinUps = document.querySelectorAll('.hnc-spin-up');
    for (let up of spinUps) {
        up.addEventListener('click', hncSpinUp_OnClick);
    }

    let spinDowns = document.querySelectorAll('.hnc-spin-down');
    for (let down of spinDowns) {
        down.addEventListener('click', hncSpinDown_OnClick);
    }

    // slider
    let sliders = document.querySelectorAll('.hnc-slider');
    for (let slider of sliders) {
        slider.addEventListener('input', hncSlider_OnInput);
    }

    // tab-radio
    let tabRadios = document.querySelectorAll('.hnc-tab-radio');
    for (let tabRadio of tabRadios) {
        tabRadio.addEventListener("change", hncTabRadio_OnChange);
    }

});