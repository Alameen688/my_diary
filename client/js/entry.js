/* global baseUrl, checkCookie, getCookie, validateEntryField */
/* eslint-disable radix */
const errorBoxElement = document.getElementById('error-box');
const entrySubjectField = document.getElementById('write-subject');
const entryContentField = document.getElementById('write-content');
const newEntryButton = document.getElementById('new-entry-btn');
const editEntryButton = document.getElementById('edit-entry-btn');
const gridBoxElement = document.getElementById('grid-box');
const entryGridElement = document.getElementsByClassName('entry-grid')[0];
const viewEntryContentBox = document.getElementById('entry-content-box');
const viewEntryTitle = document.getElementById('entry-title');
const viewEntryContent = document.getElementById('entry-content');
const viewEntryDate = document.getElementById('date');
const FAB = document.getElementById('floating-button');


let errorMsgCode;

let token;
if (checkCookie('token')) {
  token = getCookie('token');
}

const formatDate = (date) => {
  const d = new Date(date);
  const monthText = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const entryDate = `${monthText[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  return entryDate;
};
const getEntryItemCode = (id, title, date) => {
  const firstLetter = title.slice(0, 1);
  const entryDate = formatDate(date);

  const entryItemCode = `
    <a class="item" href="/client/view-entry.html?id=${id}">
            
      <div>
        <h1 class="title">${title}</h1>
        <div class="meta">
          <div class="avatar" entry-letter="${firstLetter}">
            
          </div>
          <!-- end .avatar-->
          <div class="date">
            <i class="fa fa-calendar"></i> <span>${entryDate}</span>
          </div>
          <!-- end .date-->
        </div>
        <!-- end .meta-->
      </div>
      <!-- end .item-->
          
      </a>
  `;
  return entryItemCode;
};

const addNewEntry = (e) => {
  e.preventDefault();
  const errorMsgElement = document.getElementById('error-msg');
  if (errorMsgElement !== null) {
    errorMsgElement.parentNode.removeChild(errorMsgElement);
  }
  const url = `${baseUrl}/entries`;
  const title = entrySubjectField.value;
  const content = entryContentField.value;
  const validationMsg = validateEntryField(title, content);

  if (validationMsg.title.length !== 0 || validationMsg.content.length !== 0) {
    // take first error message of each field
    let errorMsgs = (validationMsg.title[0]) ? `<li>${(validationMsg.title[0])}</li>` : '';
    errorMsgs += (validationMsg.content[0]) ? `<li>${(validationMsg.content[0])}</li>` : '';
    errorMsgCode = `<ul id="error-msg">${errorMsgs}</ul>`;
    errorBoxElement.innerHTML = errorMsgCode;
    return;
  }
  const newEntryData = {
    title,
    content,
  };
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain,  */*',
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newEntryData),
  };

  fetch(url, options)
    .then(res => res.json())
    .then((result) => {
      const { status, message, errors } = result;
      let errorMsgs = '';
      if (status === 'success') {
        window.location = `${window.location.protocol}//${window.location.host}/client/list-entry.html`;
      } else if (status === 'error') {
        if (Object.prototype.hasOwnProperty.call(result, 'errors')) {
          errors.forEach((error) => {
            errorMsgs += `<li>${error}</li>`;
          });
          errorMsgCode = `<ul id="error-msg">${errorMsgs}</ul>`;
        } else if (Object.prototype.hasOwnProperty.call(result, 'message')) {
          errorMsgs += `<li>${message}</li>`;
          errorMsgCode = `<ul id="error-msg">${errorMsgs}</ul>`;
        }
        errorBoxElement.innerHTML = errorMsgCode;
      }
    })
    .catch((err) => {
      const message = `<li>${err}</li>`;
      errorMsgCode = `<ul id="error-msg">${message}</ul>`;
      errorBoxElement.innerHTML = errorMsgCode;
    });
};

