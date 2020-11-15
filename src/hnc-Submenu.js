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

// -----------------------
// hncSubmenuButton
// -----------------------
// 키보드 이벤트 및 expander 추가
function hncSubmenuButton_Init() {

    let buttons = document.querySelectorAll('.hnc-submenu-button');
    if (buttons == undefined) {
        return;
    }

    // 하위 depth 부터 넣어야 모두 보임. 0부터 삽입하면 하위 depth 의 expander가 안보임
    for (let i = buttons.length; 0 < i ; i--) {
        buttons[i - 1].innerHTML += '<div class="hnc-expander-down"><svg width="7" height="4"><g><path class="hnc-expander-path" d="M0,0 L7,0 L3.5,4z"/></g></svg></div>';
    }

    // 각 버튼에 이벤트 핸들러 장착
    Array.prototype.forEach.call(buttons, function(button, i)  {
        button.addEventListener('keydown', hncSubmenuButton_OnKeyDown);
    });

    hncMenuItem_AddExpander();
}


// 버튼 클릭시 하위 메뉴 토글
function hncSubmenuButton_OnClick(e) {
    // this : 이벤트를 발생시킨 버튼
    let submenu = hncSubmenu_FindFromParent(this);
    if (submenu == null) {
        alert('hnc-submenu-button 하위에 hnc-submenu 가 정의되지 않음');
        return;
    }
    hncSubmenu_Toggle(submenu);

    // 이벤트 전파를 중단하여, $("body, html").click 이벤트에서 닫히지 않게 한다.
    e.stopPropagation();
}
function hncSubmenuButton_OnKeyDown(e) {
    switch (e.key) {
        case 'ArrowDown': // 메뉴를 연다.
            let submenu = hncSubmenu_FindFromParent(this);
            if (submenu == null) {
                alert('hnc-submenu-button 하위에 hnc-submenu 가 정의되지 않음');
                return;
            }
            hncSubmenu_Show(submenu);
            e.preventDefault(); // 이벤트 전파를 중단하여 스크롤이 되지 않게 함
            break;
    }
} 

// -----------------------
// hncSubmenu
// mouseenter하여 하일라이트 표시하는 menuItem은 focus 된 개체임.
// hover로 처리하게 되면 키보드 이동에 따라 하일라이트 된 개체 찾을 수가 없어, mouseenter/mouseleave시 menuItem에 focus를 줌
// 이에 따라 Show/Hide시 menuItem에 이벤트를 연결/해제함
// 
// hnc-submenu-opened class를 Show/Hide시 동적으로 부여하고 css 에서 skin 설정함
// -----------------------
function hncSubmenu_OnKeyDown(e) {
    if (hncSubmenu_IsOpen(this) == false) {
        return;
    }
    let currentIndex = 0;
    switch (e.key) { 
        case 'ArrowUp': 
            currentIndex = hncSubmenu_GetCurrentIndex(this);
            if (hncSubmenu_IsSubmenuButton(hncSubmenu_GetParent(this)) && currentIndex == -1) { // submenubutton의 submenu인데, 아직 menuItem 선택을 한번도 안했다면 닫는다.
                hncSubmenu_Hide(this);
            }
            else {
                hncSubmenu_GotoIndex(this, currentIndex - 1, false);
            }
            e.preventDefault();
            e.stopPropagation();
            break;
        case 'ArrowDown': 
            currentIndex = hncSubmenu_GetCurrentIndex(this);
            hncSubmenu_GotoIndex(this, currentIndex + 1, true);
            e.preventDefault();
            e.stopPropagation();
            break;
        case 'Escape': // 메뉴를 닫는다.
            hncSubmenu_Hide(this);
            e.preventDefault(); // 이벤트 전파를 중단. 따라서 1회 닫기작업하고, 그다음엔 이벤트가 전파되어 계속 up 키를 누르면 스크롤 될 것임
            e.stopPropagation();
            break;
        case 'Tab': // shift+tab도 동일
            hncSubmenu_Hide(this); // e.preventDefault(); 를 호출하지 않고 이벤트 전파하여 tab이동시킴
            break;
        case ' ':
            currentIndex = hncSubmenu_GetCurrentIndex(this);
            hncSubmenu_GetAt(this, currentIndex).click();
            e.preventDefault(); // 이벤트 전파를 중단.
            e.stopPropagation();
            break;
    }  
}
// body, html 클릭시 모든 submenu 닫음
function hncDocument_OnClick(object, e) {
    hncSubmenu_CloseAll(null);
}

