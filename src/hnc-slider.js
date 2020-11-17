// Copyright (c) Hancom. All rights reserved. 
// Licensed under the MIT License. See License.txt in the project root for license information. 

// 초기 배경색을 설정하고, slider-container로 감쌈
function hncSlider_Init() {
    let sliders = document.querySelectorAll('.hnc-slider');
    if (sliders == undefined) {
        return;
    }

    // 하위 depth 부터 넣어야 모두 보임. 0부터 삽입하면 하위 depth 의 expander가 안보임
    for (let i = sliders.length; 0 < i ; i--) {

        // 초기 상태의 값으로 Track배경 설정
        hncSlider_UpdateTrackBackground(sliders[i - 1]);

        //상위 Container를 만들고, input 추가
        let sliderContainer = '<div class="hnc-slider-container">';
        sliderContainer += sliders[i - 1].outerHTML;
      
        sliderContainer += '</div>';

        sliders[i - 1].outerHTML =  sliderContainer;
    }

    // container로 감싼 후 다시 이벤트 핸들러 장착
    sliders = document.querySelectorAll('.hnc-slider');
    for (let slider of sliders) {
        slider.addEventListener('input', hncSlider_OnInput);
    } 
}
// slider 값 설정시 배경색 변경
function hncSlider_OnInput(e) {
   // this : 이벤트를 발생시킨 range
   hncSlider_UpdateTrackBackground(this);
}

// slider value에 따라 배경색 설정
function hncSlider_UpdateTrackBackground(slider) {
    if (slider == undefined) {
        return;
    }
    let min = slider.min;
    if (min == '') {
        min = 0;
    }
    let max = slider.max;
    if (max == '') {
        max = 100;
    }
    let val = slider.value;
    if (val == '') {
        val = 0;
    }
    val = (val) / (max - min) * 100; // 퍼센트 단위로 변경
    
    let foreColor = window.getComputedStyle(slider, null).color;
    let backColor = window.getComputedStyle(slider, null).borderColor;

    slider.style.background = `linear-gradient(to right, ${foreColor} 0%, ${foreColor} ${val}%, ${backColor} ${val}%, ${backColor} 100%)`;

}