const saveEditEntry = (e, id) => {
  /** URL method from https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams* */
  e.preventDefault();

  const url = `${baseUrl}/entries/${id}`;
  const title = entrySubjectField.value;
  const content = entryContentField.value;
  const validationMsg = validateEntryField(title, content);

  if (validationMsg.title.length !== 0 || validationMsg.content.length !== 0) {
    // take first error message of each field
    let errorMsgs = (validationMsg.title[0]) ? `<li>${(validationMsg.title[0])}</li>` : '';
    errorMsgs += (validationMsg.content[0]) ? `<li>${(validationMsg.content[0])}</li>` : '';
    errorMsgCode = `<ul id="error-msg">${errorMsgs}</ul>`;
    errorBoxElement.innerHTML = errorMsgCode;
    return;
  }
  const editEntryData = {
    title,
    content,
  };
  const options = {
    method: 'PUT',
    headers: {
      Accept: 'application/json, text/plain,  */*',
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(editEntryData),
  };

  fetch(url, options)
    .then(res => res.json())
    .then((result) => {
      const { status, message, errors } = result;
      let errorMsgs = '';
      if (status === 'success') {
        window.location = `${window.location.protocol}//${window.location.host}/client/view-entry.html?id=${id}`;
      } else if (status === 'error') {
        if (Object.prototype.hasOwnProperty.call(result, 'errors')) {
          errors.forEach((error) => {
            errorMsgs += `<li>${error}</li>`;
          });
          errorMsgCode = `<ul id="error-msg">${errorMsgs}</ul>`;
        } else if (Object.prototype.hasOwnProperty.call(result, 'message')) {
          errorMsgs += `<li>${message}</li>`;
          errorMsgCode = `<ul id="error-msg">${errorMsgs}</ul>`;
        }
        errorBoxElement.innerHTML = errorMsgCode;
      }
    })
    .catch((err) => {
      const message = `<li>${err}</li>`;
      errorMsgCode = `<ul id="error-msg">${message}</ul>`;
      errorBoxElement.innerHTML = errorMsgCode;
    });
};

const populateEntryToEdit = (id) => {
  const url = `${baseUrl}/entries/${id}`;
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain,  */*',
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  fetch(url, options)
    .then(res => res.json())
    .then((result) => {
      if (result.status === 'success') {
        entrySubjectField.value = result.data.title;
        entryContentField.value = result.data.content;
      }
    })
    .catch((err) => {
      const message = `<li>${err}</li>`;
      errorMsgCode = `<ul id="error-msg">${message}</ul>`;
      errorBoxElement.innerHTML = errorMsgCode;
    });
};

const getAllEntries = () => {
  const url = `${baseUrl}/entries`;
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain,  */*',
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  fetch(url, options)
    .then(res => res.json())
    .then((result) => {
      const { status, data, message } = result;
      if (status === 'success') {
        data.forEach((entry) => {
          const entryItemCode = getEntryItemCode(entry.id, entry.title, entry.created_at);
          entryGridElement.innerHTML += entryItemCode;
        });
      } else if (status === 'error') {
        errorMsgCode = `<div id="error-msg">${message}</div>`;
        entryGridElement.innerHTML = errorMsgCode;
      }
    })
    .catch((err) => {
      errorMsgCode = `<div id="error-msg">${err}</div>`;
      entryGridElement.innerHTML = errorMsgCode;
    });
};

const getEntryById = (id) => {
  const url = `${baseUrl}/entries/${id}`;
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain,  */*',
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  fetch(url, options)
    .then(res => res.json())
    .then((result) => {
      const {
        status, data, message, errors,
      } = result;
      if (status === 'success') {
        const entryDate = formatDate(data.created_at);
        const entryTitleCode = `
          ${data.title}
          <span><a href="edit-entry.html?id=${data.id}" class="fa fa-edit"></a></span>`;
        const entryDateCode = `<h3>${entryDate}</h3>`;
        viewEntryTitle.innerHTML = entryTitleCode;
        viewEntryDate.innerHTML = entryDateCode;
        viewEntryContent.innerHTML = data.content;
        document.title = `${data.title}| MyDiary`;
        FAB.firstElementChild.setAttribute('href', `/client/edit-entry.html?id=${data.id}`);
      } else if (status === 'error') {
        if (Object.prototype.hasOwnProperty.call(result, 'errors')) {
          let errorMsgs = '';
          errors.forEach((error) => {
            errorMsgs += `<li>${error}</li>`;
          });
          errorMsgCode = `<div id="error-msg"><ul>${errorMsgs}</ul></div>`;
        } else if (Object.prototype.hasOwnProperty.call(result, 'message')) {
          errorMsgCode = `<div id="error-msg">${message}</div>`;
        }
        viewEntryContentBox.innerHTML = errorMsgCode;
      }
    })
    .catch((err) => {
      errorMsgCode = `<div id="error-msg">${err}</div>`;
      viewEntryContentBox.innerHTML = errorMsgCode;
    });
};

window.onload = () => {
  if (newEntryButton !== null) {
    newEntryButton.addEventListener('click', addNewEntry);
  }
  if (editEntryButton !== null) {
    const currentLocation = new URL(document.location);
    const params = (currentLocation).searchParams;
    const urlIdParam = params.get('id').trim();
    const entryId = parseInt(urlIdParam);
    populateEntryToEdit(entryId);
    editEntryButton.addEventListener('click', (e) => {
      saveEditEntry(e, entryId);
    });
  }
  if (gridBoxElement !== null) {
    getAllEntries();
  }
  if (viewEntryContentBox !== null) {
    const currentLocation = new URL(document.location);
    const params = (currentLocation).searchParams;
    const urlIdParam = params.get('id').trim();
    const entryId = parseInt(urlIdParam);
    getEntryById(entryId);
  }
};
