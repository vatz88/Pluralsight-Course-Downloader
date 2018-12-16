var count = 0;
var shouldBeSequential = true;

Number.prototype.myPadding = function () {
  var number = this.valueOf();
  var length = 2;
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
};

function getVideoSrc(){
  var link = $('#vjs_video_3_html5_api');
  if(!link.length){
    //try fix get src error(domId changed)
    link = $('video');
  }
  return link.attr('src');
}

function pauseVideo() {
  if ($('#play-control').length === 1) {
    $('#play-control').click();
  }
}

function getCourseName() {
  var courseName = $('#course-title-link').text();
  courseName = courseName.replace(/[\/:?><]/g, '');
  return courseName;
}

function getSectionDom() {
  var folderDom = $('li.selected')
    .parents('ul')
    .prev('header')
    .children('div')
    .eq(1);
  return folderDom;
}

function getSaveFilePath() {
  var link = getVideoSrc();
  var courseName = getCourseName();
  // console.log(courseName);

  var folderDom = getSectionDom();
  var sectionName = folderDom.find('h2').text();
  var sectionIndex = (folderDom.parents('section.module.open').eq(0).index() + 1).myPadding();
  var saveFolder = sectionIndex + ' - ' + sectionName;
  saveFolder = saveFolder.replace(/[\/:?><]/g, '');
  // console.log(saveFolder);

  var rawFileName = $('#module-clip-title').text().split(' : ').pop().trim();
  var fileIndex = ($('li.selected').eq(1).index() + 1).myPadding();
  var saveFileName = fileIndex + ' - ' + rawFileName + '.' + link.split('?')[0].split('.').pop();
  saveFileName = saveFileName.replace(/[\/:?><]/g, '');
  // console.log(saveFileName);

  console.log('processing => ' + courseName + ' ' + sectionIndex + ' - ' + fileIndex);
  return 'Pluralsight/' + courseName + '/' + saveFolder + '/' + saveFileName;
}

function downloadCurrentVideo() {
  var link = getVideoSrc();
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

function downloadAllVideos() {
  var link = getVideoSrc();
  var saveFilePath = getSaveFilePath();
  console.log('chrome download => ' + saveFilePath);

  var downloadAllVideosTimeout = 30000;
  var pauseVideoTimeout = 8000;
  var folderDom = getSectionDom();
  var sectionName = folderDom.find('h2').text();
  var finalFolderName = $('section:last').find('h2').text();
  var rawFileName = $('#module-clip-title').text().split(' : ').pop().trim();
  var finalFileName = $('section:last').find('li:last').find('h3').text();

  chrome.runtime.sendMessage({
      action: shouldBeSequential? 'download-sync': 'download',
      link: link,
      filename: saveFilePath
    },
    function (response) {
      console.log('response => ' + response.actionStatus);
      if (sectionName == finalFolderName && rawFileName == finalFileName) {
        alert("Full Course Downloaded!");
      } else {
        $('#next-control').click();
        // Use less timeout in sequential mode, since the
        // response is  already async.
        setTimeout(pauseVideo, shouldBeSequential? pauseVideoTimeout / 2 : pauseVideoTimeout);
        setTimeout(downloadAllVideos, shouldBeSequential? downloadAllVideosTimeout / 3 :  downloadAllVideosTimeout);
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
      // shouldBeSequential = confirm('Do you want your downloads to be sequential?');

      console.log('a => all');
      downloadAllVideos();
    }
  });
});
