import './index.styl';

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
  var klass = status === 'done' ? 'danger' : '';
  var item =
    '<li data-id="' + id + '" class="' + klass + '">' +
    '<div class="checkbox">' +
      '<span class="close">x</span>' +
      '<label><span class="checkbox-mask"></span>' +
      '<input type="checkbox" />' + text + '</label>' +
    '</div>' +
    '</li>';

  var control = document.querySelector('.form-control');
  var err = document.querySelector('.err');

  if (text === '') {
    err.classList.remove('hidden');
  } else {
    err.classList.add('hidden');
    document.querySelector('.todo-list').insertAdjacentHTML(
      'afterbegin', item);
  }

  control.value = '';
  control.setAttribute('placeholder', 'Add item...');
  setTimeout(function() {
    let elem = document.querySelector('.todo-list li');
    if (elem != null) {
      elem.classList.remove('animated');
    }
  }, 150);

  if (!noUpdate) {
    pushToState(text, 'new', id);
  }
}

var dateLine = document.querySelector('.today');
dateLine.innerHTML = new Date();

document.addEventListener('DOMContentLoaded', function(event) {
  var state = getState();

  if (!state) {
    setDefaultState();
    state = getState();
  }

  Object.keys(state).forEach(function(todoKey) {
    var todo = state[todoKey];
    addItem(todo.title, todo.status, todo.id, true);
  });

  var control = document.querySelector('.form-control')
    , isError = control.classList.contains('hidden')
    ;

  if (!isError) {
    var err = document.querySelector('.err');
    err.classList.add('hidden');
  }

  var btn = document.querySelector('.add-btn');
  btn.addEventListener('click', function(event) {
    addItem(control.value);
    control.focus();
  });

  var nodeList;

  // check
  nodeList = document.querySelectorAll('.todo-list input[type="checkbox"]');
  Array.prototype.slice.call(nodeList).map(function(element) {
    element.addEventListener('click', function(event) {
      var li = this.parentNode.parentNode.parentNode;
      li.classList.toggle('danger');
      li.classList.toggle('animated');

      setToDone(li.getAttribute('data-id'));
      setTimeout(function() {
        li.classList.remove('animated');
      }, 150);
    });
  });

  // done
  nodeList = document.querySelectorAll('.todo-list .close');
  Array.prototype.slice.call(nodeList).map(function(element) {
    element.addEventListener('click', function(event) {
      var box = this.parentNode.parentNode;

      var tasksCount = document.querySelectorAll('.todo-list li').length;
      setTimeout(function() {
        box.remove();
        if (tasksCount === 1) {
          document.querySelector('.no-items').classList.remove('hidden');
        }
      }, 200);
      deleteTodo(box.getAttribute('data-id'));
    });
  });

  control.addEventListener('keypress', function(event) {
    if (event.key.toString() === 'Enter') {
      addItem(this.value);
    }
  });

  var list = document.querySelector('.todo-list');
  Sortable.create(list);
});
