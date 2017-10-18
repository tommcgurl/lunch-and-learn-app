/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const getInventoryMap = function (items){
	return items.reduce((mapSoFar, nextItem) => {
		const itemId = nextItem.name.replace(/\s/g, '_').toLowerCase();
		mapSoFar[itemId] = nextItem;
		return mapSoFar;
	}, {});
};

module.exports = {
	getMap: function (req, res) {
		Item.find({}, (err, data) =>{
			if (err) {
				res.send(500, {
					error: "Database error. All hope is lost. Abandon the surface."
				});
				return;
			}
			res.json(getInventoryMap(data));
		});
  },
	withName: function(req, res) {
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
