/* global $ store api*/
'use strict';

const noteful = (function() {
  function render() {
    const notesList = generateNotesList(store.notes, store.currentNote);
    $('.js-notes-list').html(notesList);

    const editForm = $('.js-note-edit-form');
    editForm.find('.js-note-title-entry').val(store.currentNote.title);
    editForm.find('.js-note-content-entry').val(store.currentNote.content);
  }

  /**
   * GENERATE HTML FUNCTIONS
   */
  function generateNotesList(list, currentNote) {
    const listItems = list.map(
      item => `
    <li data-id="${item.id}" class="js-note-element ${
    currentNote.id === item.id ? 'active' : ''
  }">
      <a href="#" class="name js-note-show-link">${item.title}</a>
      <button class="removeBtn js-note-delete-button">X</button>
    </li>`
    );
    return listItems.join('');
  }

  /**
   * HELPERS
   */
  function getNoteIdFromElement(item) {
    const id = $(item)
      .closest('.js-note-element')
      .data('id');
    return id;
  }

  function updateStore() {
    return api.search(store.currentSearchTerm);
  }
  /**
   * EVENT LISTENERS AND HANDLERS
   */
  function handleNoteItemClick() {
    $('.js-notes-list').on('click', '.js-note-show-link', event => {
      event.preventDefault();

      const noteId = getNoteIdFromElement(event.currentTarget);

      api.details(noteId).then(response => {
        store.currentNote = response;
        render();
      });
    });
  }

  function handleNoteSearchSubmit() {
    $('.js-notes-search-form').on('submit', event => {
      event.preventDefault();

      const searchTerm = $('.js-note-search-entry').val();
      store.currentSearchTerm = searchTerm ? { searchTerm } : {};

      api.search(store.currentSearchTerm).then(response => {
        store.notes = response;
        render();
      });
    });
  }

  function handleNoteFormSubmit() {
    $('.js-note-edit-form').on('submit', event => {
      event.preventDefault();

      const editForm = $(event.currentTarget);

      const noteObj = {
        title: editForm.find('.js-note-title-entry').val(),
        content: editForm.find('.js-note-content-entry').val()
      };

      if (store.currentNote.id) {
        api.update(store.currentNote.id, noteObj)
          .then(updateStore)
          .then(updateResponse => {
            store.currentNote = updateResponse;
            render();
          });
      } else {
        api.create(noteObj)
          .then(updateStore)
          .then(updateResponse => {
            console.log();
            store.notes = updateResponse;
            render();
          });
      }
    });
  }

  function handleNoteStartNewSubmit() {
    $('.js-start-new-note-form').on('submit', event => {
      event.preventDefault();
      store.currentNote = false;
      render();
    });
  }

  function handleNoteDelete() {
    $('.js-notes-list').on('click', '.js-note-delete-button', event => {
      const id = getNoteIdFromElement(event.currentTarget);
      api.delete(id)
        .then(updateStore)
        .then(updateResponse => {
          store.currentNote = false;
          store.notes = updateResponse;
          render();
        });
    });
  }

  function bindEventListeners() {
    handleNoteItemClick();
    handleNoteSearchSubmit();
    handleNoteFormSubmit();
    handleNoteStartNewSubmit();
    handleNoteDelete();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners
  };
})();
