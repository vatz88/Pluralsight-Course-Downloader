var count = 0;

Number.prototype.myPadding = function() {

  var number = this.valueOf();
  var length =2;
  var str = '' + number;
 while (str.length < length) {
     str = '0' + str;
 } 
 return str;
};

var pauseVideo = function pauseVideo() {
  if ($('#play-control').length === 1) {
    $('#play-control').click();
  }
}

var getCourseName = function(){  
  var courseName = $('#course-title-link').text();
  courseName = courseName.replace(/[\/:?><]/g, '');
  return courseName;
}

var getSectionDom = function(){
  
  var folderDom = $('li.selected')
    .parents('ul')
    .prev('header')
    .children('div')
    .eq(1);

    return folderDom;
}

var getSaveFilePath = function(){
  
  var link = $('#vjs_video_3_html5_api').attr('src');
  var courseName = getCourseName();
  // console.log(courseName);

  var folderDom = getSectionDom();

  var sectionName = folderDom.find('h2').text();
  var sectionIndex = (folderDom.parents('section.module.open').eq(0).index() + 1).myPadding();
  var saveFolder =  sectionIndex + ' - ' +  sectionName;
  saveFolder = saveFolder.replace(/[\/:?><]/g, '');
  // console.log(saveFolder);

  var rawFileName = $('#module-clip-title').text().split(' : ').pop().trim();
  var fileIndex =($('li.selected').eq(1).index() + 1).myPadding();
  var saveFileName = fileIndex + ' - ' + rawFileName + '.' +  link.split('?')[0].split('.').pop();
  saveFileName = saveFileName.replace(/[\/:?><]/g, '');
  // console.log(saveFileName);

  console.log('processing => ' + courseName + ' ' + sectionIndex + '-' + fileIndex);
  return 'Pluralsight/' + courseName + '/' + saveFolder + '/' + saveFileName;
}

var downloadCurrentVideo = function() {
  var link = $('#vjs_video_3_html5_api').attr('src');
  console.log('downloadCurrentVideo: ' + link);

  var saveFilePath = getSaveFilePath();
  console.log('chrome download => ' + saveFilePath);
  chrome.runtime.sendMessage({
      action: 'download',
      link: link,
      filename: saveFilePath
    },
    function (response) {
      console.log('=> ' + response.actionStatus);
    }
  );
}

var downloadAllVideos = function() {

  var folderDom = getSectionDom();
  var link = $('#vjs_video_3_html5_api').attr('src');
  var sectionName = folderDom.find('h2').text();
  var finalFolderName = $('section:last').find('h2').text();
  var downloadAllVideosTimeout = 120000;
  var pauseVideoTimeout = 8000;

  var rawFileName = $('#module-clip-title').text().split(' : ').pop().trim();
  var finalFileName = $('section:last').find('li:last').find('h3').text();

  var saveFilePath = getSaveFilePath();
  console.log('chrome download => ' + saveFilePath);

  chrome.runtime.sendMessage({
      action: 'download',
      link: link,
      filename: saveFilePath
    },
    function (response) {
      console.log('response => ' + response.actionStatus);
      if (sectionName == finalFolderName && rawFileName == finalFileName) { 
        alert("Full Course Downloaded!");
      }
      else {         
        $('#next-control').click();
        setTimeout(pauseVideo, pauseVideoTimeout);
        setTimeout(downloadAllVideos, downloadAllVideosTimeout); 
      }
    }
  );
}


$(function () {

  $(document).keypress(function (e) {
    if (e.which === 115 || e.which === 83) {
      // keypress `s`
      console.log('s => current');
      downloadCurrentVideo();
    } else if (e.which === 97 || e.which === 65) {
      // keypress `a`
      count = 0;
      console.log('a => all');
      downloadAllVideos();
    }
  });
});
