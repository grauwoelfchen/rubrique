import './index.styl';

function setDefaultState() {
  const id = generateID();
  const baseState = {};
  baseState[id] = {
    status: 'new'
  , id
  , title: 'Hello, World!'
  };
  syncState(baseState);
}

function generateID() {
  const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return randLetter + Date.now();
}

function pushToState(title, status, id) {
  const baseState = getState();
  baseState[id] = {
    id
  , title
  , status
  };
  syncState(baseState);
}

function setToDone(id) {
  const baseState = getState();
  const state = baseState[id];
  if state !== undefined {
    const next = (state.status === 'new') ? 'done' : 'new';
    baseState[id].status = next;
    syncState(baseState);
  }
}

function deleteTodo(id) {
  const baseState = getState();
  delete baseState[id];
  syncState(baseState);
}

function resetState() {
  localStorage.clear();
  localStorage.setItem('state', null);
}

function syncState(state) {
  localStorage.setItem('state', JSON.stringify(state));
}

function getState() {
  return JSON.parse(localStorage.getItem('state'));
}

function addItem(text, status, id, noUpdate) {
  const dataId = id ? id : generateID();
  const klass = status === 'done' ? 'done' : '';

  const item =
    '<li data-id="' + dataId + '" class="' + klass + '">'
    + '<div class="checkbox">'
    + '<span class="close">x</span>'
    + '<label><span class="checkbox-mask"></span>'
    + '<input type="checkbox" />' + text + '</label>'
    + '</div>'
  + '</li>';

  const ctl = document.querySelector('.form-control');

  if (text !== '') {
    document.querySelector('.todo-list').insertAdjacentHTML(
      'afterbegin', item);
  }

  ctl.value = '';
  ctl.setAttribute('placeholder', 'Add item...');
  setTimeout(() => {
    const elm = document.querySelector('.todo-list li');
    if (elm != null) {
      const btn = elm.querySelector('.close');
      if (btn != null) {
        setDeleteListener(btn);
      }

      const chk = elm.querySelector('input[type="checkbox"]');
      if (chk != null) {
        setDoneListener(chk);
      }

      elm.classList.remove('animated');
    }
  }, 150);

  if (!noUpdate) {
    pushToState(text, 'new', dataId);
  }
}

function setDoneListener(elm) {
  elm.addEventListener('click', (e) => {
    const li = e.target.parentNode.parentNode.parentNode;
    li.classList.toggle('done');
    li.classList.toggle('animated');

    setToDone(li.getAttribute('data-id'));
    setTimeout(() => {
      li.classList.remove('animated');
    }, 150);
  });
}

function setDeleteListener(elm) {
  elm.addEventListener('click', (e) => {
    const box = e.target.parentNode.parentNode;

    const tasksCount = document.querySelectorAll('.todo-list li').length;
    setTimeout(() => {
      box.remove();
      if (tasksCount === 1) {
        const m = document.querySelector('.no-items');
        if (m !== null) {
          m.classList.remove('hidden');
        }
      }
    }, 200);
    deleteTodo(box.getAttribute('data-id'));
  });
}

document.addEventListener('DOMContentLoaded', (_) => {
  let state = getState();

  if (!state) {
    setDefaultState();
    state = getState();
  }

  Object.keys(state).forEach((key) => {
    const todo = state[key];
    addItem(todo.title, todo.status, todo.id, true);
  });

  const ctl = document.querySelector('.form-control');

  // [mark as done] by checking a box
  const done = document.querySelectorAll('.todo-list input[type="checkbox"]');
  Array.prototype.slice.call(done).map((m) => {
    setDoneListener(m);
  });

  // [delete] by clicking X
  const closed = document.querySelectorAll('.todo-list .close');
  Array.prototype.slice.call(closed).map((m) => {
    setDeleteListener(m);
  });

  ctl.addEventListener('keypress', (e) => {
    if (e.key.toString() === 'Enter') {
      if (e.target.tagName === 'INPUT') {
        addItem(e.target.value);
      }
    }
  });
});
