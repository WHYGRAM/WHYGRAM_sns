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








