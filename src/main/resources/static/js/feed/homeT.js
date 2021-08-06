const feedList = [];
const feedImgElem = document.querySelector('.feedImg');
const feedCtntElem = document.querySelector('.feedCtnt');
const feedInputBtnElem = document.querySelector('.feedInputBtn');
const feedSelectImgElem = document.querySelector('.feedSelectImg');
const displayImgListElem = document.querySelector('.displayImgList');

// 이미지 클릭시 file 열기
feedImgElem.addEventListener('click', () => {
   feedSelectImgElem.click();
});

// 이미지선택 후 feedList에 추가
feedSelectImgElem.addEventListener('change', () => {
   const imgFiles = feedSelectImgElem.files;
   for(let i = 0; i < imgFiles.length; i++) {
      feedList.push(imgFiles[i]);
   }
   displaySelectedImgArr()
});

function displaySelectedImgArr() {
   displayImgListElem.innerHTML = '';

   for(let i = 0; i < feedList.length; i++) {
      const item = feedList[i];
      const reader = new FileReader();
      reader.readAsDataURL(item);

      reader.onload = () => {
         const img = document.createElement('img');
         img.addEventListener('click', () => {
            feedList.splice(i, 1);
            displaySelectedImgArr();
         });
         img.src = reader.result;
         img.classList.add('wh90')
         displayImgListElem.append(img);
      };
   }

}

feedInputBtnElem.addEventListener('click', () => {
   const data = new FormData();
   if(feedCtntElem.value.length > 0) { data.append(feedCtntElem.id, feedCtntElem.value); }
   if(feedList.length > 0) {
      for(let i = 0; i < feedList.length; i++) {
         data.append('contents_img', feedList[i]);
      }
   }

   fetch('/feed/home', {
      method: 'POST',
      body: data
   }).then(res => res.json())
       .then(myJson => {
          switch(myJson.result) {
             case 0:
                alert('피드 등록에 실패하였습니다.');
                break;
             case 1:
                location.href = '/feed/home';
                break;
          }
       });
});



// data 기능
function getDateTimeInfo(date) {
   const nowDate = new Date();
   const targetDate = new Date(date);
   const nowDateSec = parseInt(nowDate.getTime() / 1000);
   const targetDateSec = parseInt(targetDate.getTime() / 1000);

   const differentSec = nowDateSec - targetDateSec;
   if(differentSec < 120) {
      return '1분 전';
   } else if(differentSec < 3600) {
      return `${parseInt(differentSec / 60)}분 전`;
   } else if(differentSec < 86400) { //시간 단위
      return `${parseInt(differentSec / 3600)}시간 전`;
   } else if(differentSec < 604800) { //일 단위
      return `${parseInt(differentSec / 86400)}일 전`;
   }
   return targetDate.toLocaleString();
}

function moveToProfile(users_id) {
   location.href = `/profile/mypage?profilePage=${users_id}`;
}

const feedObj = {
   limit: 5,
   itemLength: 0,
   currentPage: 1,
   url: '',
   users_id: 0,
   containerElem: document.querySelector('#feedContainer'),
   loadingElem: document.querySelector('.loading'),

   makeFeedList: function (data) {
      if(data.length == 0) { return; }

      for(let i = 0; i < data.length; i++) {
         const item = data[i];

         const feedItemContainer = document.createElement('div');
         feedItemContainer.classList.add('feedItem');

         let profileImg = '';
         if(item.users_img != null) {
            profileImg = `<img src="pic/feed/${item.users_id}/${item.users_img}" class="pointer wh30"
            onclick="moveToProfile(${item.users_id})">`
         }
         const regdtInfo = getDateTimeInfo(item.feed_regdt);
         const feedUserInfo = document.createElement('div');
         feedUserInfo.classList.add('userInfo')
         feedUserInfo.innerHTML = `
         <div class="userProfile">${profileImg}</div>
         <div><span class="pointer" onclick="moveToProfile(${item.users_id})">${item.writer}</span>- ${regdtInfo}</div>
         `;

         const feedImgDiv = document.createElement('div');
         feedImgDiv.classList.add('feedImg');


      }
   },

   // 인피니티 스크롤
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
      }, {passive: true});
   },
   getFeedList: function (page) {

      this.showLoading();
      fetch(`${this.url}?feedListnum=${this.users_id}&page=${page}&limit=${this.limit}`)
         .then(res => res.json())
         .then(myJson => {
            this.itemLength = myJson.length;
            this.makeFeedList(myJson);
         }).catch(err => {
            console.log(err);
      }).then(() => {
        this.hideLoading();
      });
   },
   hideLoading: function() { this.loadingElem.classList.add('hide');},
   showLoading: function() { this.loadingElem.classList.remove('hide'); }
}

feedObj.url = '/user/home';
feedObj.setScrollInfinity(window);
feedObj.getFeedList(1);



