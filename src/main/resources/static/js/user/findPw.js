/********* 비밀번호 모달창 ********/
//const findPwElem = document.querySelector('#findPw'); -> startPage.js에 이미 있는 전역변수
const modalFindPwElem = document.querySelector('.modal');
const findPwFrmElem = document.querySelector('.findPwFrm');
const modalCloseIcon = document.querySelector('.modal_close_icon');
const chkbtnElem = findPwFrmElem.chkbtn;
const findPwEmailElem = findPwFrmElem.findPwEmail;
const findPwNmElem = findPwFrmElem.findPwNm;

// 모달창 열기
findPwElem.addEventListener('click', () => {
    modalFindPwElem.classList.remove('hide');
});

// 모달창 닫기
if(findPwElem) {
    modalCloseIcon.addEventListener('click', () => {
        modalFindPwElem.classList.add('hide');
    });
}

//모달창 input 빈값 검사와 버튼 활성화

findPwEmailElem.addEventListener('click', () => {
    btn(findPwEmailElem, findPwNmElem, chkbtnElem);
});
findPwEmailElem.addEventListener('input', () => {
    btn(findPwEmailElem, findPwNmElem, chkbtnElem);
});

findPwNmElem.addEventListener('click', () => {
    btn(findPwEmailElem, findPwNmElem, chkbtnElem);
});
findPwNmElem.addEventListener('input', () => {
    btn(findPwEmailElem, findPwNmElem, chkbtnElem);
});


// 모달창 비밀번호 찾기 누르면 이메일 보내기 ajax 처리
chkbtnElem.addEventListener('click', () => {
    //findPw();
});