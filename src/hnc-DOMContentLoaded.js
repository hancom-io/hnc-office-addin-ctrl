// Copyright (c) Hancom. All rights reserved. 
// Licensed under the MIT License. See License.txt in the project root for license information. 

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

    // 빈 영역을 클릭하면 모든 submenu를 닫는다.
    document.addEventListener('click', hncDocument_OnClick);
});