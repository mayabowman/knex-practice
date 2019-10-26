const ItemsService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Items service object`, function() {
  let db
  let testItems = [
    {
      id: 1,
      name: 'Example name 1',
      price: '9.99',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: false,
      category: 'Main'
    },
    {
      id: 1,
      name: 'Example name 2',
      price: '19.99',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      checked: false,
      category: 'Snack'
    },
    {
      id: 1,
      name: 'Example name 3',
      price: '10.99',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      checked: false,
      category: 'Lunch'
    }
  ]

  before(() => db('shopping_list').truncate())

  afterEach(() => db('shopping_list').truncate())

  after(() => db.destroy())

  context(`Given 'shopping_list' has data`, () => {
    this.beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems)
    })
    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      return ItemsService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(testItems.map(item => ({
            ...item,
            date_added: new Date(item.date_added)
          })))
        })
    })
    it(`getById() resolves an article by id from 'shopping_list' table`, () => {
      const thirdId = 3
      const thirdTestItem = testItems[thirdId - 1]
      return ItemsService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            title: thirdTestItem.name,
            price: thirdTestItem.price,
            date_added: thirdTestItem.date_added,
            checked: thirdTestItem.checked,
            category: thirdTestItem.category
          })
        })
    })
    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const ItemId = 3
      return ItemsService.deleteItem(db, ItemId)
        .then(() => ItemsService.getAllItems(db))
        .then(allItems => {
          const expected = testItems.filter(item => item.id !== ItemId)
          expect(allItems).to.eql(expected)
        })
    })
    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3
      const newItemData = {
        name: 'updated name', 
        price: '21.99',
        date_added: new Date(),
        checked: true,
      }
      const originalItem = testItems[idOfItemToUpdate -1]
      return ItemsService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ItemsService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...originalItem,
            ...newItemData,
          })
        })
    })
  })

  context(`Given 'shopping_list; has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ItemsService.getAllItems(db)
        .then(acutal => {
          expect(actual).to.eql([])
        })
    })
    it(`insertItem() inserts an item and resolves item with an 'id'`, () => {
      const newItem = {
        name: 'Test new item name',
        price: '5.99',
        date_added: new Date('2020-01-01T00:00:00.000Z'),
        checked: true,
        category: 'Breakfast'
      }
      return ItemsService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            date_added: newItem.date_added,
            checked: newItem.checked,
            category: newItem.category,
          })
        })
    })
  })
})