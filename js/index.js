var state = [];

function setDefaultState() {
  var id = generateID();
  var baseState = {};
  baseState[id] = {
    status: 'new'
  , id: id
  , title: 'Hello, World!'
  };
  syncState(baseState);
}

function generateID() {
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return randLetter + Date.now();
}

function pushToState(title, status, id) {
  var baseState = getState();
  baseState[id] = {
    id: id
  , title: title
  , status: status
  };
  syncState(baseState);
}

function setToDone(id) {
  var baseState = getState();
  if (baseState[id].status === 'new') {
    baseState[id].status = 'done'
  } else {
    baseState[id].status = 'new';
  }
  syncState(baseState);
}

function deleteTodo(id) {
  var baseState = getState();
  delete baseState[id]
  syncState(baseState)
}

function resetState() {
  localStorage.setItem('state', null);
}

function syncState(state) {
  localStorage.setItem('state', JSON.stringify(state));
}

function getState() {
  return JSON.parse(localStorage.getItem('state'));
}

function addItem(text, status, id, noUpdate) {
  var id = id ? id : generateID();
  var c = status === 'done' ? 'danger' : '';
  var item =
    '<li data-id="' + id + '" class="animated flipInX ' + c + '">' +
    '<div class="checkbox"><span class="close"><i class="fa fa-times"></i>' +
    '</span><label><span class="checkbox-mask"></span>' +
    '<input type="checkbox" />' +
    text +
    '</label></div></li>';

  var isError = $('.form-control').hasClass('hidden');

  var err = document.getElementsByClassName('err')[0];
  if (text === '') {
    err.classList.remove('hidden');
  } else {
    err.classList.add('hidden');
    $('.todo-list').append(item);
  }

  $('.refresh').removeClass('hidden');
  $('.no-items').addClass('hidden');
  $('.form-control')
    .val('')
    .attr('placeholder', '✍️ Add item...');
  setTimeout(function() {
    $('.todo-list li').removeClass('animated flipInX');
  }, 500);

  if (!noUpdate) {
    pushToState(text, 'new', id);
  }
}

function refresh() {
  $('.todo-list li').each(function(i) {
    $(this)
      .delay(70 * i)
      .queue(function() {
        $(this).addClass('animated bounceOutLeft');
        $(this).dequeue();
      });
  });

  setTimeout(function() {
    $('.todo-list li').remove();
    $('.no-items').removeClass('hidden');
    $('.err').addClass('hidden');
  }, 800);
}

$(function() {
  var err = $('.err'),
    formControl = $('.form-control'),
    isError = formControl.hasClass('hidden');

  if (!isError) {
    formControl.blur(function() {
      err.addClass('hidden');
    });
  }

  $('.add-btn').on('click', function() {
    var itemVal = $('.form-control').val();
    addItem(itemVal);
    formControl.focus();
  });

  $('.refresh').on('click', refresh);

  $('.todo-list').on('click', 'input[type="checkbox"]', function() {
    var li = $(this)
      .parent()
      .parent()
      .parent();
    li.toggleClass('danger');
    li.toggleClass('animated flipInX');

    setToDone(li.data().id);

    setTimeout(function() {
      li.removeClass('animated flipInX');
    }, 500);
  });

  $('.todo-list').on('click', '.close', function() {
    var box = $(this)
      .parent()
      .parent();

    if ($('.todo-list li').length == 1) {
      box.removeClass('animated flipInX').addClass(
        'animated bounceOutLeft');
      setTimeout(function() {
        box.remove();
        $('.no-items').removeClass('hidden');
        $('.refresh').addClass('hidden');
      }, 500);
    } else {
      setTimeout(function() {
        box.remove();
      }, 500);
    }
    deleteTodo(box.data().id)
  });

  $('.form-control').keypress(function(e) {
    if (e.which == 13) {
      var itemVal = $('.form-control').val();
      addItem(itemVal);
    }
  });
  $('.todo-list').sortable();
  $('.todo-list').disableSelection();
});

var dateLine = document.querySelector('.today');
dateLine.innerHTML = new Date();

$(document).ready(function() {
  var state = getState();

  if (!state) {
    setDefaultState();
    state = getState();
  }

  Object.keys(state).forEach(function(todoKey) {
    var todo = state[todoKey];
    addItem(todo.title, todo.status, todo.id, true);
  });
});
