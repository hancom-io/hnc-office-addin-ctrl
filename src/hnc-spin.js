// Copyright (c) Hancom. All rights reserved. 
// Licensed under the MIT License. See License.txt in the project root for license information. 

// spin-container로 감싸고, spin들의 updown 버튼 추가
function hncSpin_Init() {
    let spins = document.querySelectorAll('.hnc-spin');
    if (spins == undefined) {
        return;
    }
   
    // 하위 depth 부터 넣어야 모두 보임. 0부터 삽입하면 하위 depth 의 expander가 안보임
    for (let i = spins.length; 0 < i ; i--) {

        // 상위 Container를 만들고, input, up, down 추가
        let spinContainer = '<div class="hnc-spin-container">';
        spinContainer += spins[i - 1].outerHTML;
        spinContainer += '<div class="hnc-spin-arrow-container">';
        spinContainer += '<div class="hnc-control hnc-spin-up"><svg width="7" height="4"><g><path class="hnc-spin-path" d="M0,4 L3.5,0 L7,4z"/></g></svg></div>';
        spinContainer += '<div class="hnc-control hnc-spin-down"><svg width="7" height="4"><g><path class="hnc-spin-path" d="M0,0 L7,0 L3.5,4z"/></g></svg></div>';
        spinContainer += '</div>';
        spinContainer += '</div>';

        spins[i - 1].outerHTML =  spinContainer;
    }

    // spin의 up/down
    let spinUps = document.querySelectorAll('.hnc-spin-up');
    for (let up of spinUps) {
        up.addEventListener('click', hncSpinUp_OnClick);
    }

    let spinDowns = document.querySelectorAll('.hnc-spin-down');
    for (let down of spinDowns) {
        down.addEventListener('click', hncSpinDown_OnClick);
    } 
}

// 버튼 클릭시 spin 값 수정
function hncSpinUp_OnClick(e) {
    // this : 이벤트를 발생시킨 버튼
    let spinContainer = this.parentElement.parentElement;
    if (spinContainer == undefined) {
        alert('spinContainer 가 없음');
        return;
    }

    let spin = spinContainer.children[0];
    if (spin == undefined) {
        alert('spin이 없음');
        return;
    }
    
    let step = spin.step;
    if (step == '') {
        step = 1;
    }
    let value = spin.value;
    if (value == '') {
        value = 0;
    }  

    // step 만큼 값 증가
    value = parseFloat(value) + parseFloat(step);

    if (spin.max != '') {
        if (parseFloat(spin.max) < value) {
            value = spin.max;
        }
    }
    spin.value = value;

    // 이벤트 전파를 중단
    e.stopPropagation();
}
function hncSpinDown_OnClick(e) {
    // this : 이벤트를 발생시킨 버튼
    let spinContainer = this.parentElement.parentElement;
    if (spinContainer == undefined) {
        alert('spinContainer 가 없음');
        return;
    }

    let spin = spinContainer.children[0];
    if (spin == undefined) {
        alert('spin이 없음');
        return;
    }
    
    let step = spin.step;
    if (step == '') {
        step = 1;
    }
    let value = spin.value;
    if (value == '') {
        value = 0;
    }   
    
    // step 만큼 값 만큼 감소
    value = parseFloat(value) - parseFloat(step);

    if (spin.min != '') {
        if (value < parseFloat(spin.min)) {
            value = spin.min;
        }
    }
    spin.value = value;

    // 이벤트 전파를 중단
    e.stopPropagation();

}