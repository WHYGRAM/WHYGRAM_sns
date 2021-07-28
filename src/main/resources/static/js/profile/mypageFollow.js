const mypageConstElem = document.querySelector('#mypageConst');

// 팔로우 기능
const btnFollowElem = document.querySelector('#btnFollow');

function folllowOver(follow) {
    switch(follow) {
        case "unfollow2":
            btnFollowElem.innerHTML='<i class="profile-icon bi bi-person-dash-fill"></i>';
            break;
        case "unfollow1":
            btnFollowElem.innerHTML='<i class="profile-icon bi bi-person-dash"></i>';
            break;
        case "follow2":
            btnFollowElem.innerHTML='<i class="profile-icon bi bi-person-plus-fill"></i>';
            break;
        case "follow1":
            btnFollowElem.innerHTML='<i class="profile-icon bi bi-person-plus"></i>';
            break;
    }
}

function folllowOut(follow) {
    switch(follow) {
        case "unfollow2":
            btnFollowElem.innerHTML='<i class="profile-icon bi bi-person-check-fill"></i>';
            break;
        case "unfollow1":
            btnFollowElem.innerHTML='<i class="profile-icon bi bi-person-check"></i>';
            break;
        case "follow2":
            btnFollowElem.innerHTML='<i class="profile-icon bi bi-person-fill"></i>';
            break;
        case "follow1":
            btnFollowElem.innerHTML='<i class="profile-icon bi bi-person"></i>';
            break;
    }
}

function followClick(follow, elem) {
    switch(follow) {
        case "unfollow2":
            btnFollowElem.innerHTML='<i class="profile-icon bi bi-person-fill"></i>';
            elem.dataset.follow = 'follow2';
            break;
        case "unfollow1":
            btnFollowElem.innerHTML='<i class="profile-icon bi bi-person"></i>';
            elem.dataset.follow = 'follow1';
            break;
        case "follow2":
            btnFollowElem.innerHTML='<i class="profile-icon bi bi-person-check-fill"></i>';
            elem.dataset.follow = 'unfollow2';
            break;
        case "follow1":
            btnFollowElem.innerHTML='<i class="profile-icon bi bi-person-check"></i>';
            elem.dataset.follow = 'unfollow1';
            break;
    }
}

function followProc(follow, him, elem) {
    const init = {};
    const param = {'follow_him' : him};
    
    switch(follow) {
        case "unfollow2": case "unfollow1":
            init.method = 'DELETE';
            break;
        case "follow2": case "follow1":
            init.method = 'POST';
            break;
    }
    
    init.headers = {
        'accept' : 'application/json',
        'content-type' : 'application/json;charset=UTF-8'
    }
    init.body = JSON.stringify(param);
    
    fetch('follow', init)
        .then(res => res.json())
        .then(myJson => {
            if(myJson.result === 1) {
                followClick(follow, elem);
            } else { alert('에러가 발생하였습니다.'); }
        });
}

if (btnFollowElem) {
    const follow = btnFollowElem.dataset.follow;
    const him = mypageConstElem.dataset.pId;
    
    btnFollowElem.addEventListener('mouseover', () => {
        folllowOver(follow);
    });
    btnFollowElem.addEventListener('mouseout', () => {
        folllowOut(follow);
    });
    btnFollowElem.addEventListener('click', () => {
        followProc(follow, him, btnFollowElem);
    });
}