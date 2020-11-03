// Copyright (c) Hancom. All rights reserved. 
// Licensed under the MIT License. See License.txt in the project root for license information. 

// spin들의 updown 버튼 추가
function hncAddSpinUpDownButton() {
    let spins = document.querySelectorAll('.hnc-spin');

    // 하위 depth 부터 넣어야 모두 보임. 0부터 삽입하면 하위 depth 의 expander가 안보임
    for (let i = spins.length; 0 < i ; i--) {

        // 상위 Container를 만들고, input, up, down 추가
        let spinContainer = '<div class="hnc-control hnc-spin-container">';
        spinContainer += spins[i - 1].outerHTML;
        spinContainer += '<div class="hnc-spin-arrow-container">';
        spinContainer += '<div class="hnc-control hnc-spin-up"><svg width="7" height="4"><g><path class="hnc-spin-path" d="M0,4 L3.5,0 L7,4z"/></g></svg></div>';
        spinContainer += '<div class="hnc-control hnc-spin-down"><svg width="7" height="4"><g><path class="hnc-spin-path" d="M0,0 L7,0 L3.5,4z"/></g></svg></div>';
        spinContainer += '</div>';
        spinContainer += '</div>';

        spins[i - 1].outerHTML =  spinContainer;
    }
}

