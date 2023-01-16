document.onreadystatechange = function (e) {
  // Set html background before load.
  let localTheme = localStorage.getItem('theme');
  const doc = document.getElementsByTagName('html');
  if (
    localTheme === 'dark' ||
    (!localTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    doc[0].style.backgroundColor = '#131927';
  } else {
    doc[0].style.backgroundColor = '#F9FAFC';
  }

  if (document.readyState === 'complete') {
    //dom is ready, window.onload fires later
  }
};

window.onload = function () {
  // Wait for 200ms to avoid flickering.
  setTimeout(function () {
    document.body.style.display = '';
  }, 200);
};
