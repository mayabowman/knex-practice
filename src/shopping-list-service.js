const ItemsService = {
  getAllItems(knex) {
    return knex.select('*').from('shopping_list')
  },
}