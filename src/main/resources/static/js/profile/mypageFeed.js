const feedElem = document.querySelector('#mypageFeedContainer');
const feedObj = {
    loadingElem : document.querySelector('#loading'),
    mypage_id : mypageConstElem.dataset.pid,
    limit : 12,
    itemLength : 0,
    currentPage : 1,
    getFeedList : function(page) {
        this.showLoading();
        fetch(`/profile/mypageList?mypage_id=${this.mypage_id}&page=${page}&limit=${this.limit}`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error(`${res.status}`);
            }).then(myJson => {
            console.log(myJson);
            if (myJson.length) {
                this.itemLength = myJson.length;
                this.makeFeedList(myJson);
            } else {
                console.log('!  게시물리스트 없음');
                feedElem.innerHTML = '<img src="/img/feed/empty.jpg" class="img-thumbnail wh400">';
            }
        }).catch(err => {
            console.log('! 게시물리스트 fetch() 오류 - ' + err);
            feedElem.innerHTML = '<img src="/img/feed/error.jpg" class="img-thumbnail wh400">';
        }).then(() => {
            this.hideLoading();
        });
    },
    makeFeedList: function(data) {
        if(data.length == 0) { return; }

        for(let i=0; i<data.length; i++) {
            const item = data[i];
            const divId = 'mypageFeed' + i;
            const mypageFeedElem = document.createElement('div');
            mypageFeedElem.id = divId;
            mypageFeedElem.classList.add('pointer');
            mypageFeedElem.classList.add('d-flex');
            mypageFeedElem.classList.add('justify-content-center');
            mypageFeedElem.classList.add('align-items-center');
            mypageFeedElem.style.position = 'relative';
            mypageFeedElem.dataset.fid = `${item.feed_id}`;
            mypageFeedElem.dataset.isfav = `${item.isFav}`;
            mypageFeedElem.dataset.iscmt = `${item.isCmt}`;
            mypageFeedElem.dataset.bsToggle = "modal";
            mypageFeedElem.dataset.bsTarget = '#mypageDetailModal';
            mypageFeedElem.innerHTML = `
                    <img src="/pic/feed/${item.feed_id}/${item.contents.contents_img}" 
                    class="rounded mypageImg wh400"
                    onError="this.src=/img/feed/error.png">
            `;

            this.addEvent(mypageFeedElem, `${item.feed_id}`, `${this.mypage_id}`, `${item.isFav}`, `${item.isCmt}`);
            feedElem.append(mypageFeedElem);
        }
    },
    setScrollInfinity: function(target) {
        target.addEventListener('scroll', () => {
            const {
                scrollTop,
                scrollHeight,
                clientHeight
            } = document.documentElement;

            if (scrollTop + clientHeight >= scrollHeight - 5 && this.itemLength === this.limit) {
                this.itemLength = 0;
                this.getFeedList(++this.currentPage);
            }
        }, { passive: true });
    },
    hideLoading: function() { this.loadingElem.classList.add('visually-hidden');},
    showLoading: function() { this.loadingElem.classList.remove('visually-hidden'); },
    addEvent : function (elem, feedId, mypageId, isFav, isCnt) {
        const imgElem = elem.firstElementChild;
        elem.addEventListener('mouseover', () => {
            imgElem.classList.add('blurImg');
            this.showIcn(elem);
        });
        elem.addEventListener('mouseout', () => {
            imgElem.classList.remove('blurImg');
            this.hideIcn(elem);
        });
        elem.addEventListener('click', () => { showMypageDetail(feedId, mypageId, isFav, isCnt); });
    },
    favIcn : function (isFav) {
        const icn = document.createElement('i');
        icn.classList.add('bi');

        if(isFav > 0) {
            icn.classList.add('bi-heart-fill');
        } else {
            icn.classList.add('bi-heart');
        }
        return  icn;
    },
    cmtIcn : function (isCmt) {
        const icn = document.createElement('i');
        icn.classList.add('bi');

        if(isCmt > 0) {
            icn.classList.add('bi-chat-left-quote-fill');
        } else {
            icn.classList.add('bi-chat-left-quote');
        }
        return icn;
    },
    showIcn : function (elem) {
        const favIcn = this.favIcn(elem.dataset.isfav);
        const cmtIcn = this.cmtIcn(elem.dataset.iscmt);

        const icnElem = document.createElement('div');
        icnElem.id = 'icn';
        icnElem.append(favIcn);
        icnElem.append(cmtIcn);
        icnElem.style.position = 'absolute';

        elem.append(icnElem);
    },
    hideIcn : function (elem) {
        if(elem.childElementCount>1) {
            elem.lastElementChild.remove();
        }
    }
}

feedObj.setScrollInfinity(window);
feedObj.getFeedList(1);


