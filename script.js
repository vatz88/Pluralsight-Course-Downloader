var count = 0;

$(function () {
  $(document).keypress(function (e) {
    if (e.which === 115 || e.which === 83) {
      // keypress `s`
      downloadCurrentVideo();
    } else if (e.which === 97 || e.which === 65) {
      // keypress `a`
      count = 0;
      downloadAllVideos();
    }
  });
});


function downloadCurrentVideo() {
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


function downloadAllVideos() {
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
        setTimeout(pauseVideo, 8000);
        setTimeout(downloadAllVideos, 30000);
      } else if (foldername2 == finalfoldername) {
        if (filename2 == finalfilename) {
          alert("Full Course Downloaded!");
        } else {
          $('#next-control').click();
          setTimeout(pauseVideo, 8000);
          setTimeout(downloadAllVideos, 30000);
        }
      }
    }
  );
}

function pauseVideo() {
  if ($('#play-control').length === 1) {
    $('#play-control').click();
  }
}
