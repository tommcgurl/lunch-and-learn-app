/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const getInventoryMap = function (items){
	return items.reduce((mapSoFar, nextItem) => {
		const itemId = nextItem.id;
		mapSoFar[itemId] = nextItem;
		return mapSoFar;
	}, {});
};

module.exports = {
	map: function (req, res) {
		Item.find({}, (err, data) => {
			if (err) {
				res.send(500, {
					error: "Database error. All hope is lost. Abandon the surface."
				});
				return;
			}
			res.json(getInventoryMap(data));
		});
  },
	sortedMap: function(req, res) {
		const query = Item.find()
		query.sort('name ASC')
		query.exec((err, data) => {
			if (err) {
				res.send(500, {
					error: "Database error. All hope is lost. Abandon the surface."
				});
				return;
			}
			Item.message(getInventoryMap(data));
			res.json(getInventoryMap(data));
		});
	},
	sorted: function (req, res) {
		const query = Item.find()
		query.sort('name ASC')
		query.exec((err, data) => {
			if (err) {
				res.send(500, {
					error: "Database error. All hope is lost. Abandon the surface."
				});
				return;
			}
			res.json(data);
		});
	},
	withName: function(req, res) {
		// Get an item using it's 'name' column.
		const name = req.query.name;
		Item.find({name: name}, (err, data) => {
			if (err) {
				res.send(500, {
					error: "Database error. All hope is lost. Abandon the surface. No item with that name. No hope. End is nie"
				});
				return;
			}
			res.json(data);
		})
		return;
	}
};
