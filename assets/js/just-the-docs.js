// Event handling

function addEvent(el, type, handler) {
  if (el.attachEvent) el.attachEvent('on' + type, handler); else el.addEventListener(type, handler);
}
function removeEvent(el, type, handler) {
  if (el.detachEvent) el.detachEvent('on' + type, handler); else el.removeEventListener(type, handler);
}

// Decode HTML
function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

// Show/hide mobile menu

function toggleNav() {
  const nav = document.querySelector('.js-main-nav');
  const auxNav = document.querySelector('.js-aux-nav');
  const navTrigger = document.querySelector('.js-main-nav-trigger');
  const search = document.querySelector('.js-search');
  const content = document.querySelector('.js-main-content')

  addEvent(navTrigger, 'click', function () {
    var text = navTrigger.innerText;
    var textToggle = navTrigger.getAttribute('data-text-toggle');

    nav.classList.toggle('nav-open');
    if (auxNav) {
      auxNav.classList.toggle('nav-open');
    }
    navTrigger.classList.toggle('nav-open');
    search.classList.toggle('nav-open');
    content.classList.toggle('nav-open');
    navTrigger.innerText = textToggle;
    navTrigger.setAttribute('data-text-toggle', text);
    textToggle = text;
  })
}

// Site search

function initSearch() {
  var index = lunr(function () {
    this.ref('id');
    this.field('title', { boost: 20 });
    this.field('content', { boost: 10 });
    this.field('tags', { boost: 5});
    this.field('url');
  });

  // Get the generated search_data.json file so lunr.js can search it locally.

  sc = document.getElementsByTagName("script");
  source = '';

  for (idx = 0; idx < sc.length; idx++) {
    s = sc.item(idx);

    if (s.src && s.src.match(/just-the-docs\.js$/)) { source = s.src; }
  }

  jsPath = source.replace('just-the-docs.js', '');

  jsonPath = jsPath + 'search-data.json';

  var request = new XMLHttpRequest();
  request.open('GET', jsonPath, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      var keys = Object.keys(data);

      for (var i in data) {
        index.add({
          id: data[i].id,
          title: data[i].title,
          content: data[i].content,
          url: data[i].url,
          tags: data[i].tags
        });
      }
      searchResults(data);
    } else {
      // We reached our target server, but it returned an error
      console.log('Error loading ajax request. Request status:' + request.status);
    }
  };

  request.onerror = function () {
    // There was a connection error of some sort
    console.log('There was a connection error');
  };

  request.send();

  function searchResults(dataStore) {

    var searchInput = document.querySelector('.js-search-input');
    var searchResults = document.querySelector('.js-search-results');
    var store = dataStore;
    let keyboardNavigationListener

    function hideResults() {
      searchResults.innerHTML = '';
      searchResults.classList.remove('active');
    }

    addEvent(searchInput, "keyup", function (e) {

      if (e.key === 'ArrowDown') {
        return
      } else {
        clearKeyboardNavigationListener(searchInput, keyboardNavigationListener)
      }

      const query = this.value;

      searchResults.innerHTML = '';
      searchResults.classList.remove('active');

      if (query === '') {
        hideResults();
      } else {
        const results = index.search(query);

        if (results.length > 0) {
          searchResults.classList.add('active');

          const searchResultsTabs = document.createElement('div');
          searchResultsTabs.classList.add('tabs')
          searchResults.appendChild(searchResultsTabs)

          var docsResultsList = document.createElement('ul');
          var faqResultsList = document.createElement('ul');

          for (const i in results) {
            let result = store[results[i].ref]
            var resultsListItem = document.createElement('li');
            var resultsLink = document.createElement('a');
            var resultsUrlDesc = document.createElement('span');

            var resultsUrl = result.url;
            var resultsRelUrl = result.relUrl;
            var resultsTitle = htmlDecode(result.title);
            var resultsType = result.collection;
            var resultsTags = result.tags

            resultsLink.setAttribute('href', resultsUrl);
            resultsLink.innerText = resultsTitle;

            faqResultsList.classList.add('search-results-list');
            docsResultsList.classList.add('search-results-list');

            resultsListItem.classList.add('search-results-list-item');
            resultsLink.classList.add('search-results-link');
            resultsUrlDesc.classList.add('fs-2', 'text-grey-dk-000', 'd-block');

            resultsLink.appendChild(resultsUrlDesc);
            resultsListItem.appendChild(resultsLink);

            if (resultsType === 'faqs') {
              faqResultsList.appendChild(resultsListItem);
              let tags = document.createElement('div')
              tags.classList.add('search-tags')
              tags.textContent = resultsTags
              resultsListItem.appendChild(tags)
            } else {
              docsResultsList.appendChild(resultsListItem)
            }

          }

          const docsContent = generateTabAndReturnContentNode('Documentation', searchResultsTabs, docsResultsList.childElementCount, true);
          const faqContent = generateTabAndReturnContentNode('FAQ', searchResultsTabs, faqResultsList.childElementCount);
          docsContent.appendChild(docsResultsList);
          faqContent.appendChild(faqResultsList);

        }

        // When esc key is pressed, hide the results and clear the field
        if (e.keyCode == 27) {
          hideResults();
          searchInput.value = '';
        }

        keyboardNavigationListener = addKeyboardNavigationToSearch(searchInput, [docsResultsList, faqResultsList])
      }
    });

    // We don't want the search results dialog to close when the user is clicking inside
    searchResults.addEventListener('click', function (e) {
      e.stopPropagation()
    })

    addEvent(document.querySelector('.js-main-content'), 'click', function (e) {
      // setTimeout(function () { hideResults() }, 100);
      hideResults()
    })
  }
}

