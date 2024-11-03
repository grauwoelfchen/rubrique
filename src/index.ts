import './index.styl';

function setDefaultState() {
  const id = generateID();
  const baseState: any = {};
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

function pushToState(title: string, status: string, id: string) {
  const baseState = getState();
  baseState[id] = {
    id
  , title
  , status
  };
  syncState(baseState);
}

function setToDone(id: string) {
  const baseState = getState();
  const state = baseState[id];
  if (state !== undefined) {
    const next = (state.status === 'new') ? 'done' : 'new';
    baseState[id].status = next;
    syncState(baseState);
  }
}

function deleteTodo(id: string) {
  const baseState = getState();
  delete baseState[id];
  syncState(baseState);
}

function syncState(state: string) {
  localStorage.setItem('state', JSON.stringify(state));
}

function getState() {
  const data: string = localStorage.getItem('state') || '{}';
  return JSON.parse(data);
}

function addItem(
    text: string
  , status: string | null
  , id: string | null
  , noUpdate: boolean | null
) {
  const dataId = id ? id : generateID();
  const klass = status === 'done' ? 'done' : '';

  let out: string = text;
  if (status !== 'done' && text !== '') {
    const c = text.slice(0, 1);
    const r = text.slice(1);
    out = '<span class="first-letter">' + c + '</span>' + r;
  }

  const item =
    '<li data-id="' + dataId + '" class="' + klass + '">'
    + '<div class="checkbox">'
    + '<span class="close">x</span>'
    + '<label><span class="checkbox-mask"></span>'
    + '<input type="checkbox" />' + out + '</label>'
    + '</div>'
  + '</li>';

  const ctl = document.querySelector('.form-control');

  if (text !== '') {
    const list = document.querySelector('.todo-list');
    if (list != null) {
      list.insertAdjacentHTML('afterbegin', item);
    }
  }

  if (ctl != null) {
    ctl.setAttribute('value', '');
    ctl.setAttribute('placeholder', 'Add item...');
  }
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

function setDoneListener(elm: any) {
  elm.addEventListener('click', (e: any) => {
    const li = e.target.parentNode.parentNode.parentNode;
    li.classList.toggle('done');
    li.classList.toggle('animated');

    setToDone(li.getAttribute('data-id'));
    setTimeout(() => {
      li.classList.remove('animated');
    }, 150);
  });
}

function setDeleteListener(elm: any) {
  elm.addEventListener('click', (e: any) => {
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

  /*
  // [mark as done] by checking a box
  const done = document.querySelectorAll('.todo-list input[type="checkbox"]');
  Array.prototype.slice.call(done).map((m: any) => {
    setDoneListener(m);
  });
  */

  // [delete] by clicking X
  const closed = document.querySelectorAll('.todo-list .close');
  Array.prototype.slice.call(closed).map((m: any) => {
    setDeleteListener(m);
  });

  if (ctl != null) {
    ctl.addEventListener('keypress', (e: any) => {
      if (e.key.toString() === 'Enter') {
        if (e.target.tagName === 'INPUT') {
          addItem(e.target.value.trim(), null, null, null);
          e.target.value = '';
        }
      }
    });
  }
});
