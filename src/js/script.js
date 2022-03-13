/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      list: '.books-list',
    },
    filters: '.filters',
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  class Book {
    constructor(id, data) {
      const thisBook = this;
      thisBook.id = id;
      thisBook.data = data;
      this.renderInList();
    }
    renderInList(){
      const thisBook = this;
      thisBook.data.ratingWidth = thisBook.data.rating*10;
      thisBook.data.ratingBgc = thisBook.determineRatingBgc(thisBook.data.rating);
      const generatedHTML = templates.book(thisBook.data);
      thisBook.element = utils.createDOMFromHTML(generatedHTML);
      const listContainer = document.querySelector(select.containerOf.list);
      listContainer.appendChild(thisBook.element);
    }
    determineRatingBgc(rating){
      if(rating < 6) {
        return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if(rating > 6 && rating <= 8){
        return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if(rating > 8 && rating <= 9){
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else {
        return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
    }
  }

  class BooksList {
    constructor(){
      const thisBookList = this;
      thisBookList.appName = 'BookList v1.0';
      thisBookList.favoriteBooks = [];
      thisBookList.filters = [];
      thisBookList.initData();
      thisBookList.initList();
      thisBookList.initActions();
    }
    initData(){
      const thisBookList = this;
      thisBookList.data = dataSource.books;
    }
    initList(){
      const thisBookList = this;
      for(let bookData in thisBookList.data) {
        new Book(thisBookList.data[bookData].id, thisBookList.data[bookData]);
      }
    }
    getElements(){
    }
    initActions(){
      const thisBookList = this;
      const listContainer = document.querySelector(select.containerOf.list);
      listContainer.addEventListener('dblclick', function(event){
        event.preventDefault();
        if(event.target.offsetParent.classList.contains('book__image')) {
          event.target.offsetParent.classList.toggle('favorite');
          const bookId = event.target.offsetParent.getAttribute('data-id');
          const foundId = thisBookList.favoriteBooks.indexOf(bookId);
          if(foundId >= 0){
            thisBookList.favoriteBooks.splice(foundId, 1);
          } else {
            thisBookList.favoriteBooks.push(bookId);
          }
        }
      });
      const appFilters = document.querySelector(select.filters);
      appFilters.addEventListener('click', function(event){
        if(event.target.name == 'filter'
            && event.target.type == 'checkbox'
            && event.target.tagName == 'INPUT'){
          if(event.target.checked) {
            thisBookList.filters.push(event.target.value);
          } else {
            thisBookList.filters.splice(thisBookList.favoriteBooks.indexOf(event.target.value),1);
          }
          thisBookList.filterBooks();
        }
      });
    }
    filterBooks(){
      const thisBookList = this;
      for(let book in dataSource.books){
        let shouldBeHidden = false;
        for(const filter of thisBookList.filters) {
          if(!dataSource.books[book].details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        const bookImage = document.querySelector('.book__image[data-id="' + dataSource.books[book].id +'"]');
        if(shouldBeHidden){
          bookImage.classList.add('hidden');
        } else {
          bookImage.classList.remove('hidden');
        }
      }
    }
  }

  const app = new BooksList();
  console.log('Start Application: ', app.appName);

}