function addKeyboardNavigationToSearch(searchInputElement, resultsListsArray) {
  let activeResultsList = 0

  function searchInputKeyboardNavListener(event) {
    if (event.key === 'ArrowDown' && resultsListsArray[activeResultsList]) {
      event.preventDefault()

      resultsListsArray[activeResultsList].firstChild.firstElementChild.focus()
    }
  }
  function searchResultsKeyboardNavListener(event) {
    switch (event.key) {
      case 'ArrowUp':
        if (event.target.parentElement.previousElementSibling) {
          event.preventDefault()
          event.target.parentElement.previousElementSibling.firstElementChild.focus()
        } else {
          searchInputElement.focus()
        }
        return
      case 'ArrowDown':
        if (event.target.parentElement.nextElementSibling) {
          event.preventDefault()
          event.target.parentElement.nextElementSibling.firstElementChild.focus()
        }
        return
      case 'ArrowRight':
        if (activeResultsList < resultsListsArray.length - 1) {
          event.preventDefault()
          // Quick hack to switch to FAQs
          const faqTab = document.getElementById('FAQ')
          faqTab.checked = true
          activeResultsList++
          resultsListsArray[activeResultsList].firstChild.firstElementChild.focus()
        }
        return
      case 'ArrowLeft':
        if (activeResultsList > 0) {
          event.preventDefault()
          // Quick hack to switch to DOCS
          const docsTab = document.getElementById('Documentation')
          docsTab.checked = true
          activeResultsList--
          resultsListsArray[activeResultsList].firstChild.firstElementChild.focus()
        }
        return
      default:
        return
    }
  }

  searchInputElement.addEventListener("keydown", searchInputKeyboardNavListener, false);

  resultsListsArray.forEach(resultList => {
    if (resultList && resultList.childNodes) {
      for (let i = 0; i < resultList.childNodes.length; i++) {
        const item = resultList.childNodes[i]
        item.addEventListener("keydown", searchResultsKeyboardNavListener, false)
      }
    }
  })


  return searchInputKeyboardNavListener
}

function clearKeyboardNavigationListener(searchInputElement, listener) {
  searchInputElement.removeEventListener("keydown", listener)
}

function pageFocus() {
  const mainContent = document.querySelector('.js-main-content');
  mainContent.focus();
}

function generateTabAndReturnContentNode(name, elementToAppendTo, resultCount, active) {
  var tabControl = document.createElement('input')
  tabControl.setAttribute('type', 'radio')
  tabControl.setAttribute('name', 'tabs')
  tabControl.setAttribute('id', name)
  active ? tabControl.setAttribute('checked', 'checked') : ''
  elementToAppendTo.appendChild(tabControl)

  var tabLabel = document.createElement('label')
  tabLabel.setAttribute('for', name)
  tabLabel.textContent = name
  elementToAppendTo.appendChild(tabLabel)


  var tab = document.createElement('div')
  tab.classList.add('tab')
  elementToAppendTo.appendChild(tab)

  let resultCountBadge = document.createElement('span')
  resultCountBadge.classList.add('result-count-badge')
  resultCountBadge.textContent = resultCount
  // resultCountBadge.style
  tabLabel.appendChild(resultCountBadge)

      // var contentTitle = document.createElement('h1')
  // contentTitle.textContent = name
  // tab.appendChild(contentTitle)

  var content = document.createElement('p')
  // content.textContent = name
  tab.appendChild(content)

  return content
}

function addCtrlGListener() {
  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'g') {
      console.log('search focus')
      event.preventDefault()
      document.querySelector('.js-search-input').focus()
    }
  });
}

// Document ready

function ready() {
  toggleNav();
  addCtrlGListener()
  pageFocus();
  if (typeof lunr !== 'undefined') {
    initSearch();
  }
}

// in case the document is already rendered
if (document.readyState != 'loading') ready();
// modern browsers
else if (document.addEventListener) document.addEventListener('DOMContentLoaded', ready);
// IE <= 8
else document.attachEvent('onreadystatechange', function () {
  if (document.readyState == 'complete') ready();
});