// 현재 focus가 있어 선택된 항목. 0 base. 만약 없다면 -1
function hncSubmenu_GetCurrentIndex(submenu) {
    if (submenu == null) {
        return -1;
    }

    // 포커싱된 인덱스를 구한다.
    if (document.hasFocus() && document.activeElement != undefined && document.activeElement != null) {
        for (let i = 0; i < hncSubmenu_GetCount(submenu); ++i) {
            if (hncSubmenu_GetAt(submenu, i) == document.activeElement) {
                return i;
            }
        }
    }
    return -1;
}

// down방향인지 up 방향인지 에 따라 주어진 index가 separator면 이를 회피 
function hncSubmenu_GotoIndex(submenu, index, down) {
    if (submenu == null) {
        return;
    }
    let menuItemCount = hncSubmenu_GetCount(submenu);
    if (menuItemCount == 0) {
        return;
    }
  
    // rotation 되도록 값 보정
    if (index < 0) {
        index = menuItemCount - 1;
    }
    if (menuItemCount <= index) {
        index = 0;
    }

    // 주어진 index가 separator인지 확인하여 separator가 아닌 곳으로 위치 보정
    if (hncSubmenu_IsSeparator(hncSubmenu_GetAt(submenu, index)) == true) {
        if (down == true) { // down 키 입력
            for (let i = index + 1; i < menuItemCount; ++i) {
                if (hncSubmenu_IsSeparator(hncSubmenu_GetAt(submenu, i)) == false) {
                    index = i;
                    break;
                }
            }
            if (index == menuItemCount)  {
                alert('submenu 가장 끝까지 뒤졌으나 모두 separetor임. 0번 위치로 보정함.');
                index = 0;
            }
        }
        else {
            let i = index;
            for (; 0 < i; --i) {
                if (hncSubmenu_IsSeparator(hncSubmenu_GetAt(submenu, i - 1)) == false) {
                    index = i - 1;
                    break;
                }
            }
            if (i == 0)  {
                alert('submenu 가장 앞까지 뒤졌으나 모두 separetor임. 마지막 위치로 보정함.');
                index = menuItemCount - 1;
            }
        }
    }

    // 선택된 항목에만 포커스를 준다.
    for (let i = 0; i < menuItemCount; ++i) {
        if (index == i) {
            hncSubmenu_GetAt(submenu, i).tabIndex = 0;
            hncSubmenu_GetAt(submenu, i).focus();
        }
        else {
            hncSubmenu_GetAt(submenu, i).tabIndex = -1;   
        }
    }

}
function hncSubmenu_GetCount(submenu) {
    if (submenu == null) {
        return 0;
    }
    return submenu.childElementCount;
}
function hncSubmenu_GetAt(submenu, index) {
    if (index < 0 || hncSubmenu_GetCount(submenu) <= index) {
        alert('유효하지 않은 index');
        return null;
    }
    return submenu.children[index];
}
function hncSubmenu_IsSeparator(menuItem) {
    if (menuItem == undefined) {
        return false;
    }   
    if (menuItem.className.includes('hnc-separator') == true) {
        return true;
    }
    return false;
}
function hncSubmenu_IsSubmenuItem(menuItem) {
    if (menuItem == undefined) {
        return false;
    }   
    if (menuItem.className.includes('hnc-submenu-item') == true) {
        return true;
    }
    return false;
}
function hncSubmenu_IsSubmenuButton(subemenuButton) {
    if (subemenuButton == undefined) {
        return false;
    }   
    if (subemenuButton.className.includes('hnc-submenu-button') == true) {
        return true;
    }
    return false;
}

function hncSubmenu_FindFromParent(parent) {
    if (parent == undefined || parent == null) {
        return null;
    }
    for (let element of parent.children) {
        if (hncContainsClassName(element, 'hnc-submenu') == true) {
            return element;
        } 
    }

    return null;
}
function hncSubmenu_GetParent(submenu) {
    if (submenu == undefined || submenu == null) {
        return null;
    }
    
    return submenu.parentElement;
}

