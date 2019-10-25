const ItemsService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Items service object`, function() {
  let db
  let testItems = [
    {
      id: 1,
      name: 'Example name 1',
      price: 9.99,
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: false,
      category: grocery
    },
    {
      id: 1,
      name: 'Example name 2',
      price: 19.99,
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      checked: false,
      category: grocery
    },
    {
      id: 1,
      name: 'Example name 3',
      price: 10.99,
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      checked: false,
      category: grocery
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
  })
})