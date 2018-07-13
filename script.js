$(function () {
  $(document).keypress(function (e) {
    if (e.which === 83 || e.which === 115) {
      count = 0;
      downloadVideo();
    } else if(e.which === 103) {
      downloadVideoOne();
    }
  });
});

var count = 0;

function downloadVideoOne() {
  var link = $('#vjs_video_3_html5_api').attr('src');

  var coursename = $('#course-title-link').text();
  coursename = coursename.replace(/[\/:?><]/g, '');

  var folder = $('li.selected')
    .parents('ul')
    .prev('header')
    .children('div')
    .eq(1);
  folder =
    folder
    .parents('section.module.open')
    .eq(0)
    .index() +
    1 +
    ' - ' +
    folder.find('h2').text();
  folder = folder.replace(/[\/:?><]/g, '');

  var filename =
    $('li.selected')
    .eq(1)
    .index() +
    1 +
    ' - ' +
    $('#module-clip-title')
    .text()
    .split(' : ')
    .pop()
    .trim() +
    '.' +
    link
    .split('?')[0]
    .split('.')
    .pop();
  filename = filename.replace(/[\/:?><]/g, '');

  chrome.runtime.sendMessage({
      action: 'download',
      link: link,
      filename: 'Pluralsight/' + coursename + '/' + folder + '/' + filename,
    },
    function (response) {
      console.log(response.actionStatus);
    }
  );
}


function downloadVideo() {
  var link = $('#vjs_video_3_html5_api').attr('src');

  var coursename = $('#course-title-link').text();
  coursename = coursename.replace(/[\/:?><]/g, '');

  var folder = $('li.selected')
    .parents('ul')
    .prev('header')
    .children('div')
    .eq(1);
  folder =
    folder
    .parents('section.module.open')
    .eq(0)
    .index() +
    1 +
    ' - ' +
    folder.find('h2').text();
  folder = folder.replace(/[\/:?><]/g, '');

  var filename =
    $('li.selected')
    .eq(1)
    .index() +
    1 +
    ' - ' +
    $('#module-clip-title')
    .text()
    .split(' : ')
    .pop()
    .trim() +
    '.' +
    link
    .split('?')[0]
    .split('.')
    .pop();
  filename = filename.replace(/[\/:?><]/g, '');

  var filename2 = $('#module-clip-title').text().split(' : ').pop().trim();
  var foldername2 = $('li.selected').parents('ul').prev('header').children('div').eq(1).find('h2').text();
  var finalfilename = $('section:last').find('li:last').find('h3').text();
  var finalfoldername = $('section:last').find('h2').text();

  chrome.runtime.sendMessage({
      action: 'download',
      link: link,
      filename: 'Pluralsight/' + coursename + '/' + folder + '/' + filename,
    },
    function (response) {
      console.log(response.actionStatus);
      if (foldername2 != finalfoldername) {
        $('#next-control').click();
        setTimeout(pauseVideo, 5000);
        setTimeout(downloadVideo, 50000);  
      } else if(foldername2 == finalfoldername) {
        if (filename2 == finalfilename) {

        } else {
          $('#next-control').click();
          setTimeout(pauseVideo, 5000);
          setTimeout(downloadVideo, 50000);
        }
      }
    }
  );
}

function pauseVideo() {
  $('#play-control').click();
}