// submenu를 토글한다.
function hncSubmenu_Toggle(submenu) {
    if (submenu == null) {
        return;
    }
    
    if (hncSubmenu_IsOpen(submenu) == true) { // 화면에서 보인다면 감춤 */
        hncSubmenu_Hide(submenu);
    }
    else {
        hncSubmenu_Show(submenu);
    }  
}
// submenu가 이미 열렸는지의 여부
function hncSubmenu_IsOpen(submenu) {
    if (submenu == null) {
        return false;
    }
    let opacity = submenu.style.opacity;
    if (opacity == 1) {
        return true;
    }
    return false;
}
// show시 키보드 포커스 획득
function hncSubmenu_Show(submenu) {
    if (submenu == null) {
        return;
    }
    if (hncSubmenu_IsOpen(submenu) == true) {
        return;
    }
    hncSubmenu_CloseAll(submenu); // 모든 서브메뉴를 닫고(submenu의 parent는 안닫고)

    // submenuItem의 하위 submenu일때 좌표 보정
    if (hncSubmenu_IsSubmenuItem(hncSubmenu_GetParent(submenu)) == true) {
        let parentRect = hncSubmenu_GetParent(submenu).getBoundingClientRect(); // window.scrollX, window.scrollY 계산 포함해야 함
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

    submenu.style.opacity = 1; // 내것만 연다.
    submenu.style['pointer-events'] = 'auto'; 
    submenu.tabIndex = 0; // 키보드 이벤트를 받을 수 있게 함
    submenu.focus(); 
    submenu.addEventListener('keydown', hncSubmenu_OnKeyDown);
    hncAddClass(hncSubmenu_GetParent(submenu), 'hnc-submenu-opened');

    // 하위 menuItem에 이벤트 장착
    for (let menuItem of submenu.children) {
        menuItem.addEventListener('click', hncMenuItem_OnClick); // submenuitem을 클릭하면 하위 메뉴가 열린 상태로 있어야 함. 닫히면 안됨.
        menuItem.addEventListener('mouseenter', hncMenuItem_OnMouseEnter); 
        menuItem.addEventListener('mouseleave', hncMenuItem_OnMouseLeave);
    } 
}
// hide시 키보드 포커스 반환
function hncSubmenu_Hide(submenu) {
    if (submenu == null) {
        return;
    }

    if (hncSubmenu_IsOpen(submenu) == false) {
        return;
    }

    for (let menuItem of submenu.children) {
        let childSubmenu = hncSubmenu_FindFromParent(menuItem);
        if (childSubmenu != null) {
            hncSubmenu_Hide(childSubmenu); // 재귀호출. 하위의 서브메뉴를 닫는다.
        }
    }
    submenu.style.opacity = 0;
    submenu.style['pointer-events'] = 'none';   
    submenu.tabIndex = -1; // 키보드 이벤트를 받을 수 없게 함
    hncSubmenu_GetParent(submenu).focus(); // 상위개체에 포커스 반환
    submenu.removeEventListener('keydown', hncSubmenu_OnKeyDown);
    hncRemoveClass(hncSubmenu_GetParent(submenu), 'hnc-submenu-opened');

    // 하위 menuItem에 이벤트 제거
    for (let menuItem of submenu.children) {
        menuItem.tabIndex = -1; // 키보드 이동에 따라 하위 항목이 TabIndex를 가졌을 수 있으므로 모두 제거. 제거하지 않으면 Tab 이동시 숨겨진 submenu내의 menuItem에 포커싱이 감
        menuItem.removeEventListener('click', hncMenuItem_OnClick); 
        menuItem.removeEventListener('mouseenter', hncMenuItem_OnMouseEnter); 
        menuItem.removeEventListener('mouseleave', hncMenuItem_OnMouseLeave);
    } 
}

// submenu가 null 이면 모두 닫고, null이 아니면 submenu의 parent 인 것은 남겨두고 닫는다.
function hncSubmenu_CloseAll(submenu) {
    let others = document.querySelectorAll('.hnc-submenu');
    if (others == undefined) {
        return;
    }

    for (let other of others) {
        if (hncIsAncestor(other, submenu) == false) { // submenu의 조상이 아니라면 닫음. submenu == null 이면 false
            hncSubmenu_Hide(other);
        }
    }
}

// -----------------------
// hncMenuItem
// -----------------------
// mouseenter되는 경우 상위 항목의 위치로 부터 left, top 좌표를 계산하여 메뉴 표시
// hover상태인데도 마우스를 약간 움직이면 hover/out이 반복적으로 호출되어 mouseenter/mouseleave에서 구현
function hncMenuItem_OnMouseEnter(e) {
    this.tabIndex = 0;
    this.focus();
    if (hncSubmenu_IsSubmenuItem(this) == true) {
        let submenu = hncSubmenu_FindFromParent(this);
        if (submenu == null) {
            alert('hnc-submenu-item 하위에 hnc-submenu 가 정의되지 않음');
            return;
        }

        // enter시 보이는 것은 css에서 해도 되나 focus 처리를 위해 javascript 사용
        hncSubmenu_Show(submenu); // 자신의 parent라면 닫으면 안된다.
    }
}
// submenuItem 바깥으로 나가면 마우스 닫음
// hover상태인데도 마우스를 약간 움직이면 hover/out이 반복적으로 호출되어 mouseenter/mouseleave에서 구현
function hncMenuItem_OnMouseLeave(e) {
    this.tabIndex = -1;
    if (hncSubmenu_IsSubmenuItem(this) == true) {
        let submenu = hncSubmenu_FindFromParent(this);
        if (submenu == null) {
            alert('hnc-submenu-item 하위에 hnc-submenu 가 정의되지 않음');
            return;
        }
        hncSubmenu_Hide(submenu);
    }
}

function hncMenuItem_OnClick(e) {
    // 하위 메뉴 클릭시 이벤트 전파 중단하여 닫히지 않게 함
    if (hncSubmenu_IsSubmenuItem(this) == true) { 
        e.stopPropagation();

        // 하위메뉴가 open되지 안았다면 open
        let submenu = hncSubmenu_FindFromParent(this);
        if (submenu != null && hncSubmenu_IsOpen(submenu) == false) {
            hncSubmenu_Show(submenu);  
        }
    }
}

// submenu-item들의 오른쪽 Expander 추가. absolute로 배치됨
function hncMenuItem_AddExpander() {
    let items = document.querySelectorAll('.hnc-submenu-item');
    if (items == undefined) {
        return;
    }

    // 하위 depth 부터 넣어야 모두 보임. 0부터 삽입하면 하위 depth 의 expander가 안보임. <div>를 앞쪽에 붙임. 뒤에 붙이면, 하위 depth에서 세로 위치가 깨지는 현상 발생
    for (let i = items.length; 0 < i ; i--) {
        items[i - 1].innerHTML = '<div class="hnc-expander-right"><svg width="4" height="7"><g><path class="hnc-expander-path" d="M0,0 L0,7 L4,3.5z"/></g></svg></div>' + items[i - 1].innerHTML;
    }
}

// -----------------------
// 일반 유틸리티 함수
// -----------------------
// ancestor 가 descendants의 조상이면 true
function hncIsAncestor(ancestor, descendants) {
    if (descendants == null) {
        return false;
    }
    if (ancestor == null) {
        return false;
    }
    if (ancestor == descendants) {
        return false;
    }

    if (ancestor == descendants.parentElement) {
        return true;
    }
    return hncIsAncestor(ancestor, descendants.parentElement);
}

// element에 className인 항목이 있는지 여부
function hncContainsClassName(element, className) {
    if (element == undefined || element == null) {
        return false;
    }

    if (element.className.includes(className) == true) {
        return true;
    }
    return false;
}
// 이미 있으면 추가 안항(class이름 앞에 css 처럼 . 사용하지 말것)
function hncAddClass(element, className) {
    if (element == undefined || element == null) {
        return;
    }
    if (hncContainsClassName(element, className) == true) {
        return;
    }

    element.className += ' ' + className;
}
// 이미 없다면 삭제 안함(class이름 앞에 css 처럼 . 사용하지 말것)
function hncRemoveClass(element, className) {
    if (element == undefined || element == null) {
        return;
    }
    if (hncContainsClassName(element, className) == false) {
        return;
    }
    element.className = element.className.replace(' ' + className, '');
}