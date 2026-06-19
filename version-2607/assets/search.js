(function() {
  var input = document.querySelector('[data-global-search]');
  var results = document.querySelector('[data-search-results]');
  var empty = document.querySelector('[data-search-empty]');
  if (!input || !results || !window.SEARCH_ITEMS) {
    return;
  }
  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';
  input.value = initial;

  function normalize(value) {
    return String(value || '').toLowerCase();
  }

  function render() {
    var q = normalize(input.value.trim());
    var items = window.SEARCH_ITEMS.filter(function(item) {
      var text = normalize([item.title, item.year, item.region, item.type, item.genre, item.line].join(' '));
      return !q || text.indexOf(q) >= 0;
    }).slice(0, 120);
    results.innerHTML = items.map(function(item) {
      return '<article class="movie-card" data-title="' + item.title.replace(/"/g, '&quot;') + '">' +
        '<a class="poster" href="' + item.url + '">' +
        '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '" loading="lazy">' +
        '<span class="poster-shade"></span>' +
        '<span class="score">' + item.score + '</span>' +
        '</a>' +
        '<div class="card-body">' +
        '<h3><a href="' + item.url + '">' + item.title + '</a></h3>' +
        '<p class="meta">' + item.year + ' · ' + item.region + ' · ' + item.type + '</p>' +
        '<p class="desc">' + item.line + '</p>' +
        '<div class="tag-row"><span>' + item.genre + '</span></div>' +
        '</div>' +
        '</article>';
    }).join('');
    if (empty) {
      empty.classList.toggle('show', items.length === 0);
    }
  }

  input.addEventListener('input', render);
  render();
})();
