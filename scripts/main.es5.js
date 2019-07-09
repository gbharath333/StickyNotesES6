/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// A Sticky Notes app.

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StickyNotesApp = function () {

  // Initializes the Sticky Notes app.
  function StickyNotesApp() {
    var _this = this;

    _classCallCheck(this, StickyNotesApp);

    // Shortcuts to DOM Elements.
    this.notesContainer = document.getElementById('notes-container');
    this.noteMessageInput = document.getElementById('message');
    this.addNoteButton = document.getElementById('save');
    this.notesSectionTitle = document.getElementById('notes-section-title');

    // Saves notes on button click.
    this.addNoteButton.addEventListener('click', function () {
      return _this.saveNote();
    });

    // Toggle for the button.
    this.noteMessageInput.addEventListener('keyup', function () {
      return _this.toggleButton();
    });

    // Loads all the notes.
    for (var key in localStorage) {
      this.displayNote(key, localStorage[key]);
    }
    // Listen for updates to notes from other windows.
    window.addEventListener('storage', function (e) {
      return _this.displayNote(e.key, e.newValue);
    });
  }

  // Saves a new sticky note on localStorage.


  _createClass(StickyNotesApp, [{
    key: 'saveNote',
    value: function saveNote() {
      if (this.noteMessageInput.value) {
        var key = Date.now().toString();
        localStorage.setItem(key, this.noteMessageInput.value);
        this.displayNote(key, this.noteMessageInput.value);
        StickyNotesApp.resetMaterialTextfield(this.noteMessageInput);
        this.toggleButton();
      }
    }

    // Resets the given MaterialTextField.

  }, {
    key: 'displayNote',


    // Creates/updates/deletes a note in the UI.
    value: function displayNote(key, message) {
      var note = document.getElementById(key);
      // If no element with the given key exists we create a new note.
      if (!note) {
        note = document.createElement('sticky-note');
        note.id = key;
        this.notesContainer.insertBefore(note, this.notesSectionTitle.nextSibling);
      }
      // If the message is null we delete the note.
      if (!message) {
        return note.deleteNote();
      }
      note.setMessage(message);
      //console.log(note," and :::: ", message)
    }

    // Enables or disables the submit button depending on the values of the input field.

  }, {
    key: 'toggleButton',
    value: function toggleButton() {
      if (this.noteMessageInput.value) {
        this.addNoteButton.removeAttribute('disabled');
      } else {
        this.addNoteButton.setAttribute('disabled', 'true');
      }
    }
  }], [{
    key: 'resetMaterialTextfield',
    value: function resetMaterialTextfield(element) {
      element.value = '';
      element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
      element.blur();
    }
  }]);

  return StickyNotesApp;
}();

// On load start the app.


window.addEventListener('load', function () {
  return new StickyNotesApp();
});

// This is a Sticky Note custom element.

var StickyNote = function (_HTMLElement) {
  _inherits(StickyNote, _HTMLElement);

  function StickyNote() {
    _classCallCheck(this, StickyNote);

    return _possibleConstructorReturn(this, (StickyNote.__proto__ || Object.getPrototypeOf(StickyNote)).apply(this, arguments));
  }

  _createClass(StickyNote, [{
    key: 'connectedCallback',


    // Fires when an instance of the element is created.
    value: function connectedCallback() {
      var _classList,
          _this3 = this;

      console.log(this);
      (_classList = this.classList).add.apply(_classList, CLASSES);
      this.innerHTML = TEMPLATE;
      this.messageElement = this.querySelector('.message');
      this.dateElement = this.querySelector('.date');
      this.deleteButton = this.querySelector('.delete');
      this.deleteButton.addEventListener('click', function () {
        return _this3.deleteNote();
      });
    }

    // Fires when an attribute of the element is added/deleted/modified.

  }, {
    key: 'attributeChangedCallback',
    value: function attributeChangedCallback(attributeName) {
      // We display/update the created date message if the id changes.
      if (attributeName == 'id') {
        var date = void 0;
        if (this.id) {
          date = new Date(parseInt(this.id));
        } else {
          date = new Date();
        }

        // Format the date
        var dateFormatterOptions = { day: 'numeric', month: 'short' };
        var shortDate = new Intl.DateTimeFormat("en-US", dateFormatterOptions).format(date);

        this.dateElement.textContent = 'Created on ' + shortDate;
      }
    }

    // Sets the message of the note.

  }, {
    key: 'setMessage',
    value: function setMessage(message) {
      //console.log(this)
      this.textContent = message;
      // Replace all line breaks by <br>.
      this.innerHTML = this.innerHTML.replace(/\n/g, '<br>');
    }

    // Deletes the note by removing the element from the DOM and the data from localStorage.

  }, {
    key: 'deleteNote',
    value: function deleteNote() {
      localStorage.removeItem(this.id);
      this.parentNode.removeChild(this);
    }
  }]);

  return StickyNote;
}(HTMLElement);

// Initial content of the element.


var TEMPLATE = '\n    <div class="message"></div>\n    <div class="date"></div>\n    <button class="delete mdl-button mdl-js-button mdl-js-ripple-effect">\n      Delete\n    </button>';

// StickyNote elements top level style classes.
var CLASSES = ['mdl-cell--4-col-desktop', 'mdl-card__supporting-text', 'mdl-cell--12-col', 'mdl-shadow--2dp', 'mdl-cell--4-col-tablet', 'mdl-card', 'mdl-cell', 'sticky-note'];

customElements.define('sticky-note', StickyNote);

//# sourceMappingURL=main.es5.js.map